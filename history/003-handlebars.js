// substitute all the values for the variable names

var ourRegex = new RegExp(/{{([^{}]+)}}/, 'g');

// creating the regex once will save us cycles:
// https://jsperf.com/regexp-indexof-perf/24

function interpolate (str, values) {
    return str.replace(ourRegex, function(a, b) { // match, capture
        return values[b];
    });
}

interpolate("The {{speed}} {{color}} fox jumped over the lazy {{mammal}}", { speed: "fast", color: "blue", mammal: "human"});

// try removing mammal above; then you get undefined in the substitution.

   