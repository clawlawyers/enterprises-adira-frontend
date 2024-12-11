import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./features/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Toaster } from "react-hot-toast";
const root = ReactDOM.createRoot(document.getElementById("root"));
let persistor = persistStore(store);
root.render(
  <PersistGate persistor={persistor}>
  <Provider store={store}>
    <App />
    <Toaster />
  </Provider>
  </PersistGate>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
