Slate.js(https://github.com/ianstormtaylor/slate) requires react-dom, which is a headache if you want to render saved editor states into react native views with the Html serializers. This package extract the Html and Raw serializers, removes the requirement of react-dom to make them compatiable with react-native.

Example:



<pre>
    <div class="container">
     import {RNHtml} from 'slate-react-native-render';
     import {Text} from 'react-native'

     const editorStateObj = {"document":{"data":{},"kind":"document","nodes":[{"data":{},"kind":"block","isVoid":false,"type":"numbered-list","nodes":[{"data":{},"kind":"block","isVoid":false,"type":"list-item","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"gdfgdffgdfdgfdg","marks":[]}]}]},{"data":{},"kind":"block","isVoid":false,"type":"list-item","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"gfdgfdgfddfggdffdg","marks":[]}]}]}]}]},"kind":"state"}
     const rules = [
       {
         serialize(object, children) {
           if (object.kind == 'block' && object.type == 'paragraph') {
             return &lt;Text&gt;{children}&lt;/Text&gt;
           }
         }
       }
     ]
     const htmlSerializer = new RNHtml(rules);

     export class RichTextComponent extends React.Component {
         public render() {
             let editorState = State.fromJSON(JSON.parse(editorStateObj));
             let views = htmlSerializer.serialize(editorState);
             return  <View> {comment}</View>
         }
     }
    </div>
</pre>