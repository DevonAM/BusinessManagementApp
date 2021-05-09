/**
 * @author Devon Acree-Meza
 * @description A business customer management web application.
 * @version 1.0 April
 */

onAddClick = () => {
  loadAddPage();
};

loadHome = () => {
  //show the home page that was stored in session
  let x = document.getElementById("content");
  x.innerHTML = window.sessionStorage.getItem("home");
  //refresh the table
  fillTable(JSON.parse(window.sessionStorage.getItem("customers")));
};

loadAddPage = () => {
  var modal = document.getElementById("myModal");
  var content = document.getElementById("main_modal_content");
  content.innerHTML = "";

  let s =
    '<div class="sixteen wide mobile thirteen wide tablet thirteen wide computer right floated column" id="content"> <div class="ui padded grid"> <div class="row"> <h1 class="ui huge dividing header">Add New Customer</h1> </div>' +
    '<form id="add_cust_form" class="ui form">' +
    '<div class="field"> <label>First Name</label> <input required type="text" name="firstName" placeholder="First Name">' +
    "</div>" +
    '<div class="field"> <label>Last Name</label> <input required type="text" name="lastName" placeholder="Last Name">' +
    "</div>" +
    '<div class="field"> <label>Address</label> <input required type="text" name="address" placeholder="1234 W. 5th St. Paradise, ST 85012">' +
    "</div>" +
    '<div class="field"> <label># Gallons</label> <input type="number" name="poolSize" placeholder="12345">' +
    "</div>" +
    '<div class="field"> <label>Filter Type</label> <input type="test" name="filterType" placeholder="sand">' +
    "</div>" +
    '<button class="ui button" type="button" onclick="addSubmitted()">Add</button>' +
    "</form></div></div>";

  let x = "";
  x = document.getElementById("content").innerHTML;
  window.sessionStorage.setItem("home", x);
  document.getElementById("content").innerHTML = s;
};

addSubmitted = () => {
  let x = document
    .getElementById("add_cust_form")
    .getElementsByTagName("input");
  if (
    x["firstName"].value == "" ||
    x["lastName"].value == "" ||
    x["poolSize"].value == "" ||
    x["filterType"].value == "" ||
    x["address"].value == ""
  ) {
    alert("Please complete all the fields");
  } else {
    let cs = JSON.parse(window.sessionStorage.getItem("customers"));
    let c = {};
    let found = false;

    //determine if the stuomer already exists
    cs.forEach((e) => {
      if (
        e.firstName == x["firstName"].value &&
        e.lastName == x["lastName"].value
      ) {
        alert("A customer with that information already exists");
        found = true;
      }
    });
    if (!found) {
      c.firstName = x["firstName"].value;
      c.lastName = x["lastName"].value;
      c.address = x["address"].value;
      c.poolSize = x["poolSize"].value;
      c.filterType = x["filterType"].value;
      c.serviceHistory = {
        lastDrainDate: "none",
        lastFilterServiceDate: "none",
      };
      sendAdd(c);
    }
  }
};

//send the POST request for an add
sendAdd = (obj) => {
  let bodyStr = JSON.stringify(obj);
  //create request for a post
  let req = new XMLHttpRequest();
  req.open("POST", "/add");
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        //store the new collection to session
        let customers = JSON.parse(req.responseText);
        window.sessionStorage.setItem("customers", JSON.stringify(customers));
        //show the home page
        let x = document.getElementById("content");
        x.innerHTML = window.sessionStorage.getItem("home");
        //refresh the table
        fillTable(customers);
      } else {
        // document.getElementById("response").innerHTML =
        //   "Error retrieving response from server"; TODO
      }
    }
  };
  req.send(bodyStr);
  return req;
};

historyHelper = (history) => {
  let s = "<div>";
  let h = Object.keys(history);
  h.forEach((e) => {
    let t = e.toString();
    s += t + ": " + history[t] + "<br />";
  });
  s += "</div>";

  return s;
};

showServiceHistory = (id) => {
  var modal = document.getElementById("myModal");
  var content = document.getElementById("main_modal_content");
  var history = [];

  //get customers
  let cs = JSON.parse(window.sessionStorage.getItem("customers"));
  let c;

  //find the customer in the collection
  cs.forEach((e) => {
    if (e.id == id) {
      c = e;
    }
  });

  if (c !== undefined) {
    history = c.serviceHistory;
  } else {
    //couldn't find the customer with that id TODO
  }

  modal.style.display = "block";
  let s = "";
  s = historyHelper(history);

  content.innerHTML = s;
};

sendEdit = (obj) => {
  let bodyStr = JSON.stringify(obj);
  //create request for a post
  let req = new XMLHttpRequest();
  req.open("POST", "/edit");
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        //store the customer collection into session storage
        let customers = JSON.parse(req.responseText);
        window.sessionStorage.setItem("customers", JSON.stringify(customers));
        //refresh the table
        fillTable(customers);
        //close the modal
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
      } else {
        // document.getElementById("response").innerHTML =
        //   "Error retrieving response from server"; TODO
      }
    }
  };
  req.send(bodyStr);
  return req;
};

