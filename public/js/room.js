const code = document.body.dataset.code;
const myId  = document.body.dataset.uid;
const socket = io();
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtTime = t => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 2500);
}

/* --- connection --- */
socket.on('connect', () => {
    $('status').textContent = '● Live';
    $('status').style.color = '#34d399';
    socket.emit('room:join', code);
});
socket.on('disconnect', () => {
    $('status').textContent = '● Offline';
    $('status').style.color = '#f87171';
});

socket.on('room:init', d => {
    $('chatBox').innerHTML = '';
    d.messages.forEach(addMsg);
});

socket.on('members:update', names => {
    $('members').innerHTML = names.map(n =>
        `<div class="member-row"><span class="m-dot"></span>${esc(n)}</div>`
    ).join('');
});

/* --- tabs --- */
$('tabs').onclick = e => {
    const t = e.target.dataset.t;
    if (!t) return;
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.t === t));
    ['chat', 'files'].forEach(x => $('t-' + x).classList.toggle('hidden', x !== t));
};

/* --- chat --- */
function addMsg(m) {
    const box = $('chatBox');
    const isMe = m.uid === myId;
    box.insertAdjacentHTML('beforeend',
        `<div class="msg-wrap ${isMe ? 'me' : ''}">
            <div class="msg">
                <span class="msg-name">${esc(m.name)}</span>
                <span class="msg-text">${esc(m.text)}</span>
                <span class="msg-time">${fmtTime(m.time)}</span>
            </div>
        </div>`
    );
    box.scrollTop = box.scrollHeight;
}

function sendChat() {
    const inp = $('chatIn');
    const text = inp.value.trim();
    if (!text) return;
    socket.emit('chat:send', text);
    inp.value = '';
}

socket.on('chat:new', addMsg);
$('chatSend').onclick = sendChat;
$('chatIn').onkeydown = e => { if (e.key === 'Enter') sendChat(); };

$('clearChat').onclick = () => {
    if (confirm('Clear all messages for everyone in this room?')) socket.emit('chat:clear');
};
socket.on('chat:cleared', () => {
    $('chatBox').innerHTML = '';
    toast('Chat cleared');
});
