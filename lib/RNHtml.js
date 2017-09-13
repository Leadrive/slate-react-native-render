import * as React from 'react';
import logger from 'slate-dev-logger';
import { Node } from 'slate';
import { Record } from 'immutable';
const String = new Record({
    kind: 'string',
    text: ''
});
/**
 * A default `parseHtml` option using the native `DOMParser`.
 *
 * @param {String} html
 * @return {Object}
 */
function defaultParseHtml(html) {
    if (typeof DOMParser == 'undefined') {
        throw new Error('The native `DOMParser` global which the `Html` serializer uses by default is not present in this environment. You must supply the `options.parseHtml` function instead.');
    }
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    // Unwrap from <html> and <body>.
    const fragment = parsed.childNodes[0].childNodes[1];
    return fragment;
}
export default class RNHtml {
    /**
     * Create a new serializer with `rules`.
     *
     * @param {Object} options
     *   @property {Array} rules
     *   @property {String|Object|Block} defaultBlock
     *   @property {Function} parseHtml
     */
    constructor(options, textRule = null) {
        this.rules = [];
        /**
         * Serialize a `state` object into an HTML string.
         *
         * @param {State} state
         * @param {Object} options
         *   @property {Boolean} render
         * @return {String|Array}
         */
        this.serialize = (state, options) => {
            const { document } = state;
            const elements = document.nodes.map(this.serializeNode);
            if (options.render === false) {
                return elements;
            }
            else {
                /*
                let ReactDOMServer = require('react-dom/server');
                const html = ReactDOMServer.renderToStaticMarkup(<body>{elements}</body>)
                const inner = html.slice(6, -7)
                return inner*/
            }
        };
        /**
         * Serialize a `node`.
         *
         * @param {Node} node
         * @return {String}
         */
        this.serializeNode = (node) => {
            if (node.kind == 'text') {
                const ranges = node.getRanges();
                return ranges.map(this.serializeRange);
            }
            const children = node.nodes.map(this.serializeNode);
            for (let i = 0; i < this.rules.length; i++) {
                const rule = this.rules[i];
                if (!rule.serialize)
                    continue;
                const ret = rule.serialize(node, children);
                if (ret)
                    return addKey(ret);
            }
            throw new Error(`No serializer defined for node of type "${node.type}".`);
        };
        /**
         * Serialize a `range`.
         *
         * @param {Range} range
         * @return {String}
         */
        this.serializeRange = (range) => {
            const string = new String({ text: range.text });
            const text = this.serializeString(string);
            return range.marks.reduce((children, mark) => {
                for (let i = 0; i < this.rules.length; i++) {
                    const rule = this.rules[i];
                    if (!rule.serialize)
                        continue;
                    const ret = rule.serialize(mark, children);
                    if (ret)
                        return addKey(ret);
                }
                throw new Error(`No serializer defined for mark of type "${mark.type}".`);
            }, text);
        };
        /**
         * Serialize a `string`.
         *
         * @param {String} string
         * @return {String}
         */
        this.serializeString = (string) => {
            for (let i = 0; i < this.rules.length; i++) {
                const rule = this.rules[i];
                if (!rule.serialize)
                    continue;
                const ret = rule.serialize(string, string.text);
                if (ret)
                    return ret;
            }
        };
        let { defaultBlock = 'paragraph', parseHtml = defaultParseHtml, rules = [], } = options;
        if (options.defaultBlockType) {
            logger.deprecate('0.23.0', 'The `options.defaultBlockType` argument of the `Html` serializer is deprecated, use `options.defaultBlock` instead.');
            defaultBlock = options.defaultBlockType;
        }
        defaultBlock = Node.createProperties(defaultBlock);
        this.rules = rules;
        if (textRule) {
            this.rules.push(textRule);
        }
        this.defaultBlock = defaultBlock;
        this.parseHtml = parseHtml;
    }
}
/**
 * Add a unique key to a React `element`.
 *
 * @param {Element} element
 * @return {Element}
 */
let key = 0;
function addKey(element) {
    return React.cloneElement(element, { key: key++ });
}
//# sourceMappingURL=RNHtml.js.map