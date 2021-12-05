const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    return sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true
        },
        textFTS: {
            type: DataTypes.TSVECTOR,
            unique: true
        }
    }, {
        tableName: 'reviewsCategory',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['id']
            },
            {
                fields: ['textFTS'],
                using: 'gin'
            }
        ]
    })
}

