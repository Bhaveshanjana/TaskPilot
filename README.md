
# 🚀 Project Pilot

**Project Pilot** is a full-featured MERN stack web app that helps users manage their projects and tasks in one place. With support for login/signup, task tracking, status updates, and dark mode, Project Pilot is built to make your workflow clean and intuitive.

---

## 🌟 Features

- ✅ **User Authentication**
  - Sign up, log in, and log out securely.
  - Only logged-in users can create and view their projects.

- 📁 **Project Management**
  - Create projects with a unique title.
  - Automatically saves the project creation date.

- 📝 **Task Tracking**
  - Add tasks under each project.
  - Edit and delete individual tasks.
  - Change task status (e.g., Pending, Completed).

- 🌒 **Dark Mode Support**
  - Switch between light and dark themes with a built-in toggle.

- 📱 **Responsive Design**
  - Mobile-friendly layout that works on all devices.

- 🔐 **Authentication Flow**
  - Uses JWT tokens stored in localStorage or cookies.

  - Backend protects project routes via middleware (authMiddleware)

  - Only authenticated users can create/view/edit/delete their own projects.
---

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JSON Web Token (JWT)

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Bhaveshanjana/TaskPilot
cd TaskPilot
 
```
### 2.Set up the backend
```
cd server
npm install

cd client 
npm install
```
### 3. Setup environment variables

```
Setup environment variables using-- 

env.example

```
### 4. Run the development server

#### In one terminal
- cd client
- npm run dev

#### In another terminal
- cd server
- npx nodemon

---


## 💬 Contact

For any feedback, suggestions or collaborations: 📧 [bhaveshanjana58@gmail.com]