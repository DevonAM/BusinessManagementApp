var express = require("express");
var router = express.Router();
var fs = require("fs");
var cF = "./data/customers.json";
var customers = JSON.parse(fs.readFileSync(cF));

/**
 * @author Devon Acree-Meza
 * @description The main route
 * @version 1.0 April
 */

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
  let edited = JSON.parse(Object.keys(req.body)[0]);

  writeCustomers(edited);

  //send updated customers list
  res.send(JSON.stringify(customers));
});

/* POST a new customer. */
router.post("/add", function (req, res, next) {
  //Create object from the req.body
  let newObj = JSON.parse(Object.keys(req.body)[0]);
  //write new customer to file
  writeCustomers(newObj);
  //send updated customers list
  res.send(JSON.stringify(customers));
});

/* POST delete a customer */
router.delete("/", (req, res, next) => {
  //use the hacky way to get the object to delete
  let objToDel = JSON.parse(Object.keys(req.body)[0]);
  //refresh the collection
  customers = JSON.parse(fs.readFileSync(cF));

  let found = false;
  //find the customer to delete
  for (let i = 0; i < customers.length; i++) {
    if (customers[i].id == objToDel.id) {
      customers.splice(i, 1);
      found = true;
    }
  }
  //write the collection to file
  fs.writeFileSync(cF, JSON.stringify(customers));

  //send updated customers list
  res.send(JSON.stringify(customers));
});

function writeCustomers(newObj) {
  newObj.poolSize = parseFloat(newObj.poolSize);
  customers = JSON.parse(fs.readFileSync(cF));
  let found = false;
  //check if customer already exists
  for (let i = 0; i < customers.length; i++) {
    if (customers[i].id == newObj.id) {
      newObj.id = parseFloat(newObj.id);

      customers[i] = newObj;
      found = true;
    }
  }
  //if the customer wasn't found, then add.
  if (!found) {
    newObj.id = create_UUID();
    customers.push(newObj);
  }
  fs.writeFileSync(cF, JSON.stringify(customers));
}

create_UUID = () => {
  var dt = new Date().getTime();
  var uuid = "yyyyyyyyy.yyyy".replace(/[y]/g, function (c) {
    return Math.floor(Math.random() * Math.floor(10));
  });
  return uuid;
};

module.exports = router;
