(function () {
    'use strict';
    
    class NoFluff extends HTMLElement {
        constructor() {
            super();
            this._parseRegex = new RegExp(/{{([^{}]+)}}/, 'g');
            this._data = {};
        }
        
        // added stubs for connected
        connectedCallback () {
            
            console.log('connected');
        }
        
        // ... and attribute changed
        attributeChangedCallback () {
            
        }
        
        // use some data 
        set data (data) {
            this._data = data;
        }

        get data () {
            return this._data;
        }

        // iterate the attributes for an element, and interpolate
        iterateAttributes () {
            for (var i = 0; i < this.attributes.length; i++) {
                var avalue = this.attributes[i].value;
                if (avalue === undefined) { continue; }
                var interped = this.interpolateText(avalue, this._data);
                this.attributes[i].value = interped;
            }
        }
    
        // moved interpolate to bottom
        interpolateText (str, values) {
            return str.replace(this._parseRegex, function(a, b) { // match, capture
                let r = values[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
        }
    }
    
    // register the custom element
    customElements.define('no-fluff', NoFluff);
    
}());
