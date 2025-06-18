
import { useSelector } from "react-redux";
import Post from "../posts/Post";
import { useState } from "react";
import Spinner from "../../components/spinner/Spinner";

const UserContent = () => {

  const { posts, postsStatus } = useSelector((state) => state.posts);
  const {loggedInUser} = useSelector((state) => state.users)

  const tagsArray = ["Posts", "Replies", "Media", "Likes", "Bookmarks"];

  const [selectedTag, setSelectedTag] = useState("Posts");

    const loggedInUserPosts = posts.filter(
        (post) =>
          post.author._id == loggedInUser._id && post.parentPostComment == null
      );
    
    const loggedInUserReplies = posts.filter(
        (post) =>
          post.author._id == loggedInUser._id && post.parentPostComment != null
      );
    
    const loggedInUserBookmarks = loggedInUser?.bookmarks.map((postDetailed) =>
        posts.find((post) => post._id == postDetailed._id)
      );
    
    const loggedInUserLikes = posts.filter((post) =>
        post.likes.includes(loggedInUser._id)
      );
    
    const loggedInMediaArray = posts
        .filter((post) => post.author._id == loggedInUser._id && post.media != null)
        .map((post) => post.media);


    return (
        <>
            <div className="d-flex justify-content-between flex-wrap my-4">
                  {tagsArray.map((tag, index) => (
                    <button
                      key={index}
                      value={tag}
                      className={
                        selectedTag == tag
                          ? "p-2 tag_btn_selected"
                          : "p-2 tag_btn"
                      }
                      onClick={(e) => setSelectedTag(e.target.value)}
                    >
                      {tag}
                    </button>
                  ))}
            </div>
            {postsStatus == "loading" && <div className="mt-3"><Spinner /></div>}
            {selectedTag == "Posts" &&
                  loggedInUserPosts.map((post) => (
                    <div className="mb-3 position-relative" key={post._id}>
                        <Post post={post}  /></div>
                  ))}
                {selectedTag == "Replies" &&
                  loggedInUserReplies.map((post) => (
                    <div className="mb-3" key={post._id}><Post post={post} /></div>
                  ))}
                {selectedTag == "Likes" &&
                  loggedInUserLikes.map((post) => (
                    <div className="mb-3" key={post._id}><Post post={post} /></div>
                  ))}
                {selectedTag == "Bookmarks" &&
                  loggedInUserBookmarks.map((post) => (
                    <div className="mb-3" key={post._id}><Post post={post} /></div>
                  ))}
                {selectedTag == "Media" &&
                  loggedInMediaArray?.map((post, index) => (
                    <img
                      key={index}
                      src={post}
                      width="90%"
                      height="300px"
                      className="mb-3"
                      alt={`media ${index}`}
                    />
            ))}
        </>
    )

}


export default UserContent