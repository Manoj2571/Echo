# Echo

A full-stack social media application where users can post content, interact with posts, follow users, and manage their profile.  
Built with a React frontend, Express/Node backend, MongoDB database, JWT-based authentication and Socket.IO for live updates.


## 🔗 Demo Link

[Live Demo](https://echo-client-sooty.vercel.app/)


## Login

> **Guest**  
> Username: `mkeijser0@geocities.jp`  
> Password: `Nan@dec03`


## Quick Start

```
git clone https://github.com/Manoj2571/Echo.git
cd Echo

# Install server and client dependencies
cd server && npm install
cd ../client && npm install

# Start the server
cd server && node index.js

# Start the client
cd client && npm start
```
## Technologies
- React JS
- React Router
- Node.js
- Express
- MongoDB
- JWT
- Socket.IO (for real-time interactions)

## Demo Video
Watch a walkthrough (5–7 minutes) of all major features of this app:<br>
[Demo Video Link](https://youtu.be/YgxmjTpi8vM)

## Features


**User Feed**
- Landing page showing a list of user posts
- Sort and filter posts by Date and Trending

**Create a Post**
- Use "Create Post" button to open a post creation form
- Add text, images, and videos to your post
- Newly created posts appear instantly in the user feed

**Explore Feed**
- Explore page with tabs:
  - **For You** – Displays all posts sorted by latest
  - **Trending** – Shows posts sorted by likes
  - **Technology**, **Sports**, **News** – Shows posts filtered by these topics
- Accessible regardless of follow status

**Post Interactions**
- Toggle like/unlike a post using the heart icon  
- Bookmark/unbookmark posts using toggle icon  
- Share posts via popup interface  
- Comment on posts using a popup form  

**Search**
- Search across posts, users, and media content  
- Results categorized into **Top**, **Latest**, **People**, and **Media** tabs  
- Shows a helpful message if no results are found 

**User Profile**
- View user’s posts, bookmarks, media, replies, and liked posts all in one place  
- Edit profile by clicking the **Edit Profile** button
- Default avatar displayed for all users   
- Edit or delete **only your own posts** directly from your profile 

**Bookmarks**
- Bookmark posts directly from the feed
- View all bookmarked posts

**Profile Suggestions**
- Show suggestions based on following/followers logic

**Real-Time Updates**
- Live updates for new posts, likes, bookmarks, comments, and shares

**Follow / Unfollow**
- Follow/unfollow users from profile pages
- Buttons dynamically reflect current following status
- Confirmation popup when unfollowing, with a warning message

**Authentication**
- User signup and login with JWT
- Logout functionality
- Protected routes with access control

## API Reference

### POST /auth/signup
Register a new user

**Sample Response:**
```
{
  "message": "User added successfully.",
  "user": {
    "_id": "642a1b3f2c3e1d4f7a8e1c23",
    "email": "user@example.com",
    "userName": "username",
    "fullName": "User Name",
    ...
  }
}
```

### POST /auth/login
Login with email and password

**Sample Response:**
```
{
  "message": "Login Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "642a1b3f2c3e1d4f7a8e1c23",
    "email": "user@example.com",
    "userName": "username",
    ...
  }
}
```

### GET /auth/me  
Get current authenticated user data

**Sample Response:**  
```json
{
  "_id": "642a1b3f2c3e1d4f7a8e1c23",
  "email": "user@example.com",
  "userName": "username",
  "bookmarks": [
    {
      "_id": "643b2c4f4d5e1a7b9c0f1d12",
      "author": { /* author details */ },
      "repost": { /* repost details */ }
    }
  ]
  // other user fields...
}
```

### GET /api/users  
Get list of all users with populated bookmarks and repost authors 

**Sample Response:**  
```json
[
  {
    "_id": "642a1b3f2c3e1d4f7a8e1c23",
    "email": "user@example.com",
    "userName": "username",
    "bookmarks": [
      {
        "_id": "643b2c4f4d5e1a7b9c0f1d12",
        "author": { /* author details */ },
        "repost": { /* repost details */ }
      }
    ]
    // other user fields...
  }
]
```


### POST /api/users/edit/:userId  
Update user interaction data such as bookmarks, followers, and following

**Sample Response:**  
```json
{
  "message": "user updated successfully",
  "updatedUser": {
    "_id": "642a1b3f2c3e1d4f7a8e1c23",
    "email": "user@example.com",
    "userName": "username",
    "bookmarks": [
      {
        "_id": "643b2c4f4d5e1a7b9c0f1d12",
        "author": { /* author details */ },
        "repost": { /* repost details */ }
      }
    ]
    // other updated user fields...
  }
}
```

### POST /api/users/edit/profile/:userId  
Update user profile information, including profile picture and bio

**Sample Response:**  
```json
{
  "message": "user updated successfully",
  "updatedUser": {
    "_id": "642a1b3f2c3e1d4f7a8e1c23",
    "userName": "john_doe",
    "email": "john@example.com",
    "profilePictureUrl": "https://res.cloudinary.com/demo/image/upload/v123456789/avatar.jpg",
    "bio": "Full-stack developer and tech enthusiast.",
    "bookmarks": [
      {
        "_id": "643b2c4f4d5e1a7b9c0f1d12",
        "author": { /* author info */ },
        "repost": { /* repost info */ }
      }
    ]
  }
}
```

### GET /api/posts  
Get all posts sorted by newest first

**Sample Response:**  
```json
[
  {
    "_id": "643c3d4e5f6a7b8c9d0e1f23",
    "content": "This is a post content",
    "author": {
      "_id": "642a1b3f2c3e1d4f7a8e1c23",
      "userName": "username"
    },
    "repost": {
      "_id": "643c3d4e5f6a7b8c9d0e1f22",
      "author": {
        "_id": "642a1b3f2c3e1d4f7a8e1c24",
        "userName": "otheruser"
      }
    },
    "createdAt": "2025-06-13T10:20:30Z"
  },
  ...
]
```

### GET /api/posts/:postId  
Get a specific post by its ID

**Sample Response:**  
```json
{
  "_id": "643c3d4e5f6a7b8c9d0e1f23",
  "content": "This is a post content",
  "author": {
    "_id": "642a1b3f2c3e1d4f7a8e1c23",
    "userName": "username"
  },
  "repost": null,
  "createdAt": "2025-06-13T10:20:30Z"
}
```

### POST /api/user/post  
Create a new post or comment with optional media upload

**Sample Response (New Post):**  
```json
{
  "message": "post added successfully.",
  "post": {
    "_id": "643c3d4e5f6a7b8c9d0e1f23",
    "author": "642a1b3f2c3e1d4f7a8e1c23",
    "content": "Hello world!",
    "media": "https://res.cloudinary.com/yourcloud/image/upload/v123456/media.jpg",
    "createdAt": "2025-06-13T10:20:30Z"
  }
}
```

### POST /api/posts/edit/:postId  
Edit a post by ID

**Sample Response:**  
```json
{
  "message": "post updated successfully",
  "post": {
    "_id": "643c3d4e5f6a7b8c9d0e1f23",
    "author": "642a1b3f2c3e1d4f7a8e1c23",
    "content": "Updated post content",
    "media": "https://res.cloudinary.com/yourcloud/image/upload/v123456/updated_media.jpg",
    "updatedAt": "2025-06-13T11:00:00Z"
  }
}
```

### DELETE /api/user/posts/:postId  
Delete a post by ID

**Sample Response:**  
```json
{
  "message": "Post deleted successfully.",
  "post": {
    "_id": "643c3d4e5f6a7b8c9d0e1f23",
    "content": "Sample post content",
    "author": "642a1b3f2c3e1d4f7a8e1c23",
    "media": "https://res.cloudinary.com/yourcloud/image/upload/v123456/sample_media.jpg",
    "createdAt": "2025-06-12T10:00:00Z"
  }
}
```


## Contact
For bugs or feature requests, please reach out to manojreddy2571@gmail.com