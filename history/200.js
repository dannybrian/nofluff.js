(function () {
    'use strict';
    
    class NoFluff extends HTMLElement {
        constructor() {
            super();
            this._parseRegex = new RegExp(/{{([^{}]+)}}/, 'g');
            // this._data = {};
        }
        
        // added stubs for connected
        connectedCallback () {
            console.log(`connected: ${this.nodeName}`);
        }
        
        // ... and attribute changed
        attributeChangedCallback (a, b, c) {
        }

        // iterate the attributes for an element, and interpolate
        iterateAttributes (node, values) {
            node = (node === undefined) ? this : node;
            // values = (values === undefined) ? this._data : values;
                        
            for (var i = 0; i < node.attributes.length; i++) {
                let avalue = node.attributes[i].value;
                if (avalue === undefined) { continue; }
                let interped = this.interpolateText(avalue, values);
                node.attributes[i].value = interped;
            }
        }
    
        iterateNodes (nodes, values) {
            nodes = (nodes === undefined) ? this.childNodes : nodes;
            // values = (values === undefined) ? this._data : values;
            
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].nodeType === Node.ELEMENT_NODE) {
                    this.iterateAttributes(nodes[i], values);    
                }
                 
                // console.log(`${nodes[i].nodeName}   ${nodes[i].nodeValue}`);
                if (nodes[i].nodeType === Node.TEXT_NODE) {
                    nodes[i].nodeValue = this.interpolateText(nodes[i].nodeValue, values);
                }
                
                this.iterateNodes(nodes[i].childNodes, values);    
            }
            
        }
        
        // moved interpolate to bottom
        interpolateText (str, values) {
            let replaced = str.replace(this._parseRegex, function(a, b) { // match, capture
                let r = values[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
            return replaced;
        }
    }
    
    class NoFluffRepeat extends NoFluff {
        
        constructor (hooks) {
            // { dataFetched: function() { }, repeaterFinished: function () {} }
            super();
            
        }
    
        connectedCallback () {
            this._sourceUrl = this.getAttribute('data-source');
            let self = this;
            
            self._template = document.querySelector('template');
                
            self.fetchData();
            
        }
        
        fetchData () {
            let self = this;
            fetch(this._sourceUrl).then(function(response) {
               response.json().then(function(data) {
                   //console.log(data);
                   self.renderRepeat(data);
               });
            });
            setTimeout(() => this.fetchData(), 1500);
        }
        
        renderRepeat (data) {
            for (let i = 0; i < data.length; i++) {
                let already = document.getElementById(data[i].id);
                if (already !== null) {
                    this.iterateNodes(already.childNodes, data[i]);
                }
                else
                {
                    let cloned = document.importNode(this._template.content, true);
                    
                    this.appendChild(cloned);
                    this.iterateNodes(this.childNodes, data[i]);
                }
            }
        }
    }
    
    class NoFluffSpeaker extends NoFluff {
        constructor () {
            super();
        }
        
        connectedCallback () {
            let speakerid = location.hash.substr(1);
            if (speakerid === '') { return; }
            if (speakerid === this.id) {
                this.classList.remove('hide');
            }
            else
            {
                this.classList.add('hide');
            }
        }
    }
    
    // register the custom element
    customElements.define('no-fluff', NoFluff);
    customElements.define('no-fluff-repeat', NoFluffRepeat);
    customElements.define('no-fluff-speaker', NoFluffSpeaker);
    
    document.querySelector('no-fluff').iterateNodes(undefined,
        { title: "Create Your Own JS Framework", description: "Here are some people:" });
    
    window.addEventListener('hashchange', hashChanged, false);
    function hashChanged (e) {
        let hash = location.hash;
        let ourid = hash.substr(1);
        let speaker = document.getElementById(ourid);
        if (speaker === null) { return; }
        for (let i = 0; i < speaker.parentNode.childNodes.length; i++) {
            let currentNode = speaker.parentNode.childNodes[i];
            if (currentNode.nodeType === Node.ELEMENT_NODE) {
                if (currentNode === speaker) {
                    currentNode.classList.remove('hide');
                }
                else
                {
                    currentNode.classList.add('hide');
                }
            }
        }
    }
    
    setTimeout(function() {
        hashChanged();
    },1000);

    
}());
