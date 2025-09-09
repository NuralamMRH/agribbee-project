class APIFeatures {
  constructor(query, queryStr) {
    this.query = query
    this.queryStr = queryStr
  }

  search() {
    const language = this.queryStr.language || "vi" // Default to 'vi'

    // Check if keyword exists in the query string
    if (this.queryStr.keyword) {
      const keyword = {
        $or: [
          {
            [`name`]: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          },
          {
            [`${language}.name`]: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }, // Case-insensitive search on 'name'
          {
            [`introduction`]: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }, // Case-insensitive search on 'introduction'
          {
            [`description`]: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }, // Case-insensitive search on 'description'
        ],
      }

      // Apply the keyword search to the query
      this.query = this.query.find({ ...keyword })
    }

    return this
  }

  filter() {
    const queryCopy = { ...this.queryStr }

    // console.log("Before calling function:", queryCopy);

    // Removing fields that are not part of the filter
    const removeFields = [
      "latest",
      "keyword",
      "name",
      "limit",
      "offset",
      "page",
      "language",
      "region",
      "city",
      "zip",
      "country",
      "beverage",
    ]
    removeFields.forEach((el) => delete queryCopy[el])

    if (queryCopy.created_at) {
      // Ensure the filter properly parses the 'gte' and 'lte' fields
      queryCopy.created_at = {
        ...(queryCopy.created_at.gte && {
          $gte: new Date(queryCopy.created_at.gte),
        }),
        ...(queryCopy.created_at.lte && {
          $lte: new Date(queryCopy.created_at.lte),
        }),
      }
    }

    if (queryCopy.starting_bid_price) {
      queryCopy.starting_bid_price = {
        $gte: queryCopy.starting_bid_price.gte,
        $lte: queryCopy.starting_bid_price.lte,
      }
    }

    if (queryCopy.current_bid_price) {
      queryCopy.current_bid_price = {
        $gte: queryCopy.current_bid_price.gte,
        $lte: queryCopy.current_bid_price.lte,
      }
    }

    if (queryCopy.min_bid_price) {
      queryCopy.min_bid_price = {
        $gte: queryCopy.min_bid_price.gte,
        $lte: queryCopy.min_bid_price.lte,
      }
    }

    if (queryCopy.reserve_bid_price) {
      queryCopy.reserve_bid_price = {
        $gte: queryCopy.reserve_bid_price.gte,
        $lte: queryCopy.reserve_bid_price.lte,
      }
    }

    if (queryCopy.market_price) {
      queryCopy.market_price = {
        $gte: queryCopy.market_price.gte,
        $lte: queryCopy.market_price.lte,
      }
    }

    if (queryCopy.weight_min) {
      queryCopy.weight_min = {
        $gte: queryCopy.weight_min.gte,
        $lte: queryCopy.weight_min.lte,
      }
    }

    if (queryCopy.weight_max) {
      queryCopy.weight_max = {
        $gte: queryCopy.weight_max.gte,
        $lte: queryCopy.weight_max.lte,
      }
    }
    if (queryCopy.quantity_min) {
      queryCopy.quantity_min = {
        $gte: queryCopy.quantity_min.gte,
        $lte: queryCopy.quantity_min.lte,
      }
    }
    if (queryCopy.quantity_max) {
      queryCopy.quantity_max = {
        $gte: queryCopy.quantity_max.gte,
        $lte: queryCopy.quantity_max.lte,
      }
    }

    if (queryCopy.bids_count) {
      queryCopy.bids_count = {
        $gte: queryCopy.bids_count.gte,
        $lte: queryCopy.bids_count.lte,
      }
    }
    if (queryCopy.weight) {
      queryCopy.weight = {
        $gte: queryCopy.weight.gte,
        $lte: queryCopy.weight.lte,
      }
    }

    if (queryCopy.starting_time) {
      // Ensure the filter properly parses the 'gte' and 'lte' fields
      queryCopy.starting_time = {
        ...(queryCopy.starting_time.gte && {
          $gte: new Date(queryCopy.starting_time.gte),
        }),
        ...(queryCopy.starting_time.lte && {
          $lte: new Date(queryCopy.starting_time.lte),
        }),
      }
    }

    if (queryCopy.ending_time) {
      // Ensure the filter properly parses the 'gte' and 'lte' fields
      queryCopy.ending_time = {
        ...(queryCopy.ending_time.gte && {
          $gte: new Date(queryCopy.ending_time.gte),
        }),
        ...(queryCopy.ending_time.lte && {
          $lte: new Date(queryCopy.ending_time.lte),
        }),
      }
    }

    if (queryCopy.avg_rating) {
      queryCopy.avg_rating = {
        $gte: queryCopy.avg_rating.gte,
        $lte: queryCopy.avg_rating.lte,
      }
    }

    if (queryCopy.reviews_count) {
      queryCopy.reviews_count = {
        $gte: queryCopy.reviews_count.gte,
        $lte: queryCopy.reviews_count.lte,
      }
    }

    if (queryCopy.bids_count) {
      queryCopy.bids_count = {
        $gte: queryCopy.bids_count.gte,
        $lte: queryCopy.bids_count.lte,
      }
    }

    if (queryCopy.shipping_start_date) {
      queryCopy.shipping_start_date = {
        ...(queryCopy.shipping_start_date.gte && {
          $gte: new Date(queryCopy.shipping_start_date.gte),
        }),
        ...(queryCopy.shipping_start_date.lte && {
          $lte: new Date(queryCopy.shipping_start_date.lte),
        }),
      }
    }

    if (queryCopy.shipping_end_date) {
      queryCopy.shipping_end_date = {
        ...(queryCopy.shipping_end_date.gte && {
          $gte: new Date(queryCopy.shipping_end_date.gte),
        }),
        ...(queryCopy.shipping_end_date.lte && {
          $lte: new Date(queryCopy.shipping_end_date.lte),
        }),
      }
    }

    // Filter for shipping cities (array of ObjectId)
    if (queryCopy.shipping_cities) {
      queryCopy.shipping_cities = { $in: queryCopy.shipping_cities }
    }

    // Advanced filter (gt, gte, lt, lte)
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte)\b(?=\s*:\s*(?:\{|\")?\w+)/g,
      (match, field) => `$${match}.${field}`
    )

    // Apply the constructed filters to the main query
    this.query = this.query.find(queryCopy)
    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  // Dynamic nested filtering for various objects

  pagination(resPerPage = 10) {
    const offset = Number(this.queryStr.offset) || 0 // Default offset is 0 if not provided
    const limit = Number(this.queryStr.limit) || resPerPage

    // Slice the array for pagination
    this.query = this.query.slice(offset, offset + limit)
    return this
  }
}

module.exports = APIFeatures
