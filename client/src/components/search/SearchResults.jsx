import Post from "../../features/posts/Post";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import MediaView from "../media/MediaView";
import React from "react";
import UserAvatar from "../profile/UserAvatar";



const SearchResults = () => {
  const tagsArray = ["Top", "Latest", "People", "Media"];

  const { posts, postsStatus } = useSelector((state) => state.posts);
  const { users, usersStatus, loggedInUser } = useSelector(
    (state) => state.users
  );

  
  const {searchTerm} = useSelector((state) => state.search)

  const [selectedTag, setSelectedTag] = useState("Top");

  const filteredTopPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLatestPosts = posts.filter(
    (post) =>
      post.author.userName
        .split(" ")
        .join("")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      post.author.fullName
        .split(" ")
        .join("")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      post.author.email
        .split(" ")
        .join("")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const media = filteredLatestPosts
    .filter((post) => post.media != null && post.author._id != loggedInUser._id)
    .map((post) => post.media);

  const filteredPeople = users
    .filter(
      (user) =>
        user.userName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.fullName
          .split(" ")
          .join("")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    ).filter((user) => user._id != loggedInUser._id);

  return (
    <div className="">
      <div className="d-flex justify-content-between flex-wrap my-4">
        {tagsArray.map((tag, index) => (
          <button
            key={index}
            value={tag}
            className={
              selectedTag == tag ? "p-2 tag_btn_selected" : "p-2 tag_btn"
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
      {(usersStatus == "loading" || postsStatus == "loading") && <p>Loading...</p>}
      {selectedTag == "Top" && (
        <>
          {filteredTopPosts.length != 0 ? (
            filteredTopPosts?.map((post) => <div className="mb-3" key={post._id}><Post post={post}  /></div>)
          ) : (
            <div className="display-5 text-center py-5 my-5">
              No Results for "{searchTerm}"
            </div>
          )}
        </>
      )}
      {selectedTag == "Latest" && (
        <>
          {filteredLatestPosts.length != 0 ? (
            filteredLatestPosts?.map((post) => (
              <div className="mb-3" key={post._id}><Post post={post}  /></div>
            ))
          ) : (
            <div className="display-5 text-center py-5 my-5">
              No Results for "{searchTerm}"
            </div>
          )}
        </>
      )}
      {selectedTag == "People" && (
        <>
          {filteredPeople.length != 0 ? (
            filteredPeople.map((user) => (
              <div
                className="d-flex justify-content-between align-items-center px-2 bg-white border-bottom"
                key={user._id}
              >
                <Link
                  className="d-flex justify-content-between"
                  to={`/profile/${user._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div>
                    <UserAvatar url={user.profilePictureUrl || `https://ui-avatars.com/api/?color=ffffff&background=random&name=${user.userName}&length=1&size=250`}/>
                  </div>
                  <div className="mb-1 ms-2">
                    <div
                      className="fw-bold text-black"
                      style={{ fontSize: "15px" }}
                    >
                      {user.fullName}
                    </div>
                    <span
                      style={{ lineHeight: "1" }}
                      className="text-body-tertiary"
                    >
                      @{user.userName}
                    </span>
                  </div>
                </Link>
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/profile/${user._id}`}
                  // state={{ user, follow: true }}
                >
                  {loggedInUser.following.includes(user._id) ? (
                    <button
                    className="my-3 px-3 py-1 bg-transparent border"
                    // onClick={() => setConformationPopup(true)}
                  >
                    Following
                  </button>
                  ) : (
                    <button
                    className="my-3 primary-bg border-0 text-white px-4 py-1"
                    name="follow_btn"
                    // onClick={handleFollowUser}
                  >
                    Follow
                  </button>
                  )}
                </Link>
              </div>
            ))
          ) : (
            <div className="display-5 text-center py-5 my-5">
              No Results for "{searchTerm}"
            </div>
          )}
        </>
      )}
      {selectedTag == "Media" && (
        <>
          {media.length != 0 ? (
            media?.map((post, index) => (
              <React.Fragment key={index}><MediaView media={post}/></React.Fragment>
            ))
          ) : (
            <div className="display-5 text-center py-5 my-5">
              No Results for "{searchTerm}"
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;


