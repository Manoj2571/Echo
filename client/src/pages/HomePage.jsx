import Header from "../components/header/Header";
import Spinner from "../components/spinner/Spinner";
import Post from "../features/posts/Post";
import NavigationBar from "../components/navigation/NavigationBar";
import ProfileSuggestions from "../components/profile/ProfileSuggestions";
import NewPostSection from "../features/posts/NewPostSection";
import { useSelector } from "react-redux";
import SortPosts from "../features/posts/SortPosts";
import { useState } from "react";
import EditPostPopup from "../features/posts/EditPostPopup";

const HomePage = () => {
  const { posts, postsStatus, error } = useSelector((state) => state.posts);
  const { usersStatus, users, loggedInUser} = useSelector((state) => state.users);
  const [showSortPosts, setShowSortPosts] = useState(false)
  const [selected, setSelected] = useState("Latest Posts")

  const postsAlone = posts.filter(post =>
  (loggedInUser.following.includes(post.author._id) || post.author._id === loggedInUser._id) &&
  post.parentPostComment == null
);

  const handleSortPosts = (e) => {
    e.preventDefault()
    setShowSortPosts(true)
  }

  const sortedPosts = selected == "Latest Posts" ? postsAlone :  postsAlone.sort(
    (a, b) => b.likes.length - a.likes.length
  );

  return (
      <div className="grid-container">
      <Header />
      <NavigationBar />
      <main className="me-5 mt-5 pt-2 pe-3">
        {/* <EditPostPopup post={sortedPosts[2]}/> */}
        
        <NewPostSection />
        <div className="d-flex justify-content-between align-items-center mt-3 mb-2 me-3 position-relative">
          <h4 className="fw-bold">{selected}</h4>
          <i className="bi bi-sliders2-vertical" onClick={handleSortPosts}></i>
          {showSortPosts && <SortPosts selected={selected} setSelected={setSelected} setShowSortPosts={setShowSortPosts}/>}
        </div>
        {postsStatus == "loading" && <div className="mt-5"><Spinner /></div>}
        {postsStatus == "success" &&
                usersStatus == "success" &&
                postsAlone?.map((post) => <div className="mb-3" key={post._id}><Post post={post}  /></div>)}
      </main>
      <ProfileSuggestions />
      </div>
  );
};  

export default HomePage;
