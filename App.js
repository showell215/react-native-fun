/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";
import RouteView from "./components/RouteView";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

// type Props = {};
export default class App extends Component {
  state = {
    count: 0
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textView}>
          <Text>Some info about the next stop</Text>
          <Text>{this.state.count}</Text>
          <Button title='Increase' onPress={() => this.setState({count: this.state.count + 1})}></Button>
        </View>
        <RouteView style={styles.routeView} />
        {/* <View style={{width: '100%', height: '50%', backgroundColor: 'blue'}}></View> */}
        {/* <View style={{width: '100%', height: '50%', backgroundColor: 'red'}}></View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  textView: {
    // border: '2px solid blue',
    borderColor: 'blue',
    borderStyle: 'solid',
    borderWidth: 4,
    padding: 50,
    height: '50%',
    width: '100%',
    backgroundColor: 'transparent'
    // flex: 1
  },
  routeView: {
    borderColor: 'red',
    borderStyle: 'solid',
    borderWidth: 4,
    // border: '2px solid blue',
    position: "relative",
    // flex: 1
    height: '50%',
    width: '100%'
  }
});
