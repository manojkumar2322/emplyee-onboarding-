import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";             // your existing form (unchanged)
import Home from "./pages/Home.jsx"; // use uppercase 'Home' for React component
// Import the ViewForms component to handle viewing stored forms
import ViewForms from "./pages/ViewForms.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new" element={<App />} />
      <Route path="/view" element={<ViewForms />} />
    </Routes>
  </BrowserRouter>
);
