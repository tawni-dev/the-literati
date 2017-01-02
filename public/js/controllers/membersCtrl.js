angular.module('theLiterati').controller('membersCtrl', function ($scope, user, $state, authService) {

  function logout() {
    authService.deauthenticate().then(() => {
      $state.go('home');
    });
  }

  if(!user || user.is_active === false) {
    logout();
  }

  $scope.currentUser = user;

  $scope.logout = () => {
    logout();
  }

});
