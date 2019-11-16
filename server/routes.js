const { Router } = require("express");
const got = require("got");
const router = Router();

router.get("/directions", async (req, res) => {
  const { startLoc, destinationLoc, mode, waypoints } = req.query;

  try {
    const response = await got(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        method: "GET",
        json: true,
        query: {
          origin: startLoc,
          destination: destinationLoc,
          key: process.env.GMAPS_API_KEY,
          mode: mode,
          waypoints: waypoints
        }
      }
    );

    return res.status(200).json(response.body);
  } catch (err) {
    return res.sendStatus(err.statusCode || 500);
  }
});

module.exports = router;
