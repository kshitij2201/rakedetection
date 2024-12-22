import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import RakeForm from "./pages/RakeForm.jsx";
import Table from "./pages/Table.jsx";
import UpdateTable from "./pages/UpdateTable.jsx";
import Home from "./pages/Home.jsx";
import Sorting from "./pages/Sorting.jsx";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { isLogin } from "./actions/userAction";
import { setIsLoginFalse } from "./slices/userSlice";
import Report from "./pages/Report.jsx";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const token = localStorage.getItem("token");
    if (token) {
      dispatch(isLogin()).finally(() => setLoading(false));
    } else {
      dispatch(setIsLoginFalse());
      setLoading(false);
    }
  }, [dispatch]);

  if (loading) {
    return "loading ...";
  }

  return (
    <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
      <Route path="/" element={<Home />}></Route>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/form" /> : <Login />}
        />
        <Route
          path="/updateTable"
          element={isAuthenticated ? <UpdateTable /> : <Navigate to="/login" />}
        />
        <Route
          path="/form"
          element={isAuthenticated ? <RakeForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/table"
          element={isAuthenticated ? <Table /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports-1"
          element={isAuthenticated ? <Sorting /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports-2"
          element={isAuthenticated ? <Report /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster position="top-left" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;
