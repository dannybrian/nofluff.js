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
        
        iterateNodes(nodes) {
            nodes = (nodes === undefined) ? this.childNodes : nodes;
            for (var i = 0; i < nodes.length; i++) {
                var nvalue = nodes[i].nodeValue;
                
                // stop if we reach another no-fluff element
                if (nodes[i].nodeName.toUpperCase().startsWith('NO-FLUFF')) {
                    return;
                }
                
                // fixed to just update value of text nodes
                if (nodes[i].nodeType === Node.TEXT_NODE) {
                    let interped = this.interpolateText(nvalue, this._data);
                    nodes[i].nodeValue = interped;
                }
                
                this.iterateNodes(nodes[i].childNodes);
            }
        }
    }
    
    class NoFluffRepeat extends NoFluff {
        constructor() {
            super();
        }
        connectedCallback () {
            // get the template and the data source JSON
            let sourceUrl = this.getAttribute('data-source');
            
            fetch(sourceUrl).then(function(response) {
                console.log(response);
                response.json().then(function(data) { // stream, JSON parsed async
                   console.log(data); 
                });
            });
            
            let template = document.querySelector('template');
            console.log(template);            
        }
    }
    
    customElements.define('no-fluff', NoFluff);
    customElements.define('no-fluff-repeat', NoFluffRepeat);
    
}());
