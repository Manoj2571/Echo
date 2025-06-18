

const MediaView = ({media}) => {

    return (
        <>
        {media.includes('/image/') && <div className=" position-relative overflow-hidden mb-3">
        <img
          src={media}
          alt="post media"
          className="w-100 h-100 rounded"
          style={{ objectFit: 'cover' }}
        />
      </div>}
      {
        media.includes('/video/') && <div className=" position-relative overflow-hidden mb-3">
  <video
    src={media}
    controls
    controlsList="nodownload"
    onContextMenu={(e) => e.preventDefault()}
    className="w-100 h-100 rounded"
    style={{ objectFit: 'cover'}}
  />
</div>
      }
        </>
   
    )

}

export default MediaView