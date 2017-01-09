module.exports = (app, io) => {
  const db = app.get('db');

  io.on('connection', (socket) => {

    db.users.find(socket.handshake.session.passport.user, (err, user) => {
      socket.handshake.user = user;
      socket.emit('initialized');
    });

    socket.on('getMessageHistory', () => {
      const query = `
        SELECT messages.message, messages.created_at, users.display_name, users.photo_url
        FROM messages
        LEFT JOIN users ON messages.user_id = users.id
        WHERE messages.created_at > transaction_timestamp() - interval '7' day
        ORDER BY messages.created_at DESC;
      `.trim().replace(/\n/g, ' ').replace(/\t/g, '');
      db.run(query, (err, records) => {
        if(err) {
          socket.emit('messageHistoryError', err);
          return console.error(err);
        }

        socket.emit('messageHistory', records.map((item) => {
          return {
            createdAt: item.created_at,
            displayName: item.display_name,
            message: item.message,
            photoUrl: item.photo_url
          };
        }));
      });
    });

    socket.on('sendMessage', (message) => {
      // Add logic to save message to DB here
      if(message) {
        db.messages.insert({
          user_id: socket.handshake.user.id,
          message: message,
          created_at: new Date()
        }, (err, record) => {
          if(err) {
            socket.emit('messageError', err);
            return console.error(err);
          }

          io.sockets.emit('newMessage', {
            message: record.message,
            createdAt: record.created_at
          }, {
            displayName: socket.handshake.user.display_name,
            photoUrl: socket.handshake.user.photo_url
          });
        });
      }
    });
  });
}
