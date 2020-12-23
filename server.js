const { sequelize } = require("./models");
const app = require('./app');
const dotenv = require('dotenv');
const { propfind } = require("./app");
dotenv.config();

const port = process.env.PORT || 80;
const host = process.env.HOST || '0.0.0.0';


sequelize
  .authenticate()
  .then(() => {
    console.log("sucessfully connected to database");
    for (const table in sequelize.models) {
      sequelize.models[table].sync({ alter: true });
    }
    console.log("database sucessfully synced!");
    app.listen(port, host, () => console.log(`server has started on \nhttp://${host}:${port}`));
    // sequelize
    //   .sync({force: true})
    //   .then(() => {
    //  
    //  })
    //   .catch((err) => {
    //     console.log("error syncing to the database .." + err);
    //     process.exit(1);
    //   });
  })
  .catch((err) => {
    console.log("error connecting to the database.." + err.stack);
    process.exit(1);
  });
