const mongoose = require("mongoose")


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

module.exports = mongoose.model("Post", postSchema)


