import Block from 'slate/lib/models/block';
import Character from 'slate/lib/models/character';
import Document from 'slate/lib/models/document';
import Inline from 'slate/lib/models/inline';
import Mark from 'slate/lib/models/mark';
import Node from 'slate/lib/models/node';
import Selection from 'slate/lib/models/selection';
import State from 'slate/lib/models/state';
import Text from 'slate/lib/models/text';
export const Raw = {
    deserialize(object, options) {
        const state = Raw.deserializeState(object, options);
        return state;
    },
    deserializeBlock(object, options = {}) {
        if (options.terse)
            object = Raw.untersifyBlock(object);
        const nodes = Node.createList(object.nodes.map(node => Raw.deserializeNode(node, options)));
        const block = Block.create({
            key: object.key,
            type: object.type,
            data: object.data,
            isVoid: object.isVoid,
            nodes,
        });
        return block;
    },
    deserializeDocument(object, options) {
        const nodes = object.nodes.map(node => Raw.deserializeNode(node, options));
        const document = Document.create({
            key: object.key,
            data: object.data,
            nodes,
        });
        return document;
    },
    deserializeInline(object, options = {}) {
        if (options.terse)
            object = Raw.untersifyInline(object);
        const nodes = object.nodes.map(node => Raw.deserializeNode(node, options));
        const inline = Inline.create({
            key: object.key,
            type: object.type,
            data: object.data,
            isVoid: object.isVoid,
            nodes,
        });
        return inline;
    },
    deserializeMark(object, options) {
        const mark = Mark.create(object);
        return mark;
    },
    deserializeNode(object, options) {
        switch (object.kind) {
            case 'block': return Raw.deserializeBlock(object, options);
            case 'document': return Raw.deserializeDocument(object, options);
            case 'inline': return Raw.deserializeInline(object, options);
            case 'text': return Raw.deserializeText(object, options);
            default: {
                throw new Error(`Unrecognized node kind "${object.kind}".`);
            }
        }
    },
    deserializeRange(object, options = {}) {
        if (options.terse)
            object = Raw.untersifyRange(object);
        const marks = Mark.createSet(object.marks.map(mark => Raw.deserializeMark(mark, options)));
        const chars = object.text.split('');
        const characters = Character.createList(chars.map(text => ({ text, marks })));
        return characters;
    },
    deserializeSelection(object, options = {}) {
        const selection = Selection.create({
            anchorKey: object.anchorKey,
            anchorOffset: object.anchorOffset,
            focusKey: object.focusKey,
            focusOffset: object.focusOffset,
            isFocused: object.isFocused,
        });
        return selection;
    },
    deserializeState(object, options = {}) {
        if (options.terse)
            object = Raw.untersifyState(object);
        const document = Raw.deserializeDocument(object.document, options);
        let selection;
        if (object.selection != null) {
            selection = Raw.deserializeSelection(object.selection, options);
        }
        return State.create({ data: object.data, document, selection }, options);
    },
    deserializeText(object, options = {}) {
        if (options.terse)
            object = Raw.untersifyText(object);
        const characters = object.ranges.reduce((list, range) => {
            return list.concat(Raw.deserializeRange(range, options));
        }, Character.createList());
        const text = Text.create({
            key: object.key,
            characters,
        });
        return text;
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
            };
        }
        return object;
    },
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
            };
        }
        return object;
    },
    untersifyRange(object) {
        return {
            kind: 'range',
            text: object.text,
            marks: object.marks || []
        };
    },
    untersifyState(object) {
        if (object.document) {
            return {
                kind: 'state',
                data: object.data,
                document: object.document,
                selection: object.selection,
            };
        }
        return {
            kind: 'state',
            document: {
                data: object.data,
                key: object.key,
                kind: 'document',
                nodes: object.nodes
            }
        };
    },
    untersifyText(object) {
        if (object.ranges)
            return object;
        return {
            key: object.key,
            kind: object.kind,
            ranges: [{
                    text: object.text,
                    marks: object.marks || []
                }]
        };
    }
};
//# sourceMappingURL=Raw.js.map