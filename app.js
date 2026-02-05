const form = document.querySelector('#searchForm')
const resultCard = document.querySelector('#results');
const homeSub = document.querySelector('#homeSub');
const tvIcon = document.querySelector('#tvIcon');
const homeHeading = document.querySelector('h1');

function returnHome() {
    form.reset();
    resultCard.innerHTML = '';
    homeSub.style.display = "inline-block";
    tvIcon.style.display = "block";
}

// paraeter = an array of objects (the search result)
function assembleCard(searches) {
    for (let search of searches) {

        const showCard = document.createElement('div');
        showCard.classList.add('card'); // add CSS class to the div element
        showCard.classList.add('card-row');

        // card image
        const image = document.createElement('IMG');
        image.setAttribute("id", "showImage");
        if (search.show.image) {
            image.src = search.show.image.medium;
            image.classList.add('card-image');
        } else {
            image.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930';
            image.classList.add('card-image');
            image.style.height = '210px';
        }

        // card text container: this contains title, summary, metaData..
        const textContainer = document.createElement('div');
        textContainer.classList.add('container');

        // this contains title + description
        const topContainer = document.createElement('div');
        topContainer.classList.add('topContainer');

        // card title
        const cardTitle = document.createElement('h2');
        cardTitle.textContent = search.show.name;

        // card description
        const cardDescription = document.createElement('p');
        const summary = search.show.summary;

        const shortSummary = summary.length > 500 // limit the summary to be <=500, ends with '...'
            ? summary.slice(0, 500) + '...'
            : summary;
        cardDescription.innerHTML = shortSummary;

        // card metaData: contain rating, released date, webChannel
        const cardMetaData = document.createElement('div');
        cardMetaData.classList.add('cardMetaData');

        // card rating, with stars
        const cardRating = document.createElement('p');
        const rating = search.show.rating?.average ?? '0';
        const stars = Math.round(rating / 2); // convert to 5 stars rating
        let starString = '';

        for (let i = 0; i < 5; i++) {
            starString += i < stars ? '★' : '☆';
        }

        cardRating.textContent = rating > 0
            ? `Rating:${rating} ${starString}`
            : "Rating: N/A";

        // card released date
        const cardDate = document.createElement('p');
        cardDate.textContent = 'Released:' + (search.show.premiered ?? 'Unknown');

        // card webChannel
        const cardChannel = document.createElement('p');
        cardChannel.textContent = 'Channel: ' + (search.show.webChannel?.name ?? 'Unknown');

        // card URL
        const showLink = document.createElement('a');
        const cardURL = search.show.officialSite ?? search.show.url ?? '#';
        showLink.setAttribute("href", cardURL);
        showLink.target = '_blank'; // optional: open in new tab
        showLink.rel = 'noopener noreferrer';


        // Assemble card elements
        cardMetaData.appendChild(cardRating);
        cardMetaData.appendChild(cardDate);
        cardMetaData.appendChild(cardChannel);

        topContainer.appendChild(cardTitle);
        topContainer.appendChild(cardDescription);

        textContainer.appendChild(topContainer);
        textContainer.appendChild(cardMetaData);


        showCard.appendChild(image);
        showCard.appendChild(textContainer);


        // Append it to #results
        showLink.appendChild(showCard);
        resultCard.appendChild(showLink);
    }
}

function showSearch(searches) {
    resultCard.innerHTML = ''; // clear any old content

    if (searches.length > 0) { // if result is not empty
        homeSub.style.display = "none";
        tvIcon.style.display = "none";
        assembleCard(searches);
    } else if (searches.length === 0) {
        returnHome();
        homeSub.textContent = 'Your search is not in our database. Please try again.'
        tvIcon.style.display = "none";
        homeSub.style.fontWeight = "bold";
        homeSub.style.color = "#8B0000";
    }
}

async function searchShow(showName) {
    const config = { params: { q: showName } }
    const searches = await axios.get(`https://api.tvmaze.com/search/shows`, config);
    return searches.data; //returns promise result (an array of objects)
}

// when user clicks submit, search from db. THEN show search result.
// reset form once search is complete
form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const searchTerm = form.elements.query.value;
    const results = await searchShow(searchTerm);
    showSearch(results);
    form.reset();
});


// when user click h1, return home
homeHeading.addEventListener('click', (e) => {
    returnHome();

});



