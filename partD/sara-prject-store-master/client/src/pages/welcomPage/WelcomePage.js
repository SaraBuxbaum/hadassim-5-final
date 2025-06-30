import { NavLink } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  return (
    <div className="welcome-bg">
      <div className="welcome-card">
        <h1 className="welcome-title">ניהול הספקים - חנות מכולת</h1>
        <p className="welcome-subtitle">
          ספקים יכולים להתחבר למערכת, לצפות בהזמנות חדשות, ולאשר את הטיפול בהן.
        </p>
        <div className="welcome-buttons">
          <NavLink to="/login" className="btn login-btn">
            כניסה
          </NavLink>
          <NavLink to="/register" className="btn register-btn">
            הרשמה
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
