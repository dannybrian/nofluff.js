// extend this to double handlebars, and should our variable name 
// be able to contain a curly brace?

var ourRegex = new RegExp(/{{([^{}]+)}}/, 'g');

///

// var ourRegex = new RegExp(/{{((?!}}).+?)}}/, 'g');

///

"The {{speed}} {{color}} fox jumped over the lazy {{mammal}}".replace(ourRegex, "HI");


   