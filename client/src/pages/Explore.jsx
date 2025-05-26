import NavigationBar from "../components/navigation/NavigationBar";
import ProfileSuggestions from "../components/profile/ProfileSuggestions";
import Header from "../components/header/Header";
import ExploreContent from "../components/explore/ExploreContent";

const Explore = () => {


  return (
    <div className="grid-container">
      <Header />
      <NavigationBar />
      <div className="me-5 mt-5">
        <h4 className="fw-bold my-3">Explore</h4>
        <ExploreContent />
      </div>
      <ProfileSuggestions />
    </div>
  );
};

export default Explore;
