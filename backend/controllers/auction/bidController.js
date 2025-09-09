const socket = require("../../config/socket");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { Bid, Auction } = require("../../models");
const APIFeatures = require("../../utils/apiFeatures");
const ErrorHandler = require("../../utils/errorHandler");
const { translateNestedContent } = require("../../utils/translatedContent");

exports.createBid = catchAsyncErrors(async (req, res, next) => {
  try {
    const updatedAuctionBid = await Auction.findByIdAndUpdate(
      req.params.id,
      { $inc: { current_bid_price: req.body.bid_amount } },
      { new: true, useFindAndModify: false }
    );

    const newBid = new Bid({ ...req.body });
    await newBid.save();

    // Get the Socket.IO instance and emit the bid update
    const io = socket.getIO();
    const totalBids = await Bid.countDocuments({ auction_id: req.params.id });

    io.emit("bidUpdate", {
      current_bid_price: updatedAuctionBid.current_bid_price,
      total_bids: totalBids,
    });

    res.status(201).json({
      success: true,
      bid: newBid,
      updatedAuctionBid,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Error creating new Bid: ${error.message}`, 500)
    );
  }
});

exports.updateBid = catchAsyncErrors(async (req, res, next) => {
  try {
    const updatedBid = await Bid.findByIdAndUpdate(
      req.params.id,
      { bid_status: req.body.bid_status },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(201).json({
      success: true,
      bid: updatedBid,
    });
  } catch (error) {
    // console.error("ErrorHandler:", error.message);
    return next(new ErrorHandler(`Error updating  Bid: ${error.message}`, 500));
  }
});

exports.getBids = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi";

    const searchKey = req.query.name
      ? {
          [`${language}.name`]: { $regex: req.query.name, $options: "i" },
        }
      : {};

    // Fetch filtered markets and apply search, filter, and pagination
    const bidQuery = new APIFeatures(
      Bid.find({ ...searchKey })
        .populate("auction")
        .lean(),
      req.query
    )
      .search()
      .filter()
      .pagination(req.query.limit);

    const bid = await bidQuery.query;

    // Fetch countries

    const response = await translateNestedContent(language, bid);

    return res.status(200).json({
      bids: response,
    });
  } catch (error) {
    return next(new ErrorHandler(`Bids not found: ${error.message}`, 500));
  }
});

// Get single Bid details    =>   /api/v1/bid/:id
exports.getBidById = catchAsyncErrors(async (req, res, next) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate("user_id")
      .populate("seller_id")
      .populate({
        path: "auction",
        populate: [{ path: "product_id" }],
      })
      .lean(); // Convert Mongoose documents to plain objects

    if (!bid) {
      return next(new ErrorHandler("Bid not found", 404));
    }

    const language = req.headers["x-localization"] || "vi";

    // Perform translation on the plain JavaScript object
    const response = await translateNestedContent(language, bid);

    // console.log(response._id);

    return res.status(200).json({
      response,
    });
  } catch (error) {
    console.error("Error in getBidById:", error);
    return next(new ErrorHandler(`Bid not found: ${error.message}`, 500));
  }
});
