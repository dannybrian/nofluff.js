// keep our regex object cached in our interpolate function

var interpolate = (function() {
    const ourRegex = new RegExp(/{{([^{}]+)}}/, 'g');
    return function (str, values) {
        return str.replace(ourRegex, function(a, b) { // match, capture
            let r = values[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        });
    };
}());

interpolate("The {{speed}} {{color}} fox jumped over the lazy {{mammal}}", { speed: "fast", color: "blue" });

