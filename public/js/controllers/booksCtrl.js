angular.module('theLiterati').controller('booksCtrl', ($scope, bookService) => {
  const socket = io.connect('http://localhost:3000');

  $scope.messages = [];
  $scope.messageVal = '';
  $scope.disabledMessages = true;

  socket.on('initialized', () => {
    socket.emit('getMessageHistory');
  });

  socket.on('messageHistory', (messages) => {
    $scope.disabledMessages = false;
    messages.forEach((item) => {
      $scope.messages.push(item);
      $scope.$apply();
    });
  });

  socket.on('newMessage', (message, user) => {
    $scope.messages.unshift({
      message: message.message,
      createdAt: message.createdAt,
      displayName: user.displayName,
      photoUrl: user.photoUrl
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
