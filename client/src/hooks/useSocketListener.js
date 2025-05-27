import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost, updatePostLikes } from "../features/posts/postsSlice";
import { setAlertMessage, updateBookmarks } from "../features/users/usersSlice";
import { getSocket, initSocket } from "../utils/socket";

const useSocketListener = () => {
  const dispatch = useDispatch();

  const { loggedInUser, isUserLoggedIn } = useSelector((state) => state.users);


  useEffect(() => {
    if (isUserLoggedIn) {
      initSocket(loggedInUser);

      const socket = getSocket();

      socket.on("connect", () => {
        console.log("socket connected");
      });

      socket.on("newPostCreated", (post) => {
        dispatch(addNewPost(post));
      });

      socket.on("postInteractionNotification", (data) => {
        dispatch(setAlertMessage(data));
      });

      socket.on("postLikesUpdate", (data) => {
        dispatch(updatePostLikes(data));
      });

      socket.on("bookmarksUpdate", (data) => {
        dispatch(updateBookmarks(data));
      });

      return () => {
        socket.off("connect");
        socket.off("newPostCreated");
        socket.off("postInteractionNotification");
        socket.off("postLikesUpdate");
        socket.off("bookmarksUpdate");
      };
    }
  }, [isUserLoggedIn]);
};

export default useSocketListener;
