const cron = require("node-cron");
const Vendor = require("../models/Vendor");
const Kiosk = require("../models/Kiosk");

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  const now = new Date();

  // Find all vendors with expired memberships
  const expiredVendors = await Vendor.find({
    "membership.expiresAt": { $lt: now },
  });

  expiredVendors.forEach(async (vendor) => {
    // Disable all Kiosks linked to the expired vendor
    await Kiosk.updateMany({ vendor_id: vendor._id }, { status: 0 });
  });

  console.log("Checked and disabled expired kiosks.");
});
