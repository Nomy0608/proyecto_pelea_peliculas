const createAutoComplete =({root, rederOption, onOptionSelect, inputValue, fetchData}) =>{
    //Funcion createAutoComple

    root.innerHTML`
    <label><b>Busqueda</b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"</div>
            </div>
        </div> 
    `
}
const input = root.querySelector('input')
const dropdown = root.querySelector('.dropdown')
const resultsWrapper = root.querySelector('.result')

const debonce = (func, delay = 1000) =>{
    let timeoutId
    return(...args) => {
        clearTimeout(timeoutId)
        timeoutId = serTimeout(() =>{
            func.apply(null, args)
        }, deLay)
    }
}

const onInput = async event =>{
    const items = await fetchData(event.target.value)
    console.log("Movies", items)

    if(!items.length){
        dropdown.classList.remove('is-active')
        return
    }

    resultsWrapper.innerHTML = ''
    dropdown.classList.add('is-active')
    for(let item of items){
        const option = document.createElement('a')

        option.classList.add('dropdown-item')
        option.innerHTML=renderOption(item)
        option.addEventListener('click', () =>{
            dropdown.classList.remove('is-active')
            input.value = inputValue(item)
            onOptionSelect(item)
            console.log("onMovieSelect")
        })
        resultsWrapper.appendChild(option)
    }
    input.addEventListener('input', debonce(onInput, 1000))
    
    document.addEventListener('click', event => {
        if(!root.contains(event.target)){
            dropdown.classList.remove('is-active')
        }
    })
}