import NavigationBar from "../components/navigation/NavigationBar";
import ProfileSuggestions from "../components/profile/ProfileSuggestions";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CommentPopup from "../components/comment/CommentPopup";
import { updateBookmarksAsync } from "../features/users/usersSlice";
import { updateAuthorBookmarkColorCode,updatePostLikesAsync, updateAuthorLikeColorCode, addNewPostAsync } from "../features/posts/postsSlice";
import Post from "../features/posts/Post";
import SharePostPopup from "../components/share/SharePostPopup";
import toast from "react-hot-toast";

const PostDetail = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [commentClick, setCommentClick] = useState(false);
  const [shareClick, setShareClick] = useState(false);

  const { posts, authorLikeColorCode, authorBookmarkColorCode } = useSelector(
    (state) => state.posts
  );
  const { loggedInUser } = useSelector((state) => state.users);

  const [comment, setComment] = useState({
    parentPostComment: postId,
    content: "",
    media: null,
    author: loggedInUser._id,
  });

  const currentPost = posts.find((post) => post._id == postId);

  // const comments = posts.filter(
  //   (post) => post.parentPostComment == currentPost._id
  // );

  const comments = posts
    ?.filter((comment) => comment.parentPostComment == currentPost._id)
    .map((comment) => <div className="border-top" key={comment._id}><Post post={comment} /></div>);

  //Does the loggedInUser liked particular post
  const userIndex = currentPost.likes.findIndex(
    (user) => user == loggedInUser._id
  );

  //Does the Post bookmarked by the loggedInUser
  const postIndex = loggedInUser.bookmarks.findIndex(
    (bookmarkedPost) => bookmarkedPost._id == currentPost._id
  );

  const likeColorCode =
    userIndex == -1
      ? dispatch(updateAuthorLikeColorCode("#ffffff"))
      : dispatch(updateAuthorLikeColorCode("#ff0000"));

  const BookmarkColorCode =
    postIndex == -1
      ? dispatch(updateAuthorBookmarkColorCode("#ffffff"))
      : dispatch(updateAuthorBookmarkColorCode("#000000"));

  const [commentData, setCommentData] = useState({
    comment: "",
    commentedUser: loggedInUser,
  });

  

  const commentHandler = (e) => {
    e.stopPropagation();
    const formData = new FormData();
    const { parentPostComment, content, media, author, repost } = comment;
    formData.append("parentPostComment", parentPostComment);
    formData.append("content", content);
    formData.append("media", media);
    formData.append("author", author);
    dispatch(addNewPostAsync(formData));
    setComment({
      parentPostComment: postId,
      content: "",
      media: null,
      author: loggedInUser._id,
    });
  };

  const handleLikeDislikePost = (e) => {
    e.stopPropagation();
    authorLikeColorCode == "#ffffff"
      ? dispatch(updateAuthorLikeColorCode("#ff0000"))
      : dispatch(updateAuthorLikeColorCode("#ffffff"));
    dispatch(updatePostLikesAsync(currentPost, loggedInUser));
  };

  const handleBookmarkPost = (e) => {
    e.stopPropagation();
    authorBookmarkColorCode == "#ffffff"
      ? dispatch(updateAuthorBookmarkColorCode("#000000"))
      : dispatch(updateAuthorBookmarkColorCode("#ffffff"));
    dispatch(updateBookmarksAsync(currentPost, loggedInUser));
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    setCommentClick(true);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShareClick(true);
  };


  return (
    <div className="grid-container">
      <Header />
      <NavigationBar />
      <div className="me-4  bg-white mb-3">
              <div className="p-3 pb-2 ">
                <div className="mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-left-short" onClick={() => navigate(-1)} viewBox="0 0 20 20">
  <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"></path>
</svg>{" "}
                  <span className="fw-bold fs-4 ms-1">Post</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2 ">
                  <Link
                    className="d-flex justify-content-between"
                    to={`/othersProfile/${currentPost.author._id}`}
                    // state={{ user, follow: false }}
                    style={{ textDecoration: "none" }}
                  >
                    <div>
                      <img
                        className="rounded-circle mt-1"
                        src={currentPost.author.profilePictureUrl}
                        width="40px"
                        height="40px"
                      />
                    </div>
                    <div className="mb-1 ms-2">
                      <div
                        className="fw-bold text-black"
                        style={{ fontSize: "15px" }}
                      >
                        {currentPost.author.fullName}
                      </div>
                      <span
                        style={{ lineHeight: "1" }}
                        className="text-body-tertiary"
                      >
                        @{currentPost.author.userName}
                      </span>
                    </div>
                  </Link>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-three-dots text-body-tertiary"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                  </svg>
                </div>
                <div className="fs-4 px-2" style={{ whiteSpace: "pre-wrap" }}>
                  {currentPost.content}
                </div>
                {currentPost.media && (
                  <img
                    src={currentPost.media}
                    width="90%"
                    height="300px"
                    className="mb-3 px-2"
                  />
                )}
                {currentPost.repost && (
                  <div
                    className="px-2 pt-2 mx-2 post_display my-3 border rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/postDetail/${currentPost.repost._id}`);
                    }}
                  >
                    <div style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                      <img
                        className="rounded-circle"
                        src={currentPost.repost.author.profilePictureUrl}
                        width="40px"
                        height="40px"
                      />
                    </div>
                    <div
                      className="flex-grow-1"
                      style={{ paddingLeft: "8px", paddingRight: "0px" }}
                    >
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <span className="fw-semibold ms-1">
                            {currentPost.repost.author.fullName}
                          </span>{" "}
                          <span className="text-body-tertiary">
                            @{currentPost.repost.author.userName}{" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-dot"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                            </svg>{" "}
                            2 min
                          </span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-three-dots text-body-tertiary"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                        </svg>
                      </div>
                      <div style={{ paddingInlineEnd: "18px" }}>
                        <p className="ms-1">{currentPost.repost.content}</p>
                        {currentPost.repost.media && (
                          <img
                            src={currentPost.repost.media}
                            width="90%"
                            height="300px"
                            className="mb-3"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="my-2">
                  <span>12:11 AM</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-dot"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                  </svg>{" "}
                  <span>Nov 21, 2024</span>
                </div>
                <hr />
                <span>{currentPost.likes.length} Likes</span>
                <hr />
                <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    stroke="black"
                    viewBox="0 0 24 24"
                    className="bi bi-heart-fill mb-1"
                    onClick={handleLikeDislikePost}
                  >
                    <path
                      fill={authorLikeColorCode}
                      d="M12 5.881A5.39 5.39 0 0116.05 4C18.822 4 21 6.178 21 8.95c0 3.4-3.055 6.17-7.684 10.367l-.011.01L12 20.515l-1.305-1.179-.036-.032C6.044 15.11 3 12.344 3 8.95 3 6.178 5.178 4 7.95 4A5.39 5.39 0 0112 5.881z"
                    ></path>
                  </svg>
                  {commentClick ? (
                    <CommentPopup
                      setCommentClick={setCommentClick}
                      post={currentPost}
                      loggedInUser={loggedInUser}
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-chat-left"
                      viewBox="0 0 16 16"
                      onClick={handleCommentClick}
                    >
                      <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                    </svg>
                  )}
                  {shareClick ? (
                    <SharePostPopup
                      setShareClick={setShareClick} post={currentPost} 
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-chat-left"
                      viewBox="0 0 16 16"
                      onClick={handleShareClick}
                    >
                      <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                    </svg>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    stroke="black"
                    className="bi bi-bookmark-fill"
                    viewBox="0 0 16 16"
                    onClick={handleBookmarkPost}
                  >
                    <path
                      fill={authorBookmarkColorCode}
                      d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"
                    />
                  </svg>
                </div>
              </div>

             
                <div className="px-2 py-3 d-flex border-top">
                  <div
                    className=""
                    style={{ paddingLeft: "0px", paddingRight: "0px" }}
                  >
                    <img
                      className="rounded-circle"
                      src={loggedInUser.profilePictureUrl}
                      width="40px"
                      height="40px"
                    />
                  </div>
                  <div
                    className="flex-grow-1 d-flex align-items-center gap-2 ms-2"
                    style={{ paddingLeft: "8px", paddingRight: "0px" }}
                  >
                    <textarea
                      placeholder="Comment Your reply"
                      className="py-2 grey-bg border-0 px-2 "
                      rows="1"
                      value={comment.content}
                      onChange={(e) =>
                        setComment({ ...comment, content: e.target.value })
                      }
                      style={{
                        width: "100%",
                        resize: "none",

                        paddingRight: "0px",
                        outline: "none",
                      }}
                    ></textarea>
                      <button
                        className="primary-bg  px-4 py-2 text-white border-0 outline-transparent me-2"
                        onClick={commentHandler}
                        disabled={comment.content.length == 0}
                      >
                        Post
                      </button>
                  </div>
                </div>
          
              {comments}
              <div className="py-2 bg_grey"></div>
      </div>
      <ProfileSuggestions />
    </div>    
  );
};

export default PostDetail;
