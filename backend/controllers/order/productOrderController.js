const { request } = require("express")
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")
const { Order, Product, Seller, Address, User } = require("../../models")
const orderRequest = require("../../models/order/orderRequest")
const ErrorHandler = require("../../utils/errorHandler")
const {
  generateProductListPDF,
  generateOrderAcceptPDF,
} = require("../../utils/generatePDF")
const { sendGmail } = require("../../utils/sendEmail")
const { translateNestedContent } = require("../../utils/translatedContent")
const { createLog } = require("../log/logController")

// Create a new order   =>  /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  })

  res.status(200).json({
    success: true,
    order,
  })
})

// Get single order   =>   /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  )

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404))
  }

  res.status(200).json({
    success: true,
    order,
  })
})

// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })

  res.status(200).json({
    success: true,
    orders,
  })
})

// Get logged in user orders   =>   /api/v1/orders/me
exports.ordersBySellerId = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderRequest.find({ seller_id: req.params.id })

  res.status(200).json({
    success: true,
    orders,
  })
})

// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderRequest.find()

  let totalAmount = 0

  orders.forEach((order) => {
    totalAmount += order.totalPrice
  })

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  })
})

// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400))
  }

  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity)
  })
  ;(order.orderStatus = req.body.status), (order.deliveredAt = Date.now())

  await order.save()

  res.status(200).json({
    success: true,
  })
})

async function updateStock(id, quantity) {
  const product = await Product.findById(id)

  product.stock = product.stock - quantity

  await product.save({ validateBeforeSave: false })
}

// Delete order   =>   /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404))
  }

  await order.remove()

  res.status(200).json({
    success: true,
  })
})

// Controller for submitting an order request
exports.submitOrderRequest = catchAsyncErrors(async (req, res, next) => {
  try {
    const { billing, cart, discount, shipping, subtotal, total, sourcer } =
      req.body
    const language = req.headers["x-localization"] || "vi"

    // Validate and process the request
    if (!billing || !billing._id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid billing address" })
    }

    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" })
    }

    const buyerData = await Seller.findOne({ user_id: req.user.id })
    if (!buyerData) {
      return next(new ErrorHandler("Seller not found for this user.", 404))
    }

    // Prepare order items
    const orderItems = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findById(item.id)
        if (!product) {
          throw new Error(`Product not found: ${item.name}`)
        }
        return {
          product: product._id,
          quantity: item.quantity,
          price: item.price,
        }
      })
    )

    const orderDetails = {
      products: req.body.cart, // Array of products
      billing: req.body.billing, // Billing details
      subtotal: req.body.subtotal,
      total: req.body.total,
      payment_status: "paid",
      buyerData,
    }

    const pdfUrl = await generateProductListPDF(req, orderDetails)

    // console.log(`Seller id`, req.body.cart);
    // Create order data
    const orderData = {
      order_type: billing.address_type || "Address",
      orderItems,
      order_amount: total,
      coupon_discount_amount: discount || 0,
      total_tax_amount: 0, // Assume no tax calculation for now
      seller_discount_amount: 0, // Add logic for seller discounts if applicable
      delivery_charge: shipping || 0,
      user_id: billing.user_id,
      shipping_address: billing._id,
      payment_status: "paid",
      itemsPrice: subtotal,
      taxPrice: 0, // Assume no tax for now
      shippingPrice: shipping || 0,
      totalPrice: total,
      order_invoice: pdfUrl,
      buyer_id: req.user.id,
      seller_id: sourcer?.user_id,
    }

    // Save the order to the database
    const newOrder = await orderRequest.create(orderData)

    // Log for the seller
    await createLog({
      user_id: sourcer?.user_id,
      name: "Order Request",
      model_id: newOrder._id,
      model: "OrderRequest",
      action: "order_request",
      data: { buyer_id: newOrder.buyer_id, newOrder },
      message: `Order requested by ${buyerData[language].name}`,
    })

    // Log for the buyer
    await createLog({
      user_id: req.user.id,
      name: "Order Request",
      model_id: newOrder._id,
      model: "OrderRequest",
      action: "order_request",
      data: { seller_id: sourcer?.user_id, newOrder },
      message: `Order requested sent to ${sourcer[language].name}`,
    })

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    })
  } catch (error) {
    console.error("Error submitting order:", error.message)
    res.status(500).json({
      success: false,
      message: `Error submitting order: ${error.message}`,
    })
  }
})

