import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Navbar Pages/Dashboard/Dashboard";
import Login from "./Account Components/Login";
import Channels from "./Navbar Pages/Channels/Channels";
import Calendar from "./Navbar Pages/Calendar/Calendar";
import ContactUs from "./Navbar Pages/ContactUs/ContactUs";
import FAQ from "./Navbar Pages/FAQ/FAQ";
import CalGuide from "./Navbar Pages/Calendar/CalGuide/CalGuide";
import "firebase/firestore";

//PrivateRoutes only when users are logged in

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/channels/" component={Channels} />
            <PrivateRoute path="/calendar" component={Calendar} />
            <PrivateRoute path="/contact-us" component={ContactUs} />
            <PrivateRoute path="/faq" component={FAQ} />*
            <PrivateRoute path="/calendar-guide" component={CalGuide} />*
            <Route path="/login" component={Login} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
