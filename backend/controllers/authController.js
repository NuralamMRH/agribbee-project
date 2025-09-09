const User = require("../models/user/user")
const jwt = require("jsonwebtoken")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const sendToken = require("../utils/jwtToken")

const crypto = require("crypto")
const { roleBasedUser } = require("../utils/roleBasedUser")
const { MembershipPackage, Seller, Warehouse } = require("../models")
const { translateNestedContent } = require("../utils/translatedContent")
const { fileUpdatePromises } = require("../utils/fileUploader")
const { sendEmail, sendGmail } = require("../utils/sendEmail")
const createAddress = require("../utils/createAddress")

// Create a guest login endpoint
exports.loginAsGuest = catchAsyncErrors(async (req, res, next) => {
  // Generate a unique guest ID or guest user in the database
  const guest_id = `guest_${Date.now()}`

  // Optionally create a new user in the database for tracking purposes
  const user = await User.create({
    role: "guest",
    guest_id: guest_id,
    email: `${guest_id}@guest.com`, // Placeholder email
    phone: "0000000000", // Placeholder phone
  })

  sendToken(user, 200, res)
})

// Register a user   => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const {
    username,
    f_name,
    l_name,
    company_name,
    membership,
    phone,
    ref_code,
    ref_by,
    isSubscribed,
    email,
    password,
    guest_id,
  } = req.body

  // Default role assignment
  let role = "customer"

  // Check if membership is provided and validate it
  if (membership) {
    const membershipPackage = await MembershipPackage.findById(membership)
    if (!membershipPackage) {
      return next(new ErrorHandler("Invalid membership ID", 400))
    }
    if (
      membershipPackage?.user_role === "kiosk" ||
      membershipPackage?.user_role === "sourcer"
    ) {
      role = "seller"
    } else {
      role = membershipPackage?.user_role
    }
  }

  let user

  // If guest_id is provided, find the guest user
  if (guest_id) {
    user = await User.findOne({ guest_id })
    if (user) {
      // Update guest user to a full account
      user.username = username
      user.f_name = f_name
      user.l_name = l_name
      user.company_name = company_name
      user.phone = phone
      user.ref_code = ref_code
      user.ref_by = ref_by
      user.isSubscribed = isSubscribed
      user.email = email
      user.password = password
      user.membership = membership
      user.role = role

      await user.save()
    }
  }

  // If no guest_id, create a new user
  if (!user) {
    user = await User.create({
      username,
      f_name,
      l_name,
      company_name,
      phone,
      ref_code,
      ref_by,
      isSubscribed,
      email,
      password,
      membership,
      role,
    })
  }

  // Send response with token
  sendToken(user, 200, res)
})

// Create Warehouse and Assign Manager
exports.createWarehouse = catchAsyncErrors(async (req, res, next) => {
  let { name, managerEmail, phone, managerName, managerPassword, addressId } =
    req.body

  const sellerData = await Seller.findOne({ user_id: req.user.id })
  if (!sellerData) {
    return next(new ErrorHandler("Seller not found for this user.", 404))
  }

  if (!name || !managerEmail || !phone) {
    name = req.body.contact_person_name
    managerEmail = req.body.contact_person_email
    phone = req.body.contact_person_number
  }
  if (
    !req.body.contact_person_name ||
    !req.body.contact_person_email ||
    !req.body.contact_person_number
  ) {
    req.body.contact_person_name = name
    req.body.contact_person_email = managerEmail
    req.body.contact_person_number = phone
  }

  let manager = await User.findOne({ email: managerEmail })

  const chars = process.env.PASSWORD_GENERATOR
  let password = ""
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  const randomPassword = managerPassword || password // Generate a random password if none is provided

  if (!manager) {
    // If manager doesn't exist, create one
    manager = await User.create({
      company_name: sellerData?.seller_type,
      f_name: req.body.f_name || managerName,
      l_name: req.body.l_name || "Manager",
      phone,
      email: managerEmail,
      password: randomPassword,
      role: "warehouse_manager",
    })
  }

  // console.log(manager);

  // Send email to the manager with login credentials
  const token = manager.getJwtToken()
  const loginUrl = `${process.env.FRONTEND_URL}/login?token=${token}`
  const message = `Dear ${
    manager.f_name || manager.username || ""
  },\n\nYour warehouse management account has been created.\n\nHere are your login details:\n\nEmail: ${managerEmail}\nYou can log in here: ${loginUrl} \n\nThank you,\n${
    sellerData?.name || ""
  }\nAgribbee`

  // if (manager.role !== "warehouse_manager") {
  //   return next(
  //     new ErrorHandler("The user is not authorized to manage a warehouse.", 403)
  //   );
  // }

  let location = {
    type: "Point", // GeoJSON format
    coordinates: [req.body.lng, req.body.lat], // Store longitude first in GeoJSON
  }

  if (!addressId && req.body.address_type === "Warehouse") {
    addressId = await createAddress(req, next)
  }

  if (req.body.isDefault) {
    // Update all other addresses to isDefault: false for the given user
    await Warehouse.updateMany(
      { seller_id: sellerData._id, isDefault: true }, // Find all addresses with the same user_id and isDefault: true
      { $set: { isDefault: false } } // Set their isDefault to false
    )
  }

  const warehouseData = {
    name,
    location,
    address_id: addressId,
    manager_id: manager._id,
    seller_id: sellerData._id,
    zip: req.body.zip,
  }
  console.log("warehouse: ", warehouseData)
  // Create new warehouse
  if (req.body.address_type === "Warehouse") {
    const warehouse = await Warehouse.create(warehouseData)
  }

  await sendGmail({
    from: `${sellerData?.name} || Agribbee`,
    to: req.body.managerEmail,
    email: managerEmail,
    subject: "Warehouse Management Account Created",
    text: message,
  })

  res.status(201).json({
    success: true,
    token,
    message: "Warehouse Management Account Created",
    user: manager,
  })
})

