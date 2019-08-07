var db = require("../models");
var mockdata = require("../models/mockdata.js");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/results/", function(req, res) {
    // eslint-disable-next-line prettier/prettier
    res.render("results", {
      mockdata: name
    });
  });

  // Load example page and pass in an example by id
  app.get("/candidate/:id", function(req, res) {
    // eslint-disable-next-line prettier/prettier
    db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
