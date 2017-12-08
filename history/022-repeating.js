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
        
        // fix for recursion
        iterateNodes(nodes) {
            nodes = (nodes === undefined) ? this.childNodes : nodes;
            for (var i = 0; i < nodes.length; i++) {
                var nvalue = nodes[i].nodeValue;
                if (nvalue === undefined) { continue; }
                var interped = this.interpolateText(nvalue, this._data);
                nodes[i].nodeValue = interped;
                
                // iterate child nodes, recursively
                this.iterateNodes(nodes[i].childNodes);
            }
        }
    }
    
    class NoFluffRepeat extends NoFluff {
        constructor() {
            super();
        }
    }
    
    customElements.define('no-fluff', NoFluff);
    customElements.define('no-fluff-repeat', NoFluffRepeat);
    
}());
