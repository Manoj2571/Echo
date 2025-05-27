
import toast from "react-hot-toast";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPostAsync } from "./postsSlice";

const NewPostSection = () => {
    const dispatch = useDispatch()

    const {loggedInUser} = useSelector((state) => state.users)

    const [newPost, setNewPost] = useState({
        author: loggedInUser?._id,
        content: "",
        media: null,
  });

    const fileHandler = (e) => {
      setNewPost({
        ...newPost,
        media: e.target.files[0],
        });
      toast.success(`${e.target.files[0].name} uploaded successfully.`)
    };

    const postHandler = () => {
    const formData = new FormData();
    const { author, content, media } = newPost;
    formData.append("author", author);
    formData.append("content", content);
    formData.append("media", media);
    dispatch(addNewPostAsync(formData));
    setNewPost({ ...newPost, content: "", media: null });
  };


    return (
        <div className="py-3 bg-white d-flex">
                <div
                  className="ps-3"
                >
                  <img
                    className="rounded-circle"
                    src={loggedInUser.profilePictureUrl}
                    width="40px"
                    height="40px"
                  />
                </div>
                <div
                  className="flex-grow-1 pe-3"
                  style={{ paddingLeft: "8px", paddingRight: "0px" }}
                >
                  <textarea
                    placeholder="Write something interesting..."
                    className="grey-bg border-0 px-3 py-2"
                    rows="5"
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    style={{
                      width: "100%",
                      resize: "none",
                      outline: "none"
                    }}
                  ></textarea>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="d-flex gap-3">
                      <label htmlFor="imageFileInput">
                        <input
                          type="file"
                          id="imageFileInput"
                          onChange={fileHandler}
                          hidden
                        />
                        <i className="bi bi-card-image"></i>
                      </label>
                      <label htmlFor="gifFileInput">
                        <input
                          type="file"
                          id="gifFileInput"
                          onChange={(e) =>
                            setNewPost({
                              ...newPost,
                              media: e.target.files[0],
                            })
                          }
                          hidden
                        />
                        <i className="bi bi-filetype-gif"></i>
                      </label>
                      <span>
                        <i className="bi bi-emoji-smile"></i>
                      </span>
                    </div>
                    <button
                      className="primary-bg  px-4 py-1 text-white border-0 outline-transparent"
                      onClick={postHandler}
                      disabled={newPost.content.length == 0}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
    )
}

export default NewPostSection