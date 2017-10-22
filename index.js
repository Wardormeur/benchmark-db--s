const appLink = require('./lib/appLink.js');
const consolidatedAppLink = require('./lib/consolidatedAppLink.js');
const naturalJoin = require('./lib/naturalJoin.js');
const uuid = require('uuid/v4');
const pg = require('pg-promise')();
// TODO : try benchmark.js
setTimeout(() => {
  resetDB()
  .then(timer.bind(this, appLink))
  .then(timer.bind(this, consolidatedAppLink))
  .then(timer.bind(this, naturalJoin))
  .then(() => {
    console.log('finished');
  });
}, 2000);
function timer(fn) {
  const startTime = new Date().getTime();
  console.log('startTime');	
  return fn().then(() => {
    console.log('fn took', new Date().getTime() - startTime, 'ms');
  });
}
function resetDB() {
  const cn = {
    host: 'db',
    database: 'test',
    user: 'postgres',
    password: 'test',
  };
  const db = pg(cn);
  return db.any('DROP TABLE IF EXISTS users, user_groups')
  .then(() => db.any('CREATE TABLE IF NOT EXISTS users(id uuid CONSTRAINT ukey PRIMARY KEY, name character varying);'))
  .then(() => db.any('TRUNCATE TABLE users;'))
  .then(() => db.any('CREATE TABLE IF NOT EXISTS user_groups(id uuid CONSTRAINT ugkey PRIMARY KEY, user_id uuid NOT NULL , group_id integer NOT NULL, unique(user_id, group_id));'))
  .then(() => db.any('TRUNCATE TABLE user_groups;'))
  .then(() => {
    const inserts = [];
    const names = ['John', 'Guim'];
    const loopArray = Array.from(Array(10000).keys());
    loopArray.forEach((index) => {
      let p = db.any('INSERT INTO users(id, name) VALUES(${id}, ${name})', {id: uuid(),name: names[index%2]});
      inserts.push(p);
    });
    return Promise.all(inserts);
  })
  .then(() => {
    const inserts = [];
    db.any('SELECT id FROM users;')
    .then((users) => {
      users.forEach((user, index) => {
        const p = db.any('INSERT INTO user_groups(id, user_id, group_id) VALUES(${id}, ${userId}, ${groupId});',
        { id: uuid(), userId: user.id, groupId: index%2 });
        inserts.push(p);
      });
      return Promise.all(inserts);
    });
  })
  .then(() => db.any('REINDEX DATABASE test'))
  .then(() => console.log('reset finished'));
}
