import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "./features/users/usersSlice";
import postsSlice from "./features/posts/postsSlice";
import searchSlice from "./features/search/searchSlice";

const store = configureStore({
  reducer: {
    users: usersSlice.reducer,
    posts: postsSlice.reducer,
    search: searchSlice.reducer
  },
});

export default store;
