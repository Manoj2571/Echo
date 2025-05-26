const {initializeDatabase} = require('./db/db.connect')
const User = require("./models/User")
const Post = require('./models/Post')
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const cloudinary = require('cloudinary')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')
const http = require('http')
const {Server} = require('socket.io')

const postAuthorSocketIdArray = []  // {authorID, socketID}


const activeUsers = {}

dotenv.config()

const JWT_SECRET = 'echo_login_access_key'

const app = express()
const PORT = 8000

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.json())


initializeDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const storage = multer.diskStorage({})
const upload = multer({ storage })

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on("connection", (socket) => {

  const {userId} = socket.handshake.auth
  
  activeUsers[userId] = socket.id
  console.log(activeUsers)


//new post broadcast
  socket.on("newPost", (data) => {

    socket.broadcast.emit("newPostCreated", data.fullPost)


    //new post is comment ? trigger post interaction notification to author
    if(data.fullPost.parentPostComment) {
      
      const authorId = data.parentPostComment.author._id
      if(authorId in activeUsers) {
        const socketId = activeUsers[authorId]
        socket.to(socketId).emit("postInteractionNotification", {action: "comment", post: data.fullPost, user: data.fullPost.author})
      }
    }

    if(data.fullPost.repost) {
      const authorId = data.fullPost.repost.author._id
      if(authorId in activeUsers) {
        const socketId = activeUsers[authorId]
        socket.to(socketId).emit("postInteractionNotification", {action: "share", post: data.fullPost.repost, user: data.fullPost.author})
      }
    }

  })

  //post interaction notification to author
  socket.on("postInteraction", (data) => {

    const authorId = data.authorId

    if(authorId in activeUsers) {
      const socketId = activeUsers[authorId]
      console.log(data.post)
      socket.to(socketId).emit("postInteractionNotification", {action: data.action, post: data.post, user: data.user})
    }
  })

  //update post likes 
  socket.on("postLikes", (data) => {
    socket.broadcast.emit("postLikesUpdate", data)
  })

  socket.on("bookmarkPost", (data) => {
    socket.broadcast.emit("bookmarksUpdate", data)
  })

  
  socket.on("disconnect", () => {
    delete activeUsers[userId]
  });

  

});


server.listen(PORT, () => {
  console.log("Server is running on port", PORT)
})


const deleteTestPosts = async () => {
  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    await Post.deleteMany({ createdAt: { $gte: twoHoursAgo } });
  } catch(err) {
    console.log(err)
  }
}

// deleteTestPosts()

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().populate({path: "bookmarks", populate: [
    { path: 'author' },
    {
      path: 'repost',
      populate: { path: 'author' } // If you want to populate the author of the repost as well
    }
  ]})
    if (users.length > 0) {
      res.send(users)
    } else {
      res.status(404).json("Users not found.")
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal server error."})
  }
})



//update user
app.post("/api/users/edit/:userId", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, {new: true}).populate({path: "bookmarks", populate: [
    { path: 'author' },
    {
      path: 'repost',
      populate: { path: 'author' } // If you want to populate the author of the repost as well
    }
  ]})
    if(updatedUser) {
      res.status(201).json({message: "user updated successfully", updatedUser})
    } else {
      console.log(error)
      res.status(404).json("Failed to update user.")
    } 
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal server error."})
  }
})

app.post("/api/users/updateUser/:userId", upload.single("profilePictureUrl"), async (req, res) => {
  try {
    const file = req.file
    const user = await User.findById(req.params.userId)

    let updatedUser

    if(user.profilePictureUrl == req.body.profilePictureUrl) {
      updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, {new: true}).populate({path: "bookmarks", populate: [
    { path: 'author' },
    {
      path: 'repost',
      populate: { path: 'author' } // If you want to populate the author of the repost as well
    }
  ]})
    } else {
      if(!file) {
        updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, {new: true}).populate({path: "bookmarks", populate: [
    { path: 'author' },
    {
      path: 'repost',
      populate: { path: 'author' } // If you want to populate the author of the repost as well
    }
  ]})
      } else {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "uploads"
      })
        updatedUser = await User.findByIdAndUpdate(req.params.userId, {...req.body, profilePictureUrl: result.secure_url}, {new: true}).populate({path: "bookmarks", populate: [
    { path: 'author' },
    {
      path: 'repost',
      populate: { path: 'author' } // If you want to populate the author of the repost as well
    }
  ]})
      }
      
    }

    if(updatedUser) {
      res.status(201).json({message: "user updated successfully", updatedUser})
    } else {
      res.status(404).json("Failed to update user.")
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal server error."})
  }
})




//update post
app.post("/api/posts/edit/:postId", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, req.body, {new: true}).populate([{path: "author"}, {path: "repost", populate: {path: "author"}}])
    if(updatedPost.length != 0) {
      res.status(201).json({message: "post updated successfully", post: updatedPost})
    } else {
      res.status(404).json("Internal server error.")
    }


  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Failed to update post"})
  }
})


