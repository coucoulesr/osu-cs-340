async function update_ratings(category, score)
{
    // Create json string to send in body of request
    let http_body = {}
    http_body.category= category;
    http_body.score = score;
    http_body = JSON.stringify(http_body)

    console.log(http_body)

    // Get assignment id from url
    current_url = window.location.href
    assignment_id = current_url.slice(current_url.search('assignments/') + 12) // Given 'url.assignments/23' this should return '23'

    // Send request and wait for response
    let response = await fetch("/assignments/" + assignment_id + "/ratings",
    {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: http_body
    })

    // Get content of response
    let resContent = await response.json();

    // Update ratings on page
    location.reload()

}

document.getElementById("rate_easy").addEventListener('click', function(event){event.preventDefault(), update_ratings("difficulty", -1)})
document.getElementById("rate_medium").addEventListener('click', function(event){event.preventDefault(), update_ratings("difficulty", 0)})
document.getElementById("rate_hard").addEventListener('click', function(event){event.preventDefault(), update_ratings("difficulty", 1)})

document.getElementById("rate_waste").addEventListener('click', function(event){event.preventDefault(), update_ratings("usefulness", -1)})
document.getElementById("rate_practice").addEventListener('click', function(event){event.preventDefault(), update_ratings("usefulness", 0)})
document.getElementById("rate_helpful").addEventListener('click', function(event){event.preventDefault(), update_ratings("usefulness", 1)})

document.getElementById("rate_hated").addEventListener('click', function(event){event.preventDefault(), update_ratings("satisfaction", -1)})
document.getElementById("rate_eh").addEventListener('click', function(event){event.preventDefault(), update_ratings("satisfaction", 0)})
document.getElementById("rate_loved").addEventListener('click', function(event){event.preventDefault(), update_ratings("satisfaction", 1)})