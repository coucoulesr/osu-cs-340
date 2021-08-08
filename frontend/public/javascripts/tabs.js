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

// Scream in frustration at confusing closure loops
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

                    // Display selected tab
                    tab_contents[i].style.display = "flex"
                    tabs[i].style.boxShadow = ""
                }
            };
        }(i);
    };
    return handlers;
}

handlers = generateHandlers();
for (var i = 0; i < handlers.length; i++){
    handlers[i]()
}

