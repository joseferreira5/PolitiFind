// var db = require("../models");
var got = require("got");
require("dotenv");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index");
  });
  app.get("/results", function(req, res, next) {
    var userAddress = req.query.userAddress;
    // Get local candidates
    got(
      "https://www.googleapis.com/civicinfo/v2/voterinfo?address=" +
        userAddress +
        "&electionId=2000&officialOnly=true&returnAllAvailableData=true&key=" +
        process.env.CIVIC_KEY,
      { json: true }
    )
      .then(function(response) {
        var body = response.body;
        var results = {
          candidates: body.contests ? body.contests[0].candidates : [],
          pollingLocations: body.pollingLocations,
          contests: body.contests[0],
          election: body.election,
          apiKey: process.env.CIVIC_KEY
        };
        res.render("results", { results: results });
      })
      .catch(function(e) {
        console.error(e);
        res.redirect("/?error");
      });
    next();
  });

  app.get("/results", function(req, res) {
    var userAddress = req.query.userAddress;
    got(
      "https://www.googleapis.com/civicinfo/v2/representatives?address=" +
        userAddress +
        "&key=" +
        process.env.CIVIC_KEY,
      { json: true }
    )
      .then(function(response) {
        var body = response.body;
        console.log("body");
        var reps = {
          repName: body.name,
          imageUrl: body.photoUrl,
          politicalParty: body.party,
          apiKey: process.env.CIVIC_KEY
        };
        res.render("reps", { reps: reps });
      })
      .catch(function(e) {
        console.error(e);
      });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
