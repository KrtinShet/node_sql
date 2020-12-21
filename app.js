const express = require("express");
const morgan = require("morgan");
const app = express();

const AppError = require("./utils/appError");
const ErrorHandler = require("./controllers/error_controller");
const tourRoutes = require("./routes/tour_routes");
const userRoutes = require("./routes/user_routes");

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(ErrorHandler);

module.exports = app;
