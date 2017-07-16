var queryDataBase = function() {
  const pgp = require('pg-promise')();
  const cn = {
    host: process.env.host,
    port: process.env.port,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
};
  const db = pgp(cn);
  var result = {};
  db.query("select mmc from mmc order by ytd desc limit 5;").then(
      data => {
          result.data = data;
          console.log(result);
          pgp.end();
      }
  );

  return result;
}


exports.handler = (event, context, callback) => {
    // TODO implement
    var mostPopular = queryDataBase();
    console.log("hello");
    var make_model = mostPopular.data.reduce(function(acc, obj) {
        return acc + ", " + obj['mmc'];
    }, "")

    callback(null, `Here are the most popular Make models this year: ${make_model}`);
};
