import Header from "../components/header/Header";
import { useSelector } from "react-redux";
import { useState } from "react";
import NavigationBar from "../components/navigation/NavigationBar";
import ProfileSuggestions from "../components/profile/ProfileSuggestions";
import EditProfile from "../components/profile/EditProfile";
import UserContent from "../features/users/UserContent";
import UserAvatar from "../components/profile/UserAvatar";

const Profile = () => {
  
  const [editProfile, setEditProfile] = useState(false);

  const { posts, postsStatus } = useSelector((state) => state.posts);
  const {loggedInUser, usersStatus} = useSelector((state) => state.users)

  const loggedInUserPosts = posts.filter(
    (post) =>
      post.author._id == loggedInUser._id && post.parentPostComment == null
  );

  return (
    <div className="grid-container">
      <Header />
            <NavigationBar />
            {editProfile ? (
              <EditProfile setEditProfile={setEditProfile} />
            ) : (
              <div className="me-5 mt-2 pt-2">  
                <div className="d-flex flex-column align-items-center">
                  <label htmlFor="profile_image">
                    <UserAvatar url={loggedInUser.profilePictureUrl} width="120px" height="120px"/>
                  </label>
                  <input type="file" id="profile_image" hidden />
                  <h4 className="fw-bold mt-4">{loggedInUser.fullName}</h4>
                  <div
                    className="text-body-tertiary"
                    style={{ lineHeight: "0.7" }}
                  >
                    @{loggedInUser.userName}
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className=" px-2 py-1 grey-border bg-transparent mt-3 mb-4"
                      onClick={() => setEditProfile(!editProfile)}
                    >
                      Edit Profile
                    </button>
                  </div>

                  <p>{loggedInUser.about}</p>
                  <p className="primary-txt">{loggedInUser.userName}.com</p>
                  <div className="bg-white d-flex justify-content-between p-3  align-items-center col-8 col-md-6 text-center">
                    <div>
                      <div className="fw-bold">
                        {loggedInUser.following.length}
                      </div>
                      <div className="fw-semi-bold">Following</div>
                    </div>
                    <div>
                      <div className="fw-bold">{loggedInUserPosts.length}</div>
                      <div className="fw-semi-bold">Posts</div>
                    </div>
                    <div>
                      <div className="fw-bold">
                        {loggedInUser.followers.length}
                      </div>
                      <div className="fw-semi-bold">Followers</div>
                    </div>
                  </div>
                </div>
                {usersStatus == "success" && <UserContent />}
              </div>
            )}
            <ProfileSuggestions />
    </div>
  );
};

export default Profile;
