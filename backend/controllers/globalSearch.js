const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { Auction, Product } = require("../models");
const { addressQuery } = require("../utils/addressQuery");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const { translateNestedContent } = require("../utils/translatedContent");

exports.globalSearch = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi";

    const searchKey = req.query.name
      ? {
          [`${language}.name`]: { $regex: req.query.name, $options: "i" },
        }
      : {};

    // Fetch filtered markets and apply search, filter, and pagination
    const auctionQuery = new APIFeatures(
      Auction.find({ ...searchKey })
        .populate("bids")
        .populate("product_id")
        .populate({
          path: "seller_id",
          populate: [{ path: "address" }],
        })
        .lean(),
      req.query
    )
      .search()
      .filter()
      .pagination();

    let auctions = [];

    if (req.query.latest === "true") {
      auctions = await auctionQuery.query.sort({ created_at: -1 });
    } else if (req.query.latest === "false") {
      auctions = await auctionQuery.query;
    } else {
      auctions = await auctionQuery.query.sort({ created_at: -1 });
    }

    const addressAuctions = await addressQuery(auctions, req.query);

    auctions = await translateNestedContent(language, addressAuctions);

    const productQuery = new APIFeatures(
      Product.find({ ...searchKey }).lean(),
      req.query
    )
      .search()
      .filter()
      .pagination();

    let products = [];
    if (req.query.latest === "true") {
      products = await productQuery.query.sort({ created_at: -1 });
    } else if (req.query.latest === "false") {
      products = await productQuery.query;
    } else {
      products = await productQuery.query.sort({ created_at: -1 });
    }

    products = await translateNestedContent(language, products);

    return res.status(200).json({
      auctions,
      products,
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        `Some occurs for get search result: ${error.message}`,
        500
      )
    );
  }
});
