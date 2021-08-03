// // Get modal
// var modal = document.getElementById("modal");

// // Get button that opens modal
// var open_button = document.getElementById("modal_open");

// // Get button that closes modal
// var close_button = document.getElementById("modal_close");

// // Open modal when user clicks on button
// open_button.onclick = function() {
//     modal.style.display = "flex";
//     modal.style.justifyContent = "center";
// }

// // Close modal when user clicks close button
// close_button.onclick = function () {
//     modal.style.display = "none";
// }

// // Close modal when user clicks outside of the modal box
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }

// Get modals
var modals = document.getElementsByClassName("modal");

// Get buttons that open modals
var open_buttons = document.getElementsByClassName("modal_open");

// Get buttons that close modals
var close_buttons = document.getElementsByClassName("modal_close");

function generateHandlers(){
    var handlers = [];
    for (var i = 0; i < modals.length; i++){
        handlers[i] = function(i){
            return function(){
                
                // Create events for each open button
                open_buttons[i].onclick = function(){
                    console.log('test')
                    modals[i].style.display = "flex";
                    modals[i].style.justifyContent = "center";
                };
                
                // Create events for each close button
                close_buttons[i].onclick = function() {
                    modals[i].style.display = "none";
                };

                // Create event for when clicking outside of the modal box TODO: does not work yet
                window.onclick = function(event) {
                    if (event.target == modals[i]) {
                        modal.style.display = "none"
                    };
                };
            };
        }(i);
    };
    return handlers;
}

handlers = generateHandlers();
for (var i = 0; i < handlers.length; i++) {
    handlers[i]()
}
