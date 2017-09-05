```html
<h2>Example of code</h2>

<pre>
    <div class="container">
        <div class="block two first">
            <div class="wrap">

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
        </div>
    </div>
</pre>
```
