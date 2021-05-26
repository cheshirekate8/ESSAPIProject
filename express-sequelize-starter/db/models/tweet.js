'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    message: {
      allowNull: false,
      type: DataTypes.STRING(280)
    }
  }, {});
  Tweet.associate = function(models) {
    // associations can be defined here
  };
  return Tweet;
};
