const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    return sequelize.define('Tag', {
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
            type: DataTypes.TSVECTOR
        }
    }, {
        tableName: 'tags',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['id']
            },
            {
                fields: ['text']
            },
            {
                fields: ['textFTS'],
                using: 'gin'
            }
        ]
    })
}

