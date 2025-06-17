"use client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// import your reducers here
// import rootReducer from "./reducers";

export const store = configureStore({
  reducer: {
    // add your reducers here
    // example: user: userReducer,
  },
});

// Optionally, export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
