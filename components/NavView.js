import React from 'react';
import { StyleSheet, View, Text } from "react-native";
import {WebView} from 'react-native-webview';

function NavView ({styleProp, directions }) {
    // example
    const step = directions.legs && directions.legs[0].steps[0].html_instructions;

    return (
        <View style={styleProp}> 
            {/* Wow, this is ugly. Need to investigate proper styling of webview components */}
            {/* NOTE: Alternate option: HTML-native parser https://www.npmjs.com/package/react-native-render-html */}
            <WebView source={{html:`${step}<style>html { font-size: 100px }</style>`}} ></WebView> 
        </View>
    )
}

export default NavView;

