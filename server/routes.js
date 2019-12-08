const { Router } = require("express");
const got = require("got");
const router = Router();
const exampleRoute = require("./data/waypoint-sets/durham/downtown.json");
const DIRECTIONS_MODE = "walking";

let cachedDirectionsResponse;

router.get("/directions", async (req, res) => {
  // for now just get a static json file containing an example route

  const route = exampleRoute;
  // timeout to test loading screen on UI
  // await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // TODO cache this in memory to keep my Google quota down
    let response;

    if (cachedDirectionsResponse) {
      console.log("USING CACHED DIRETIONS")
      response = cachedDirectionsResponse;
    } else {
      response = await got(
        "https://maps.googleapis.com/maps/api/directions/json",
        {
          method: "GET",
          json: true,
          query: {
            key: process.env.GMAPS_API_KEY,
            origin: `${route.start.latitude},${route.start.longitude}`,
            destination: `${route.end.latitude},${route.end.longitude}`,
            mode: DIRECTIONS_MODE,
            waypoints: route.waypoints.reduce((prev, cur, index) => {
              return (
                // TODO: make this a function
                prev +
                (index > 0 && index < route.waypoints.length ? "|" : "") +
                `${cur.latitude},${cur.longitude}`
              );
            }, "")
          }
        }
      );

      if (response.body.status !== "OK") {
        throw new Error(response.body.error_message);
      }

      cachedDirectionsResponse = response;
    }

    return res.status(200).json({
      route,
      directions: response.body
    });
  } catch (err) {
    console.error(err.message);
    return res.status(err.statusCode || 500).json({ errMessage: err.message });
  }
});

module.exports = router;
