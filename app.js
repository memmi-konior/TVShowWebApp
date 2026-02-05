const form = document.querySelector('#searchForm')
const resultCard = document.querySelector('#results');
const homeSub = document.querySelector('#homeSub');
const tvIcon = document.querySelector('#tvIcon');


function showSearch(searches) {
    resultCard.innerHTML = '';

    if (searches.length > 0) {
        homeSub.style.display = "none";
        tvIcon.style.display = "none";
    } else if (searches.length === 0) {
        homeSub.style.display = "inline-block";
        tvIcon.style.display = "block";

    }

    for (let search of searches) {

        const showCard = document.createElement('div');
        showCard.classList.add('card'); // add CSS class to the div element
        showCard.classList.add('card-row');

        // card image
        const image = document.createElement('IMG');
        if (search.show.image) {
            image.src = search.show.image.medium;
            image.classList.add('card-image');
        } else {
            image.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930';
            image.classList.add('card-image');
            image.style.height = '210px';
        }

        // card text container
        const textContainer = document.createElement('div');
        textContainer.classList.add('container');

        const topContainer = document.createElement('div');
        topContainer.classList.add('topContainer');

        // card title
        const cardTitle = document.createElement('h2');
        cardTitle.textContent = search.show.name;

        // card description
        const cardDescription = document.createElement('p');
        const summary = search.show.summary;
        const shortSummary = summary.length > 500
            ? summary.slice(0, 500) + '...'
            : summary;
        cardDescription.innerHTML = shortSummary;

        // card metaData
        const cardMetaData = document.createElement('div');
        cardMetaData.classList.add('cardMetaData');

        // card rating
        const cardRating = document.createElement('p');
        cardRating.textContent = 'Rating:' + (search.show.rating?.average ?? 'N/A');

        // card released data
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

async function searchShow(showName) {
    const config = { params: { q: showName } }
    const searches = await axios.get(`https://api.tvmaze.com/search/shows`, config);
    return searches.data;
}

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const searchTerm = form.elements.query.value;
    const results = await searchShow(searchTerm);
    showSearch(results);
    form.reset();
});

