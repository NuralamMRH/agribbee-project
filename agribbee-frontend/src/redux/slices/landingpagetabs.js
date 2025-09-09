import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageTabs: undefined,
};

export const pageTabsSlice = createSlice({
  name: "pageTabs",
  initialState,
  reducers: {
    setPageTabs: (state, action) => {
      // console.log('Action payload:', action.payload)
      state.pageTabs = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPageTabs } = pageTabsSlice.actions;
export default pageTabsSlice.reducer;
