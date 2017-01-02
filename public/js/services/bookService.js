angular.module('theLiterati').service('bookService', function ($http) {

  this.getBooks = function () {
    return $http ({
      method: GET,
      url: ''
    }).then(function gotBook(response) {
      return response.data;
    });

  };

});
