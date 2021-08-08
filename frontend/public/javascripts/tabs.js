// Get all the tabs
var tabs = document.getElementsByClassName("tab");
var tab_contents = document.getElementsByClassName("tab_contents")

// Hide contents of all but first tab
for (var i = 1; i < tab_contents.length; i++){
    tab_contents[i].style.display = "none";
}

for (var i = 1; i < tabs.length; i++){
    tabs[i].style.boxShadow =  "0 -5px 5px #DBEAFE inset"
}

// Define function for handling what happens when a tab is clicked
function generateHandlers(){
    var handlers = [];
    for (var i = 0; i < tabs.length; i++){
        handlers[i] = function(i){
            return function(){
                tabs[i].onclick = function(){
                    // Hide all tabs
                    for (var j = 0; j < tab_contents.length; j++)
                    {
                        tab_contents[j].style.display = "none"
                        tabs[j].style.boxShadow =  "0 -5px 5px #DBEAFE inset"
                    }

                    // Display clicked on tab
                    tab_contents[i].style.display = "flex"
                    tab_contents[i].style.flexDirection = "column"
                    tabs[i].style.boxShadow = ""
                }
            };
        }(i);
    };
    return handlers;
}

// Add handler for very tab
handlers = generateHandlers();
for (var i = 0; i < handlers.length; i++){
    handlers[i]()
}

