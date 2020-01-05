import React, {Fragment, Component} from 'react';
import { StyleSheet, View } from "react-native";
import haversine from "haversine";
import { decode as polyLineDecode } from "@mapbox/polyline";

import RouteView from "./RouteView";
import NavView from "./NavView";

const SERVER_HOST = "http://localhost:3000";

export default class Tour extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          userLatitude: "",
          userLongitude: "",
          routeCoordinates: [],
          route: null,
          error: null,
          isLocationSet: false,
          directions: {}
        };
      }
    
    
      componentDidMount() {
        console.log(this.polyLineStrokeColor)
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
    
        //   let allPoints = [];
    
        //   const allPolylines = directions.routes[0].legs.reduce((polylineArray, leg)=> {
        //     const polyLines = leg.steps.map(step => step.polyline.points);
            
        //     return polylineArray.concat(polyLines);
        //   }, []);
    
        //   console.log(allPolylines);
    
        //   allPolylines.forEach(polyLine => {
        //     allPoints = allPoints.concat(polyLineDecode(polyLine));
        //   });
    
        //   console.log(allPoints);
    
    
    
    
          const points = polyLineDecode(
            directions.routes[0].overview_polyline.points
          );
    
          const coords = points.map((point, idx) => {
            return {
              isVisited: idx < 3,  // NOTE: example. setting some points to visited to test polyline stroke color
              latitude: point[0],
              longitude: point[1]
            };
          });
          this.setState({ routeCoordinates: coords, route, directions: directions.routes[0] });
        } catch (error) {
          console.error(error);
          alert("check the console, dummy");
        }
      };
    
    render () {
        return (
            <View style={styles.container}> 
                <NavView directions={this.state.directions} styleProp={styles.halfScreen}/>
                <RouteView {...this.state} styleProp={styles.halfScreen}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
      },
        halfScreen: {
          padding: 50,
          height: '50%',
          width: '100%',
          backgroundColor: 'transparent'
        }
  });

