import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const MarkerColors = {
  ORIGIN: "#2ab850",
  DESTINATION: "#f00726",
  WAYPOINT: "#103fcc"
};

const POLYLINE_STROKE_COLOR = "rgba(119, 35, 203, 0.70)";
const POLYLINE_STROKE_COLOR_ALT = "rgba(119, 35, 203, 0.25)";

function RouteView({
  styleProp,
  userLatitude,
  userLongitude,
  route,
  isLocationSet,
  routeCoordinates
}) {
  return isLocationSet ? (
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
      style={styleProp}
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
            coordinates={routeCoordinates}
            strokeWidth={6}
            lineCap="round"
            lineJoin="round"
            geodesic
            strokeColor="#FFF"
            strokeColors={
              // test dynamically changing the stroke color based on some value
              routeCoordinates.map(coord =>
                coord && coord.isVisited
                  ? POLYLINE_STROKE_COLOR_ALT
                  : POLYLINE_STROKE_COLOR
              )
            }
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

const styles = StyleSheet.create({
  map: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    borderColor: "blue",
    borderStyle: "solid",
    borderWidth: 4
  }
});

export default RouteView;
