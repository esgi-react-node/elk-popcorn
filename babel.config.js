// Stricter mode for preventing using old JavaScript syntax and idioms
"use strict";

// Babel settings
module.exports = {
    // Presets for transpiling the code
    presets: [
        // Translate newer (ES6+) into older JavaScript (ES5)
        "@babel/preset-env"
    ]
};
