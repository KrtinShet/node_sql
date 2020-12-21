const { Sequelize, Model, Op } = require("sequelize");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}

    async correctPassword(candidatePassword, userPassword) {
      return await bcrypt.compare(candidatePassword, userPassword);
    }

    changedPasswordAfter(JWTTimestamp) {
      if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
          this.passwordChangedAt.getTime() / 1000,
          10
        );
        return JWTTimestamp < changedTimestamp;
      }
      return false;
    }

    createPasswordResetToken() {
      const resetToken = crypto.randomBytes(32).toString("hex");
      this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      console.log({ resetToken }, this.passwordResetToken);
      this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
      return resetToken;
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
        allowNull: false,
      },
      photo: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM(["user", "guide", "lead-guide", "admin"]),
        defaultValue: "user",
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          minLength: function (value) {
            if (value.length < 8) {
              throw new Error(
                "password length must be minimum 8 characters long"
              );
            }
          },
        },
      },
      passwordChangedAt: DataTypes.DATE,
      passwordResetToken: DataTypes.DATE,
      passwordResetExpires: DataTypes.DATE,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
    }
  );

  User.beforeSave(async function (user) {
    if (user.changed("password") || user.isNewRecord) {
      user.password = await bcrypt.hash(user.password, 12);
      user.passwordChangedAt = Date.now() - 1000;
    }
  });

  User.findAll({
    where: {
      active: { [Op.ne]: false },
    },
    attributes: {
      exclude: ["password"],
    },
  });

  return User;
};
