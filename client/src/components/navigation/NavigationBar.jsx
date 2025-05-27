import { useState } from "react";
import {  NavLink, useNavigate, useLocation } from "react-router-dom";
import NewPostPopup from "../../features/posts/NewPostPopup";
import { useDispatch, useSelector} from "react-redux";
import { logoutUser } from "../../features/users/usersSlice";
import Spinner from "../spinner/Spinner";

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()

  const [showLogout, setShowLogout] = useState(false)
  const [createNewPost, setCreateNewPost] = useState(false);

  const {loggedInUser, usersStatus} = useSelector(state => state.users)


  const logoutHandler = async () => {
      localStorage.removeItem("authToken")
      navigate("/");
      dispatch(logoutUser());
    };

  return (
    <div className="p-s pt-xl ml-m sidebar1" style={{paddingLeft: "4rem"}}>
      <div className="d-flex flex-column justify-content-between sidebar">
        <div>
            <div className={`pt-3 ps-1  ${location.pathname === "/home" && "fw-semibold"}`}>
                <NavLink className="nav-link" to="/home">
                    <i className="bi bi-house me-1"></i>&nbsp; <span>Home</span>
                </NavLink>
            </div>
            <div className={`pt-3 ps-1  ${location.pathname === "/explore" ? "fw-semibold" : ''}`}>
                <NavLink className="nav-link" to="/explore">
                    <i className="bi bi-rocket me-1"></i>&nbsp; <span>Explore</span>
                </NavLink>
            </div>
            <div className={`pt-3 ps-1  ${location.pathname === "/bookmarks" && "fw-semibold"}`}>
                <NavLink className="nav-link" to="/bookmarks">
                    <i className="bi bi-bookmark me-1"></i>&nbsp; <span>Bookmark</span>
                </NavLink>
            </div>
            <div className={`pt-3 ps-1  ${location.pathname === "/profile" && "fw-semibold"}`}>
                <NavLink className="nav-link" to="/profile">
                    <i className="bi bi-person me-1"></i>&nbsp; <span>Profile</span>
                </NavLink>
            </div>
            <div className={`pt-3 ps-1  ${location.pathname === "/search" && "fw-semibold"}`}>
                <NavLink className="nav-link" to="/search">
                    <i className="bi bi-search me-1"></i>&nbsp; <span>Search</span>
                </NavLink>
            </div>
            <button
        className="primary-bg py-2 px-4 w-100 border-0 outline-transparent text-white my-3"
        style={{
          textWrap: "nowrap",
        }}
        onClick={() => setCreateNewPost(true)}
      >
        Create New Post
      </button>
        </div>
      
      {createNewPost && <NewPostPopup setCreateNewPost={setCreateNewPost} />}

        <div  className="d-flex gap-3 align-items-center pt-5 mt-5 position-relative" style={{ cursor: "pointer" }} onClick={() => setShowLogout(!showLogout)}>
          {usersStatus == "success" ? <><div
          className="d-flex"
        >
          <div style={{ paddingLeft: "0px", paddingRight: "5px" }}>
            <img
              className="rounded-circle"
              src={loggedInUser.profilePictureUrl}
              width="40px"
              height="40px"
            />
          </div>
          <div className="ms-1">
            <div className="fw-bold" style={{ fontSize: "14px" }}>
              {loggedInUser.fullName}
            </div>
            <div style={{ lineHeight: "1" }} className="text-body-tertiary">
              @{loggedInUser.userName}
            </div>
          </div>
        </div>
        <i className="bi bi-three-dots"></i>
        {showLogout && <div className="position-absolute w-full text-center top-0 start-0" onClick={logoutHandler}>
          <div className="position-relative py-2 px-4 primary-bg primary-border text-white rounded-pill text-nowrap">
  Logout @{loggedInUser.userName}<svg width="1em" height="1em" viewBox="0 0 16 16" className="position-absolute top-100 start-50 translate-middle mt-1" fill=" #FF3B30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>
</div>
        </div>}</> : <div className="ms-5"><Spinner /></div>}
        </div>
      </div>
      </div>
  );
};

export default NavigationBar;
