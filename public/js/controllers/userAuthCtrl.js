angular.module('theLiterati').controller('userAuthCtrl', (authService, $state) => {

  authService.authenticate().then((data) => {
    $state.go('members.books');
  }, (err) => {
    $state.go('home');
  });

});
