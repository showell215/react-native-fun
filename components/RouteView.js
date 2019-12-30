import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { decode as polyLineDecode } from "@mapbox/polyline";
import MapView, { Marker, Polyline } from "react-native-maps";
import haversine from "haversine";

const SERVER_HOST = "http://localhost:3000";
const MarkerColors = {
  ORIGIN: "#2ab850",
  DESTINATION: "#f00726",
  WAYPOINT: "#103fcc"
};

class RouteView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userLatitude: "",
      userLongitude: "",
      routeCoordinates: [],
      route: null,
      error: null,
      isLocationSet: false
    };
  }

  componentDidMount() {
    this.watchID = navigator.geolocation.watchPosition(
      this.handlePositionUpdate,
      () => {},
      { distanceFilter: 10 }
    );
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleInitialPosition,
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  handleInitialPosition = position => {
    this.setState({
      userLatitude: position.coords.latitude,
      userLongitude: position.coords.longitude,
      isLocationSet: true
    });
    this.getDirections();
  };

  handlePositionUpdate = position => {
    const { latitude, longitude } = position.coords;

    const waypointWithinThreshold =
      this.state.route &&
      this.state.route.waypoints.find(waypoint => {
        const distance = haversine(
          { latitude, longitude },
          { latitude: waypoint.latitude, longitude: waypoint.longitude },
          { unit: "meter" }
        );

        return distance < 20;
      });
    waypointWithinThreshold &&
      console.log("Within 20m of waypoint", waypointWithinThreshold);
  };

  getDirections = async () => {
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
  };

  render() {
    const { userLatitude, userLongitude, route } = this.state;

    return this.state.isLocationSet ? (
      <MapView
        mapType="mutedStandard"
        followsUserLocation
        showsUserLocation
        showsMyLocationButton={false}
        showsTraffic={false}
        loadingEnabled
        camera={{
          center: {
            latitude: userLatitude,
            longitude: userLongitude
          },
          pitch: 0,
          heading: 0,
          altitude: 1000,
          zoom: 50
        }}
        style={{
          ...styles.map
        }}
      >
        {route && (
          <>
            {route.waypoints.map((waypoint, idx) => (
              <Marker
                pinColor={
                  idx === 0
                    ? MarkerColors.ORIGIN
                    : idx === route.waypoints.length - 1
                    ? MarkerColors.DESTINATION
                    : MarkerColors.WAYPOINT
                }
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
  map: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    borderColor: 'blue',
    borderStyle: 'solid',
    borderWidth: 4,
  }
});

export default RouteView;
