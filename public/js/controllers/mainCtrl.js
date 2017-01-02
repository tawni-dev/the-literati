angular.module('theLiterati').controller('mainCtrl', function ($scope, bookService) {

  mainService.getBooks().then(function (response) {
    $scope.myBook = response;
  });

});
