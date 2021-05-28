import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Navbar Pages/Dashboard";
import Signup from "./Account Components/Signup";
import Login from "./Account Components/Login";
import ForgotPassword from "./Account Components/ForgotPassword";
import Channels from "./Navbar Pages/Channels";
import Calendar from "./Navbar Pages/Calendar";
import Profile from "./Navbar Pages/Profile";
import ContactUs from "./Navbar Pages/ContactUs";

//PrivateRoutes only when users are logged in

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/channels" component={Channels} />
            <PrivateRoute path="/calendar" component={Calendar} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/contact-us" component={ContactUs} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
