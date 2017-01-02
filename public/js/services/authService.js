angular.module('theLiterati').service('authService', ($http, sessionService, $q) => {

  return {
    authenticate() {
      return $q((resolve, reject) => {
        const session = sessionService.getSession();

        if(session) {
          return resolve(session);
        }

        return $http({
          method: 'GET',
          url: 'http://localhost:3000/session'
        }).then((resp) => {
          return resolve(sessionService.createSession(resp.data));
        }, (err) => {
          return reject(err);
        });
      });
    },

    deauthenticate() {
      return $q((resolve, reject) => {
        return $http({
          method: 'GET',
          url: 'http://localhost:3000/logout'
        }).then((resp) => {
          return resolve(sessionService.deleteSession());
        }, (err) => {
          return reject(err);
        });
      });
    },

    isAdmin() {
      return $q((resolve, reject) => {
        const session = sessionService.getSession();

        if(!session) {
          return reject("No session to check.");
        }

        if(session.is_admin) {
          return resolve(true);
        }

        return reject(false);
      });
    }
  };

});
