# Letter Drive 📝✉️

## Overview

Letter Drive is a web-based letter writing application that allows users to create, edit, save, and manage letters with a rich text editor. Built with React, this application provides a seamless writing experience with local draft saving and cloud storage capabilities.

## 🌟 Features

- **Rich Text Editing**
  - Quill.js powered editor with formatting options
  - Supports headers, bold, italic, underline, and list formatting
  - Placeholder text to inspire writing

- **Draft Management**
  - Local draft saving in browser's localStorage
  - Ability to preview and load saved drafts
  - Prevent accidental loss of work

- **Cloud Storage**
  - Save letters directly to cloud storage
  - Edit existing letters
  - Secure access with authentication tokens

- **User-Friendly Interface**
  - Clean, minimalist design
  - Easy navigation
  - Responsive layout

## 🛠 Tech Stack

- **Frontend**
  - React
  - React Router
  - Axios for API calls
  - Quill.js for rich text editing

- **Backend**
  - Express.js (assumed)
  - JWT Authentication
  - MongoDB or similar database (assumed)

## 📦 Prerequisites

- Node.js (v14 or later)
- npm or Yarn
- Backend API service

## 🚀 Installation

1. Clone the repository
```bash
git clone https://github.com/manishkapoor5/WordLetterApp.git
cd client
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the project root with:
```
REACT_APP_API_URL=https://localhost:3000
```

4. Run the application
```bash
npm start
```


##**To run Backend**

npm install
cd server
node index.js

## 🔐 Environment Variables

- `REACT_APP_API_URL`: Base URL for your backend API
- Ensure you have a valid access token mechanism

## 📘 Key Components

- `Editor.js`: Main component for letter creation/editing
- Rich text editing with Quill.js
- Local draft saving
- Cloud storage integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐞 Known Issues & Improvements

- [ ] Add comprehensive error handling
- [ ] Implement save functionality
- [ ] Create user authentication flow

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Your Name - manishkapoorrr13@gmail.com

Project Link: [https://github.com/manishkapoor5/WordLetterApp](https://github.com/manishkapoor5/WordLetterApp)

---
