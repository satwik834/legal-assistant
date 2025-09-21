import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import ChatBox from "./components/ChatBox.jsx";
import UploadPdf from "./components/UploadPdf.jsx";
import App from "./App.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
