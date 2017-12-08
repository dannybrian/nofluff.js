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

        iterateAttributes (node, values) {
            node = (node === undefined) ? this : node;
            
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
            
            values = (values === undefined) ? this._data : values;
            for (let i = 0; i < nodes.length; i++) {
                
                if (nodes[i].nodeType === Node.ELEMENT_NODE) {
                    this.iterateAttributes(nodes[i], values);
                }
                
                var nvalue = nodes[i].nodeValue;
                
                if (nodes[i].nodeName.toUpperCase().startsWith('NO-FLUFF')) {
                    return;
                }
                
                if (nodes[i].nodeType === Node.TEXT_NODE) {
                    let interped = this.interpolateText(nvalue, values);
                    nodes[i].nodeValue = interped;
                }
                
                this.iterateNodes(nodes[i].childNodes, values);
            }
        }
    }
    
    class NoFluffRepeat extends NoFluff {
        constructor() {
            super();
        }
        connectedCallback () {
            this._sourceUrl = this.getAttribute('data-source');
            this._template = this.querySelector('template'); 
            // call fetch and set timer to continually poll
            this.fetchData();
        }
        
        // move fetch call to here
        fetchData () {
            var self = this;
            fetch(this._sourceUrl).then(function(response) {
                response.json().then(function(data) { // stream, JSON parsed async
                    self.renderRepeat(data);
                });
            });
        }
        
        renderRepeat (data) {
            var self = this;
            for (let i = 0; i < data.length; i++) {
                // look for an existing speaker id before appending a new one.
                let already = this.querySelector('[data-speakerid="' + data[i].id + '"]');
                if (already) {
                    this.iterateNodes(already.childNodes, data[i]);
                }
                // otherwise add them.
                else
                {
                    let newrow = document.importNode(this._template.content, true);
                    let appended = this.appendChild(newrow);
                    this.iterateNodes(this.childNodes, data[i]);
                }
                // ... but there are no templates to use!
            }
            setTimeout(function() { self.fetchData(); }, 5000);

        }
    }
    
    customElements.define('no-fluff', NoFluff);
    customElements.define('no-fluff-repeat', NoFluffRepeat);
    
}());
