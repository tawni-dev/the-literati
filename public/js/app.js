var theLiterati = angular.module('theLiterati', ['ui.router']);

theLiterati.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
            url: '/',
            templateUrl: 'views/home.html'
        })
    .state('books', {
            url: '/books',
            templateUrl: 'views/books.html'
        })
    .state('discussions', {
            url: '/discussions'
    });
});
