import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updatePostContentAsync } from "./postsSlice";
import UserAvatar from "../../components/profile/UserAvatar";


const EditPostPopup = ({ setShowEditPost, post }) => {
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.users);

  const [postData, setPostData] = useState({
    content: post.content
  });

  const handleEditPost = (e) => {
    e.stopPropagation()
    dispatch(updatePostContentAsync({postId: post._id, postData})).then(() => setShowEditPost(false))
  }

  const closeEditPostHandler = (e) => {
    e.stopPropagation()
    setShowEditPost(false)
  }

  return (
    <div className="newPost_popup p-3">
        <div className="d-flex justify-content-between align-items-center">
            <button className="border-0 bg-transparent primary-txt" onClick={closeEditPostHandler}>cancel</button>
            <button className="text-white border-0 px-4 py-1 primary-bg" onClick={handleEditPost} disabled={post.content == postData.content}>Edit</button>
        </div>
      <div className="p-2 d-flex  mb-3">
        <div className="" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
          <UserAvatar url={loggedInUser.profilePictureUrl}/>
        </div>
        <div className="" style={{ paddingLeft: "8px", paddingRight: "0px" }}>
          <textarea
            className="bg-transparent border-0"
            rows="5"
            
            style={{ width: "100%", resize: "none", outline: "none" }}
            value={postData.content}
            onChange={(e) => {
                e.stopPropagation()
                setPostData({ ...postData, content: e.target.value })
            }
              
            }
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default EditPostPopup;
