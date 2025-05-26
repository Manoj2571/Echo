import { useDispatch } from "react-redux";
import Header from "../components/header/Header";
import NavigationBar from "../components/navigation/NavigationBar";
import ProfileSuggestions from "../components/profile/ProfileSuggestions";
import { updateSearchTerm } from "../features/search/searchSlice";
import SearchResults from "../components/search/SearchResults";
import ExploreContent from "../components/explore/ExploreContent";
import { useState } from "react";

const Search = () => {
  const dispatch = useDispatch();


  const [searchValue, setSearchValue] = useState(null)

  const changeHandler = (e) => {
    setSearchValue(e.target.value)
    dispatch(updateSearchTerm(e.target.value));
  };

  return (
    <div className="grid-container">
      <Header />
            <NavigationBar />
            <div className="me-5 mt-5 pt-2 pe-3">
              <div
                className="py-2 ps-3  d-flex align-items-center bg-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
                <input
                  className="border-0 ms-3  flex-grow-1 text-black pe-3"
                  placeholder="Search Echo"
                  value={searchValue}
                  type="search"
                  onChange={changeHandler}
                  style={{ outline: "none" }}
                  autoFocus
                />
              </div>
              {searchValue ? <SearchResults /> : <ExploreContent />}
            </div>
            <ProfileSuggestions />
    </div>
  );
};

export default Search;
