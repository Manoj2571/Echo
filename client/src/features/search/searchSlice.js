import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getSocket } from "../../utils/socket";

export const fetchPosts = createAsyncThunk("/posts/fetchPosts", async () => {
  const response = await axios.get("http://localhost:8000/api/posts");
  return response.data;
});

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchTerm: null,
    showSearchResults: false,
  },
  reducers: {
    updateSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  }
});

export const {
  updateSearchTerm
} = searchSlice.actions;



export default searchSlice;
