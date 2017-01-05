angular.module('theLiterati').controller('adminCtrl', (isAdmin, $scope, bookService) => {

  $scope.tabBotM = true;
  $scope.tabUsers = false;
  $scope.searchTerm = '';
  $scope.loading = false;
  $scope.results = [];

  $scope.switchTab = (type) => {
    $scope.tabBotM = false;
    $scope.tabUsers = false;
    $scope[`tab${type}`] = true;
  };

  $scope.searchBook = (evt) => {
    const keyCode = evt.keyCode;
    const searchTerm = $scope.searchTerm;

    if(keyCode === 13 && searchTerm !== '') {
      $scope.loading = true;
      $scope.results = [];

      bookService.searchBook(searchTerm).then((data) => {
        $scope.loading = false;
        $scope.results = data.items;
      });
    }
  };

  $scope.setBotM = (book) => {
    console.log(book);
    bookService.setBotM(book.id).then(function (response) {

    });
  };

});
