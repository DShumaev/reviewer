const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    return sequelize.define('Review', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        likesCount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        ratingCount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        authorsRating: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        reviewFTS: {
            type: DataTypes.TSVECTOR,
            allowNull: true
        }
    }, {
        tableName: 'reviews',
        indexes: [
            {
                unique: true,
                fields: ['id']
            },
            {
                fields: ['reviewFTS'],
                using: 'gin'
            }
        ]
    })
}

