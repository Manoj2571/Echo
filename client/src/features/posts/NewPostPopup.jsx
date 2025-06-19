import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { addNewPostAsync } from "../posts/postsSlice";
import toast from "react-hot-toast";
import UserAvatar from "../../components/profile/UserAvatar";


const NewPostPopup = ({ setCreateNewPost }) => {
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.users);
  const [mediaPreview, setMediaPreview] = useState({ type: "", url: "" });

  const [newPost, setNewPost] = useState({
    author: loggedInUser._id,
    content: "",
    media: null,
  });

  const postHandler = (e) => {
    e.stopPropagation();
    const formData = new FormData();
    const { author, content, media } = newPost;
    formData.append("author", author);
    formData.append("content", content);
    formData.append("media", media);
    dispatch(addNewPostAsync(formData));
    setNewPost({ ...newPost, content: "", media: null });
    setCreateNewPost(false);
  };

  const fileHandler = (e) => {
     const file = e.target.files[0];
     if (!file) return;

     if(file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10 MB limit. Please select a smaller file.")
        e.target.value = null; // reset the input
        return;
     }

     setNewPost({
      ...newPost,
      media: e.target.files[0],
    });

      const fileType = file.type;

    if (fileType.startsWith("image/")) {
      setMediaPreview({ type: "image", url: URL.createObjectURL(file) });
    } else if (fileType.startsWith("video/")) {
      setMediaPreview({ type: "video", url: URL.createObjectURL(file) });
    } else {
      toast.error("Unsupported file type");
    }

    toast.success(`${e.target.files[0].name} uploaded successfully.`)

  };

  const removeMedia = (e) => {
    e.preventDefault()
  if (mediaPreview.url) {
    URL.revokeObjectURL(mediaPreview.url);
  }
  setMediaPreview({ type: "", url: "" });
  setNewPost({...newPost, media: null})
};

  return (
    <div className="newPost_popup">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        className="bi bi-x"
        viewBox="0 0 16 16"
        onClick={() => setCreateNewPost(false)}
      >
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
      </svg>
      <div className="p-2 d-flex  mb-3">
        <div className="" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
          <UserAvatar url={loggedInUser.profilePictureUrl}/>
        </div>
        <div className="" style={{ paddingLeft: "8px", paddingRight: "0px" }}>
          <span className="fw-semibold">{loggedInUser.fullName}</span>{" "}
          <span className="text-body-tertiary">@{loggedInUser.userName}</span>
          <br />
          <textarea
            className="bg-transparent border-0"
            placeholder="What is happening?!"
            rows="4"
            autoFocus
            style={{ width: "100%", resize: "none", outline: "none" }}
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
          ></textarea>
          {mediaPreview.url && (
  <div className="position-relative d-inline-block">
    {/* Remove Button */}
   <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-1 z-1"
            onClick={removeMedia}
          ></button>

    {/* Media Preview */}
    {mediaPreview.type === "image" ? (
      <img
        src={mediaPreview.url}
        alt="Preview"
        style={{ width: 300, height: "auto", borderRadius: 8 }}
      />
    ) : (
      <video controls width="300" style={{ borderRadius: 8 }}>
        <source src={mediaPreview.url} />
        Your browser does not support the video tag.
      </video>
    )}
  </div>
)}

        </div>
      </div>
      <div className="px-2">
        <hr />
      </div>
      <div className="d-flex justify-content-between align-items-center mt-2 px-3 pb-3">
        <div className="d-flex gap-3">
          <label htmlFor="imageFileInput">
            <input
              type="file"
              id="imageFileInput"
              onChange={fileHandler}
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
              onChange={fileHandler}
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
          className={`primary-bg  px-4 py-1 text-white border-0 outline-transparent ${newPost.content.length == 0 && "disabled"}`}
          onClick={postHandler}
          disabled={newPost.content.length == 0 && newPost.media == null}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default NewPostPopup;
