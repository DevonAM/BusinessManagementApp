var express = require("express");
var router = express.Router();
var fs = require("fs");
var cF = "./data/customers.json";
var customers = JSON.parse(fs.readFileSync(cF));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { data: { customerData: customers } });
});

/* GET customer data. */
router.get("/customerData", function (req, res, next) {
  res.send(JSON.stringify(customers));
});

/* POST an edited customer. */
router.post("/edit", function (req, res, next) {
  console.log("hello from the muh fucking post");
  // res.send(JSON.stringify(customers));
  console.log(req.body);
  let edited = JSON.parse(req.body);
  writeCustomers(edited);
  //send updated customers list
  res.send(JSON.stringify(customers));
});

function writeCustomers(newObj) {
  customers = JSON.parse(fs.readFileSync(cF));
  customers.push(newObj);
  console.log(newObj);
  console.log(customers);
  fs.writeFileSync(cF, JSON.stringify(customers));
  console.log("wrote");
}

module.exports = router;
