import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Navbar Pages/Dashboard";
import Login from "./Account Components/Login";
import CreateChannel from "./Navbar Pages/CreateChannel";
import Calendar from "./Navbar Pages/Calendar";
import ContactUs from "./Navbar Pages/ContactUs";
import FAQ from "./Navbar Pages/FAQ";
import "firebase/firestore";

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
            <PrivateRoute path="/faq" component={FAQ} />*
            <Route path="/login" component={Login} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
