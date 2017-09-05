import * as React from 'react';
let immutable = require('immutable');
let StringRecord = new immutable.Record({
    kind: 'string',
    text: ''
});
let key = 0;
function addKey(element) {
    return React.cloneElement(element, { key: key++ });
}
export class RNHtml {
    constructor(rules) {
        this.rules = [];
        this.serializeNode = (node) => {
            if (node.kind == 'text') {
                let ranges = node.getRanges();
                return ranges.map(this.serializeRange);
            }
            let children = node.nodes.map(this.serializeNode);
            for (let i = 0; i < this.rules.length; i++) {
                let rule = this.rules[i];
                if (!rule.serialize)
                    continue;
                let ret = rule.serialize(node, children);
                if (ret)
                    return addKey(ret);
            }
            throw new Error('No serializer defined for node of type "' + node.type + '".');
        };
        this.serializeRange = (range) => {
            let string = new StringRecord({ text: range.text });
            let text = this.serializeString(string);
            return range.marks.reduce((children, mark) => {
                for (let i = 0; i < this.rules.length; i++) {
                    let rule = this.rules[i];
                    if (!rule.serialize)
                        continue;
                    let ret = rule.serialize(mark, children);
                    if (ret)
                        return addKey(ret);
                }
                throw new Error('No serializer defined for mark of type "' + mark.type + '".');
            }, text);
        };
        this.serializeString = (string) => {
            for (let i = 0; i < this.rules.length; i++) {
                let rule = this.rules[i];
                if (!rule.serialize)
                    continue;
                let ret = rule.serialize(string, string.text);
                if (ret)
                    return ret;
            }
        };
        this.rules = [].concat(this._toConsumableArray(rules), [{}]);
    }
    _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            let arr2 = Array(arr.length);
            for (let i = 0; i < arr.length; i++) {
                arr2[i] = arr[i];
            }
            return arr2;
        }
        else {
            return Array.from(arr);
        }
    }
    serialize(state) {
        let document = state.document;
        let elements = document.nodes.map(this.serializeNode);
        console.log(elements);
        return elements;
    }
}
//# sourceMappingURL=RNHtml.js.map