// utils/getImageSource.js
export const getImageSource = (image) => {
  if (typeof image === "string" && image.startsWith("http")) {
    // If the image is a link (starts with http), return the link as-is
    return image
  } else {
    // If the image is a local image, return image.src
    return image.src
  }
}
