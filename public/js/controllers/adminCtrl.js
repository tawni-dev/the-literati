angular.module('theLiterati').controller('adminCtrl', (isAdmin, $scope, bookService) => {

  function resetTabs() {
    $scope.tabBotM = true;
    $scope.tabUsers = false;
  }

  $scope.resetTabs();
  $scope.searchTerm = '';
  $scope.loading = false;
  $scope.results = [];

  $scope.switchTab = (type) => {
    $scope.resetTabs();
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
  };

});
