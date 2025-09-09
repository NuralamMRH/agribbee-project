import { createSlice } from '@reduxjs/toolkit';
import MainApix from 'src/api/MainApix';

const initialState = {
  global: undefined,
  couponInfo: null,
  couponType: '',
  zoneData: null,
  handleHomePage: false,
  openMapDrawer: false,
  userLocationUpdate: false,
};

export const globalSettingSlice = createSlice({
  name: 'globalData',
  initialState,
  reducers: {
    setGlobalSettings: (state, action) => {
      state.global = action.payload;
    },
    setCustomerProfile: (state, action) => {
      state.customerProfile = action?.payload;
    },
    setCouponInfo: (state, action) => {
      state.couponInfo = action?.payload;
    },
    setCouponType: (state, action) => {
      state.couponType = action?.payload;
    },
    setZoneData: (state, action) => {
      state.zoneData = action?.payload;
    },
    setHandleHomePage: (state, action) => {
      state.handleHomePage = action.payload;
    },
    setOpenMapDrawer: (state, action) => {
      state.openMapDrawer = action.payload;
    },
    setUserLocationUpdate: (state, action) => {
      state.userLocationUpdate = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setGlobalSettings,

  setCustomerProfile,
  setCouponInfo,
  setCouponType,
  setZoneData,
  setHandleHomePage,
  setOpenMapDrawer,
  setUserLocationUpdate,
} = globalSettingSlice.actions;
export default globalSettingSlice.reducer;

export function getConfig() {
  return async (dispatch) => {
    try {
      const response = await MainApix.get('/api/v1/config');
      dispatch(globalSettingSlice.actions.setGlobalSettings(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}
