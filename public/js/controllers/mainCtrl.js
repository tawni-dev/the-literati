angular.module('theLiterati').controller('mainCtrl', function ($scope, bookService) {

  console.log("On the book service");

  mainService.getBooks().then(function (response) {
    $scope.myBook = response;
  });

});
