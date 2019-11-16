import React, { Component } from "react";
import { AppRegistry, StyleSheet, Dimensions, View, Text } from "react-native";
import { decode as polyLineDecode } from "@mapbox/polyline";
import MapView from "react-native-maps";

const SERVER_HOST = "http://localhost:3000";

class LocationA extends Component {
  constructor(props) {
    console.log("constructor running");
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      coords: [],
      x: "false",
      destLatitude: "35.9921676", // durham coop
      destLongitude: "-78.9134648",
      error: null,
      isLocationSet: false,
      isMapReady: true // TODO set this dynamically from onMapReady fn
    };
  }
  componentDidMount() {
    console.log("component did mount. State is", this.state);
  }

  componentWillMount() {
    console.log("component will mount. State is", this.state);
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("got current position:", position.coords);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLocationSet: true
        });
        this.getDirections(
          `${position.coords.latitude},${position.coords.longitude}`,
          `${this.state.destLatitude},${this.state.destLongitude}`
        );
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );
  }
  // TODO: this isn't being called for some reason
  onMapReady = () => {
    console.log("map is ready");
    this.setState({
      isMapReady: true
    });
  };
  //35.987327,-78.906104 35.9921676,-78.9134648
  async getDirections(startLoc, destinationLoc) {
    try {
      const resp = await fetch(
        `${SERVER_HOST}/api/directions?startLoc=${startLoc}&destinationLoc=${destinationLoc}&mode=walking&waypoints=Durham+Bulls+Athletic+Park,+Blackwell+Street,+Durham,+NC`
      );
      const respJson = await resp.json();
      console.log(respJson);
      const points = polyLineDecode(
        respJson.routes[0].overview_polyline.points
      );
      const coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        };
      });
      this.setState({ coords: coords });
      return coords;
    } catch (error) {
      alert(error);
      return error;
    }
  }

  render() {
    const {
      latitude,
      longitude,
      destLatitude,
      destLongitude,
      error
    } = this.state;

    console.log("render", latitude + ", " + longitude);

    return this.state.isLocationSet ? (
      <MapView
        showsUserLocation={true}
        onMapReady={this.onMapReady}
        style={{
          ...styles.map,
          display: this.state.isMapReady ? "flex" : "none"
        }}
        initialRegion={{
          latitude: Number(latitude),
          longitude: Number(longitude),
          latitudeDelta: 0.015,
          longitudeDelta: 0.015
        }}
      >
        {Boolean(latitude) && Boolean(longitude) && (
          <MapView.Marker
            coordinate={{
              latitude: Number(latitude),
              longitude: Number(longitude)
            }}
            title={"Your Location"}
          />
        )}
        {Boolean(destLatitude) && Boolean(destLongitude) && (
          <MapView.Marker
            coordinate={{
              latitude: Number(destLatitude),
              longitude: Number(destLongitude)
            }}
            title={"Destination"}
          />
        )}
        <MapView.Polyline
          coordinates={this.state.coords}
          strokeWidth={3}
          strokeColor="rgba(119, 35, 203, 0.72)"
        />
      </MapView>
    ) : (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default LocationA;
