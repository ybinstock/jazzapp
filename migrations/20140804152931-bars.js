module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    
    migration.createTable('favorites', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // REQUIRED: createdAt and updatedAt
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      // STRING is a VarChar of 255 characters default
      title: DataTypes.STRING,
      userId: {
       type:DataTypes.INTEGER,
        foreignKey: true
      }
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    
    migration.dropTable('favorites')
    .complete(done);
  }
};
