const config = require('./config');
const massive = require('massive');

module.exports = massive.connectSync({ connectionString : config.POSTGRES_CON_URL });
