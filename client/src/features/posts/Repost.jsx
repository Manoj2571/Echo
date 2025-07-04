import { useNavigate } from "react-router-dom";
import { postingTimeModifier } from "./Post";
import MediaView from "../../components/media/MediaView";
import UserAvatar from "../../components/profile/UserAvatar";

const Repost = ({repost}) => {

    const navigate = useNavigate()

    return (
        <div
                        className="p-3 bg-white d-flex  mb-3 border rounded post_display"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/posts/${repost._id}`);
                        }}
                      >
                        <div
                          className=""
                          style={{ paddingLeft: "0px", paddingRight: "0px" }}
                        >
                          <UserAvatar url={repost.author.profilePictureUrl}/>
                        </div>
                        <div
                          className="flex-grow-1"
                          style={{ paddingLeft: "5px", paddingRight: "0px" }}
                        >
                          <div className="d-flex justify-content-between mb-2">
                            <div className="d-flex ">
                          <span className="fw-bold text-black">{repost.author.fullName}</span>
                          <span className="text-body-tertiary">&nbsp;@{repost.author.userName} <span>•</span> <span>{postingTimeModifier(repost.createdAt)}</span></span>
                        </div>
                            <i className="bi bi-three-dots"></i>
                          </div>
                          <div style={{ paddingInlineEnd: "18px" }}>
                            <p className="ms-1">{ repost.content}</p>
                            {repost.media && (
                              <MediaView media={repost.media}/>
                            )}
                          </div>
                        </div>
                      </div>
    )
}

export default Repost