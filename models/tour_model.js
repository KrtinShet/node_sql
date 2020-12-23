const { Sequelize, Model } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize, DataTypes) => {
  class Tour extends Model {
    static associate(models) { }
  }
  Tour.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
        validate: {
          len: [10, 40],
        },
      },
      slug: {
        type: DataTypes.STRING,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      durationweeks: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.duration / 7;
        },
      },
      maxGroupSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.ENUM(["easy", "medium", "difficult"]),
        allowNull: false,
      },
      ratingsAverage: {
        type: DataTypes.DOUBLE,
        defaultValue: 4.5,
        validate: {
          max: 5,
          min: 1,
        },
      },
      ratingsQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      priceDiscount: {
        type: DataTypes.DOUBLE,
        validate: {
          checkDiscount(value) {
            if (value < this.price) {
              throw new Error("Discount cannot be greater then the tour price");
            }
          },
        },
      },
      summary: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1500),
        allowNull: false,
      },
      imageCover: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      images: {
        type: DataTypes.STRING,
        get: function () {
          return JSON.parse(this.getDataValue("images"));
        },
        set: function (value) {
          this.setDataValue("images", JSON.stringify(value));
        },
      },
      startDates: {
        type: DataTypes.STRING,
        get: function () {
          return JSON.parse(this.getDataValue("startDates"));
        },
        set: function (value) {
          this.setDataValue("startDates", JSON.stringify(value));
        },
      },
      secretTour: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      timestamps: true,
    }
  );
  Tour.beforeCreate(function (tour) {
    tour.slug = slugify(tour.name, { lower: true });
  });
  return Tour;
};
