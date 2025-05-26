
const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    bookmarks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    about: {
      type: String
    },
    profilePictureUrl: {
      type: String,
      default: function() {
        return `https://ui-avatars.com/api/?color=ffffff&background=random&name=${this.userName}&length=1&size=250`;
      }
    }
  },{timestamps: true}
)

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
  
//     try {
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
//       next();
//     } catch (err) {
//       next(err);
//     }
//   });

module.exports = mongoose.model("User", userSchema)