// Get logged in buyer orders   =>   /api/v1/buyer-order-requests
exports.myOrderRequests = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderRequest
    .find({ user_id: req.user.id })
    .populate("seller")
    .populate("shipping_address")
    .lean()

  const response = await translateNestedContent(language, orders)

  res.status(200).json({
    success: true,
    orders: response,
  })
})

// Get logged in seller orders   =>   /api/v1/seller-order-requests
exports.orderRequestsBySellerId = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderRequest
    .find({ seller_id: req.user.id })
    .populate("buyer")
    .populate("shipping_address")
    .lean()

  const language = req.headers["x-localization"] || "vi"

  // Perform translation on the plain JavaScript object
  const response = await translateNestedContent(language, orders)

  res.status(200).json({
    success: true,
    orders: response,
  })
})

// Get logged in seller orders   =>   /api/v1/seller-order-requests/:qrCode
exports.getOrderRequestsByQr = catchAsyncErrors(async (req, res, next) => {
  const order = await orderRequest
    .findOne({ qrCode: req.query.qrCode })
    .populate("buyer")
    .populate({
      path: "seller",
      populate: [{ path: "address" }],
    })
    .populate("shipping_address")
    .populate({
      path: "orderItems",
      populate: [{ path: "product" }],
    })
    .lean()

  // Perform translation on the plain JavaScript object
  // const response = await translateNestedContent(language, order)

  res.status(200).json(order)
})

const updateMissingQrCodes = async () => {
  try {
    // Find orders that lack a QR Code
    const orders = await orderRequest.find()

    let counter = 1 // Start increment counter for missing QR Codes

    for (const order of orders) {
      // Ensure we only modify the QR Code and leave other fields like seller_id unchanged
      if (order.buyer_id || order.seller_id) {
        const date = new Date(order.createdAt)
        const day = String(date.getDate()).padStart(2, "0")
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const year = String(date.getFullYear()).slice(-2)

        order.buyer_id = "6742fc58dd948f2917150d54"
        order.seller_id = "672941009590b2ebde138085"

        // order.qrCode = `${order.order_type.slice(0, 2).toUpperCase()}/${
        //   order.orderItems.length
        // }/${order.payment_status
        //   .slice(0, 2)
        //   .toUpperCase()}/${day}/${month}/${year}/${String(counter).padStart(
        //   3,
        //   "0"
        // )}`

        counter++

        // Save only the updated QR Code while skipping seller_id validation
        await order.save()
      }
    }

    console.log("All missing QR Codes updated!")
  } catch (error) {
    console.error("Error updating QR Codes:", error.message)
  }
}

// updateMissingQrCodes()

