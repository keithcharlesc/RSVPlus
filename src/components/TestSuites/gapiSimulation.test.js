test("gapi call", () => {
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
            this.getId = () => "test";
            this.getAuthResponse = () =>
              new (function () {
                this.id_token = "randomToken";
              })();
            this.getBasicProfile = () =>
              new (function () {
                this.getName = () => "Orbital RSVP";
                this.getEmail = () => "rsvptest@gmail.com";
                this.getImageUrl = () => "http://gmail.com/image";
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
