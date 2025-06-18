
const UserAvatar = ({width="40px", height="40px", url}) => {
    return (
        <img
            className="rounded-circle"
            src={url}
            width={width}
            height={height}
            alt="profile picture"
          />
    )
}

export default UserAvatar