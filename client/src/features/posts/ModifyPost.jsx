import { useDispatch } from "react-redux";
import { deletePostAsync } from "./postsSlice";



const ModifyPost = ({post, setShowModifyPost, setShowEditPost}) => {
   
  const dispatch = useDispatch() 
  

  const deletePostHandler = (e) => {
    e.preventDefault()
     e.stopPropagation()
    dispatch(deletePostAsync({postId: post._id})).then(() => setShowModifyPost(false))
  }  

  const showEditPostHandler = (e) => {
    e.stopPropagation()
    setShowEditPost(true)
    setShowModifyPost(false)
  }

  const closeModifyPostHanlder = (e) => {
    e.stopPropagation()
    setShowModifyPost(false)
  }

  return (
    <>
    <ul className="list-group position-absolute top-0 end-0 pe-1 pt-3 z-1" style={{cursor: "pointer"}}>
      <li className="list-group-item primary-txt d-flex gap-3 align-items-center" onClick={deletePostHandler}>
        <i class="bi bi-trash3-fill"></i><span>Delete Post</span>
      </li>
      <li className="list-group-item d-flex gap-3 align-items-center" onClick={showEditPostHandler}>
        <i class="bi bi-pencil"></i><span>Edit Post</span>
      </li>
      <li className="list-group-item text-center" onClick={closeModifyPostHanlder}>
        Cancel
      </li>
    </ul>
    </>
  );
};

export default ModifyPost;