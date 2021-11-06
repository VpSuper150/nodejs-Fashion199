module.exports = {
    showName: function (name) {
        const a = name.split(' ').slice(-1).toString();
        return a.charAt(0).toUpperCase() + a.slice(1);
    },
};
