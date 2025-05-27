import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addNewPostAsync } from "../../features/posts/postsSlice";
import { postingTimeModifier } from "../../features/posts/Post";
import toast from "react-hot-toast";

const SharePostPopup = ({ setShareClick, post }) => {
  const navigate = useNavigate()  
  const dispatch = useDispatch();
  const {loggedInUser} = useSelector((state) => state.users)
  const [newPost, setNewPost] = useState({
    author: loggedInUser._id,
    content: "",
    media: null,
    repost: post._id,
  });

  const addingMediaHandler = (e) => {
    e.stopPropagation();
    setNewPost({ ...newPost, media: e.target.files[0] });
    toast.success(`${e.target.files[0].name} uploaded successfully.`)
  };

  const postHandler = (e) => {
    e.stopPropagation();
    const formData = new FormData();
    const { author, content, media, repost } = newPost;
    formData.append("author", author);
    formData.append("content", content);
    formData.append("media", media);
    formData.append("repost", repost);
    if(newPost.content.length == 0 && !newPost.media) {
      toast.error("To create a post, please add content, media, or both.")
    } else {
      dispatch(addNewPostAsync(formData)).then(() => setShareClick(false));
    }
    
  };

  return (
    <div className="sharePost_popup">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        className="bi bi-x"
        viewBox="0 0 16 16"
        onClick={(e) => {
          e.stopPropagation();
          setShareClick(false);
        }}
      >
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
      </svg>
      <div className="p-2 d-flex ">
        <div className="" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
          <img
            className="rounded-circle"
            src={loggedInUser.profilePictureUrl}
            width="40px"
            height="40px"
          />
        </div>
        <div
          className="flex-grow-1"
          style={{ paddingLeft: "8px", paddingRight: "8px" }}
        >
          <textarea
            className="bg-transparent border-0"
            placeholder="Add a comment"
            rows="2"
            autoFocus
            style={{ width: "100%", resize: "none", outline: "none" }}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
          ></textarea>
          <div
            className="p-2 bg-white d-flex border rounded post_display"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/postDetail/${post._id}`);
            }}
          >
            <div
              className=""
              style={{ paddingLeft: "0px", paddingRight: "0px" }}
            >
              <img
                className="rounded-circle"
                src={post.author.profilePictureUrl}
                width="40px"
                height="40px"
              />
            </div>
            <div
              className="flex-grow-1"
              style={{ paddingLeft: "8px", paddingRight: "0px" }}
            >
              <div className="d-flex justify-content-between mb-2">
                <div className="d-flex ">
                                  <span className="fw-bold text-black">{post.author.fullName}</span>
                                  <span className="text-body-tertiary">&nbsp;@{post.author.userName} <span>•</span> <span>{postingTimeModifier(post.createdAt)}</span></span>
                                </div>
              </div>
              <div style={{ paddingInlineEnd: "18px" }}>
                <p className="truncated">{post.content}</p>
                {post.media && (
                  <div className="square-box overflow-hidden pb-2">
        <img
          src={post.media}
          alt="Post"
          className="w-100 h-100"
          style={{ objectFit: 'contain', maxHeight: "40vh" }}
        />
      </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between p-3">
        <div className="d-flex gap-3">
          <label htmlFor="imageFileInput">
            <input
              type="file"
              id="imageFileInput"
              onChange={addingMediaHandler}
              hidden
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-card-image"
              viewBox="0 0 16 16"
            >
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
              <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z" />
            </svg>
          </label>
          <label htmlFor="gifFileInput">
            <input
              type="file"
              id="gifFileInput"
              onChange={addingMediaHandler}
              hidden
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-filetype-gif"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M14 4.5V14a2 2 0 0 1-2 2H9v-1h3a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM3.278 13.124a1.4 1.4 0 0 0-.14-.492 1.3 1.3 0 0 0-.314-.407 1.5 1.5 0 0 0-.48-.275 1.9 1.9 0 0 0-.636-.1q-.542 0-.926.229a1.5 1.5 0 0 0-.583.632 2.1 2.1 0 0 0-.199.95v.506q0 .408.105.745.105.336.32.58.213.243.533.377.323.132.753.132.402 0 .697-.111a1.29 1.29 0 0 0 .788-.77q.097-.261.097-.551v-.797H1.717v.589h.823v.255q0 .199-.09.363a.67.67 0 0 1-.273.264 1 1 0 0 1-.457.096.87.87 0 0 1-.519-.146.9.9 0 0 1-.305-.413 1.8 1.8 0 0 1-.096-.615v-.499q0-.547.234-.85.237-.3.665-.301a1 1 0 0 1 .3.044q.136.044.236.126a.7.7 0 0 1 .17.19.8.8 0 0 1 .097.25zm1.353 2.801v-3.999H3.84v4h.79Zm1.493-1.59v1.59h-.791v-3.999H7.88v.653H6.124v1.117h1.605v.638z"
              />
            </svg>
          </label>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-emoji-smile"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
            </svg>
          </span>
        </div>
        <button
          className="primary-bg text-white border-0 px-4 py-1"
          onClick={postHandler}
          // disabled={newPost.content.length == 0 && !newPost.media}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default SharePostPopup;
