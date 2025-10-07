import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import Homepage from "../pages/Homepage";
import DetailProducts from "../pages/DetailProducts";
import { useState } from "react";
import CartPage from "../pages/CartPage";
import WishPage from "../pages/WishPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Homepage />} />
            <Route path="details/:param" element={<DetailProducts />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="wish" element={<WishPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
