/**
 * main.jsx — React application bootstrap
 *
 * Mounts the React tree into the <div id="root"> element in index.html.
 *
 * Wrapping with:
 *  - React.StrictMode  : Enables additional development-time warnings
 *                        (e.g. detecting deprecated API usage, double-invoking
 *                        render functions to surface side-effects).
 *  - Redux <Provider>  : Makes the Redux store available to every component
 *                        in the tree via useSelector / useDispatch hooks.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Tailwind CSS base styles
import { Provider } from "react-redux";
import store from "./store/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Provide the Redux store to the entire component tree */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
