// Get modal
var modal = document.getElementById("modal");

// Get button that opens modal
var open_button = document.getElementById("modal_open");

// Get button that closes modal
var close_button = document.getElementById("modal_close");

// Open modal when user clicks on button
open_button.onclick = function() {
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
}

// Close modal when user clicks close button
close_button.onclick = function () {
    modal.style.display = "none";
}

// Close modal when user clicks outside of the modal box
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}