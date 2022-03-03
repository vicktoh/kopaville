import React, {FC} from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview' 

type PDFViewerProps = {
    width: number;
    uri: string;
}

export const PDFViewer: FC<PDFViewerProps> = ({ width, uri })=>{
    return(
        <View style = {{ width, height: 4/3 * width}}>
            <WebView style={{flex: 1}} source = {{uri}} />
    </View>
    )
}