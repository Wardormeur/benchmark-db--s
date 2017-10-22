const pg = require('pg-promise')();
// Create a restriction without joining result in memory
module.exports = () => {
  
  // See also: http://vitaly-t.github.io/pg-promise/module-pg-promise.html

  // Database connection details;
  const cn = {
    host: 'db', // 'localhost' is the default;
    port: 5432, // 5432 is the default;
    database: 'test',
    user: 'postgres',
    password: 'test'
  };
  // You can check for all default values in:
  // https://github.com/brianc/node-postgres/blob/master/lib/defaults.js

  const db = pg(cn); // database instance	
  return db.any('SELECT user_id, group_id FROM users u JOIN user_groups ug ON ug.user_id = u.id WHERE name = ${name}', {
    name: 'John',
  });
}
