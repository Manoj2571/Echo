const mongoose = require("mongoose")
const User = require("./User")

const postSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      default: ""
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    media: {
        type: String,
        default: null
    },
    repost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null
    },
    parentPostComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now}
  },{timestamps: true}
)

postSchema.pre('validate', function (next) {
  if (!this.content && !this.media) {
    this.invalidate('content', 'Either content or media is required.');
    this.invalidate('media', 'Either content or media is required.');
  }
  next();
});

postSchema.post('findOneAndDelete', async function (post) {
  if(!doc) return;

  await User.updateMany(
    {bookmarks: post._id}, {$pull: {bookmarks: post._id}}
  )

  await mongoose.model('Post').updateMany(
    { repost: doc._id },
    { $set: { repost: null } }
  );

  await mongoose.model('Post').updateMany(
    { parentPostComment: doc._id },
    { $set: { parentPostComment: null } }
  );
  
})

module.exports = mongoose.model("Post", postSchema)


