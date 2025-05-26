import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchUsers, setLoggedInUser } from "../../features/users/usersSlice";
import toast from "react-hot-toast";
import { fetchPosts } from "../../features/posts/postsSlice";


const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const {isUserLoggedIn} = useSelector((state) => state.users);

  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("authToken");
      if (!isUserLoggedIn) {
        if(token) {
            try {
          const response = await axios.get("http://localhost:8000/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        dispatch(setLoggedInUser(response?.data))

        await Promise.all([
            dispatch(fetchPosts()),
            dispatch(fetchUsers())
        ])
        
        } catch (error) {
          toast.error("An unknown error occured, please login")
        } finally {
          setCheckingToken(false);
        }
        } else {
          setCheckingToken(false)
        }
        
      }
    };

    checkToken();
  }, [dispatch, isUserLoggedIn]);

  if (isUserLoggedIn) {
    return children;
  }

  if (checkingToken) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border primary-txt" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } 

  if(!checkingToken) {
    return <Navigate to="/" />
  }
};

export default ProtectedRoute;
