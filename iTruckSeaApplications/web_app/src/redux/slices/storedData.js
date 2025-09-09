import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  featuredCategories: [],
  cuisines: [],
  popularRestaurants: [],
  campaignFoods: [],
  featuredAuctions: [],
  banners: {
    banners: [],
    campaigns: [],
  },
  bestReviewedFoods: [],
  popularFood: [],
  suggestedKeywords: [],
  landingPageData: {},
  pageTabs: [],
  orderInvoice: {},
  orderInvoice: {},
  sourcer: {},
  notifications: {},
};

export const storedDataSlice = createSlice({
  name: 'stored-data',
  initialState,
  reducers: {
    setFeaturedCategories: (state, action) => {
      state.featuredCategories = action.payload;
    },
    setCuisines: (state, action) => {
      state.cuisines = action.payload;
    },
    setPopularRestaurants: (state, action) => {
      state.popularRestaurants = action.payload;
    },
    setCampaignFoods: (state, action) => {
      state.campaignFoods = action.payload;
    },
    setFeaturedAuctions: (state, action) => {
      state.featuredAuctions = action.payload;
    },
    setBanners: (state, action) => {
      state.banners.banners = action.payload.banners;
      state.banners.campaigns = action.payload.campaigns;
    },
    setBestReviewedFood: (state, action) => {
      state.bestReviewedFoods = action.payload;
    },
    setPopularFood: (state, action) => {
      state.popularFood = action.payload;
    },
    setSuggestedKeywords: (state, action) => {
      state.suggestedKeywords = action.payload;
    },
    setLandingPageData: (state, action) => {
      state.landingPageData = action.payload;
    },
    setPageTabs: (state, action) => {
      state.pageTabs = action.payload;
    },
    setOrderInvoice: (state, action) => {
      state.orderInvoice = action.payload;
    },
    setSourcer: (state, action) => {
      state.sourcer = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setLandingPageData,
  setFeaturedCategories,
  setCuisines,
  setPopularRestaurants,
  setCampaignFoods,
  setFeaturedAuctions,
  setBanners,
  setBestReviewedFood,
  setPopularFood,
  setSuggestedKeywords,
  setPageTabs,
  setOrderInvoice,
  setSourcer,
  setNotifications,
} = storedDataSlice.actions;
export default storedDataSlice.reducer;
