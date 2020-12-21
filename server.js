const port = process.env.PORT || 80;
const { sequelize } = require("./models");
const app = require('./app');


sequelize
.authenticate()
.then(() => {
  console.log("sucessfully connected to database");
  sequelize
    .sync({ alter: true })
    .then(() => {
      console.log("database sucessfully synced!");
      app.listen(port, () => console.log("server has started..."));
    })
    .catch((err) => {
      console.log("error syncing to the database .." + err);
      process.exit(1);
    });
})
.catch((err) => {
  console.log("error connecting to the database.." + err.stack);
  process.exit(1);
});
