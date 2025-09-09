import PropTypes from "prop-types"
import Image from "./image"

// ----------------------------------------------------------------------

SingleFilePreview.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

export default function SingleFilePreview({ file, ...others }) {
  if (!file) {
    return null
  }

  // Determine file URL
  const fileUrl = typeof file === "string" ? file : file.preview || file.name

  // Check if the file is a video
  const isVideo =
    typeof file === "string"
      ? /\.(mp4|avi|mov|mkv|webm)$/.test(file) // Match video file extensions for server files
      : file.type?.startsWith("video") // Check MIME type for local files

  console.log("others:", others.sx)

  const videoStyle = {
    width: "calc(100% - 16px)",
    height: "calc(100% - 16px)",
    top: 8,
    left: 8,
    zIndex: 8,
    borderRadius: 1,
    position: "absolute",
    ...(others.sx || {}), // Spread others.sx values
  }

  const imageSx = {
    top: 8,
    left: 8,
    zIndex: 8,
    borderRadius: 1,
    position: "absolute",
    width: "calc(100% - 16px)",
    height: "calc(100% - 16px)",
    ...(others.sx || {}), // Spread others.sx values
  }
  return (
    <>
      {isVideo ? (
        <video
          controls={others.controls || true}
          autoPlay={others.autoPlay || false}
          muted={others.muted || true}
          loop={others.loop || false}
          style={videoStyle}
        >
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <Image alt="file preview" src={fileUrl} sx={imageSx} />
      )}
    </>
  )
}
