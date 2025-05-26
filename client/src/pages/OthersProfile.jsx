import Header from "../components/header/Header";
import { useSelector, useDispatch } from "react-redux";
import NavigationBar from "../components/navigation/NavigationBar";
import ProfileSuggestions from "../components/profile/ProfileSuggestions";
import Post from "../features/posts/Post";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { updateFollowersAsync, updateFollowingAsync } from "../features/users/usersSlice";

const OtherProfile = () => {
  const dispatch = useDispatch();

  const { userId } = useParams();

  const { posts } = useSelector((state) => state.posts);
  const { users, loggedInUser } = useSelector((state) => state.users);

  const tagsArray = ["Posts", "Replies", "Media", "Likes", "Bookmarks"];

  const otheruser = users.find((obj) => obj._id == userId);

  const alreadyFollowing =
    loggedInUser.following.findIndex((currentUser) => currentUser == userId) ==
    -1
      ? false
      : true;

  const [following, setFollowing] = useState(alreadyFollowing);

  const [confirmationPopup, setConformationPopup] = useState(false);

  const [selectedTag, setSelectedTag] = useState("Posts");

  const userPosts = posts.filter((post) => post.author._id == userId);

  const otherUserPosts = posts.filter(
    (post) => post.author._id == userId && post.parentPostComment == null
  );

  const UserReplies = posts.filter(
    (post) => post.author._id == userId && post.parentPostComment != null
  );

  const UserBookmarks = otheruser?.bookmarks.map((postDetailed) =>
    posts.find((post) => post._id == postDetailed._id)
  );

  const UserLikes = posts.filter((post) => post.likes.includes(otheruser._id));

  const UserMediaArray = posts
    .filter((post) => post.author._id == otheruser._id && post.media != null)
    .map((post) => post.media);

  const handleFollowUser = (e) => {
    if (e.target.name == "unfollow_btn") {
      setConformationPopup(false);
      setFollowing(false);
    } else {
      setFollowing(true);
    }

    dispatch(updateFollowingAsync(loggedInUser, otheruser));
    dispatch(updateFollowersAsync(loggedInUser, otheruser));
  };

  return (
    <div className="grid-container">
      <Header />
      <NavigationBar />
      <div className="me-5 mt-2 pt-2">
              <div className="d-flex flex-column align-items-center">
                <img
                  className="rounded-circle"
                  src={otheruser.profilePictureUrl || `https://ui-avatars.com/api/?color=ffffff&background=random&name=${otheruser.userName}&length=1&size=250`}
                  width="120px"
                  height="120px"
                />
                <h4 className="fw-bold mt-4">{otheruser.fullName}</h4>
                <div
                  className="text-body-tertiary"
                  style={{ lineHeight: "0.7" }}
                >
                  @{otheruser.userName}
                </div>
                {following ? (
                  <button
                    className="mt-3 mb-4 px-5 py-1 bg-transparent border"
                    onClick={() => setConformationPopup(true)}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    className="mt-3 mb-4 primary-bg border-0 text-white px-5 py-1"
                    name="follow_btn"
                    onClick={handleFollowUser}
                  >
                    Follow
                  </button>
                )}
                {confirmationPopup && (
                  <div className="comment_popup p-2">
                    <h4>Unfollow @{otheruser.userName} ?</h4>
                    <p>
                      Their posts will no longer show up in your For You
                      timeline. You can still view their profile.
                    </p>
                    <button
                      className="primary-bg text-white border-0"
                      name="unfollow_btn"
                      onClick={handleFollowUser}
                    >
                      Unfollow
                    </button>
                    <button
                      className="border-0 ms-3"
                      onClick={() => setConformationPopup(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <p>{otheruser.about}</p>
                <p className="txt_primary">{otheruser.userName}.com</p>

                <div className="bg-white d-flex justify-content-between p-3  align-items-center col-8 col-md-6 text-center">
                  <div>
                    <div className="fw-bold">{otheruser.following.length}</div>
                    <div className="fw-semi-bold">Following</div>
                  </div>
                  <div>
                    <div className="fw-bold">{userPosts.length}</div>
                    <div className="fw-semi-bold">Posts</div>
                  </div>
                  <div>
                    <div className="fw-bold">{otheruser.followers.length}</div>
                    <div className="fw-semi-bold">Followers</div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between flex-wrap mb-4">
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

              {selectedTag == "Posts" &&
                otherUserPosts.map((post) => (
                  <Post post={post} key={post._id} />
                ))}
              {selectedTag == "Replies" &&
                UserReplies.map((post) => <Post post={post} key={post._id} />)}
              {selectedTag == "Likes" &&
                UserLikes.map((post) => <Post post={post} key={post._id} />)}
              {selectedTag == "Bookmarks" &&
                UserBookmarks.map((post) => (
                  <Post post={post} key={post._id} />
                ))}
              {selectedTag == "Media" &&
                UserMediaArray?.map((post, index) => (
                  <img src={post} width="90%" height="300px" className="mb-3" key={index}/>
                ))}
      </div>
      <ProfileSuggestions />
    </div>
  );
};

export default OtherProfile;
