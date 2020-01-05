# What is this?

Just me playing around with React Native with the Google Maps and MapBox APIs.

## To run

Set gmaps API key

`npm run start:server`
=> starts Express server

`npm run serve:ios`
=> opens xCode simulator for iPhone
=> opens terminal running the Metro Bundler
=> terminal used to run npm stops and hands off to new terminal

### To simulate Location route
`npm run serve ios`
Open XCode project
Set destination to appropriate Simulator or Device
Start Xcode build
In XCode, `Debug -> Simulate location`

## Notes

Hey dummy, you saved a bunch of tabs in your bookmarks related to this project.

### How it works

1. Get current location data from device
1. react-native-maps shows gmaps interface
1. Google directions API gives directions in the form of "polylines"
1. MapBox polyline library decodes polyline strings to overlay onto map

### Issues I've faced and how to resolve them

#### error Could not find iPhone X simulator. Run CLI with --verbose flag for more details.

1. Open Xcode
2. Press Command+Shift+2 it will open Devices & Simulators option.
3. Go to Simulators tab and press + icon on the left bottom and add iPhone X or other device, based on error message

## Debugging

1. In Simulator "Hardware" menu, press "Shake Gesture"
2. Select "Debug JS Remotely"
3. In the browser that opens, do 'inspect'

## To-dos

Trigger something when user reaches a waypoint

Use `polylines` from each step object for better accuracy
- `.legs` represents waypoints
- `legs.steps` represents steps in tha waypoint
- `legs.steps.polyline.points` has the polyline


Display info for current leg and next leg
    For each step in the leg, display next step
    When user reaches within 2m of step dest, go to next step
When use reaches within 5m of leg destination, go to next
