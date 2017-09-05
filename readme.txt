Slate.js(https://github.com/ianstormtaylor/slate) requires react-dom, which is a headache if you want to use the Html serializers to render react native views. This package removes the requirement of react-dom to make Html and Raw serializers compatiable with react-native.

If you store the entire editor state to the database, these two modified serializers allow you to render the views in react native.

Example:

````
import {RNHtml} from "../src/RNHtml";
import {Raw} from '../src/Raw'

const comment = {
                  "document": {
                    "data": {},
                    "kind": "document",
                    "nodes": [
                      {
                        "data": {},
                        "kind": "block",
                        "isVoid": false,
                        "type": "numbered-list",
                        "nodes": [
                          {
                            "data": {},
                            "kind": "block",
                            "isVoid": false,
                            "type": "list-item",
                            "nodes": [
                              {
                                "kind": "text",
                                "ranges": [
                                  {
                                    "kind": "range",
                                    "text": "gdfgdffgdfdgfdg",
                                    "marks": []
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            "data": {},
                            "kind": "block",
                            "isVoid": false,
                            "type": "list-item",
                            "nodes": [
                              {
                                "kind": "text",
                                "ranges": [
                                  {
                                    "kind": "range",
                                    "text": "gfdgfdgfddfggdffdg",
                                    "marks": []
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  "kind": "state"
                }

const htmlSerializer = new RNHtml(rules);
export class RichTextComponent extends React.Component {

    public render() {
        let editorState = Raw.deserialize(JSON.parse(comment), {terse: true});
        let views = htmlSerializer.serialize(editorState);
        return  <View> {comment}</View>
    }
}
````