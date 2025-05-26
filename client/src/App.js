import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import LandingPage from "./pages/LandingPage";
import Login from './pages/Login';
import Signup from "./pages/Signup";
import Explore from "./pages/Explore";
import Bookmarks from "./pages/Bookmarks";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import OtherProfile from "./pages/OthersProfile";
import Search from "./pages/Search";

export default function App() {

  return (
    <div>
      <Router>
        <Toaster
          position="top-right"
          containerClassName="text-nowrap"
          toastOptions={{
            duration: 1800
          }}
        />
        {/* <Alert />
        <TokenValidator /> */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path="/signup" element={<Signup />}/>
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>}/>
          <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>}/>
          <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/posts/:postId" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<OtherProfile />}/>
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/home"
                element={isUserLoggedIn ? <HomePage /> : <LandingPage />}
              />
              <Route
                path="/profile"
                element={isUserLoggedIn ? <ProfilePage /> : <LandingPage />}
              />
              <Route
                path="/othersProfile/:userId"
                element={
                  isUserLoggedIn ? <OtherProfilePage /> : <LandingPage />
                }
              />
              <Route
                path="/bookmarks"
                element={isUserLoggedIn ? <BookmarksPage /> : <LandingPage />}
              />
              <Route
                path="/postDetail/:postId"
                element={isUserLoggedIn ? <PostDetail /> : <LandingPage />}
              />
              <Route
                path="/search"
                element={isUserLoggedIn ? <SearchPage /> : <LandingPage />}
              />
              <Route
                path="/explore"
                element={isUserLoggedIn ? <ExplorePage /> : <LandingPage />}
              /> */}
        </Routes>
      </Router>
    </div>
  );
}


