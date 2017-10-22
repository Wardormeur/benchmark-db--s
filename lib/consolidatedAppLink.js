const pg = require('pg-promise')();
const _ = require('lodash');
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
  let users = [];
  return db.any('SELECT id, name FROM users WHERE name = ${name}', {
    name: 'John',
  })
  .then((_users) => {
    users = _users;
    return db.any('SELECT * FROM user_groups WHERE user_id IN ($1)', users.map((u) => u.id)); 
  })
  .then((_user_groups) => {
    const users_groups = _.map(users, (u) => { 
      u.group = _.find(_user_groups, {'user_id': u.id});
      return u;
    });
    return users_groups;
  });
}
