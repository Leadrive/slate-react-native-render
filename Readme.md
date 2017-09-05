Slate.js(https://github.com/ianstormtaylor/slate) requires react-dom, which is a headache if you want to render the saved editor state into react native views with the Html serializers. This package extract the Html and Raw serializers, removes the requirement of react-dom to make them compatiable with react-native.

Example:

<pre>
    <div class="container">
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
    </div>
</pre>