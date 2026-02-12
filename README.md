# ChatX

## What is ChatX?

ChatX is a modern, real-time chat application built with pure HTML, CSS, and Vanilla JavaScript. Designed to provide seamless communication experiences without any external dependencies, our application enables users to connect, communicate, and collaborate effectively in real-time using browser technologies and localStorage for data persistence.

## Why Choose ChatX?

**Pure Vanilla JavaScript**: Built without frameworks or libraries, ensuring lightweight performance and easy understanding.

**Real-Time Communication**: Experience instant messaging with real-time updates, ensuring smooth and responsive conversations.

**User-Friendly Interface**: Clean and intuitive design that makes chatting effortless, with easy navigation and accessible features.

**Offline-First**: Uses localStorage for data persistence, allowing messages to persist across browser sessions.

**No Backend Required**: Client-side only implementation, making it easy to deploy and understand.

**Cross-Platform**: Access ChatX from any device with a modern web browser, providing flexibility and convenience.


# Documentation

## Software Requirement Specification

### Overview

ChatX is a real-time chat application built with Vanilla JavaScript, HTML, and CSS. The platform provides instant communication using browser technologies with localStorage for data persistence. No backend server is required - all data is stored client-side.

### Technology Stack

* **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Data Storage**: localStorage API
* **Data Format**: JSON
* **Real-Time**: JavaScript event-driven architecture

### Components and Functional Requirements

**1. User Authentication**
  * Users can sign up with a unique username
  * Users can log in with existing credentials
  * Users can log out securely
  * Validate non-existing users upon login
  * Ensure usernames are unique across the system
  * User data persisted in localStorage as JSON

**2. User Profile Management**
 * Users can view their profile information
 * Users can access a dedicated profile view
 * Display user online/offline status
 * Store user preferences and settings
 
**3. Real-Time Chat Features**
 * Send and receive messages in real-time
 * Support for group chat (public room)
 * Support for private chat (one-on-one messaging)
 * Display online users in real-time
 * Messages display with timestamps
 * Chat history persisted using localStorage
 * Messages retained after page refresh
 
**4. Data Persistence**
 * LocalStorage used for all data storage
 * Chat messages stored in JSON format
 * User data stored in JSON format
 * Automatic data synchronization across browser tabs
 * Data persists between browser sessions
 
**5. User Interface Components**
 * Clean and intuitive chat interface
 * Online users list section
 * Chat messages display area
 * Message input field with send button
 * User authentication screens (login/signup)
 * User profile view
 * Responsive design for different screen sizes

**6. User Experience Enhancements**
 * Timestamps for each message
 * Message sender identification
 * Visual distinction between sent and received messages
 * Smooth scrolling to latest messages
 * Form validation
 * Error handling and user feedback

**7. Bonus Features (Optional)**
 * "User is typing" notification indicator
 * Username change functionality
 * Message formatting options (bold, italic)
 * Data encryption for localStorage
 * Message search functionality
 * User avatars or profile pictures
 * Emoji support
 * File sharing capability

### Use Case Diagrams

[Use case diagrams to be added]

### Architecture Diagram

[Architecture diagram to be added]

# Design

## Wireframes

[Link to Figma wireframes - to be added]

## Domain Model

[Link to domain model diagram - to be added]

## State Diagram

[Link to state diagram - to be added]

# Running Application

## Prerequisites

* Modern web browser (Chrome, Firefox, Safari, or Edge) with localStorage support
* Text editor or IDE (VS Code recommended)
* No build tools or dependencies required!

## Development

### Quick Start

Since this is a pure HTML/CSS/JavaScript application with no build process, you can run it directly:

**Option 1: Using VS Code Live Server (Recommended)**
1. Install the Live Server extension in VS Code
2. Right-click on [index.html](index.html)
3. Select "Open with Live Server"
4. Application opens at `http://localhost:5500`

**Option 2: Using Python HTTP Server**
```bash
# Python 3
python -m http.server 8000
```
Navigate to `http://localhost:8000`

**Option 3: Using Node.js http-server**
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000
```
Navigate to `http://localhost:8000`

**Option 4: Direct File Opening**

For testing purposes, you can open [index.html](index.html) directly in your browser. However, some features may not work properly due to CORS restrictions.

### Development Workflow

1. Make changes to HTML, CSS, or JS files
2. Refresh browser to see changes
3. Use browser DevTools for debugging
4. Check localStorage in Application tab

## Production

### Deployment

Since there's no build process, deployment is straightforward:

1. Upload all project files to your web hosting service
2. Ensure [index.html](index.html) is in the root directory
3. No server-side configuration needed
4. Access the application through your domain

### Static Site Hosting Options

* **GitHub Pages**: 
  ```bash
  git push origin main
  # Enable Pages in repository settings
  ```
  
