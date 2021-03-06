// Get all upvote buttons
let upButtons = document.getElementsByClassName("upvote")
let votesums = document.getElementsByClassName("vote-sum")
let downButtons = document.getElementsByClassName("downvote")

function generateUpvoteHandlers(){
    var handlers = [];
    for (let i = 0; i < upButtons.length; i++)
    {   
        handlers[i] = function(i){
            return function(){
                upButtons[i].onclick = async function(){
                    // Create json string to send in body of request
                    let http_body = {}
                    http_body.comment_id= upButtons[i].value;
                    http_body.student_id = 1; // Hardcoded because we did not implement multiple views
                    http_body.value = 1
                    http_body = JSON.stringify(http_body)
                    
                    // Send updated vote
                    let response = await fetch("/assignments/updateVote/" + upButtons[i].value, 
                    {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: http_body
                    })

                    // Get response. Expected response.body = {votesum: 10}
                    response = await response.json()

                    // Alter vote total on screen
                    console.log(response)
                    votesums[i].textContent = response.votesum

                }
            }
        }(i);
    }
    return handlers;
}

// Add handlers for every up button
upHandlers = generateUpvoteHandlers();
for (var i = 0; i < upHandlers.length; i++){
    upHandlers[i]()
}

function generateDownvoteHandlers(){
    var handlers = [];
    for (let i = 0; i < downButtons.length; i++)
    {   
        handlers[i] = function(i){
            return function(){
                downButtons[i].onclick = async function(){
                    // Create json string to send in body of request
                    let http_body = {}
                    http_body.comment_id= downButtons[i].value;
                    http_body.student_id = 1; // Hardcoded because we did not implement multiple views
                    http_body.value = -1;
                    http_body = JSON.stringify(http_body)
                    
                    // Send updated vote
                    let response = await fetch("/assignments/updateVote/" + downButtons[i].value, 
                    {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: http_body
                    })

                    // Get response. Expected response.body = {votesum: 10}
                    response = await response.json()

                    // Alter vote total on screen
                    console.log(response)
                    votesums[i].textContent = response.votesum

                }
            }
        }(i);
    }
    return handlers;
}

// Add handlers for every up button
downHandlers = generateDownvoteHandlers();
for (var i = 0; i < downHandlers.length; i++){
    downHandlers[i]()
}