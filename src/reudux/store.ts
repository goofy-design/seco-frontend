import { configureStore } from "@reduxjs/toolkit";
import investorReducer from "./slices/investorSlice";
import eventReducer from "./slices/eventSlice";
import eventApplicationReducer from "./slices/eventApplicationSlice";
import authReducer from "./slices/authSlice";
import projectsReducer from "./slices/projectSlice";
import folderSlice from "./slices/folderSlice";
import accountReducer from "./slices/accountSlice";
export const store = configureStore({
  reducer: {
    investor: investorReducer,
    event: eventReducer,
    eventApplication: eventApplicationReducer,
    auth: authReducer,
    projects: projectsReducer,
    folder: folderSlice,
    account: accountReducer,
  },
});
// store.dispatch(fetchCurrentUser());
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
