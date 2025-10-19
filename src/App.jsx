import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import './theme.css';


import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import PageNoFound from "./Components/PageNoFound";
import DashBoard from "./Pages/DashBoard";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Default route → directly show Login */}
          <Route path="/" element={<Login />} />

          {/* Other routes */}
          <Route path='/login' element={<> <Login /></>} />
          <Route path='/signup' element={<> <SignUp /></>} />

          <Route path="/dashboard" element={<DashBoard />} />

          {/* 404 fallback */}
          <Route path="*" element={<PageNoFound />} />
        </Routes>
      </BrowserRouter>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

export default App;
