import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import Homepage from "../pages/Homepage";
import DetailProducts from "../pages/DetailProducts";
import { useState } from "react";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={DefaultLayout}>
            <Route index element={<Homepage />} />
            <Route path="details/:id" element={<DetailProducts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
