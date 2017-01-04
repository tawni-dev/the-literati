'use strict';

var theLiterati = angular.module('theLiterati', ['ui.router']);

theLiterati.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'views/home.html'
  }).state('user-authenticated', {
    url: '/user-authenticated',
    controller: 'userAuthCtrl'
  }).state('members', {
    url: '/members',
    abstract: true,
    controller: 'membersCtrl',
    templateUrl: 'views/members.html',
    resolve: {
      user: function user(authService) {
        return authService.authenticate();
      }
    }
  }).state('members.books', {
    url: '/books',
    controller: 'booksCtrl',
    templateUrl: 'views/books.html'
  }).state('members.admin', {
    url: '/admin',
    controller: 'adminCtrl',
    templateUrl: 'views/admin.html',
    resolve: {
      isAdmin: function isAdmin(authService) {
        return authService.isAdmin();
      }
    }
  });
});
'use strict';

angular.module('theLiterati').controller('adminCtrl', function (isAdmin, $scope, bookService) {

  function resetTabs() {
    $scope.tabBotM = true;
    $scope.tabUsers = false;
  }

  $scope.resetTabs();
  $scope.searchTerm = '';
  $scope.loading = false;
  $scope.results = [];

  $scope.switchTab = function (type) {
    $scope.resetTabs();
    $scope['tab' + type] = true;
  };

  $scope.searchBook = function (evt) {
    var keyCode = evt.keyCode;
    var searchTerm = $scope.searchTerm;

    if (keyCode === 13 && searchTerm !== '') {
      $scope.loading = true;
      $scope.results = [];

      bookService.searchBook(searchTerm).then(function (data) {
        $scope.loading = false;
        $scope.results = data.items;
      });
    }
  };

  $scope.setBotM = function (book) {
    console.log(book);
  };
});
'use strict';

angular.module('theLiterati').controller('booksCtrl', function () {

  console.log("On the book service");
});
'use strict';

angular.module('theLiterati').controller('mainCtrl', function ($scope, bookService) {

  console.log("On the book service");

  mainService.getBooks().then(function (response) {
    $scope.myBook = response;
  });
});
'use strict';

angular.module('theLiterati').controller('membersCtrl', function ($scope, user, $state, authService) {

  function logout() {
    authService.deauthenticate().then(function () {
      $state.go('home');
    });
  }

  if (!user || user.is_active === false) {
    logout();
  }

  $scope.currentUser = user;

  $scope.logout = function () {
    logout();
  };
});
'use strict';

angular.module('theLiterati').controller('userAuthCtrl', function (authService, $state) {

  authService.authenticate().then(function (data) {
    $state.go('members.books');
  }, function (err) {
    $state.go('home');
  });
});
'use strict';

angular.module('theLiterati').service('authService', function ($http, sessionService, $q) {

  return {
    authenticate: function authenticate() {
      return $q(function (resolve, reject) {
        var session = sessionService.getSession();

        if (session) {
          return resolve(session);
        }

        return $http({
          method: 'GET',
          url: 'http://localhost:3000/session'
        }).then(function (resp) {
          return resolve(sessionService.createSession(resp.data));
        }, function (err) {
          return reject(err);
        });
      });
    },
    deauthenticate: function deauthenticate() {
      return $q(function (resolve, reject) {
        return $http({
          method: 'GET',
          url: 'http://localhost:3000/logout'
        }).then(function (resp) {
          return resolve(sessionService.deleteSession());
        }, function (err) {
          return reject(err);
        });
      });
    },
    isAdmin: function isAdmin() {
      return $q(function (resolve, reject) {
        var session = sessionService.getSession();

        if (!session) {
          return reject("No session to check.");
        }

        if (session.is_admin) {
          return resolve(true);
        }

        return reject(false);
      });
    }
  };
});
'use strict';

angular.module('theLiterati').service('bookService', function ($http, $q) {

  this.searchBook = function (searchTerm) {
    return $q(function (resolve, reject) {
      return $http({
        method: 'GET',
        url: 'https://www.googleapis.com/books/v1/volumes?q=' + searchTerm + '&key=AIzaSyCOvCtvf_p2guH3C3TQshW8xfs69DUIKoI'
      }).then(function (response) {
        return resolve(response.data);
      }, function (err) {
        return reject(err);
      });
    });
  };

  this.getBook = function (bookId) {
    return $http({
      method: 'GET',
      url: 'https://www.googleapis.com/books/v1/volumes/' + bookId
    }).then(function (response) {
      return response.data;
    });
  };
});
'use strict';

angular.module('theLiterati').service('sessionService', function () {

  return {
    checkLocalStorage: function checkLocalStorage() {
      return typeof Storage !== 'undefined';
    },
    getSession: function getSession(data) {
      if (!this.checkLocalStorage()) {
        return false;
      }

      var session = localStorage.getItem('session');
      return session !== 'undefined' && session !== undefined ? JSON.parse(session) : false;
    },
    createSession: function createSession(data) {
      if (!this.checkLocalStorage) {
        return false;
      }

      localStorage.setItem('session', JSON.stringify(data));
      return data;
    },
    deleteSession: function deleteSession() {
      if (this.checkLocalStorage) {
        localStorage.removeItem('session');
      }
    }
  };
});