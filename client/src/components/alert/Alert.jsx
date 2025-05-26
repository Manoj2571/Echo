import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setAlertMessage } from "../../features/users/usersSlice";
import { useNavigate } from "react-router-dom";

const Alert = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { alertMessage } = useSelector((state) => state.users);

  if (alertMessage) {
    setTimeout(() => {
      dispatch(setAlertMessage(null));
    }, 2900);
  }

  return (
    <>
      {alertMessage && (
        <div className="alert_popup">
          {alertMessage.user.fullName} {alertMessage.action}
          {alertMessage.action == "comment" || "bookmark"
            ? "ed"
            : "d"} your{" "}
          {alertMessage.post.parentPostComment ? "Comment" : "Post"} &nbsp;
          <button
            className="text-white primary-bg ms-auto px-4 py-1 border-0"
            onClick={() => navigate(`/postDetail/${alertMessage.post._id}`)}
          >
            View {alertMessage.post.parentPostComment ? "Comment" : "Post"}
          </button>
        </div>
      )}
    </>
  );
};

export default Alert;
