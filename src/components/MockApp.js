import { MockAuthProvider } from "../contexts/MockAuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import MockDashboard from "./Navbar Pages/Dashboard/MockDashboard";
import MockLogin from "./Account Components/MockLogin";
import MockChannels from "./Navbar Pages/Channels/MockChannels";
import MockCalendar from "./Navbar Pages/Calendar/MockCalendar";
import MockContactUs from "./Navbar Pages/ContactUs/MockContactUs";
import MockFAQ from "./Navbar Pages/FAQ/MockFAQ";
import MockCalGuide from "./Navbar Pages/Calendar/CalGuide/MockCalGuide";
import "firebase/firestore";

//PrivateRoutes only when users are logged in

function MockApp() {
  return (
    <div>
      <Router>
        <MockAuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={MockDashboard} />
            <PrivateRoute path="/channels/" component={MockChannels} />
            <PrivateRoute path="/calendar" component={MockCalendar} />
            <PrivateRoute path="/contact-us" component={MockContactUs} />
            <PrivateRoute path="/faq" component={MockFAQ} />*
            <PrivateRoute path="/calendar-guide" component={MockCalGuide} />*
            <Route path="/login" component={MockLogin} />
          </Switch>
        </MockAuthProvider>
      </Router>
    </div>
  );
}

export default MockApp;