* **Netlify**: Drag and drop the project folder or connect to Git repository

* **Vercel**: 
  ```bash
  npx vercel
  ```
  
* **Surge**:
  ```bash
  npm install -g surge
  surge
  ```

* **AWS S3**: Configure bucket as static website hosting

* **Firebase Hosting**:
  ```bash
  firebase init hosting
  firebase deploy
  ```

## Project Structure

```
ChatX/
├── index.html              # Landing/Login page
├── app.js                  # Main application logic and initialization
├── style.css               # Global styles
├── README.md               # Project documentation
│
├── pages/
│   ├── chat.html          # Main chat interface
│   ├── signup.html        # User registration page
│   └── profile.html       # User profile page
│
├── js/
│   ├── auth.js            # Authentication logic (login, signup, logout)
│   ├── chat.js            # Chat functionality (send, receive, display messages)
│   ├── storage.js         # localStorage management (save, retrieve, update data)
│   ├── users.js           # User management (online users, user status)
│   ├── utils.js           # Utility functions (validation, formatting, etc.)
│   └── config.js          # Configuration constants
│
├── styles/
│   ├── auth.css           # Login/Signup page styles
│   ├── chat.css           # Chat interface styles
│   ├── profile.css        # Profile page styles
│   └── components.css     # Reusable component styles
│
└── assets/
    ├── images/            # Images and icons
    └── fonts/             # Custom fonts (if any)
```

## Local Storage Structure

The application uses localStorage to persist data. Here's the data structure:

```javascript
// Users data
{
  "users": [
    {
      "id": "unique-id",
      "username": "john_doe",
      "password": "hashed-password",
      "createdAt": "2026-02-10T10:30:00.000Z",
      "isOnline": true
    }
  ],
  
  // Messages data
  "messages": [
    {
      "id": "msg-id",
      "senderId": "user-id",
      "senderName": "john_doe",
      "content": "Hello everyone!",
      "timestamp": "2026-02-10T10:35:00.000Z",
      "type": "group" // or "private",
      "recipientId": "recipient-user-id" // for private messages
    }
  ],
  
  // Current logged-in user
  "currentUser": {
    "id": "user-id",
    "username": "john_doe"
  }
}
```

## Features Checklist

### Core Features
- [ ] User sign up
- [ ] User login
- [ ] User logout
- [ ] Display online users
- [ ] Send messages in real-time
- [ ] Receive messages in real-time
- [ ] Group chat support
- [ ] Private chat support
- [ ] Persist messages using localStorage
- [ ] Store user data in JSON format
- [ ] Display message timestamps
- [ ] User profile view
- [ ] Validate non-existing users
- [ ] Ensure unique usernames
- [ ] Clean and intuitive UI
- [ ] Separate sections for users and messages
- [ ] Message input with send button

### Bonus Features
- [ ] "User is typing" notification
- [ ] Change username functionality
- [ ] Message formatting (bold, italic)
- [ ] Encrypt localStorage data

## Browser Compatibility

* Chrome 60+ (localStorage and ES6 support)
* Firefox 55+ 
* Safari 11+
* Edge 15+

**Required Browser Features:**
* localStorage API
* ES6 JavaScript (Arrow functions, Classes, Template literals)
* CSS Grid and Flexbox

## Testing

### Manual Testing

1. **Authentication Testing**
   - Sign up with a new username
   - Try signing up with an existing username (should fail)
   - Login with correct credentials
   - Try login with wrong credentials (should fail)
   - Logout and verify session cleared

2. **Chat Functionality Testing**
   - Send a message in group chat
   - Open app in another browser tab (simulate another user)
   - Verify messages appear in real-time
   - Refresh page and verify messages persist
   - Test private messaging between users

3. **Data Persistence Testing**
   - Send messages and refresh page
   - Close browser and reopen
   - Check localStorage in DevTools
   - Verify messages persist after page refresh
   - Clear localStorage and verify app resets

### Browser DevTools

* **Console**: Check for JavaScript errors
* **Application > Local Storage**: Inspect stored data
* **Network**: Verify no external network calls
* **Elements**: Inspect DOM structure and styles

## Security Considerations

* Passwords should be hashed before storage (use Web Crypto API)
* Implement XSS protection for message content
* Validate and sanitize all user inputs
* Consider implementing localStorage encryption for sensitive data
* Use HTTPS in production

## Troubleshooting

**Messages not persisting:**
- Check if localStorage is enabled in browser
- Verify localStorage quota not exceeded
- Check browser console for errors

**Real-time updates not working:**
- Ensure using `storage` event listener for cross-tab communication
- Refresh both tabs/windows
- Check if same origin policy is satisfied

**Cannot log in:**
- Clear localStorage and try again
- Check console for validation errors
- Verify username exists in localStorage
