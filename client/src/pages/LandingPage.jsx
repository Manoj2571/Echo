import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
// import { fetchUsers } from "../users/usersSlice";


const LandingPage = () => {


  return (
    <main className="landing_background h-full">
      <div className="pt-3">
        <div className="justify-content-evenly d-flex flex-wrap py-5">
          <div className="col-md-5 col-12">
            <h1
              className="display-1 mb-3 ms-3 text-white fw-bold"
              // style={{ fontSize: "175px" }}
            >
              Echo
            </h1>
            <div className="ms-3" style={{ color: "#D3D3D3" }}>
              <p>
                <span className="display-5 fw-bold">FOLLOW</span>{" "}
                <small className="fw-medium">PEOPLE AROUND GLOBE</small>
              </p>
              <p>
                <span className="display-5 fw-bold">CONNECT</span>{" "}
                <small className="fw-medium">WITH YOUR FRIENDS</small>
              </p>
              <p>
                <span className=" display-5 fw-bold">SHARE</span>{" "}
                <small className="fw-medium">WHAT YOU ARE THINKING</small>
              </p>
            </div>
          </div>
          <div
            className="mt-4 col-md-5 col-12 text-center d-flex gap-4 flex-column align-items-center"
            style={{ alignSelf: "end" }}
          >
            <Link className="text-white  landing_btn" to="/signup">
              Join Now
            </Link>
            <div className="bg-white w-100 mt-3" style={{ height: "1px"}}></div>
            <p className=" fs-4">Already have an account?</p>
            <Link className="btn-lg text-white  landing_btn mb-4" to="/login">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