onEditSubmit = (id) => {
  let x = document.getElementById("edit_form").getElementsByTagName("input");
  if (
    x["firstName"].value == "" ||
    x["lastName"].value == "" ||
    x["poolSize"].value == "" ||
    x["filterType"].value == "" ||
    x["address"].value == ""
  ) {
  } else {
    let cs = JSON.parse(window.sessionStorage.getItem("customers"));
    let c;

    //find the customer in the collection
    cs.forEach((e) => {
      if ((e.id = id)) {
        c = e;
      }
    });

    c.firstName = x["firstName"].value;
    c.lastName = x["lastName"].value;
    c.poolSize = x["poolSize"].value;
    c.filterType = x["filterType"].value;
    c.address = x["address"].value;
    c.serviceHistory = c.serviceHistory;

    sendEdit(c);
  }
};

editHelper = (customer) => {
  let s =
    '<div class="sixteen wide mobile thirteen wide tablet thirteen wide computer right floated column" id="content"> <div class="ui padded grid"> <div class="row"> <h1 class="ui huge dividing header">Editing Customer</h1> </div>' +
    '<form id="edit_form" class="ui form">' +
    '<div class="field"> <label>First Name</label> <input required type="text" name="firstName" value="' +
    customer.firstName +
    '">' +
    "</div>" +
    '<div class="field"> <label>Last Name</label> <input required type="text" name="lastName" value=" ' +
    customer.lastName +
    '">' +
    "</div>" +
    '<div class="field"> <label>Address</label> <input required type="text" name="address" value=" ' +
    customer.address +
    '">' +
    "</div>" +
    '<div class="field"> <label>Pool Size</label> <input type="number" name="poolSize" value="' +
    customer.poolSize +
    '">' +
    "</div>" +
    '<div class="field"> <label>Filter Type</label> <input type="text" name="filterType" value="' +
    customer.filterType +
    '">' +
    "</div>" +
    "<div>" +
    '<button class="ui button" type="button" onclick="onEditSubmit(\'' +
    customer.id +
    "')\">Edit</button>" +
    '<button class="ui negative button" type="button" onclick="onDeleteClicked(\'' +
    customer.id +
    "')\">Delete</button>" +
    "</div>";
  s += "</form></div></div>";

  return s;
};

onDeleteClicked = (id) => {
  //send delete
  let c = {};
  let cs = JSON.parse(window.sessionStorage.getItem("customers"));
  //find the customer in the collection
  cs.forEach((e) => {
    if (e.id == id) {
      c = e;
    }
  });

  let bodyStr = JSON.stringify(c);
  //create request for a post
  let req = new XMLHttpRequest();
  req.open("DELETE", "/");
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        //get the response
        let customers = JSON.parse(req.responseText);
        //assign it to session storage
        window.sessionStorage.setItem("customers", JSON.stringify(customers));

        //refresh the table
        fillTable(customers);

        // close the modal
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
      } else {
        // document.getElementById("response").innerHTML =
        //   "Error retrieving response from server"; TODO
      }
    }
  };
  req.send(bodyStr);
  return req;
};

onEditClick = (id) => {
  var modal = document.getElementById("myModal");
  var content = document.getElementById("main_modal_content");

  //get customers
  let cs = JSON.parse(window.sessionStorage.getItem("customers"));
  let c;

  //find the customer in the collection
  cs.forEach((e) => {
    if (e.id == id) {
      c = e;
    }
  });

  modal.style.display = "block";
  let s = editHelper(c);
  content.innerHTML = s;
};

fillTable = (customers) => {
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  customers.forEach((e) => {
    if (e !== undefined) {
      //api call for languages
      //build string of languages
      let row = tbody.insertRow(0);
      let cell0 = row.insertCell(0);
      let cell1 = row.insertCell(1);
      let cell2 = row.insertCell(2);
      let cell3 = row.insertCell(3);
      let cell4 = row.insertCell(4);
      let cell5 = row.insertCell(5);
      let cell6 = row.insertCell(6);

      let s = 'onclick="showServiceHistory()"';
      cell0.innerHTML =
        '<button class="ui icon button" onClick="onEditClick(\'' +
        e.id +
        '\')"><i class="edit icon"></i></button>';
      cell1.innerHTML = e.id;
      cell2.innerHTML = e.firstName + " " + e.lastName;
      cell3.innerHTML = e.address;
      cell4.innerHTML = e.poolSize;
      cell5.innerHTML = e.filterType;

      //add button to the branches cell
      cell6.innerHTML =
        "<button onclick=\"showServiceHistory('" +
        e.id +
        '\')" id="show_history_btn">Show</button>';
      cell6.id = e.id + "_cell";
    }
  });
};

function getCustomers() {
  let bodyStr = "";
  let req = new XMLHttpRequest();
  req.open("GET", "/customerData");
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        let customers = JSON.parse(req.responseText);
        window.sessionStorage.setItem("customers", JSON.stringify(customers));
        fillTable(customers);
      } else {
        // document.getElementById("response").innerHTML =
        //   "Error retrieving response from server";
      }
    }
  };
  req.send(bodyStr);
  return req;
}

searchClicked = () => {
  let input = document.getElementById("search_input").value;

  if (input == "") {
    alert("Please enter a first or last name into the search");
  } else {
    //create a new request
    let req = new XMLHttpRequest();
    req.open("GET", "/search/" + input);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        if (req.status === 200) {
          //get the response
          let res = JSON.parse(req.responseText);
          //assign it to session storage
          // window.sessionStorage.setItem("customers", JSON.stringify(customers));
        } else {
          // document.getElementById("response").innerHTML =
          //   "Error retrieving response from server"; TODO
        }
      }
    };
    req.send();
    return req;
  }
};

getCustomers();
