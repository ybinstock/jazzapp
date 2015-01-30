module.exports = function (sequelize, DataTypes){
  /* sequelize.define(modelName, attributes, options); */

  var Favorite = sequelize.define('favorites', {
    title: DataTypes.STRING,
    userId: DataTypes.INTEGER
  },
    {
      classMethods: {
        associate: function(db) {
          Favorite.belongsTo(db.user);
        }
      }
    });
  return Favorite;
};



