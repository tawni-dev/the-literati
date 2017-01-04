angular.module('theLiterati').controller('booksCtrl', ($scope, bookService) => {

  console.log("On the book service");
  function getBotM () {
    bookService.getBotM().then(function (response) {
      bookService.getBook(response).then(function (response) {
        $scope.book = response.volumeInfo;
        console.log(response);
      });
    });
  }
  getBotM();
});
