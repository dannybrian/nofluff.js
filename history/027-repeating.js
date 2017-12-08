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

        // allow pass of node
        iterateAttributes (node, values) {
            node = (node === undefined) ? this : node;
            
            // allow values to be supplied to method
            values = (values === undefined) ? this._data : values;
            
            for (let i = 0; i < node.attributes.length; i++) {
                var avalue = node.attributes[i].value;
                if (avalue === undefined) { continue; }
                var interped = this.interpolateText(avalue, values);
                node.attributes[i].value = interped;
            }
        }
    
        interpolateText (str, values) {
            return str.replace(this._parseRegex, function(a, b) { // match, capture
                let r = values[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
        }
        
        iterateNodes(nodes, values) {
            nodes = (nodes === undefined) ? this.childNodes : nodes;
            
            // allow values to be supplied to method
            values = (values === undefined) ? this._data : values;
            for (let i = 0; i < nodes.length; i++) {
                
                // iterate the attributes for each node too
                if (nodes[i].nodeType === Node.ELEMENT_NODE) {
                    this.iterateAttributes(nodes[i], values);
                }
                
                var nvalue = nodes[i].nodeValue;
                
                if (nodes[i].nodeName.toUpperCase().startsWith('NO-FLUFF')) {
                    return;
                }
                
                if (nodes[i].nodeType === Node.TEXT_NODE) {
                    // pass values to method
                    let interped = this.interpolateText(nvalue, values);
                    nodes[i].nodeValue = interped;
                }
                
                // pass values to method
                this.iterateNodes(nodes[i].childNodes, values);
            }
        }
    }
    
    class NoFluffRepeat extends NoFluff {
        constructor() {
            super();
        }
        connectedCallback () {
            var self = this;
            // get the template and the data source JSON
            let sourceUrl = this.getAttribute('data-source');
            this._template = this.querySelector('template'); 
            
            fetch(sourceUrl).then(function(response) {
                response.json().then(function(data) { // stream, JSON parsed async
                    self.renderRepeat(data);
                });
            });
            
        }
        
        // render our retrieved JSON into cloned rows
        renderRepeat (data) {
            console.log(data.length);
            for (let i = 0; i < data.length; i++) {
                let newrow = document.importNode(this._template.content, true);
                let appended = this.appendChild(newrow);
                this.iterateNodes(this.childNodes, data[i]);
            }
        }
    }
    
    customElements.define('no-fluff', NoFluff);
    customElements.define('no-fluff-repeat', NoFluffRepeat);
    
}());