exports.eCommerceOrderApprovalBySeller = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const {
        orderRequestId,
        exportFrom,
        exportAt,
        arrivalAt,
        truckId,
        orderStatus,
        trackingCompany,
        truckCompanyPhone,
      } = req.body

      // console.log("order approval: ", req.body)
      // console.log("order approval user: ", req.user.id)

      // Step 1: Validate required input fields
      if (
        !orderRequestId ||
        !orderStatus ||
        !exportFrom ||
        !exportAt ||
        !arrivalAt ||
        !truckId
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing data provided.",
        })
      }

      // Step 2: Fetch the buyer's order request
      const buyerOrderRequest = await orderRequest
        .findOne({ qrCode: orderRequestId })
        .populate("buyer")
        .populate("seller")
        .populate("shipping_address")
        .populate({
          path: "orderItems",
          populate: { path: "product" },
        })
        .lean()

      if (!buyerOrderRequest) {
        return next(
          new ErrorHandler("Order Request not found for the provided ID.", 404)
        )
      }
      // Step 3: Update the buyerOrderRequest
      await orderRequest.updateOne(
        { _id: buyerOrderRequest._id }, // Find by ID
        {
          $set: {
            order_req_status: orderStatus,
            updateAt: new Date(),
          },
        }
      )

      // Fetch warehouses and validate them
      const senderWarehouse = exportFrom
      const receiverWarehouse = buyerOrderRequest.shipping_address

      if (!senderWarehouse || !receiverWarehouse) {
        return next(
          new ErrorHandler(
            "Sender or receiver warehouse details are missing.",
            404
          )
        )
      }

      // Step 4: Fetch managers for warehouses
      const senderManager = await User.findById(senderWarehouse.user_id)
      const receiverManager = await User.findById(receiverWarehouse.user_id)

      const sellerAddress = await Address.findOne({
        user_id: buyerOrderRequest.buyer_id,
      })

      if (!senderManager || !receiverManager) {
        return next(
          new ErrorHandler("Sender or receiver manager not found.", 404)
        )
      }

      // Step 5: Generate unique Export CTO code
      const counter = await Order.countDocuments() // Incremental counter
      const currentDate = new Date()
      const day = String(currentDate.getDate()).padStart(2, "0")
      const month = String(currentDate.getMonth() + 1).padStart(2, "0")
      const year = String(currentDate.getFullYear()).slice(2)

      const exportCTO = `EO${buyerOrderRequest.order_type
        .slice(0, 2)
        .toUpperCase()}/${buyerOrderRequest.orderItems.length}/${orderStatus
        .slice(0, 2)
        .toUpperCase()}/${
        receiverWarehouse.zip
      }/${day}/${month}/${year}/${String(counter + 1).padStart(3, "0")}`

      const importerCTO = orderRequestId

      // Step 6: Generate PDF documents
      const exportPDFPath = await generateOrderAcceptPDF(
        req,
        exportCTO,
        importerCTO,
        senderWarehouse,
        receiverWarehouse,
        buyerOrderRequest,
        senderManager,
        sellerAddress
      )

      const importerPDFPath = buyerOrderRequest.order_invoice

      // Step 7: Create transfer inventory (order)
      // Extract only the necessary fields while replacing and omitting unwanted ones
      const {
        createdAt,
        updatedAt,
        user_id, // Exclude this field
        ...buyerOrderData // Spread the rest of the fields
      } = buyerOrderRequest

      const newOrder = await Order.create({
        ...buyerOrderData, // Include all fields from buyerOrderRequest except excluded ones
        exportFrom: exportFrom._id,
        importTo: receiverWarehouse._id,
        exportAt,
        arrivalAt,
        truckId,
        orderStatus,
        exportPDFPath,
        importerPDFPath,
        importerQrCode: importerCTO,
        exporterQrCode: exportCTO,
        trackingCompany,
        truckCompanyPhone,
        user_id: req.user.id, // Override the user_id with the logged-in user's ID
        updateAt: new Date(), // Update the timestamp
      })

      // Step 8: Create logs for seller and buyer
      await createLog({
        user_id: buyerOrderRequest.seller_id || req.user.id,
        name: "PO Request",
        model_id: newOrder._id,
        model: "Order",
        action: "order_made",
        data: { buyer_id: buyerOrderRequest.buyer_id, newOrder },
        message: `have ${orderStatus}. Requested ${orderStatus} by ${senderManager.f_name} ${senderManager.l_name}`,
      })

      await createLog({
        user_id: buyerOrderRequest.buyer_id,
        name: "Your PO Request",
        model_id: newOrder._id,
        model: "Order",
        action: "order_made",
        data: { seller_id: buyerOrderRequest.seller_id, newOrder },
        message: `has ${orderStatus}. Request ${orderStatus} by ${receiverManager.f_name} ${receiverManager.l_name}`,
      })

      // Step 9: Send notification emails
      const senderMessage = `Dear ${senderWarehouse.contact_person_name},\n\nYour PO (ID: ${newOrder.exporterQrCode}) has been created.\nPlease find the attached invoice.\n\nThank you.`
      const receiverMessage = `Dear ${receiverWarehouse.contact_person_name},\n\nYou are receiving a PO (ID: ${newOrder.importerQrCode}).\nPlease find the attached invoice.\n\nThank you.`

      await sendGmail({
        from: process.env.GMAIL,
        to: senderWarehouse.contact_person_email,
        cc: senderManager.email,
        subject: "PO Details",
        text: senderMessage,
        attachments: [
          { filename: "PO_Order_Transfer.pdf", path: exportPDFPath },
          { filename: "PO_List.pdf", path: importerPDFPath },
        ],
      })

      await sendGmail({
        from: process.env.GMAIL,
        to: receiverWarehouse.contact_person_email,
        cc: receiverManager.email,
        subject: "PO Details",
        text: receiverMessage,
        attachments: [
          { filename: "PO_Order_Transfer.pdf", path: exportPDFPath },
          { filename: "PO_List.pdf", path: importerPDFPath },
        ],
      })

      // Step 10: Send success response
      res.status(201).json({
        success: true,
        message: "Transfer inventory created, and emails sent successfully.",
        newOrder,
      })
    } catch (error) {
      return next(
        new ErrorHandler(`Failed to process request: ${error.message}`, 500)
      )
    }
  }
)
