var ourRegex = new RegExp(/{([^{}]*)}/, 'g');

function interpolate(str) {
    return function interpolate(o) {
        return str.replace(/{([^{}]*)}/g, function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        });
    }
}

var terped = interpolate('The {speed} {color} fox jumped over the lazy {mammal}')({
    speed: 'quick',
    color: 'brown',
    mammal: 'dog'
});

console.log(terped);
