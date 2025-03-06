# 🚀 Dynamic Spreadsheet Web App

![Project License](https://img.shields.io/badge/License-MIT-green.svg)
![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen)
![Made with Node.js](https://img.shields.io/badge/Made%20With-Node.js-blue)

A **dynamic spreadsheet web app** built using **Node.js, Express, MongoDB, and React**. This application allows users to create, manage, and store spreadsheet data dynamically with a user-friendly interface. It supports authentication, multiple sheets, real-time updates, and persistent storage.

---

## 🌟 Features

✅ **User Authentication** (Signup & Login)  
✅ **Create & Manage Multiple Sheets**  
✅ **Real-time Updates**  
✅ **MongoDB Data Storage**  
✅ **REST API for CRUD Operations**  
✅ **Fully Responsive UI with Tailwind CSS**  
✅ **Dark Mode Support**  

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Bcrypt.js
- **Real-time Features**: Socket.io

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/dynamic-spreadsheet.git
cd dynamic-spreadsheet
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the root directory and add:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4️⃣ Run the Server
```bash
npm start
```

### 5️⃣ Open the App in Browser
```
http://localhost:5000
```

---

## 📌 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/api/users/signup` | Register a new user |
| `POST` | `/api/users/login` | Login user |
| `POST` | `/api/sheets/setCollection` | Set active collection |
| `POST` | `/api/sheets/addSheet` | Add new sheet |
| `GET` | `/api/sheets/getSheets` | Fetch all sheets |
| `GET` | `/api/sheets/getTable` | Get spreadsheet data |
| `POST` | `/api/sheets/saveTable` | Save spreadsheet data |
| `DELETE` | `/api/sheets/deleteSheet` | Delete a sheet |

---

## 🎨 UI Preview

![App Screenshot](https://via.placeholder.com/800x400?text=App+Screenshot)

---

## 🤝 Contributing

We welcome contributions! Feel free to fork the repository and submit pull requests.

```bash
git clone https://github.com/your-username/dynamic-spreadsheet.git
cd dynamic-spreadsheet
git checkout -b feature-branch
```

---

## 📜 License

This project is licensed under the MIT License.

---

### ❤️ Support the Project
If you like this project, don't forget to **star** ⭐ the repository!

[![GitHub Stars](https://img.shields.io/github/stars/your-username/dynamic-spreadsheet?style=social)](https://github.com/your-username/dynamic-spreadsheet)

---

Made with 💙 by **Subhan Khalif**

