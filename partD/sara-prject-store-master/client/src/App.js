import {
  HashRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import WelcomePage from "./pages/welcomPage/WelcomePage";
import Login from "./pages/Login";
import ManagerOrderPanel from "./pages/ManagerOrderPanel";
import VendorOrderReview from "./pages/VendorOrderReview";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage/>}/>
          <Route path=":status" element={<Login/>}/>
          <Route path=":id/invitations" element={<VendorOrderReview/>}/>
          <Route path=":id/orders" element={<ManagerOrderPanel/>}/>
      </Routes>
      </Router>

    </div>
  );
}

export default App;
