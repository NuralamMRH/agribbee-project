import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';

// import storage from 'redux-persist/lib/storage'
import cartReducer from './slices/cart';
import offlinePaymentInfoReducer from './slices/OfflinePayment';
import addressDataReducer from './slices/addressData';
import cashbackReducer from './slices/cashbackList';
import userSlice from './slices/customer';
import editProfileReducer from './slices/editProfile';
import globalSettingsReducer from './slices/global';
import guestUserReducer from './slices/guestUserInfo';
import languageChangeReducer from './slices/languageChange';

import storedDataSliceReducer from './slices/storedData';
import userTokenReducer from './slices/userToken';

// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import { wishListSlice } from './slices/wishList';
import { searchFilterSlice } from './slices/searchFilter';
import { orderTypeSlice } from './slices/orderType';
import { fbCredentialSlice } from './slices/fbCredentials';
import landingPageSliceReducer from './slices/landingpagedata';
import { scrollPosition } from './slices/scrollPosition';
import searchTagsReducer from './slices/searchTagSlice';
import utilsReducers from './slices/utils';
import pageTabsReducer from '@/redux/slices/landingpagetabs';

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local') // Use localStorage in the browser
    : createNoopStorage();

const persistConfig = {
  key: 'rancoded',
  storage: storage,
  blacklist: ['searchFilterStore', 'storedData', 'scrollPosition', 'globalSettings', 'pageTabs'],
};

export const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
  blacklist: ['globalSettings'],
};
const reducers = combineReducers({
  globalSettings: globalSettingsReducer,
  user: userSlice,
  cart: cartReducer,
  wishList: wishListSlice,
  storedData: storedDataSliceReducer,
  userToken: userTokenReducer,
  languageChange: languageChangeReducer,
  offlinePayment: offlinePaymentInfoReducer,
  guestUserInfo: guestUserReducer,
  addressData: addressDataReducer,
  isEditProfile: editProfileReducer,
  cashbackList: cashbackReducer,
  searchFilterStore: searchFilterSlice,
  orderType: orderTypeSlice,
  fbCredentialsStore: fbCredentialSlice,
  landingPage: landingPageSliceReducer,
  scrollPosition: scrollPosition,
  searchTags: searchTagsReducer,
  utilsData: utilsReducers,
  pageTabs: pageTabsReducer,

  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer),
});

const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // serializableCheck: {
      //     ignoredActions: [
      //         FLUSH,
      //         REHYDRATE,
      //         PAUSE,
      //         PERSIST,
      //         PURGE,
      //         REGISTER,
      //     ],
      // },
    }),
});

const persistor = persistStore(store);

const { dispatch } = store;

const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();

export { store, persistor, dispatch, useSelector, useDispatch };
