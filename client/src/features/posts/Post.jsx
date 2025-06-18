import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { updatePostLikesAsync } from "./postsSlice";
import CommentPopup from "../../components/comment/CommentPopup";
import { updateBookmarksAsync } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";
import SharePostPopup from "../../components/share/SharePostPopup";
import {
  format,
  isToday,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import Repost from "./Repost";
import ModifyPost from "./ModifyPost";
import EditPostPopup from "./EditPostPopup";
import MediaView from "../../components/media/MediaView";
import UserAvatar from "../../components/profile/UserAvatar";

export const postingTimeModifier = (postingTime) => {
    const now = Date.now();
    const posted = new Date(postingTime);

    if (isToday(posted)) {
      const secondsAgo = differenceInSeconds(now, posted);
      const minutesAgo = differenceInMinutes(now, posted);
      const hoursAgo = differenceInHours(now, posted);

      if (secondsAgo < 60) {
        return `${secondsAgo} sec ago`;
      }

      if (minutesAgo < 60) {
        return `${minutesAgo} min ago`;
      }

      return `${hoursAgo}h ago`;
    }

    return format(posted, "MMM dd");
  };

const Post = ({ post }) => {
  const location = useLocation()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loggedInUser } = useSelector((state) => state.users);
  const { posts } = useSelector((state) => state.posts);
  const [commentClick, setCommentClick] = useState(false);
  const [shareClick, setShareClick] = useState(false);
  const [showModifyPost, setShowModifyPost] = useState(false)
  const [showEditPost, setShowEditPost] = useState(false)

  const comments = posts?.filter(
    (comment) => comment.parentPostComment == post._id
  );

  const parentPostComment = posts.find(parentPost => parentPost._id == post.parentPostComment)

  const isProfilePage = location.pathname.includes('/profile')

  const bookmarks = users.reduce((acc, curr) => {
    const postIndex = curr.bookmarks.findIndex(
      (currentPost) => currentPost._id == post._id
    );
    acc = postIndex == -1 ? acc : acc + 1;
    return acc;
  }, 0);


  // Does the Post bookmarked by the loggedInUser
  const postIndex = users.find(user => user._id == loggedInUser._id).bookmarks.findIndex(
    (bookmarkedPost) => bookmarkedPost._id == post._id
  );

  const isLiked = post.likes.includes(loggedInUser._id);


  const handleLikeDislikePost = (e) => {
    e.stopPropagation();
    dispatch(updatePostLikesAsync(post, loggedInUser));
  };

  const handleBookmarkPost = (e) => {
    e.stopPropagation();
    dispatch(updateBookmarksAsync(post, loggedInUser))
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    setCommentClick(true);
  };

  const handleShowModifyPostHandler = (e) => {
    e.stopPropagation()
    setShowModifyPost(true)
  }

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShareClick(true);
  };

  return (
    <>
      {/* <ModifyPost /> */}
      {isProfilePage && showEditPost && <EditPostPopup post={post} setShowEditPost={setShowEditPost}/>}
      {shareClick && <SharePostPopup setShareClick={setShareClick} post={post} />}
      {commentClick && (
        <CommentPopup
          setCommentClick={setCommentClick}
          post={post}
          loggedInUser={loggedInUser}
        />
      )}
      <div
        className="py-3 px-2 post_display position-relative"
        onClick={() => navigate(`/posts/${post._id}`)}
      >
        {isProfilePage && showModifyPost && <ModifyPost post={post} setShowModifyPost={setShowModifyPost} setShowEditPost={setShowEditPost}/>}
        <div className="" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
          <UserAvatar url={post.author.profilePictureUrl}/>
        </div>
        <div
          className="flex-grow-1"
          style={{ paddingLeft: "8px", paddingRight: "0px" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex flex-column">
                <div className="d-flex ">
                  <span className="fw-bold text-black">{post.author.fullName}</span>
                  <span className="text-body-tertiary">&nbsp;@{post.author.userName} <span>•</span> <span>{postingTimeModifier(post.createdAt)}</span></span>
                </div>
                      {parentPostComment && <span
                        className="text-body-tertiary"
                      >
                      Replying to <span className="primary-txt">@{parentPostComment.author.userName}</span>
                      </span>}
              </div>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-three-dots text-body-tertiary mt-1"
              onClick={handleShowModifyPostHandler}
              viewBox="0 0 16 16"
            >
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
            </svg>
          </div>
          <div style={{ paddingInlineEnd: "18px" }}>
            <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
            {post.media && <MediaView media={post.media}/>}
            {post.repost && (
              <Repost repost={post.repost}/>
            )}
          </div>
          <div className="d-flex justify-content-between align-items-center pe-2">
            <div>
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
                  fill={isLiked ? "#ff0000" : "#ffffff"}
                  d="M12 5.881A5.39 5.39 0 0116.05 4C18.822 4 21 6.178 21 8.95c0 3.4-3.055 6.17-7.684 10.367l-.011.01L12 20.515l-1.305-1.179-.036-.032C6.044 15.11 3 12.344 3 8.95 3 6.178 5.178 4 7.95 4A5.39 5.39 0 0112 5.881z"
                ></path>
              </svg>
              {post.likes.length > 0 && (
                <span className="ms-1">{post.likes.length}</span>
              )}
            </div>
            <div>
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
              {comments.length > 0 && (
                <span className="ms-1">{comments.length}</span>
              )}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-share"
              viewBox="0 0 16 16"
              onClick={handleShareClick}
            >
              <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
            </svg>
            <div>
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
                  fill={postIndex == -1 ? "#ffffff" : "#000000"}
                  d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"
                />
              </svg>
              {bookmarks > 0 && <span className="ms-1">{bookmarks}</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
