module.exports = {
    mongoosetoObjectS: function (mongooes) {
        // trường hợp nhiều object
        return mongooes.map((mongooes) => mongooes.toObject());
    },
    mongoosetoObject: function (mongooes) {
        return mongooes ? mongooes.toObject() : mongooes;
    },
};
