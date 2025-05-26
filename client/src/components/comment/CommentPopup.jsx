import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewPostAsync } from "../../features/posts/postsSlice";
import { postingTimeModifier } from "../../features/posts/Post";


const CommentPopup = ({ setCommentClick, post, loggedInUser }) => {
  const dispatch = useDispatch();

  const [comment, setComment] = useState({
    parentPostComment: post._id,
    content: "",
    media: null,
    author: loggedInUser._id,
  });

  const commentHandler = (e) => {
    e.stopPropagation();
    const formData = new FormData();
    const { parentPostComment, content, media, author, repost } = comment;
    formData.append("parentPostComment", parentPostComment);
    formData.append("content", content);
    formData.append("media", media);
    formData.append("author", author);
    dispatch(addNewPostAsync(formData));
    setCommentClick(false);
  };

  return (
    <div className="comment_popup">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        className="bi bi-x"
        viewBox="0 0 16 16"
        onClick={(e) => {
          e.stopPropagation();
          setCommentClick(false);
        }}
      >
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
      </svg>
      <div className="p-2 d-flex">
        <div className="" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
          <img
            className="rounded-circle"
            src={post.author.profilePictureUrl}
            width="40px"
            height="40px"
          />
        </div>
        <div className="" style={{ paddingLeft: "8px", paddingRight: "0px" }}>
          <div className="d-flex ">
                  <span className="fw-bold text-black">{post.author.fullName}</span>
                  <span className="text-body-tertiary">&nbsp;@{post.author.userName} <span>•</span> <span>{postingTimeModifier(post.createdAt)}</span></span>
                </div>
          <div style={{ paddingInlineEnd: "18px" }}>
            <p>{post.content}</p>
          </div>
          <span>
            Replying to{" "}
            <span className="primary-txt">@{post.author.userName}</span>
          </span>
        </div>
      </div>
      <div className="p-2 d-flex mb-3">
        <div className="" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
          <img
            className="rounded-circle"
            src={loggedInUser.profilePictureUrl}
            width="40px"
            height="40px"
          />
        </div>
        <div className="" style={{ paddingLeft: "8px", paddingRight: "0px" }}>
          <textarea
            className="bg-transparent border-0 pt-2"
            placeholder="Post your reply..."
            rows="5"
            autoFocus
            style={{ width: "100%", resize: "none", outline: "none" }}
            onChange={(e) =>
              setComment({ ...comment, content: e.target.value })
            }
          ></textarea>
        </div>
      </div>
      <div className="d-flex mt-2 px-3 pb-3">
        <button
          className="text-white primary-bg ms-auto px-4 py-1 border-0"
          onClick={commentHandler}
          disabled={comment.content.length == 0}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default CommentPopup;
