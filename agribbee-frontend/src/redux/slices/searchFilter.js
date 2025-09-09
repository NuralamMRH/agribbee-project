import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isFilterDrawerOpen: false,
  filterCategory: {},
  bannerFood: null,
  deliveryManInfo: null,
  filterData: {
    sortBy: "",
    filterBy: {},
    filterByCuisine: [],
    price: "",
    rating: "",
  },
  globalTabType: "products",
}

export const searchFilterSlice = createSlice({
  name: "search-filter",
  initialState,
  reducers: {
    setSortbyByDispatch: (state, action) => {
      state.filterData.sortBy = action.payload
    },
    setFilterbyByDispatch: (state, action) => {
      let filteredData = {
        veg: action.payload.find((item) => item.value === "veg") !== undefined,
        nonVeg:
          action.payload.find((item) => item.value === "nonVeg") !== undefined,
        currentlyAvailable:
          action.payload.find((item) => item.value === "currentlyAvailable") !==
          undefined,
        rating:
          action.payload.find((item) => item.value === "rating") !== undefined,
        ratings:
          action.payload.find((item) => item.value === "ratings") !== undefined,
        rating5:
          action.payload.find((item) => item.value === "rating5") !== undefined,
        new:
          action.payload.find((item) => item.value === "new_arrivals") !==
          undefined,
        popular:
          action.payload.find((item) => item.value === "popular") !== undefined,
        discounted:
          action.payload.find((item) => item.value === "discounted") !==
          undefined,
        sort_by:
          action.payload.find((item) => item.value === "sort_by") !== undefined,
      }
      state.filterData.filterBy = filteredData
    },
    setFilterbyByCuisineDispatch: (state, action) => {
      state.filterData.filterByCuisine = action.payload
    },
    setPriceByDispatch: (state, action) => {
      state.filterData.price = action.payload
    },
    setRatingByDispatch: (state, action) => {
      state.filterData.rating = action.payload
    },
    setFilterCategoryDispatch: (state, action) => {
      state.filterCategory = action.payload
    },
    setFilterDrawerOpenByDispatch: (state, action) => {
      state.isFilterDrawerOpen = action.payload
    },
    setBannerFoodByDispatch: (state, action) => {
      state.bannerFood = action.payload
    },
    setDeliveryManInfoByDispatch: (state, action) => {
      state.deliveryManInfo = action.payload
    },
    setGlobalTabType: (state, action) => {
      state.globalTabType = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setFilterCategoryDispatch,
  setSortbyByDispatch,
  setFilterbyByDispatch,
  setPriceByDispatch,
  setRatingByDispatch,
  setFilterDrawerOpenByDispatch,
  setBannerFoodByDispatch,
  setDeliveryManInfoByDispatch,
  setFilterbyByCuisineDispatch,
  setGlobalTabType,
} = searchFilterSlice.actions
export default searchFilterSlice.reducer
