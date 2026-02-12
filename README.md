# ChatX

A modern, real-time chat application built with pure HTML, CSS, and Vanilla JavaScript. Experience seamless communication without frameworks or libraries - just clean, efficient code.

🔗 **[Live Demo](https://micanipho.github.io/ChatX/)**

## Features

- Real-time messaging (group chat & private messages)
- User authentication (sign up, login, logout)
- Responsive design (mobile & desktop)
- Offline-first with localStorage persistence
- Toast notifications for better UX
- Clean, modern interface
- Password recovery with security questions
- User profiles with online/offline status
- Group chat management

## Tech Stack

- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: localStorage API
- **Architecture**: Modular ES6 modules with service-oriented design

## Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No build tools required!

### Local Development

**This is a pure HTML/CSS/JavaScript app - no installation or build process needed!**

Simply serve the files with any local HTTP server. Here are some options:

**Option 1: VS Code Live Server (Recommended)**

1. Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. App opens at `http://localhost:5500`

**Option 2: Python (if you have it installed)**

```bash
cd ChatX
python -m http.server 8000
# Open http://localhost:8000
```

**Option 3: Node.js (if you have it installed)**

```bash
npx http-server -p 8000
# Open http://localhost:8000
```


> **Note**: These are just tools to serve static files locally. The app itself requires **no dependencies, frameworks, or build tools** - it's pure client-side code!

### Usage

1. **Sign Up**: Create an account with username and password
2. **Set Security Question**: Required for password recovery
3. **Start Chatting**: Send messages in group chat or private conversations
4. **Create Groups**: Organize conversations with multiple users
5. **Manage Profile**: View and update your profile information

## Project Structure

```
ChatX/
├── index.html                  # Landing/Login page
├── pages/
│   ├── chat.html              # Main chat interface
│   ├── sign-up.html           # User registration
│   ├── forgot-password.html   # Password recovery
│   └── profile.html           # User profile
├── js/
│   ├── services/              # Business logic
│   │   ├── AuthService.js     # Authentication
│   │   ├── ChatService.js     # Chat operations (refactored to 291 lines)
│   │   └── UserService.js     # User management
│   ├── models/                # Data models
│   │   ├── User.js
│   │   ├── Chat.js
│   │   └── Group.js
│   ├── utils/                 # Utility modules
│   │   ├── ChatHelpers.js     # Formatting utilities
│   │   ├── ChatTemplates.js   # HTML templates
│   │   ├── Notification.js    # Toast notifications
│   │   ├── Logger.js          # Error logging
│   │   ├── Storage.js         # localStorage wrapper
│   │   └── CryptoUtils.js     # Password hashing
│   ├── app.js                 # Main initialization
│   ├── chatInit.js            # Chat page setup
│   ├── profilePage.js         # Profile functionality
│   ├── groupChat.js           # Group management
│   ├── forgotPassword.js      # Password recovery
│   └── logoutModal.js         # Logout confirmation
└── styles/
    ├── style.css              # Global styles
    ├── chat.css               # Chat interface
    ├── auth.css               # Authentication pages
    ├── profile.css            # Profile page
    ├── group-chat.css         # Group chat modal
    └── notification.css       # Toast notifications
```

## Deployment

Deploy to any static hosting service:

**GitHub Pages**

```bash
git push origin main
# Enable Pages in repository settings
```
## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 15+

**Required Features**: localStorage, ES6 modules, CSS Grid/Flexbox

## Contributing

This is a learning project. Feel free to fork and experiment!

---

Built with ❤️ using pure Vanilla JavaScript
