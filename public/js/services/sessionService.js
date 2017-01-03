angular.module('theLiterati').service('sessionService', () => {

  return {
    checkLocalStorage() {
      return (typeof(Storage) !== 'undefined');
    },

    getSession(data) {
      if(!this.checkLocalStorage()) {
        return false;
      }

      const session = localStorage.getItem('session');
      return (session !== 'undefined' && session !== undefined) ? JSON.parse(session) : false;
    },

    createSession(data) {
      if(!this.checkLocalStorage) {
        return false;
      }

      localStorage.setItem('session', JSON.stringify(data));
      return data;
    },

    deleteSession() {
      if(this.checkLocalStorage) {
        localStorage.removeItem('session');
      }
    }
  };

});
