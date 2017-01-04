angular.module('theLiterati').service('bookService', function ($http, $q) {

  this.searchBook = (searchTerm) => {
    return $q((resolve, reject) => {
      return $http ({
        method: 'GET',
        url: 'https://www.googleapis.com/books/v1/volumes?q=' + searchTerm + '&key=AIzaSyCOvCtvf_p2guH3C3TQshW8xfs69DUIKoI'
      }).then(function (response) {
        return resolve(response.data);
      }, (err) => {
        return reject(err);
      });
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
