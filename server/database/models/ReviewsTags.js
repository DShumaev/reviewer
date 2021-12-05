

module.exports = (sequelize) => {
    return sequelize.define('ReviewsTags', { }, {
        tableName: 'reviewsTags',
        timestamps: false
    })
}
