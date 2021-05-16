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
  let newObj = req.body; //JSON.parse(Object.keys(req.body)[0]);
  //write new customer to file
  writeCustomers(newObj);
  //send updated customers list
  res.send(JSON.stringify(customers));
});

/* GET a list of searched customers */
router.get("/search/:name", (req, res, next) => {
  //get the search term
  let searchTerm = req.params.name;
  //if first and last name were entered get both.
  let terms = searchTerm.split(" ");
  let results = [];
  let found = false;
  //iterate customers
  for (let i = 0; i < customers.length; i++) {
    //put the index customer names into an array
    let names = [
      customers[i].firstName.toLowerCase(),
      customers[i].lastName.toLowerCase(),
    ];

    //check for matches
    if (terms[1]) {
      if (
        names.includes(terms[0].toLowerCase()) ||
        names.includes(terms[1].toLowerCase())
      ) {
        //found a match
        results.push(customers[i]);
        found = true;
      }
    } else {
      if (names.includes(terms[0].toLowerCase())) {
        //found a match
        results.push(customers[i]);
        found = true;
      }
    }
  }

  if (found) {
    res.send(JSON.stringify(results));
  } else {
    res.sendStatus(404, "Could not find the customer");
  }
});

/* POST delete a customer */
router.delete("/", (req, res, next) => {
  //use the hacky way to get the object to delete
  let objToDel = req.body; //JSON.parse(Object.keys(req.body)[0]);
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
