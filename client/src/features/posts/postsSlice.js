import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getSocket } from "../../utils/socket";
import toast from "react-hot-toast";

export const fetchPosts = createAsyncThunk("/posts/fetchPosts", async () => {
  const response = await axios.get("https://echo-eta-eight.vercel.app/api/posts");
  return response.data;
});

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    postsStatus: "idle",
    error: null,
    authorLikeColorCode: null,
    authorBookmarkColorCode: null,
  },
  reducers: {
    updateAuthor: (state, action) => {
      state.author = action.payload;
    },
    addNewPost: (state, action) => {
      state.posts = [...state.posts, action.payload].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    updatePostLikes: (state, action) => {
      const postIndex = state.posts.findIndex(
        (post) => post._id == action.payload._id
      );
      state.posts[postIndex].likes = action.payload.likes;
    },
    updatePostContent: (state, action) => {
      const postIndex = state.posts.findIndex(
        (post) => post._id == action.payload._id
      );
      state.posts[postIndex].content = action.payload.content;
    },
    updatePostComments: (state, action) => {
      const postIndex = state.posts.findIndex(
        (post) => post._id == action.payload._id
      );

      state.posts[postIndex].comments = action.payload.comments;
    },
    updateAuthorLikeColorCode: (state, action) => {
      state.authorLikeColorCode = action.payload;
    },
    updateAuthorBookmarkColorCode: (state, action) => {
      state.authorBookmarkColorCode = action.payload;
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post._id != action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state, action) => {
      state.postsStatus = "loading";
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.postsStatus = "success";
      state.posts = action.payload;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.postsStatus = "error";
      state.error = action.payload;
    });
  },
});

export const {
  addNewPost,
  updateAuthor,
  updatePostLikes,
  deletePost,
  updatePostComments,
  updatePostContent,
  updateAuthorLikeColorCode,
  updateAuthorBookmarkColorCode,
} = postsSlice.actions;

export const addNewPostAsync = createAsyncThunk(
  "/posts/addNewPost",
  async (formData, thunkAPI) => {
    try {
      const { posts } = thunkAPI.getState().posts;
      const { loggedInUser } = thunkAPI.getState().users;

      const response = await axios.post(
        "https://echo-eta-eight.vercel.app/api/user/post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = await response.data;

      const repostIndex = posts.findIndex(
        (post) => post._id == data.post.repost
      );

      const fullPost =
        repostIndex == -1
          ? { ...data.post, author: loggedInUser }
          : {
              ...data.post,
              author: loggedInUser,
              repost: {
                ...posts[repostIndex],
                author: posts[repostIndex].author,
              },
            };

      const parentPostComment = posts.find(
        (post) => post._id == fullPost.parentPostComment
      );

      const socket = getSocket();

      socket.emit("newPost", { fullPost, parentPostComment });

      thunkAPI.dispatch(addNewPost(fullPost));
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deletePostAsync = createAsyncThunk("/tasks/deletePost", async (postData,thunkAPI) => {
    const {postId} = postData
    try {
        const response = await axios.delete(`https://echo-eta-eight.vercel.app/api/user/posts/${postId}`)

        toast.success(response.data?.message)
        thunkAPI.dispatch(deletePost(postId))
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const updatePostContentAsync = createAsyncThunk("/posts/updatePost", async (post, thunkAPI) => {
    const {postId, postData} = post
    try {
        const response = await axios.post(`https://echo-eta-eight.vercel.app/api/posts/edit/${postId}`, postData)

        thunkAPI.dispatch(updatePostContent(response.data?.post))
        toast.success(response.data?.message)
       
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})


export const updatePostLikesAsync = (post, user) => async (dispatch) => {
  try {
    // const { socket } = useSelector((state) => state.socket);
    const userIndex = post.likes.findIndex((like) => like == user._id);
    //if user exists, remove user else add user.
    const updatedPostLikes =
      userIndex == -1
        ? { likes: [...post.likes, user] }
        : { likes: post.likes.filter((like) => like != user._id) };

    const response = await fetch(
      `https://echo-eta-eight.vercel.app/api/posts/edit/${post._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPostLikes),
      }
    );

    if (!response.ok) {
      toast.error("Failed to update post.");
    } else {
      const data = await response.json();
      dispatch(updatePostLikes(data.post));

      const socket = getSocket();
      if (userIndex == -1) {
        socket.emit("postInteraction", {
          authorId: post.author._id,
          post: data.post,
          user,
          action: "liked",
        });
      }

      socket.emit("postLikes", data.post);
    }
  } catch (error) {
    console.log(error)
    toast.error("Failed to update post.")
  }
};

export const addCommentAsync = (post, comment) => async (dispatch) => {
  try {
    const updatedComments = { comments: [...post.comments, comment] };
    const response = await fetch(
      `https://echo-eta-eight.vercel.app/api/posts/edit/${post._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedComments),
      }
    );

    if (!response.ok) {
      toast.error("Failed to update post.");
    } else {
      const data = await response.json();
      dispatch(updatePostComments(data.post));
    }
  } catch (error) {
    toast.error("Failed to update post.")
  }
};


export default postsSlice;
