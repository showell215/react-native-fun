import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { decode as polyLineDecode } from "@mapbox/polyline";
import MapView, { Marker, Polyline } from "react-native-maps";
import haversine from "haversine";

const SERVER_HOST = "http://localhost:3000";

class RouteView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userLatitude: "",
      userLongitude: "",
      routeCoordinates: [],
      route: null,
      error: null,
      isLocationSet: false,
      isMapReady: true // TODO set this dynamically from onMapReady fn
    };
  }
  componentDidMount() {
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;

        console.log("NEW POSITION", latitude, longitude);
      },
      () => {},
      { distanceFilter: 10 }
    );
  }

  componentWillMount() {
    console.log("component will mount. State is", this.state);
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLatitude: position.coords.latitude,
          userLongitude: position.coords.longitude,
          error: null,
          isLocationSet: true
        });
        this.getDirections();
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onMapReady = () => {
    console.log("map is ready");
    this.setState({
      isMapReady: true
    });
  };

  async getDirections() {
    try {
      const resp = await fetch(`${SERVER_HOST}/api/directions`);
      const { directions, route, errMessage } = await resp.json();

      if (!resp.ok) {
        const err = new Error(errMessage);
        err.statusCode = resp.statusCode;
        throw err;
      }

      const points = polyLineDecode(
        directions.routes[0].overview_polyline.points
      );

      const coords = points.map(point => {
        return {
          latitude: point[0],
          longitude: point[1]
        };
      });
      this.setState({ routeCoordinates: coords, route });
    } catch (error) {
      console.error(error);
      alert("check the console, dummy");
    }
  }

  render() {
    const { userLatitude, userLongitude, route } = this.state;

    return this.state.isLocationSet ? (
      <MapView
        showsUserLocation={true}
        onMapReady={this.onMapReady}
        style={{
          ...styles.map,
          display: this.state.isMapReady ? "flex" : "none"
        }}
        initialRegion={{
          latitude: Number(userLatitude),
          longitude: Number(userLongitude),
          latitudeDelta: 0.015,
          longitudeDelta: 0.015
        }}
      >
        {route && (
          <>
            <Marker
              coordinate={{
                latitude: Number(route.start.latitude),
                longitude: Number(route.start.longitude)
              }}
              title={route.start.name}
            />
            <Marker
              coordinate={{
                latitude: Number(route.end.latitude),
                longitude: Number(route.end.longitude)
              }}
              title={route.end.name}
            />
            {route.waypoints.map(waypoint => (
              <Marker
                key={waypoint.id}
                coordinate={{
                  latitude: Number(waypoint.latitude),
                  longitude: Number(waypoint.longitude)
                }}
                title={waypoint.name}
              />
            ))}
            <Polyline
              coordinates={this.state.routeCoordinates}
              strokeWidth={3}
              strokeColor="rgba(119, 35, 203, 0.72)"
            />
          </>
        )}
      </MapView>
    ) : (
      <View>
        <Text>Loading....</Text>
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

export default RouteView;
