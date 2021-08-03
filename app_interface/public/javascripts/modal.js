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
                    modals[i].style.display = "flex";
                    modals[i].style.justifyContent = "center";
                };
                
                // Create events for each close button
                close_buttons[i].onclick = function() {
                    modals[i].style.display = "none";
                };

                // Close modal when clicking outside TODO: fix to work for all modals
                window.onclick = function(event) {
                    if (event.target == modals[i]) {
                        modals[i].style.display = "none"
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
