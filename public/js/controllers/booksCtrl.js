angular.module('theLiterati').controller('booksCtrl', ($scope, bookService) => {
  const socket = io.connect('http://localhost:3000');

  $scope.messages = [];
  $scope.messageVal = '';

  socket.on('newMessage', (message, user) => {
    $scope.messages.push({
      message: message,
      name: user.display_name,
      photoUrl: user.photo_url
    });
    $scope.$apply();
  });

  $scope.chatKeyUp = (evt) => {
    const keyCode = evt.keyCode;

    if(keyCode === 13) {
      if(socket) {
        socket.emit('sendMessage', $scope.messageVal);
        $scope.messageVal = '';
      }
    }
  };

  function getBotM () {
    bookService.getBotM().then(function (response) {
      bookService.getBook(response).then(function (response) {
        $scope.book = response.volumeInfo;
      });
    });
  }

  getBotM();

  $scope.poll = {choices: [{text: 'Hello', votes: []}, {text: 'Goodbye', votes: []}]};

});
