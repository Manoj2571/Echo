import Post from "../../features/posts/Post";
import {  useSelector } from "react-redux";
import {  useState } from "react";
import Spinner from "../spinner/Spinner";


const ExploreContent = () => {

  const { posts, postsStatus } = useSelector((state) => state.posts);
  const [selectedTag, setSelectedTag] = useState("For You");
  const {usersStatus} = useSelector(state => state.users)


  const sortedPosts = [...posts].sort(
    (a, b) => b.likes.length - a.likes.length
  );

  
  const tagsArray = ["For You", "Trending", "Technology", "Sports", "News"];

  const filteredPosts =
    selectedTag == "For You"
      ? posts
      : selectedTag == "Trending"
      ? sortedPosts
      : posts.filter((post) =>
          post.content.toLowerCase().includes(selectedTag.toLowerCase())
        );

    return (
        <div>
                <div className="d-flex justify-content-between flex-wrap my-3">
                  {tagsArray.map((tag, index) => (
                    <button
                      key={index}
                      value={tag}
                      className={
                        selectedTag == tag
                          ? "p-2 tag_btn_selected"
                          : "p-2 tag_btn"
                      }
                      style={{
                        color: selectedTag == tag ? "#000000" : "#808080",
                      }}
                      onClick={(e) => setSelectedTag(e.target.value)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {postsStatus == "loading" && <div className="mt-5"><Spinner /></div>}
                {postsStatus == "success" && usersStatus == "success" &&
                  filteredPosts?.map((post) => (
                    <div className="mb-3" key={post._id}><Post post={post} /></div>
                  ))}
              </div>
    )
}

export default ExploreContent