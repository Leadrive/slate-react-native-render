

import Block from '../node_modules/slate/lib/models/block'
import Character from '../node_modules/slate/lib/models/character'
import Document from '../node_modules/slate/lib/models/document'
import Inline from '../node_modules/slate/lib/models/inline'
import Mark from '../node_modules/slate/lib/models/mark'
import Selection from '../node_modules/slate/lib/models/selection'
import State from '../node_modules/slate/lib/models/state'
import Text from '../node_modules/slate/lib/models/text'


interface RawSerializeOptions{
    terse:boolean
}
export const Raw = {

    /**
     * Deserialize a JSON `object`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {Block}
     */

    deserialize(object, options) {
        return Raw.deserializeState(object, options)
    },

    /**
     * Deserialize a JSON `object` representing a `Block`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {Block}
     */

    deserializeBlock(object, options:RawSerializeOptions = {} as RawSerializeOptions) {
        if (options.terse) object = Raw.untersifyBlock(object);
        return Block.create({
            key: object.key,
            type: object.type,
            data: object.data,
            isVoid: object.isVoid,
            nodes: Block.createList(object.nodes.map((node) => {
                return Raw.deserializeNode(node, options)
            }))
        })
    },

    /**
     * Deserialize a JSON `object` representing a `Document`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {Document}
     */

    deserializeDocument(object, options) {
        return Document.create({
            key: object.key,
            data: object.data,
            nodes: Block.createList(object.nodes.map((node) => {
                return Raw.deserializeNode(node, options)
            }))
        })
    },

    /**
     * Deserialize a JSON `object` representing an `Inline`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {Inline}
     */

    deserializeInline(object, options:RawSerializeOptions = {} as RawSerializeOptions) {
        if (options.terse) object = Raw.untersifyInline(object)

        return Inline.create({
            key: object.key,
            type: object.type,
            data: object.data,
            isVoid: object.isVoid,
            nodes: Inline.createList(object.nodes.map((node) => {
                return Raw.deserializeNode(node, options)
            }))
        })
    },

    /**
     * Deserialize a JSON `object` representing a `Mark`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {Mark}
     */

    deserializeMark(object, options) {
        return Mark.create(object)
    },

    /**
     * Deserialize a JSON object representing a `Node`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {Node}
     */

    deserializeNode(object, options) {
        switch (object.kind) {
            case 'block': return Raw.deserializeBlock(object, options)
            case 'document': return Raw.deserializeDocument(object, options)
            case 'inline': return Raw.deserializeInline(object, options)
            case 'text': return Raw.deserializeText(object, options)
            default: {
                throw new Error(`Unrecognized node kind "${object.kind}".`)
            }
        }
    },

    /**
     * Deserialize a JSON `object` representing a `Range`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {List<Character>}
     */

    deserializeRange(object, options:RawSerializeOptions = {} as RawSerializeOptions) {
        if (options.terse) object = Raw.untersifyRange(object)

        const marks = Mark.createSet(object.marks.map((mark) => {
            return Raw.deserializeMark(mark, options)
        }))

        return Character.createList(object.text
            .split('')
            .map((char) => {
                return Character.create({
                    text: char,
                    marks,
                })
            }))
    },

    /**
     * Deserialize a JSON `object` representing a `Selection`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {State}
     */

    deserializeSelection(object, options = {}) {
        return Selection.create({
            anchorKey: object.anchorKey,
            anchorOffset: object.anchorOffset,
            focusKey: object.focusKey,
            focusOffset: object.focusOffset,
            isFocused: object.isFocused,
        })
    },

    /**
     * Deserialize a JSON `object` representing a `State`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {State}
     */

    deserializeState(object, options:RawSerializeOptions = {} as RawSerializeOptions) {
        if (options.terse) object = Raw.untersifyState(object)

        const document = Raw.deserializeDocument(object.document, options)
        let selection

        if (object.selection != null) {
            selection = Raw.deserializeSelection(object.selection, options)
        }

        return State.create({ data: object.data, document, selection }, options)
    },

    /**
     * Deserialize a JSON `object` representing a `Text`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {Text}
     */

    deserializeText(object, options:RawSerializeOptions = {} as RawSerializeOptions) {
        if (options.terse) object = Raw.untersifyText(object)

        return Text.create({
            key: object.key,
            characters: object.ranges.reduce((characters, range) => {
                return characters.concat(Raw.deserializeRange(range, options))
            }, Character.createList())
        })
    },

    untersifyBlock(object) {
        if (object.isVoid || !object.nodes || !object.nodes.length) {
            return {
                key: object.key,
                data: object.data,
                kind: object.kind,
                type: object.type,
                isVoid: object.isVoid,
                nodes: [
                    {
                        kind: 'text',
                        text: ''
                    }
                ]
            }
        }

        return object
    },

    /**
     * Convert a terse representation of a inline `object` into a non-terse one.
     *
     * @param {Object} object
     * @return {Object}
     */

    untersifyInline(object) {
        if (object.isVoid || !object.nodes || !object.nodes.length) {
            return {
                key: object.key,
                data: object.data,
                kind: object.kind,
                type: object.type,
                isVoid: object.isVoid,
                nodes: [
                    {
                        kind: 'text',
                        text: ''
                    }
                ]
            }
        }

        return object
    },

    /**
     * Convert a terse representation of a range `object` into a non-terse one.
     *
     * @param {Object} object
     * @return {Object}
     */

    untersifyRange(object) {
        return {
            kind: 'range',
            text: object.text,
            marks: object.marks || []
        }
    },


    /**
     * Convert a terse representation of a state `object` into a non-terse one.
     *
     * @param {Object} object
     * @return {Object}
     */

    untersifyState(object) {
        if (object.document) {
            return {
                kind: 'state',
                data: object.data,
                document: object.document,
                selection: object.selection,
            }
        }

        return {
            kind: 'state',
            document: {
                data: object.data,
                key: object.key,
                kind: 'document',
                nodes: object.nodes
            }
        }
    },

    /**
     * Convert a terse representation of a text `object` into a non-terse one.
     *
     * @param {Object} object
     * @return {Object}
     */

    untersifyText(object) {
        if (object.ranges) return object

        return {
            key: object.key,
            kind: object.kind,
            ranges: [{
                text: object.text,
                marks: object.marks || []
            }]
        }
    }
};

