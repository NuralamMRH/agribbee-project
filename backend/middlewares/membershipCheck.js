const Vendor = require("../models/Vendor");
const Kiosk = require("../models/Kiosk");

const checkMembershipForKiosk = async (req, res, next) => {
  const { vendorId } = req.body; // Assume we are sending vendor ID in the request body

  const vendor = await Vendor.findById(vendorId).populate("membership");

  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found." });
  }

  // Check if the vendor's membership type is "Silver"
  if (vendor.membership.type !== "Silver") {
    return res
      .status(403)
      .json({ message: "Only Silver members can post Kiosks." });
  }

  // Check if the membership has expired
  const now = new Date();
  if (vendor.membership.expiresAt < now) {
    return res.status(403).json({ message: "Your membership has expired." });
  }

  next(); // If all checks pass, move to the next middleware or controller
};

module.exports = checkMembershipForKiosk;
