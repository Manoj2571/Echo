import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { fetchPosts } from "../posts/postsSlice";
import { getSocket } from "../../utils/socket";

export const fetchUsers = createAsyncThunk("/users/fetchUsers", async () => {
  const response = await axios.get("https://echo-eta-eight.vercel.app/api/users");
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    usersStatus: "idle",
    error: null,
    loggedInUser: {},
    isUserLoggedIn: false,
    alertMessage: null,
  },
  reducers: {
    updateLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
    setLoggedInUser: (state, action) => {
            state.loggedInUser = action.payload
            state.isUserLoggedIn = true
    },
    updateBookmarks: (state, action) => {
      const userIndex = state.users.findIndex(
        (user) => user._id == action.payload._id
      );
      state.users[userIndex].bookmarks = action.payload.bookmarks;

      if (state.loggedInUser._id == action.payload._id) {
        state.loggedInUser.bookmarks = action.payload.bookmarks;
      }
    },
    logoutUser: (state, action) => {
      state.isUserLoggedIn = false
      state.loggedInUser = {}
    },
    setAlertMessage: (state, action) => {
      state.alertMessage = action.payload;
    },
    updateOtherUser: (state, action) => {
      const userIndex = state.users.findIndex(
        (user) => user._id == action.payload._id
      );
      state.users[userIndex] = action.payload;
    },
     addNewUser: (state, action) => {
            state.users = [...state.users, action.payload]
        }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.usersStatus = "loading";
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.usersStatus = "success";
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.usersStatus = "error";
      state.error = action.payload;
    });
  },
});

export const {
  updateLoggedInUser,
  updateOtherUser,
  updateBookmarks,
  setLoggedInUser,
  addNewUser,
  setAlertMessage,
  logoutUser,
} = usersSlice.actions;

export const loginUserAsync = createAsyncThunk("/users/loginUser", async (userData, thunkAPI) => {
    try {
        const response = await axios.post("https://echo-eta-eight.vercel.app/auth/login", userData)

            localStorage.setItem("authToken", response.data.token)
             await Promise.all([
                        thunkAPI.dispatch(fetchPosts()),
                        thunkAPI.dispatch(fetchUsers())
                    ])
            thunkAPI.dispatch(setLoggedInUser(response.data?.user))
 
    } catch (error) {
        toast.error(error.response?.data?.message)
    }
})

export const signupUserAsync = createAsyncThunk("/users/signupUser", async (newUserData, thunkAPI) => {
    try {
        const response = await axios.post("https://echo-eta-eight.vercel.app/auth/signup", newUserData)

        thunkAPI.dispatch(addNewUser(response.data?.user))
        toast.success("Account created successfully. Please log in to continue.")
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data?.message)
    }
})

export const updateBookmarksAsync = (post, user) => async (dispatch) => {
  try {
    const postIndex = user.bookmarks.findIndex(
      (bookmark) => bookmark._id == post._id
    );
    const updatedBookmarks =
      postIndex == -1
        ? { bookmarks: [...user.bookmarks, post] }
        : {
            bookmarks: user.bookmarks.filter(
              (bookmark) => bookmark._id != post._id
            ),
          };
    const response = await fetch(
      `https://echo-eta-eight.vercel.app/api/users/edit/${user._id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBookmarks),
      }
    );

    if (!response.ok) {
      toast.error("Failed to update bookmarks");
    } else {
      const data = await response.json();
      const socket = getSocket();

        if (postIndex == -1) {
          socket.emit("postInteraction", {
            authorId: post.author._id,
            post: post,
            user,
            action: "bookmarked",
          });
        }
      dispatch(updateBookmarks(data.updatedUser));
      socket.emit("bookmarkPost", data.updatedUser);
      postIndex == -1 ? toast.success("Post added to your bookmarks.") : toast.error("Post removed from your bookmarks.")
    }
  } catch (error) {
     toast.error("Failed to update bookmarks");
  }
};



export const updateFollowingAsync =
  (loggedInUser, followingUser) => async (dispatch) => {
    try {
      const userIndex = loggedInUser.following.findIndex(
        (user) => user == followingUser._id
      );

      const updatedFollowing =
        userIndex == -1
          ? { following: [...loggedInUser.following, followingUser] }
          : {
              following: loggedInUser.following.filter(
                (user) => user != followingUser._id
              ),
            };

      const response = await fetch(
        `https://echo-eta-eight.vercel.app/api/users/edit/${loggedInUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFollowing),
        }
      );

      if (!response.ok) {
        toast.error("Failed to follow user.");
      } else {
        const data = await response.json();
        dispatch(updateLoggedInUser(data.updatedUser));
      }
    } catch (error) {
      toast.error("failed to follow user.")
    }
  };

export const updateFollowersAsync =
  (loggedInUser, followingUser) => async (dispatch) => {
    try {
      const loggedInUserIndex = followingUser.followers.findIndex(
        (user) => user == loggedInUser._id
      );

      const updatedFollowers =
        loggedInUserIndex == -1
          ? { followers: [...followingUser.followers, loggedInUser] }
          : {
              followers: followingUser.followers.filter(
                (user) => user != loggedInUser._id
              ),
            };

      const response = await fetch(
        `https://echo-eta-eight.vercel.app/api/users/edit/${followingUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFollowers),
        }
      );

      if (!response.ok) {
        toast.success("Failed to follow user.");
      } else {
        const data = await response.json();
        dispatch(updateOtherUser(data.updatedUser));
      }
    } catch (error) {
      toast.success("Failed to follow user.");
    }
  };

export const updateUserDataAsync = createAsyncThunk(
  "/users/updateUser",
  async (formData, thunkAPI) => {
    const { loggedInUser } = thunkAPI.getState().users;
    try {
      const response = await axios.post(
        `https://echo-eta-eight.vercel.app/api/users/edit/profile/${loggedInUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = await response.data;
      thunkAPI.dispatch(updateLoggedInUser(data.updatedUser));
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export default usersSlice;
