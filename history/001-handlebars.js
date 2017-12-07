// come up with a regex to parse handlebars {} in a string.

var ourRegex = new RegExp(/{([^{}]*)}/, 'g');
"The {speed} {color} fox jumped over the lazy {mammal}".replace(ourRegex, "HI");

