exports.addressQuery = async (auctions, queryCopy) => {
  // console.log(auctions);
  // console.log(queryCopy);
  // Filter by city ID if provided
  if (queryCopy.city) {
    auctions = auctions.filter((auction) => {
      // console.log("warehouse ", auction?.warehouse?.city);
      // console.log("city ", auction?.seller?.address?.city);
      if (auction?.warehouse) {
        return (
          auction?.warehouse?.city &&
          String(auction?.warehouse?.city._id) === queryCopy.city
        )
      } else {
        return (
          auction?.seller &&
          auction?.seller?.address?.city &&
          String(auction?.seller?.address?.city._id) === queryCopy.city
        )
      }
    })
  }

  // Filter by region ID if provided
  if (queryCopy.region) {
    auctions = auctions.filter((auction) => {
      // console.log("warehouse ", auction?.warehouse?.city?.region);
      // console.log("region ", auction?.seller?.address?.city?.region)
      if (auction?.warehouse) {
        return (
          auction?.warehouse?.city?.region &&
          String(auction?.warehouse?.city?.region) === queryCopy.region
        )
      } else {
        return (
          auction?.seller &&
          auction?.seller?.address?.city?.region &&
          String(auction?.seller?.address?.city?.region) === queryCopy.region
        )
      }
    })
  }

  // Filter by city ZIP code if provided
  if (queryCopy.zip) {
    auctions = auctions.filter((auction) => {
      // console.log("warehouse ", auction?.warehouse?.city?.zip);
      // console.log("zip ", auction?.seller?.address?.city?.zip);
      if (auction?.warehouse) {
        return (
          auction?.warehouse?.city?.zip &&
          String(auction?.warehouse?.city?.zip) === queryCopy.zip
        )
      } else {
        return (
          auction?.seller &&
          auction?.seller?.address?.city?.zip &&
          String(auction?.seller?.address?.city?.zip) === queryCopy.zip
        )
      }
    })
  }

  return auctions
}
