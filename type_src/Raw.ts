import Block from 'slate/lib/models/block'
import Character from 'slate/lib/models/character'
import Document from 'slate/lib/models/document'
import Inline from 'slate/lib/models/inline'
import Mark from 'slate/lib/models/mark'
import Node from 'slate/lib/models/node'
import Selection from 'slate/lib/models/selection'
import State from 'slate/lib/models/state'
import Text from 'slate/lib/models/text'
interface RawSerializeOptions{
    terse:boolean
}

export const Raw = {

    /**
     * Deserialize a JSON `object`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {State}
     */

    deserialize(object, options) {
        const state = Raw.deserializeState(object, options)
        return state
    },

    /**
     * Deserialize a JSON `object` representing a `Block`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {Block}
     */

    deserializeBlock(object, options = {} as RawSerializeOptions) {
        if (options.terse) object = Raw.untersifyBlock(object)

        const nodes = Node.createList(object.nodes.map(node => Raw.deserializeNode(node, options)))
        const block = Block.create({
            key: object.key,
            type: object.type,
            data: object.data,
            isVoid: object.isVoid,
            nodes,
        })

        return block
    },

    /**
     * Deserialize a JSON `object` representing a `Document`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {Document}
     */

    deserializeDocument(object, options) {
        const nodes = object.nodes.map(node => Raw.deserializeNode(node, options))
        const document = Document.create({
            key: object.key,
            data: object.data,
            nodes,
        })

        return document
    },

    /**
     * Deserialize a JSON `object` representing an `Inline`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {Inline}
     */

    deserializeInline(object, options = {} as RawSerializeOptions) {
        if (options.terse) object = Raw.untersifyInline(object)

        const nodes = object.nodes.map(node => Raw.deserializeNode(node, options))
        const inline = Inline.create({
            key: object.key,
            type: object.type,
            data: object.data,
            isVoid: object.isVoid,
            nodes,
        })

        return inline
    },

    /**
     * Deserialize a JSON `object` representing a `Mark`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {Mark}
     */

    deserializeMark(object, options) {
        const mark = Mark.create(object)
        return mark
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

    deserializeRange(object, options = {} as RawSerializeOptions) {
        if (options.terse) object = Raw.untersifyRange(object)
        const marks = Mark.createSet(object.marks.map(mark => Raw.deserializeMark(mark, options)))
        const chars = object.text.split('')
        const characters = Character.createList(chars.map(text => ({ text, marks })))
        return characters
    },

    /**
     * Deserialize a JSON `object` representing a `Selection`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {State}
     */

    deserializeSelection(object, options = {} as RawSerializeOptions) {
        const selection = Selection.create({
            anchorKey: object.anchorKey,
            anchorOffset: object.anchorOffset,
            focusKey: object.focusKey,
            focusOffset: object.focusOffset,
            isFocused: object.isFocused,
        })

        return selection
    },

    /**
     * Deserialize a JSON `object` representing a `State`.
     *
     * @param {Object} object
     * @param {Object} options (optional)
     * @return {State}
     */

    deserializeState(object, options = {} as RawSerializeOptions) {
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

    deserializeText(object, options = {} as RawSerializeOptions) {
        if (options.terse) object = Raw.untersifyText(object)

        const characters = object.ranges.reduce((list, range) => {
            return list.concat(Raw.deserializeRange(range, options))
        }, Character.createList())

        const text = Text.create({
            key: object.key,
            characters,
        })

        return text
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

