# 💬 ChitChat – Real-time Chat Rooms

> Chat together, in real time.

ChitChat is a web application where users can create or join chat rooms, talk live with their group, and share files such as documents and PDFs.

**GitHub Repository:** https://github.com/HarshVince/ChitChat

---

## 👥 Team

| Member | Role | Work |
|---|---|---|
| Harsh | Backend | Server, database, authentication, sockets, file upload, room management |
| Harshit | Frontend | Pages, styling, navbar, client-side JavaScript |
| Bhavya | Frontend | Pages, styling, assets, client-side JavaScript |

Each member worked on their own Git branch (`backend-harsh`, `frontend-harshit`, `frontend-bhavya`) and merged through pull requests.

---

## ✨ Features

- **Sign up / Login / Logout** with hashed passwords (bcrypt) and JWT stored in a cookie
- **Public and private chat rooms**
- **Join any room with a 6-character room code**
- **Real-time group chat** (Socket.io) with message history and timestamps
- **Online members list** that updates as people join or leave
- **File sharing** inside a room: upload (max 10 MB), download and delete
- **Delete room** (room owner only), which also deletes its uploaded files
- **Profile page** to edit your name and bio
- Responsive, modern glass-style UI

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime / Server | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Real-time | Socket.io |
| Templating | EJS |
| Frontend | HTML, CSS, JavaScript |
| Authentication | JSON Web Tokens (jsonwebtoken), bcryptjs, cookie-parser |
| File uploads | Multer |
| Config | dotenv |
| Dev tool | nodemon |

---

## ✅ Prerequisites

Install these first:

1. **Node.js** (v18 or newer) – https://nodejs.org
2. **MongoDB**, either:
   - **MongoDB Community Server** installed locally (https://www.mongodb.com/try/download/community), or
   - a free **MongoDB Atlas** cluster (https://www.mongodb.com/atlas) and its connection string
3. **Git** – https://git-scm.com
4. **ngrok** (only if you want friends on other networks to join) – https://ngrok.com

Check your versions:

```bash
node -v
npm -v
git --version
```

---

## 🚀 How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/HarshVince/ChitChat.git
cd ChitChat
```

### 2. Install dependencies

```bash
npm install
```

### 3. (Optional) Set up the environment file

The project works out of the box with local MongoDB on port 3000, so you can skip this step.

Only if you use **MongoDB Atlas** or a different port, copy the example file and edit it:

```bash
# Linux / Mac
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env
```

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/study-room
```

- `MONGO_URI`: paste your MongoDB Atlas connection string here if you use Atlas.

### 4. Make sure MongoDB is running

If you use local MongoDB, start it first:

```bash
# Ubuntu / Linux
sudo systemctl start mongod

# Windows: start the "MongoDB" service, or run mongod
```

Skip this step if you use MongoDB Atlas.

### 5. Start the server

```bash
npm start
```

You should see:

```
connected MongoDB
server started at port: 3000
you:    http://localhost:3000
```

(`npm start` uses nodemon and restarts automatically on code changes. `npm run dev` runs plain node.)

### 6. Open the app

Go to **http://localhost:3000** in your browser.

---

## 🧭 How to Use

1. Open the app and click **Sign up**. Create an account, then **log in**.
2. On the home page, **create a room** and choose **public** or **private**. A room code is generated.
3. To join a friend's room, enter its **room code** and click **Join**. Public rooms also appear on the home page.
4. Inside the room:
   - **💬 Chat tab:** send messages that everyone in the room sees instantly.
   - **📁 Files tab:** upload, download or delete shared files.
5. If you created the room, you will see a **🗑 Delete Room** button. It removes the room and all its files.
6. Open **Profile** (the circle with your initial) to edit your name and bio.

---

## 🌐 Connecting with Friends using ngrok

Chat lives on the server, so **only one person runs the project** (the host). Friends on other networks connect to the host through an ngrok link.

### One-time ngrok setup

1. Create a free account at https://ngrok.com and log in.
2. Install ngrok (see https://ngrok.com/download).
3. From your ngrok dashboard, copy your **authtoken** and run:

   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN
   ```

### Every time you want friends to join

1. Start the project in one terminal:

   ```bash
   npm start
   ```

2. Open a **second terminal** and run:

   ```bash
   ngrok http 3000
   ```

   If the port in your `.env` is different, use that number instead of `3000`.

3. ngrok prints a link like:

   ```
   Forwarding   https://abcd-1234.ngrok-free.app -> http://localhost:3000
   ```

4. **Share the `https://...ngrok-free.app` link** with your friends. They open it in their browser, sign up, and join your room with the room code.

Notes:
- Friends must **not** run their own copy. They only open the host's ngrok link.
- On the free plan, ngrok may show a "Visit Site" warning page the first time. Click **Visit Site** to continue.
- The link changes every time you restart ngrok, so send the new link again.
- Keep both terminals open while people are using the app.

### Same Wi-Fi alternative

When the server starts, the terminal also prints a line like `friend: http://192.168.x.x:3000`. Anyone on the same Wi-Fi can open that address. Allow Node through your firewall if asked.

---

## 🗄 Database

| Collection | Main fields |
|---|---|
| **users** | name, email (unique), password (hashed), bio, timestamps |
| **rooms** | name, type (public/private), code (unique), owner, ownerName, files[], timestamps |
| **messages** | user, name, text, room, timestamps |

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt before saving.
- Login uses a JWT in an `httpOnly` cookie (valid 7 days).
- Room and file routes require login.
- Only the room owner can delete a room.
- Uploads are limited to 10 MB.

---

## 🧯 Troubleshooting

| Problem | Fix |
|---|---|
| `MongoDB error: connect ECONNREFUSED` | MongoDB is not running. Start it (`sudo systemctl start mongod`) or use an Atlas `MONGO_URI`. |
| `Cannot find module ...` | Run `npm install` in the project folder. |
| `Port 3000 already in use` | Change `PORT` in `.env`, or stop the other program using it. |
| Friend can't open the link | Check that `npm start` and `ngrok http 3000` are both running, and send the **new** ngrok link. |
| Friend sees different rooms or no chat | They are running their own copy. They must open the host's link only. |