app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({createdAt: -1}).populate([{path: "author"}, {path: "repost", populate: {path: "author"}}])
    if(posts.length > 0) {
      res.send(posts)
    } else {
      res.status(404).json({message: "Internal server error."})
    }
  } catch (error) {
    console.log(error)
  } 
})

// app.post("/upload", upload.single("image"), async (req, res) => {
//     try {
//         const file = req.file
//         if(!file) return res.status(400).send("No file uploaded.")
        
//         const result = await cloudinary.uploader.upload(file.path, {
//             folder: "uploads"
//         })

//         const newImage = new Post({author, media, content})
//         await newImage.save()
        
//     } catch (error) {

//     }
// })



app.post("/api/user/post", upload.single("media"), async (req, res) => {
  try {
    const file = req.file
    const {author, content, repost, parentPostComment} = req.body

    let newPost

    if(!file) {
        newPost = new Post({author, content, repost, parentPostComment})
    } else {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "uploads"
        })
        newPost = new Post({author,content,repost,parentPostComment, media: result.secure_url})
    }

    const savedPost = await newPost.save()

    // await savedPost.populate('parentPostComment');

    if(parentPostComment) {
      res.status(201).json({message: "comment added successfully.", post: savedPost})
    } else {
      res.status(201).json({message: "post added successfully.", post: savedPost})
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Failed to add post.", error: error})
  }
})

app.post('/login', async (req, res) => {

  const {email, password, rememberMe} = req.body
  const user = await User.findOne({email})

  if (!user) {
      return res.status(400).json({ message: "Account Doesn't exists" });
  }

  const isMatch = user.password === password
  if (!isMatch) {
      return res.status(400).json({ message: 'Wrong Password' });
  }


  const payload = {userId: user._id}

  const tokenOptions = rememberMe ? {expiresIn: '7d'} : {expiresIn: '15m'}

  const token = jwt.sign(payload, SECRET_KEY, tokenOptions)

  return res.status(200).json({ message: 'Login successful', token });
}) 

app.post("/auth/login", async (req, res) => {
    try {
        const {email, password, rememberMe} = req.body
      
        const existingUser = await User.findOne({email}).select('+password').populate({path: "bookmarks", populate: [
    { path: 'author' },
    {
      path: 'repost',
      populate: { path: 'author' } // If you want to populate the author of the repost as well
    }
  ]})

        if(!existingUser) {
           return res.status(400).json({message: "Invalid email."})
        }

        // const isMatch = await bcrypt.compare(password, existingUser.password)

        const isMatch = existingUser.password === password

        if(!isMatch) { return res.status(400).json({message: "Incorrect password."})}

        const token = jwt.sign(
            { existingUser },
            JWT_SECRET,
            { expiresIn: rememberMe ? '7d' : '5h' }
          );
        res.status(200).json({message: "Login Successful", token, user: existingUser})  

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "User Login Failed.", error})
    }
})

app.get("/api/posts/:postId", (req, res) => {
  try {
    const requiredPost = Post.findById(req.params.postId)
    if(requiredPost) {
      res.send(requiredPost)
    } else {
      res.status(404).json({message: "post not found."})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Failed to get post."})
  }
})


app.delete("/api/user/posts/:postId", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId)

    if(deletedPost) {
      res.status(201).json({message: "Post deleted successfully.", post: deletedPost})
    } else {
      res.status(404).json("Internal server error.")
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Failed to delete post."})
  }
})

const verifyJWT = (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if(error) {
            return res.status(402).json({message: "Invalid token"})
        }
        req.user = decoded.existingUser
        next()
    })
}


app.post("/api/users/addUser", async (req, res) => {
  try {
    const newUser = new User(req.body)
  newUser.save()
  .then(savedUser => {
    return User.findById(savedUser._id).populate({path: "bookmarks", populate: [
    { path: 'author' },
    {
      path: 'repost',
      populate: { path: 'author' } // If you want to populate the author of the repost as well
    }
  ]})
  })
  .then(populatedUser => {
    res.status(200).json({message: "User Added Successfully.", user: populatedUser})
  }) 
  } catch (error) {
    res.status(500).json({message: "Adding user failed.", error})
  }
})

app.post("/auth/signup", async (req, res) => {
    try {
        const {email, userName} = req.body

        const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists, please login." });
    }

        const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ message: "Username already taken." });
    }
        const newUser = new User(req.body)
        const savedUser = await newUser.save()

        res.status(200).json({message: "User added successfully.", user: savedUser})


    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Adding user Failed.", error})
    }  
})

app.get("/auth/me", verifyJWT, async (req, res) => {
  const user = await User.findById(req.user._id).populate({path: "bookmarks", populate: [
    { path: 'author' },
    {
      path: 'repost',
      populate: { path: 'author' }
    }
  ]})
    return res.status(200).json(user)
})



