import "@firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

it("renders without crashing", () => {
  window.gapi = { auth2: {}, client: {} };
  window.gapi.auth2.getAuthInstance = () => {
    return new (function () {
      this.isSignedIn = new (function () {
        this.signedIn = false;
        this.get = () => this.signedIn;
        this.listen = (f) => f();
      })();
      this.signIn = () => Promise.resolve((this.isSignedIn.signedIn = true));
      this.signOut = () => Promise.resolve((this.isSignedIn.signedIn = false));
      this.currentUser = new (function () {
        this.get = () =>
          new (function () {
            this.getId = () => "XYZ";
            this.getAuthResponse = () =>
              new (function () {
                this.id_token =
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
              })();
            this.getBasicProfile = () =>
              new (function () {
                this.getName = () => "Orbital RSVP";
                this.getEmail = () => "rsvptest@email.com";
                this.getImageUrl = () => "http://email.com/image";
              })();
          })();
      })();
    })();
  };
  window.gapi.auth2.init = () => {
    return Promise.resolve({});
  };
  window.gapi.client.init = (v) => true;
  window.gapi.load = (a, f) => f();
});
