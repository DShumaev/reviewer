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
            type: DataTypes.STRING(250),
            allowNull: false
        },
        textFTS: {
            type: DataTypes.TSVECTOR,
        }
    }, {
        tableName: 'comments',
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

