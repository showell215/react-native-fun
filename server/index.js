const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const routes = require("./routes");

app.use("/api", routes);
app.get("/", (req, res) => {
  res.status("200").send("Hello world");
});
app.listen(port, () => console.log(`Listening on port ${port}.`));
