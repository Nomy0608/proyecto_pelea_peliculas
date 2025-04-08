// const fetchData = async (searchTerm) => {
//     const response = await axios.get('http://www.omdbapi.com/', {
//         params: {
//             apikey: '30668e4a',
//             s: searchTerm
//         }
//     })

//     if (response.data.Error){
//         return []
//     } 
//     console.log(response.data)
//     console.log(response.data)
//     return response.data.Search
// }

//fetchData()

autoCompleteConfig = {
    renderOption(movie){
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
        return`
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `
    },
    inputValue(movie){
        return movie.Title
    },
    async fetchData(searchTerm) {
        console.log("Hello!")
        apiMovieURL = 'http://www.omdbapi.com/'
        const response = await axios.get(apiMovieURL, {
            params: {
                apikey: '30668e4a',
                s: searchTerm
            }
        })
        if(response.data.Error){
            return []
        }

        console.log(response.data)
        return response.data.Search
    }
}

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
    }
})

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
    }
})

//Crear dos variables para leftMovie y rightMovie
let leftMovie
let rightMovie

const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '30668e4a',
            i: movie.imdbID
        }
    })
    console.log(response.data)
    summaryElement.innerHTML = movieTemplate(response.data)

    // Preguntamos cual lado es?
    if(side === 'left'){
        leftMovie = response.data   
    }else{
        rightMovie = response.data
    }

    // Preguntamos si temos ambos lados
    if(leftMovie && rightMovie){
        // Entonces ejecutamos la funcion de comparacion
        runComparison()
    }
}

const runComparison = () => {
    console.log('Comparacion de peliculas')
    const leftSideStats = document.querySelectorAll('#left-summary .notification')
    const rightSideStats = document.querySelectorAll('#right-summary .notification')

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index]
        const leftSideValue = parseInt(leftStat.dataset.value)
        const rightSideValue = parseInt(rightStat.dataset.value)

        if(rightSideValue > leftSideValue){
            leftStat.classList.remove('is-primary')
            leftStat.classList.add('is-danger')
        }else{
            rightStat.classList.remove('is-primary')
            rightStat.classList.add('is-danger')
        }

    })

}

const movieTemplate = (movieDetails) => {
    // Transformar a numeros los strings que llegan de los datos
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))
    console.log(dollars)
    const metascore = parseInt(movieDetails.Metascore)
    const imdbRating = parseFloat(movieDetails.imdbRating)
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''))
    console.log(metascore, imdbRating, imdbVotes)
    const awards = movieDetails.Awards.split('').reduce((prev, word) => {
        const value = parseInt(word)

        if(isNaN(value)){
            return prev
        }else{
            return prev + value
        }
    }, 0)
    console.log('Awards', awards)
    
    // Agregar la propiedad data-value a cada elemento del template

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>
        <article data-values=${awards} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-values=${dollars} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-values=${metascore} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-values=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-values=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>   
    `
}