module.exports = (app, io) => {
  const db = app.get('db');

  io.on('connection', (socket) => {

    db.users.find(socket.handshake.session.passport.user, (err, user) => {
      socket.handshake.user = user;
    });

    socket.on('sendMessage', (message) => {
      // Add logic to save message to DB here
      socket.emit('newMessage', message, {
        display_name: socket.handshake.user.display_name,
        photo_url: socket.handshake.user.photo_url
      });
    });
  });
}
