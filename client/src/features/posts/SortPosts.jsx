const SortPosts = ({selected, setSelected, setShowSortPosts}) => {

    const selectHandler = (e) => {
        setSelected(e.currentTarget.dataset.value)
        setShowSortPosts(false)
    }


  return (
    <ul className="list-group position-absolute top-0 end-0 pe-1 pt-3 z-1" style={{cursor: "pointer"}}>
      <li className={`list-group-item text-nowrap ${selected == "Latest Posts" && "primary-txt"}`}   data-value="Latest Posts" onClick={selectHandler}>
        <span>Latest Posts</span>
      </li>
      <li className={`list-group-item text-nowrap ${selected == "Trending Posts" && "primary-txt"}`}   data-value="Trending Posts"  onClick={selectHandler}>
        <span>Trending Posts</span>
      </li>
    </ul>
  );
};

export default SortPosts;