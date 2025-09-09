import MainApix from "../../../api/MainApix"

export const CategoryApi = {
  categories: (searchKey) => {
    if (searchKey && searchKey !== "") {
      return MainApix.get(`/api/v1/categories?name=${searchKey}`)
    } else {
      return MainApix.get(`/api/v1/categories`)
    }
  },

  category: (category) => {
    if (category && category !== "") {
      return MainApix.get(`/api/v1/categories/${category}`)
    }
  },
  // childCategories: (id) => MainApix.get(`categories/childes/${id}`)

  categoriesDetails: (
    id,
    type,
    offset,
    page_limit,
    filterByData,
    priceAndRating
  ) => {
    const tempPrice = JSON.stringify(priceAndRating?.price)
    return MainApix.get(
      `/api/v1/categories/products/${id}?limit=${page_limit}&offset=${offset}&type=${type}&top_rated=${
        filterByData?.top_rated ? 1 : 0
      }
            &avg_rating=${
              priceAndRating?.rating === null ? 0 : priceAndRating?.rating
            }&price=${tempPrice}
            `
    )
  },
  categoriesChildes: (id) => {
    return MainApix.get(`/api/v1/categories/childes/${id}`)
  },
  categoriesDetailsForRes: (
    id,
    type,
    offset,
    page_limit,
    filterByData,
    priceAndRating
  ) => {
    return MainApix.get(
      `/api/v1/categories/sellers/${id}?limit=${page_limit}&offset=${offset}&type=${type}&top_rated=${
        filterByData?.top_rated ? 1 : 0
      }&avg_rating=${
        priceAndRating?.rating === null ? 0 : priceAndRating?.rating
      }`
    )
  },
}
