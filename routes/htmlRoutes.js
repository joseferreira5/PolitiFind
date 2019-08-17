// var db = require("../models");
var got = require("got");
var moment = require("moment");
require("dotenv");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  // Loads results page
  app.get("/results", function(req, res) {
    var userAddress = req.query.userAddress;
    got(
      "https://www.googleapis.com/civicinfo/v2/voterinfo?address=" +
        userAddress +
        "&electionId=2000&officialOnly=true&returnAllAvailableData=true&key=" +
        process.env.CIVIC_KEY,
      { json: true }
    )
      .then(function(res1) {
        got(
          "https://www.googleapis.com/civicinfo/v2/representatives?address=" +
            userAddress +
            "&key=" +
            process.env.CIVIC_KEY,
          { json: true }
        ).then(function(res2) {
          var local = res1.body;
          var reps = res2.body;
          var data = {
            candidates: local.contests ? local.contests[0].candidates : [],
            pollingLocations: local.pollingLocations[0].address,
            contests: local.contests[0],
            election: local.election,
            electionDate: moment(local.election.electionDay).format(
              "MMMM Do, YYYY"
            ),
            officials: reps.officials,
            offices: reps.offices.name
          };
          res.render("results", { data: data });
        });
      })
      .catch(function(e) {
        console.error(e);
        res.redirect("/?error");
      });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
