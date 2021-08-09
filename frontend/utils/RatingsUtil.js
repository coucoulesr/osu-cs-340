function calculateRatingPercents(category)
{
    console.log('cats', category) //test
    // Get initial values
    let upvotes = category.upvotes;
    let midvotes = category.midvotes;
    let downvotes = category.downvotes;
    let total = upvotes + midvotes + downvotes;

    // Calculate percent of total
    let upPercent = upvotes / total * 100;
    let midPercent = midvotes / total * 100;
    let downPercent = downvotes / total * 100;

    // Return an object containing the results
    return {
        upPercent: upPercent,
        midPercent: midPercent,
        downPercent: downPercent,
    }

}



// Expects an object of the form 
// {
//     difficulty: { upvotes: 2, midvotes: 0, downvotes: 2 },
//     usefulness: { upvotes: 1, midvotes: 2, downvotes: 1 },
//     satisfaction: { upvotes: 2, midvotes: 2, downvotes: 0 }
// }
// Returns an object with values representing percentages
// {
//     difficulty: { upPercent: 50, midPercent: 0, downPercent: 50 },
//     usefulness: { upPercent: 25, midPercent: 50, downPercent: 25 },
//     satisfaction: { upPercent: 50, midPercent: 50, downPercent: 0 }
// }
module.exports = function ratingPercents(ratings)
{
    console.log("thisstuf", ratings) //test
    let percents = {};

    percents.difficulty = calculateRatingPercents(ratings.difficulty);
    percents.usefulness = calculateRatingPercents(ratings.usefulness);
    percents.satisfaction = calculateRatingPercents(ratings.satisfaction);

    return percents

}