// start a NoFluff class

class NoFluff {
    constructor() {
        // move our compiled regex to an object variable
        this._parseRegex = new RegExp(/{{([^{}]+)}}/, 'g');
    }
    // keep our regex object cached in our interpolate function
    interpolateText (str, values) {
        return str.replace(this._parseRegex, function(a, b) { // match, capture
            let r = values[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        });
    }
}
