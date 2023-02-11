const director = require("./main").default;

function translate(root, i18Object) {
    director(root, i18Object)   
}

module.exports = {
    default: translate
}