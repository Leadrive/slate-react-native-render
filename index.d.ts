//export {Raw} from './lib/Raw'
//export {RNHtml} from './lib/RNHtml'

declare module "slate-react-native-render" {
    export class RNHtml {
        serialize(state:any)
        constructor(rules:any[])
    }

    export const Raw:{
        deserialize:(object:any, options:{})=>{}
    }
}