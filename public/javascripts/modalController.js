var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("show_history_btn");

// Get the <span> element that closes the modal
var span = document.getElementById("close_span");

// When the user clicks on <span> (x), close the modal
span.onclick = () => {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
console.log("hey");
