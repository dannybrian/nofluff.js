// accomodate undefined variables better

var ourRegex = new RegExp(/{{([^{}]+)}}/, 'g');

function interpolate (str, values) {
    return str.replace(ourRegex, function(a, b) { // match, capture
        let r = values[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
}

interpolate("The {{speed}} {{color}} fox jumped over the lazy {{mammal}}", { speed: "fast", color: "blue" });

   