// Login User  =>  /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password, guest_id } = req.body
  let user

  console.log(`User `, req.body)

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400))
  }

  // Find registered user by email
  user = await User.findOne({ email }).select("+password")
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401))
  }

  // Check password match
  const isPasswordMatched = await user.comparePassword(password)
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401))
  }

  // Check for an existing guest account with guest_id
  if (guest_id) {
    const guestUser = await User.findOne({ guest_id })
    if (guestUser) {
      // Transfer any data you want from guestUser to user (e.g., cart items)
      await mergeGuestCart(guest_id, user)

      // Delete the guest account
      await User.deleteOne({ _id: guestUser._id })
    }
  }

  // Send response with token for the logged-in user
  sendToken(user, 200, res)
})

// Login User
exports.loginByAccessToken = async (req, res, next) => {
  const { email, password, accessToken } = req.body

  try {
    let user

    // Login with email & password
    if (email && password) {
      user = await User.findOne({ email }).select("+password")
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401))
      }

      const isMatch = await user.comparePassword(password) // Assume comparePassword is defined in the User model
      if (!isMatch) {
        return next(new ErrorHandler("Invalid email or password", 401))
      }
    }

    // Login with access token
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
      user = await User.findById(decoded.id)
      if (!user || user.role !== "warehouse_manager") {
        return next(new ErrorHandler("Invalid or expired access token", 401))
      }
    }

    if (!user) {
      return next(new ErrorHandler("Invalid login credentials", 401))
    }

    sendToken(user, 200, res)
  } catch (error) {
    return next(new ErrorHandler("Login failed. Try again later.", 500))
  }
}

const mergeGuestCart = async (guest_id, user_id) => {
  const guestCartItems = await Cart.find({ guest_id, is_guest: true })

  for (const item of guestCartItems) {
    // Update the guest cart items to be associated with the user
    await Cart.findOneAndUpdate(
      { user_id, item_id: item.item_id },
      {
        $inc: { quantity: item.quantity },
        $set: { variation: item.variation }, // Update variations or any other details if needed
      },
      { upsert: true }
    )
  }

  // Remove the guest items now merged
  await Cart.deleteMany({ guest_id })
}

// Login User  =>  /a[i/v1/login
exports.loginUserByPhone = catchAsyncErrors(async (req, res, next) => {
  const { phone, password } = req.body

  // Checks if email and password is entered by user
  if (!phone || !password) {
    return next(new ErrorHandler("Please enter phone & password", 400))
  }

  // Finding user in database
  const user = await User.findOne({ phone }).select("+password")

  if (!user) {
    return next(new ErrorHandler("Invalid Phone or Password", 401))
  }

  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Phone or Password", 401))
  }

  sendToken(user, 200, res)
})

// Forgot Password   =>  /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404))
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

  try {
    await sendEmail({
      email: user.email,
      subject: "Agribbee Password Recovery",
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(error.message, 500))
  }
})

// Reset Password   =>  /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    )
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400))
  }

  // Setup new password
  user.password = req.body.password

  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  sendToken(user, 200, res)
})

// Get currently logged in user details   =>   /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const userData = await User.findById(req.user.id)
    .populate("subscription")
    .populate({
      path: "seller",
      options: { sort: { createdAt: -1 } }, // Sort by `createdAt` in descending order
    })
    .populate({
      path: "address",
      populate: [{ path: "country" }, { path: "region" }, { path: "city" }],
    })
    .populate({
      path: "warehouses",
      populate: [{ path: "address" }],
    })
    .lean()

  const language = req.headers["x-localization"] || "vi"

  // Perform translation on the plain JavaScript object
  const user = await translateNestedContent(language, userData)

  res.status(200).json(user)
})

// Update / Change password   =>  /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password")

  // Check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword)
  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect"))
  }

  user.password = req.body.password
  await user.save()

  sendToken(user, 200, res)
})

// Update user profile   =>   /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  // Update avatar
  let avatar = ""
  if (req.body.image !== "") {
    const user = await User.findById(req.user.id)

    const fieldsToUpload = ["image"]
    avatar = await fileUpdatePromises(
      req,
      res,
      next,
      fieldsToUpload,
      "avatars",
      user
    )
  }

  const newUserData = {
    ...avatar,
    f_name: req.body.f_name,
    l_name: req.body.l_name,
    phone: req.body.phone,
    email: req.body.email,
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    message: "Updated successfully",
  })
})

// Logout user   =>   /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "Logged out",
  })
})

// Admin Routes

// Get all users   =>   /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find().populate("subscription")

  res.status(200).json({
    success: true,
    users,
  })
})

// Get user details   =>   /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("subscription")

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    )
  }

  res.status(200).json({
    success: true,
    user,
  })
})

// Update user profile   =>   /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})

// Delete user   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    )
  }

  // Remove avatar from cloudinary
  const image_id = user.avatar.public_id
  await cloudinary.v2.uploader.destroy(image_id)

  await user.remove()

  res.status(200).json({
    success: true,
  })
})

// Update user profile   =>   /api/v1/me/update
exports.updateUserInterest = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    interested_categories: req.body.interest,
  }

  console.log(req.body)

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})
