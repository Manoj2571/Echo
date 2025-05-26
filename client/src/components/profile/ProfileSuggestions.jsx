import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Spinner from "../spinner/Spinner";

const ProfileSuggestions = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const { users, loggedInUser, usersStatus } = useSelector(
    (state) => state.users
  );


  const recommendedUsers = users
    .filter(
      (user) =>
        user._id != loggedInUser._id &&
        !loggedInUser.following.includes(user._id)
    )
    .slice(0, 4);


  return (
    <>
      <div className="profile_suggestions mt-xl me-5">
        {location.pathname !== "/search" && <div className="bg-white py-2 ps-3 border d-flex align-items-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-search my-1"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
        <input
          className="border-0 ms-3 small my-1 pe-3"
          placeholder="Search Posts, People, Anything"
          type="search"
          onFocus={() => navigate("/search")}
          style={{  width:"16rem", outline: "none" }}
        />
      </div>}
      
        {usersStatus == "success" ? <div className="bg-white py-3">
          <div className="d-flex justify-content-between fw-bold px-3">
            <span className="tabs fw-bold">Who to Follow?</span>
            <span className="primary-txt">Show More</span>
          </div>
          <hr />

           { recommendedUsers.map((user) => (
              <div
                className="d-flex justify-content-between px-3 gap-4 mt-4"
                key={user._id}
              >
                <Link
                  className="d-flex justify-content-between"
                  to={`/profile/${user._id}`}
                  // state={{ user, follow: false }}
                  style={{ textDecoration: "none" }}
                >
                  <div>
                    <img
                      className="rounded-circle mt-1"
                      src={user.profilePictureUrl || `https://ui-avatars.com/api/?color=ffffff&background=random&name=${user.userName}&length=1&size=250`}
                      height="40px"
                      width="40px"
                    />
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
                  <p className="primary-txt fw-bold mt-2">
                    Follow{" "}
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="#ff3b30"
                        viewBox="0 -960 960 960"
                      >
                        <path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72z"></path>
                      </svg>
                    </span>
                  </p>
                </Link>
              </div>
            ))}
        </div> : <div className="p-5 m-5"><Spinner /></div>}
      </div>
    </>
  );
};

export default ProfileSuggestions;
