import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Navbar Pages/Dashboard";
import Login from "./Account Components/Login";
import CreateChannel from "./Navbar Pages/CreateChannel";
import Calendar from "./Navbar Pages/Calendar";
import ContactUs from "./Navbar Pages/ContactUs";
import "firebase/firestore";
/*
import Signup from "./Account Components/Signup";
import ForgotPassword from "./Account Components/ForgotPassword";
import Profile from "./Navbar Pages/Profile";*/

//PrivateRoutes only when users are logged in

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/create-channel/" component={CreateChannel} />
            <PrivateRoute path="/calendar" component={Calendar} />
            <PrivateRoute path="/contact-us" component={ContactUs} />
            <Route path="/login" component={Login} />
            {/*<Route path="/signup" component={Signup} />
            <Route path="/forgot-password" component={ForgotPassword} /> 
            <PrivateRoute path="/profile" component={Profile} />*/}
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
