import { useSelector } from "react-redux";
import Post from "../features/posts/Post";
import Header from "../components/header/Header";
import NavigationBar from "../components/navigation/NavigationBar";
import ProfileSuggestions from "../components/profile/ProfileSuggestions";
import Spinner from "../components/spinner/Spinner";

const Bookmarks = () => {
  const { loggedInUser, users, usersStatus } = useSelector((state) => state.users);

  const { posts, postsStatus } = useSelector((state) => state.posts);


  return (
    <div className="grid-container">
      <Header />
      <NavigationBar />
      <div className="me-5 mt-5">
                <h4 className="fw-bold my-3">Your Bookmarks</h4>
              {postsStatus == "loading" && <div className="mt-5"><Spinner /></div>}  
              {postsStatus == "success" && usersStatus == "success" && users.find(user => user._id == loggedInUser._id).bookmarks.map((post) => (
    <div className="mb-3" key={post._id}><Post post={post}  /></div>
  ))}
      </div>
      <ProfileSuggestions />
    </div>
  );
};

export default Bookmarks;
