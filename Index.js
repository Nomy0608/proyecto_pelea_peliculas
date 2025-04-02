// const fetchData= async(searchTerm) => {
//     const response = await axios.get('https://omdbapi.com/', {
//         params: {
//             apikey:'30668e4a',
//             s: 'avengers'

//         }
//     })
//     if(response.data.Error){
//         return[]
//     }

//     console.log(response.data.Search)
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
    async fetchData(searchTerm){
        apiMovieURL = 'https://www.omdbapi.com/'
        const response = await axios.get(apiMovieURL, {
            params: {
                apikey:'30668e4a',
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
    onOptionSelect(Movie){
        document.querySelector('.tutorial').classList.add('is.hidden')
        onMovieSelect(Movie, document.querySelector('#left-summary'),'left')
    }
})

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(Movie){
        document.querySelector('.tutorial').classList.add('is.hidden')
        onMovieSelect(Movie, document.querySelector('#right-summary'),'right')
    }
})

//Crear 2 variables para leftMovie y rightMovie
let leftMovie
let rightMovie

const onMovieSelect = async(movie, summaryElement, side) =>{
    const response = await axios.get('https://www.omdbapi.com/',{
        params:{
            apikey: '30668e4a',
            i: movie.imdbID
        }
    })
    console.log(response.data)
    summaryElement.innerHTML = movieTemplate(response.data)
    //Preguntamos, que lado es?
    if(side === 'left'){
        leftMovie = response.data
    }else{
        rightMovie = response.data
    }
    //Preguntamos si tenemos ambos lados
    if(leftMovie && rightMovie){
        //Ejecutamos la funcion comparacion
        runComparasion()
    }
}

const runComparasion = () =>{
    console.log('Comparacion de peliculas')
    const leftSideStats = document.querySelector('#left-summary .notificacion')
    const rightSideStats = document.querySelector('#right-summary .notificacion')

    leftSideStats.forEach((leftStat, index) =>{
        const rightStat = rightSideStats(index)
        const leftSideValue = parseInt(leftStat.dataset.value)
        const rightSideValue = parseInt(rightStat.dataset.value)

        if(rightSideValue>leftSideValue){
            leftStat.classList.remove('is-primary')
            leftStat.classList.add('is-danger')
        }else{
            rightStat.classList.remove('is-primary')
            rightStat.classList.add('is-danger')
        }
    })
}

const movieTemplates = (movieDetails) => {
    //Transformar a numeros los string que llevan los datos
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g,'').replace(/,/g,''))
    console.log(dollars)
    const metascore = parseInt(movieDetails.metascore)
    const imdbRating = parseFloat(movieDetails.imdbRating)
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g,''))
    console.log(metascore, imdbRating, imdbVotes)
    const awards = movieDetails.awards.split('').reduce((prev, word) => {
        const value = parseInt(word)

        if(isNaN(value)){
            return prev
        }else{
            return prev + value
        }
        
    },0)
    console.log('Awards', awards)
    //Agregar la propiedad data-value a cada elemento del template

    return`
    <article class= "media">
        <figure class="media-left">
        <p class="image">
            <img src="${movieDetails.Poster}">
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
        <p class="title">${movieDetails.awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-values=${dollars} class="notification is-primary">
        <p class="title">${movieDetails.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article data-values=${metascore} class="notification is-primary">
        <p class="title">${movieDetails.metascore}</p>
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

const root = document.querySelector('.autocomplete')
root.innerHTML = `
<label><b>Busqueda de Peliculas</b></label>
<input class="input"/>
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
        </div>
    </div>
    `
const input= document.querySelector("input")
const dropdown = document.querySelector('.dropdown')
const resultsWrapper = document.querySelector('.results')

const debonce = (func, delay = 1000) =>{
    let timeoutId
    return(...args) => {
        clearTimeout(timeoutId)
        timeoutId = serTimeout(() =>{
            func.apply(null, args)
        }, deLay)
    }
}

const onInput = async(event) => {
    const movies = await fetchData(event.target.value)
    console.log("MOVIES:", movies)

    if(!movies.length) {
        dropdown.classList.remove('is-active')
        return
    }

    resultsWrapper.innerHTML = ''
    dropdown.classList.add('is-active')

    for(let movie of movies){
        const option = document.createElement('a')
        const imgSrc = movie.Poster === 'N/A' ? '': movie.Poster

        option.classList.add('dropdown-item')
        option.innerHTML = `
        <img src="${imgSrc}"/>
        ${movie.Title}
    `
    option.addEventListener('click', () =>{
        dropdown.classList.remove('is-active')
        input.value = movie.Title
        onMovieSelect(movie)
    })
    resultsWrapper.appendChild(option)
    }
}

input.addEventListener('input',debonce(onInput, 1000)) 

document.addEventListener('click', event => {
    if(!root,contains(event.target)) {
        dropdown.classList.remove('is-active')
    }
})

const onMoviesSelect = async(movie) =>{
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey:'30668e4a',
            i: movie.imdbID
        }
    })

    console.log(response.data)
    document.querySelector('#summary').innerHTML = movieTemplate(response.data)
}

const movieTemplate = (movieDetail) => {
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
    `
}