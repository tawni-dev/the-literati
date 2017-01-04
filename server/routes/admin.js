module.exports = (app) => {
  app.post('/setBotM/:id', function (req, res, next) {
    const db = app.get('db');
    db.books.update({is_active: true}, {is_active: false}, function (err, book) {
      if (err) res.status(500);
      db.books.insert({gbid: req.params.id, is_active: true}, function (err, book) {
        if (err) res.status(500);
        res.send(book);
      });
    });
  });
  app.get('/BotM', function (req, res, next) {
    const db = app.get('db');
    db.books.find({is_active: true}, function (err, book) {
      if (err) res.status(500);
      res.send(book[0]);
    });
  });
};
