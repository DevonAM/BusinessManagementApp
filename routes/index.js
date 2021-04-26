var express = require("express");
var router = express.Router();
var fs = require("fs");
var cF = "./data/customers.json";
var customers = JSON.parse(fs.readFileSync(cF));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { data: {} });
});

/* GET customer data. */
router.get("/customerData", function (req, res, next) {
  res.send(JSON.stringify(customers));
});

/* POST an edited customer. */
router.post("/edit", function (req, res, next) {
  // res.send(JSON.stringify(customers));
  // console.log(JSON.parse(req.body));

  //had to get this hacky becuase req.body was giving
  // [Object: null prototype] {
  //   '{"firstName":"Leah","lastName":" Skywalker","poolSize":"123","filterType":"Sand"}': ''
  // }
  let edited = JSON.parse(Object.keys(req.body)[0]);

  writeCustomers(edited);
  //send updated customers list
  res.send(JSON.stringify(customers));
});

/* POST a new customer. */
router.post("/add", function (req, res, next) {
  // res.send(JSON.stringify(customers));
  // console.log(JSON.parse(req.body));
  //had to get this hacky becuase req.body was giving
  // [Object: null prototype] {
  //   '{"firstName":"Leah","lastName":" Skywalker","poolSize":"123","filterType":"Sand"}': ''
  // }
  let newObj = JSON.parse(Object.keys(req.body)[0]);

  writeCustomers(newObj);
  //send updated customers list
  res.send(JSON.stringify(customers));
});
function writeCustomers(newObj) {
  newObj.id = parseFloat(newObj.id);
  newObj.poolSize = parseFloat(newObj.poolSize);
  customers = JSON.parse(fs.readFileSync(cF));
  let found = false;
  //check if customer already exists
  for (let i = 0; i < customers.length; i++) {
    if (customers[i].id == newObj.id) {
      customers[i] = newObj;
      found = true;
    }
  }
  //if the customer wasn't found, then add.
  if (!found) {
    customers.push(newObj);
  }
  fs.writeFileSync(cF, JSON.stringify(customers));
}

module.exports = router;
