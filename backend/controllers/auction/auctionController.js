const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { Language, Address, Auction, Product, Seller } = require("../../models");
const { populate } = require("../../models/config/language");
const { addressQuery } = require("../../utils/addressQuery");
const APIFeatures = require("../../utils/apiFeatures");
const createAddress = require("../../utils/createAddress");
const ErrorHandler = require("../../utils/errorHandler");
const {
  fileUploadPromises,
  filesUpdatePromises,
} = require("../../utils/fileUploader");

exports.createAuction = catchAsyncErrors(async (req, res, next) => {
  try {
    // Step 1: Fetch seller data based on user ID
    const sellerData = await Seller.findOne({ user_id: req.user.id });
    if (!sellerData) {
      return next(new ErrorHandler("Seller not found for this user.", 404));
    }

    const wareQuery = {
      $or: [
        {
          zip: req.body.zip_code,
        },
        {
          contact_person_number: req.body.seller_phone,
        },
        {
          user_id: req.user.id,
        },
      ],
    };

    const wareHouseData = req.body.warehouse_address
      ? await Address.findById(req.body.warehouse_address)
      : await Address.findOne({
          ...wareQuery,
        });

    if (typeof req.body.image === "string") {
      delete req.body.image; // Remove if `image` is a string
    }

    if (Array.isArray(req.body.images)) {
      req.body.images = req.body.images.filter(
        (image) => typeof image !== "string"
      ); // Remove strings from `images`
    }

    let uploadedFile = {};
    let uploadedFiles = {};

    if (typeof req.body.image === "string") {
      // Preserve the full URL
      req.body.image_full_url = req.body.image;

      // Extract the file name from the URL
      req.body.image = req.body.image.split("/").pop();
    } else {
      const singleFields = ["image", "video"];
      uploadedFile = await fileUploadPromises(
        req,
        res,
        next,
        singleFields,
        "product"
      );
    }

    if (Array.isArray(req.body.images)) {
      req.body.images = req.body.images.filter((url) => {
        if (typeof url === "string") {
          return {
            file: url.split("/").pop(),
            file_full_url: url,
          };
        }
      }); // Remove strings from `images`
    } else {
      const multiFields = ["images", "videos"];
      uploadedFiles = await filesUpdatePromises(
        req,
        res,
        next,
        multiFields,
        "product"
      );
    }

    req.body.quantity_left = req.body.selling_quantity;
    // Step 4: Prepare the product data
    const productData = {
      seller_id: sellerData._id,
      user_id: req.user.id,
      zip_code: req.body.zip_code || wareHouseData.zip,
      location: wareHouseData.location,
      warehouse_address: wareHouseData._id,
      warehouse_region: wareHouseData.region,
      category_id: req.body.category_id || null, // Ensure category_id is set
      status: req.body.status || "Auction",
      seller_phone:
        req.body.seller_phone || wareHouseData.contact_person_number,
      ...uploadedFile, // Includes fields like 'image', 'video'
      ...uploadedFiles, // Includes fields like 'images', 'videos'
      ...req.body,
    };

    // Step 5: Create and save the product
    let product = new Product(productData);
    if (req.body.isProduct) {
      await product.save();
    } else {
      product = await Product.findById(req.body.product_id);
    }

    if (!product) {
      return next(new ErrorHandler("Invalid product", 500));
    }

    const auctionData = {
      product_id: product._id || req.body.product_id || null,
      ...productData,
    };

    const newAuction = new Auction(auctionData);
    await newAuction.save();

    const status = {
      message: `Product ${
        req.body.isProduct ? "& Auction" : ""
      } created successfully`,
      status: "success",
    };

    // Step 6: Send the response
    res.status(201).json({
      success: true,
      status,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return next(
      new ErrorHandler(`Error creating new product: ${error.message}`, 500)
    );
  }
});

exports.updateAuction = catchAsyncErrors(async (req, res, next) => {
  try {
    // Step 1: Fetch seller data based on user ID
    const sellerData = await Seller.findOne({ user_id: req.user.id });
    if (!sellerData) {
      return next(new ErrorHandler("Seller not found for this user.", 404));
    }

    const wareQuery = {
      $or: [
        {
          zip: req.body.zip_code,
        },
        {
          contact_person_number: req.body.seller_phone,
        },
        {
          user_id: req.user.id,
        },
      ],
    };

    const wareHouseData = req.body.warehouse_address
      ? await Address.findById(req.body.warehouse_address)
      : await Address.findOne({
          ...wareQuery,
        });

    if (typeof req.body.image === "string") {
      delete req.body.image; // Remove if `image` is a string
    }

    if (Array.isArray(req.body.images)) {
      req.body.images = req.body.images.filter(
        (image) => typeof image !== "string"
      ); // Remove strings from `images`
    }

    let uploadedFile = {};
    let uploadedFiles = {};

    if (typeof req.body.image === "string") {
      // Preserve the full URL
      req.body.image_full_url = req.body.image;

      // Extract the file name from the URL
      req.body.image = req.body.image.split("/").pop();
    } else {
      const singleFields = ["image", "video"];
      uploadedFile = await fileUploadPromises(
        req,
        res,
        next,
        singleFields,
        "product"
      );
    }

    if (Array.isArray(req.body.images)) {
      req.body.images = req.body.images.filter((url) => {
        if (typeof url === "string") {
          return {
            file: url.split("/").pop(),
            file_full_url: url,
          };
        }
      }); // Remove strings from `images`
    } else {
      const multiFields = ["images", "videos"];
      uploadedFiles = await filesUpdatePromises(
        req,
        res,
        next,
        multiFields,
        "product"
      );
    }

    req.body.quantity_left = req.body.selling_quantity;
    // Step 4: Prepare the product data

    console.log("warehouse_address: ", req.body.warehouse_address);
    console.log("region: ", wareHouseData.region);
    console.log("region info: ", wareHouseData);

    const productData = {
      seller_id: sellerData._id,
      user_id: req.user.id,
      zip_code: req.body.zip_code || wareHouseData.zip,
      location: wareHouseData.location,
      warehouse_address: wareHouseData._id,
      warehouse_region: wareHouseData.region,
      category_id: req.body.category_id || null, // Ensure category_id is set
      status: req.body.status || "Auction",
      seller_phone:
        req.body.seller_phone || wareHouseData.contact_person_number,
      ...uploadedFile, // Includes fields like 'image', 'video'
      ...uploadedFiles, // Includes fields like 'images', 'videos'
      ...req.body,
    };

    // Step 5: Create and save the product
    let product;
    console.log("isProduct: ", req.body.isProduct);

    if (req.body.isProduct) {
      product = new Product(productData);
      await product.save();
    } else {
      product = await Product.findById(req.body.product_id);
    }

    if (!product) {
      return next(new ErrorHandler("Invalid product", 500));
    }

    const auctionData = {
      product_id: product._id || req.body.product_id || null,
      ...productData,
    };

    await Auction.findByIdAndUpdate(req.params.id, auctionData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    const status = {
      message: `Auction updated ${
        req.body.isProduct ? "& Product created" : ""
      } successfully`,
      status: "success",
    };

    // Step 6: Send the response
    res.status(201).json({
      success: true,
      status,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Error updating  auction: ${error.message}`, 500)
    );
  }
});

exports.getAuctions = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'

    const searchKey = req.query?.name
      ? {
          name: { $regex: req.query?.name, $options: "i" },
        }
      : {};

    console.log("search query: ", req.query);

    // Fetch filtered markets and apply search, filter, and pagination
    const auctionQuery = new APIFeatures(
      Auction.find({ ...searchKey })
        .populate("bids")
        .populate("seller")
        .populate("region")
        .populate("warehouse")
        .populate("category")
        .populate({
          path: "product",
          populate: [{ path: "category_id" }],
        })
        .populate({
          path: "warehouse",
          populate: [{ path: "region" }, { path: "city" }],
        })
        .lean(),
      req.query
    )
      .search()
      .filter();

    let auctions = [];

    if (req.query?.latest === "true") {
      auctions = await auctionQuery.query.sort({ createdAt: -1 });
    } else if (req.query?.latest === "false") {
      auctions = await auctionQuery.query;
    } else {
      auctions = await auctionQuery.query.sort({ createdAt: -1 });
    }

    if (req.query?.region || req.query?.city || req.query?.zip) {
      auctions = await addressQuery(auctions, req.query);
    }

    let paginatedAuctions = auctions;
    if (auctions?.length > 5) {
      // Apply pagination to the auctions array (not the query)
      paginatedAuctions = new APIFeatures(auctions, req.query).pagination();
      paginatedAuctions = paginatedAuctions.query; // Apply pagination logic to the array
    }

    console.log("Paginated response length: ", paginatedAuctions.length);

    // Translate auction content based on language
    // const response = await translateNestedContent(language, paginatedAuctions)

    return res.status(200).json({
      total_size: auctions?.length,
      current_page_size: paginatedAuctions?.length,
      auctions: paginatedAuctions,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Some occurs for get auctions: ${error.message}`, 500)
    );
  }
});

exports.getMyAuctions = catchAsyncErrors(async (req, res, next) => {
  try {
    const sellerData = await Seller.findOne({ user_id: req.user.id });
    if (!sellerData) {
      return next(new ErrorHandler("Seller not found for this user.", 404));
    }

    // console.log("sellerData:", sellerData)

    // Fetch filtered markets and apply search, filter, and pagination
    const auctionQuery = new APIFeatures(
      Auction.find({ user_id: req.user.id })
        .populate("bids")
        .populate("seller")
        .populate("region")
        .populate("category")
        .populate({
          path: "product",
          populate: [{ path: "category_id" }],
        })
        .populate({
          path: "warehouse",
          populate: [{ path: "region" }, { path: "city" }],
        })
        .lean(),
      req.query
    )
      .search()
      .filter();
    let auctions = [];

    if (req.query?.latest === "true") {
      auctions = await auctionQuery.query.sort({ createdAt: -1 });
    } else if (req.query?.latest === "false") {
      auctions = await auctionQuery.query;
    } else {
      auctions = await auctionQuery.query.sort({ createdAt: -1 });
    }

    if (req.query?.region || req.query?.city || req.query?.zip) {
      auctions = await addressQuery(auctions, req.query);
    }

    let paginatedAuctions = auctions;
    if (auctions?.length > 5) {
      // Apply pagination to the auctions array (not the query)
      paginatedAuctions = new APIFeatures(auctions, req.query).pagination();
      paginatedAuctions = paginatedAuctions.query; // Apply pagination logic to the array
    }

    return res.status(200).json({
      total_size: auctions?.length,
      current_page_size: paginatedAuctions?.length,
      auctions: paginatedAuctions,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Some occurs for get auctions: ${error.message}`, 500)
    );
  }
});

// Get single Auction details    =>   /api/v1/auction/:id
exports.getAuctionById = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log(req.params.id);
    const auction = await Auction.findById(req.params.id)
      .populate("bids")
      .populate({
        path: "seller",
        populate: [
          { path: "address", populate: [{ path: "region" }, { path: "city" }] },
        ],
      })
      .populate("region")
      .populate("warehouse")
      .populate("category")
      .populate({
        path: "product",
        populate: [{ path: "category_id" }],
      })
      .lean(); // Convert Mongoose documents to plain objects

    if (!auction) {
      return next(new ErrorHandler("Auction not found", 404));
    }

    console.log(auction);

    return res.status(200).json(auction);
  } catch (error) {
    console.error("Error in getAuctionById:", error);
    return next(new ErrorHandler(`Auction not found: ${error.message}`, 500));
  }
});

// Get single Auction details    =>   /api/v1/auction/:id
exports.getAuctionBySlug = catchAsyncErrors(async (req, res, next) => {
  try {
    const auction = await Auction.findOne({ slug: req.params.slug })
      .populate("bids")
      .populate({
        path: "seller",
        populate: [
          { path: "address", populate: [{ path: "region" }, { path: "city" }] },
        ],
      })
      .populate("region")
      .populate("warehouse")
      .populate("category")
      .populate({
        path: "product",
        populate: [{ path: "category_id" }],
      })
      .lean(); // Convert Mongoose documents to plain objects

    if (!auction) {
      return next(new ErrorHandler("Auction not found", 404));
    }

    // console.log(response._id);

    return res.status(200).json(auction);
  } catch (error) {
    console.error("Error in getAuctionById:", error);
    return next(new ErrorHandler(`Auction not found: ${error.message}`, 500));
  }
});

// Delete Product   =>   /api/v1/seller/product/:id
exports.deleteAuction = catchAsyncErrors(async (req, res, next) => {
  const auction = await Auction.findById(req.params.id);

  if (!auction) {
    return next(new ErrorHandler("Auction not found", 404));
  }

  await auction.remove();

  res.status(200).json({
    success: true,
    message: "Auction is deleted.",
  });
});

const updateMissingQrCodes = async () => {
  try {
    const orders = await Auction.find()
      .populate("seller")
      .populate({
        path: "warehouse_address",
        populate: [{ path: "region" }, { path: "city" }],
      }); // No .lean()

    if (!orders.length) {
      console.log("No orders found to update.");
      return;
    }

    let counter = 0;

    for (const order of orders) {
      if (order.warehouse_region) {
        console.log("warehouse info: ", order.shipping_warehouse);
        if (order.warehouse_region) {
          // order.warehouse_address = "6760efb2b0205ffc7abde947"
          order.warehouse_region = "66e2eead48be8cecc559d0d5";
          counter++;
        }

        try {
          const updated = await order.save({ validateBeforeSave: false });
          console.log(`Updated region: ${updated.warehouse_region}`);
        } catch (saveError) {
          console.error(`Error saving order ${order.name}:`, saveError.message);
        }
      }
    }

    console.log("All auctions info updated!", counter);
  } catch (error) {
    console.error("Error updating auctions:", error.message);
  }
};

// updateMissingQrCodes()
