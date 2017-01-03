angular.module('theLiterati').service('bookService', function ($http, $q) {

  this.searchBook = function () {
    return $http ({
      method: GET,
      url: 'https://www.googleapis.com/books/v1/volumes?q=' + searchTerm + '&key=AIzaSyCOvCtvf_p2guH3C3TQshW8xfs69DUIKoI'
    }).then(function (response) {
      console.log(response.data);
      return response.data;
    });
  };

   this.getBook = function (bookId) {
      return $http({
        method: 'GET',
        url: 'https://www.googleapis.com/books/v1/volumes/' + bookId,
      }).then(function (response) {
        return response.data;
      });
    };

});
