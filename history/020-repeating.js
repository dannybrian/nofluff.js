(function () {
    'use strict';
    
    class NoFluff extends HTMLElement {
        constructor() {
            super();
            this._parseRegex = new RegExp(/{{([^{}]+)}}/, 'g');
        }
        
        connectedCallback () {
            
            console.log('connected');
        }
        
        attributeChangedCallback () {
            console.log('attribute changed');
        }
        
        set data (data) {
            this._data = data;
        }

        get data () {
            return this._data;
        }

        iterateAttributes () {
            for (var i = 0; i < this.attributes.length; i++) {
                var avalue = this.attributes[i].value;
                if (avalue === undefined) { continue; }
                var interped = this.interpolateText(avalue, this._data);
                this.attributes[i].value = interped;
            }
        }
    
        interpolateText (str, values) {
            return str.replace(this._parseRegex, function(a, b) { // match, capture
                let r = values[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
        }
    }
    
    // extend our new class
    class NoFluffRepeat extends NoFluff {
        constructor() {
            super();
        }
    }
    
    // register both
    customElements.define('no-fluff', NoFluff);
    customElements.define('no-fluff-repeat', NoFluffRepeat);
    
}());
