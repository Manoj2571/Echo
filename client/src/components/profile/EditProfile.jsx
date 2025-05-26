import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateUserDataAsync } from "../../features/users/usersSlice";
import toast from "react-hot-toast";

const EditProfile = ({ setEditProfile }) => {
  const dispatch = useDispatch();
  const { loggedInUser, users } = useSelector((state) => state.users);

  const [currentFocus, setCurrentFocus] = useState(null);

  const [userData, setUserData] = useState(loggedInUser);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassword, setchangePassword] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(false);
  const [isUserNameAvailable, setIsUserNameAvailable] = useState(true);

  const fileUploadHandler = (e) => {
    setUserData({ ...userData, profilePictureUrl: e.target.files[0] });
  
     toast.success(`${e.target.files[0].name} uploaded successfully.`)
    
  };

  const passwordHandler = (e) => {
    const password = e.target.value;
    if (
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[^A-Za-z0-9]/.test(password) &&
      /\d/.test(password) &&
      password.length >= 8
    ) {
      setIsPasswordSecure(true);
    } else {
      setIsPasswordSecure(false);
    }

    setPassword(e.target.value);
  };

  const confirmPasswordHandler = (e) => {
    setConfirmPassword(e.target.value);
  };

  const userNameChangeHandler = (e) => {
    const username = e.target.value;

    if (
      username.length > 3 &&
      username.length < 20 &&
      !users.map((user) => user.userName).includes(username)
    ) {
      setIsUserNameAvailable(true);
    } else {
      setIsUserNameAvailable(false);
    }

    setUserData({ ...userData, userName: e.target.value });
  };

  const saveHandler = () => {
    const formData = new FormData();
    const { fullName, userName, about, profilePictureUrl } = userData;
    formData.append("fullName", fullName);
    formData.append("userName", userName);
    formData.append("about", about);
    formData.append("profilePictureUrl", profilePictureUrl);
    dispatch(updateUserDataAsync(formData)).then((response) =>
      setEditProfile(false)
    );
  };

  return (
    <div className="me-5  bg-white py-4 px-3">
      <div className="d-flex justify-content-between flex-wrap mb-3">
        <div className="d-flex justify-content-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-arrow-left mt-1 me-5"
            viewBox="0 0 16 16"
            onClick={() => setEditProfile(false)}
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
          <h4 className="fw-bold">Edit Profile</h4>
        </div>
        <button className="primary-bg text-white border-0 px-4" onClick={saveHandler}>
          Save
        </button>
      </div>
      <div className="d-flex flex-column">
        <label htmlFor="profile_image" className="d-flex align-self-center">
          <img
            className="rounded-circle"
            src={loggedInUser.profilePictureUrl}
            width="120px"
            height="120px"
          />
        </label>
        <input
          type="file"
          id="profile_image"
          onChange={fileUploadHandler}
          hidden
        />
        <label
          className="p-2 rounded mt-3"
          htmlFor="nameInput"
          onClick={() => setCurrentFocus("name")}
          style={{
            border:
              currentFocus == "name"
                ? "1px solid #ff3b30"
                : "1px solid #808080",
          }}
        >
          <span
            style={{
              color: currentFocus == "name" ? "#ff3b30" : "#808080",
            }}
          >
            Full Name
          </span>
          <br />
          <input
            type="text"
            id="nameInput"
            value={userData.fullName}
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
            }}
            onChange={(e) =>
              setUserData({ ...userData, fullName: e.target.value })
            }
          />
        </label>
        <label
          className="p-2 rounded mt-3"
          htmlFor="userNameInput"
          onClick={() => setCurrentFocus("userName")}
          style={{
            border:
              currentFocus == "userName"
                ? "1px solid #ff3b30"
                : "1px solid #808080",
          }}
        >
          <span
            style={{
              color: currentFocus == "userName" ? "#ff3b30" : "#808080",
            }}
          >
            User Name
          </span>
          <br />
          <input
            type="text"
            id="userNameInput"
            value={userData.userName}
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
            }}
            onChange={userNameChangeHandler}
            // hidden={!(currentFocus == "name")}
          />
        </label>
        {!isUserNameAvailable && userData.userName != loggedInUser.userName && (
          <small className="my-2" style={{ color: "#ff3b30" }}>
            User Name not available.
          </small>
        )}
        <label
          className=" p-2 rounded mt-3"
          htmlFor="bioInput"
          onClick={() => setCurrentFocus("Bio")}
          style={{
            border:
              currentFocus == "Bio" ? "1px solid #ff3b30" : "1px solid #808080",
          }}
        >
          <span
            style={{
              color: currentFocus == "Bio" ? "#ff3b30" : "#808080",
            }}
          >
            Bio
          </span>
          <br />
          <textarea
            value={userData.about}
            id="bioInput"
            rows="4"
            cols="70"
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              resize: "none",
            }}
            onChange={(e) =>
              setUserData({ ...userData, about: e.target.value })
            }
            // hidden={!(currentFocus == "Bio")}
          ></textarea>
        </label>
        <p
          onClick={() => setchangePassword(!changePassword)}
          style={{ cursor: "pointer" }}
          className="mt-3 mb-2"
        >
          Change Password?
        </p>
        {changePassword && (
          <>
            <div className="d-flex justify-content-between flex-wrap mb-3">
              {!(password == confirmPassword) &&
                confirmPassword.length == password.length && (
                  <small className="mt-1 mb-2" style={{ color: "#ff3b30" }}>
                    Passwords didn't match
                  </small>
                )}
              {(currentFocus == "password" ||
                currentFocus == "confirmPassword") && (
                <small className="mt-1 mb-2" style={{ color: "#ff3b30" }}>
                  Password must include atleast 1 lowercase, 1 uppercase, 1
                  number, 1 special Character and Min. 8 characters.
                </small>
              )}
              <label
                className="p-2 rounded "
                htmlFor="passwordInput"
                onClick={() => setCurrentFocus("password")}
                style={{
                  border:
                    currentFocus == "password"
                      ? "1px solid #ff3b30"
                      : "1px solid #808080",
                }}
              >
                <span
                  style={{
                    color: currentFocus == "password" ? "#ff3b30" : "#808080",
                  }}
                >
                  New Password
                </span>
                <br />
                <input
                  type="password"
                  id="passwordInput"
                  // value={userData.fullName}
                  style={{
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                  }}
                  onChange={passwordHandler}
                  // hidden={!(currentFocus == "name")}
                />
              </label>
              <label
                className="p-2 rounded "
                htmlFor="confirmPassword"
                onClick={() => setCurrentFocus("confirmPassword")}
                style={{
                  border:
                    currentFocus == "confirmPassword"
                      ? "1px solid #ff3b30"
                      : "1px solid #808080",
                }}
              >
                <span
                  style={{
                    color:
                      currentFocus == "confirmPassword" ? "#ff3b30" : "#808080",
                  }}
                >
                  Confirm Password
                </span>
                <br />
                <input
                  type="password"
                  id="confirmPassword"
                  // value={userData.fullName}
                  style={{
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                  }}
                  onChange={confirmPasswordHandler}
                  // hidden={!(currentFocus == "name")}
                />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
