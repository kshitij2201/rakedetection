import { Link, useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { RiDatabase2Fill } from "react-icons/ri";
import { FaFileUpload, FaSignOutAlt, FaRegFileAlt } from "react-icons/fa"; // Import new icon
import { TbReportSearch } from "react-icons/tb";
import "../Styles/Navbar.css";
import { useDispatch } from "react-redux";
import { loginFail } from "../slices/userSlice";
import toast from "react-hot-toast";

export default function Navbar({ isAuthenticated }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.error("Logout success");
    dispatch(loginFail());
    navigate("/login"); 
  };

  return (
    <div className="navbar">
      <Link to="/login">
        <div className="logo">LOGO</div>
      </Link>
      <div className="icons-container">
        <Link to="/form">
          <IoHome className="nav-icon" />
        </Link>
        <Link to="/table">
          <RiDatabase2Fill className="nav-icon" />
        </Link>
        <Link to="/updateTable">
          <FaFileUpload className="nav-icon" />
        </Link>
        <Link to="/reports-1">
          <TbReportSearch className="nav-icon" />
        </Link>
        {/* New report icon */}
        <Link to="/reports-2">
          <FaRegFileAlt className="nav-icon" />
        </Link>
        {isAuthenticated && (
          <div className="logout" onClick={handleLogout}>
            <FaSignOutAlt style={{color:"red", border:'5px solid red', backgroundColor:'black'}} className="nav-icon" />
          </div>
        )}
      </div>
    </div>
  );
}
