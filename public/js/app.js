var theLiterati = angular.module('theLiterati', ['ui.router']);

theLiterati.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html'
    })

    .state('user-authenticated', {
      url: '/user-authenticated',
      controller: 'userAuthCtrl'
    })

    .state('members', {
      url: '/members',
      abstract: true,
      controller: 'membersCtrl',
      templateUrl: 'views/members.html',
      resolve: {
        user: (authService) => {
          return authService.authenticate();
        }
      }
    })

    .state('members.books', {
      url: '/books',
      controller: 'booksCtrl',
      templateUrl: 'views/books.html'
    })

    .state('members.admin', {
      url: '/admin',
      controller: 'adminCtrl',
      templateUrl: 'views/admin.html',
      resolve: {
        isAdmin: (authService) => {
          return authService.isAdmin();
        }
      }
    })
});
