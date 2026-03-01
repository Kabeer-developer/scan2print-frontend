import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUserFromStorage } from "./redux/slices/storeSlice";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import StoreDetail from "./pages/StoreDetail";
import LoginStore from "./pages/LoginStore";
import RegisterStore from "./pages/RegisterStore";
import Dashboard from "./pages/Dashboard";
import MyStore from "./pages/MyStore";

const App = () => {
  const dispatch = useDispatch();
  const { storeInfo } = useSelector((state) => state.store);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store/:id" element={<StoreDetail />} />
        <Route path="/login" element={<LoginStore />} />
        <Route path="/register" element={<RegisterStore />} />
        <Route path="/mystore" element={<MyStore />} />
        <Route
          path="/dashboard"
          element={storeInfo ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

export default App;
