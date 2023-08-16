const setupSpan = document.getElementById('setup-span')
const punchlineSpan = document.getElementById('punchline-span')
const setupCheckbox = document.getElementById('setup-checkbox')
const punchlineCheckbox = document.getElementById('punchline-checkbox')
const generateJoke = document.getElementById('generate-joke')
const previousJoke = document.getElementById('previous-joke')
const nextJoke = document.getElementById('next-joke')
const saveJoke = document.getElementById('save-joke')
const badJokeGeneratorSpan = document.getElementById('bad-joke-generator-span')
const colors = ['red', 'blue', 'green', 'purple', 'royalblue', 'brown', 'skyblue', 'green', 'purple'
    , 'red', 'blue', 'green', 'purple', 'cyan', 'maroon', 'skyblue', 'green', 'purple', 'red', 'blue', 'green', 'purple'
    , 'red', 'blue', 'green', 'purple', 'red', 'blue', 'green', 'purple', 'cyan', 'maroon', 'skyblue', 'purple']
const generatedJokesArr = []
const savedJokesArr = []
let currentSetup = ''
let currentPunchline = ''
let timeoutID = 0
const setupTimeoutIDs = []
const punchlineTimeoutIDs = []
let blockOrNone = ''
let dataFetchingInProgress = false
let idOfParagprah = 0
const colorsOfParagprahs = ['rgb(200,55,255)', 'rgb(215,55,255)', 'rgb(200,55,255)', 'rgb(215,55,255)'
, 'rgb(200,55,255)', 'rgb(215,55,155)', 'rgb(210,15,255)', 'rgb(255,55,15)', 'rgb(220,255,215)', 'rgb(215,55,215)'
, 'rgb(200,55,255)', 'rgb(215,55,255)', 'rgb(200,55,255)', 'rgb(215,55,255)']

let savedJokesParagraphs = []
const selectedJokesArr = []

generateBadJoke()
async function generateBadJoke() {

    if (dataFetchingInProgress) {
        return
    }
    dataFetchingInProgress = true
    try {
        const data = await fetch('https://official-joke-api.appspot.com/random_joke/')
        const joke = await data.json()
        generatedJokesArr.push(joke.setup, joke.punchline)

        if (setupCheckbox.checked) setupSpan.style.visibility = 'visible'
        else setupSpan.style.visibility = 'hidden'
        if (punchlineCheckbox.checked) punchlineSpan.style.visibility = 'visible'
        else punchlineSpan.style.visibility = 'hidden'

        for (const id of setupTimeoutIDs) clearTimeout(id)
        for (const id of punchlineTimeoutIDs) clearTimeout(id)

        writeSetupOrPunchline(joke.setup, true)
        setTimeout(() => {
            writeSetupOrPunchline(joke.punchline, false)
        }, 1200)

        currentSetup = joke.setup
        currentPunchline = joke.punchline

    } catch (error) {
        console.log('There was an error fetching dana', error)
    } finally {
        dataFetchingInProgress = false
        setupTimeoutIDs.length = 0
        punchlineTimeoutIDs.length = 0
    }
}

async function writeSetupOrPunchline(line, whichOneIsIt) {

    const timeoutIDs = whichOneIsIt ? setupTimeoutIDs : punchlineTimeoutIDs
    let spanChoice = whichOneIsIt ? setupSpan : punchlineSpan
    spanChoice.style.color = whichOneIsIt ? 'red' : 'blue'
    spanChoice.innerText = ''

    for (let i = 0; i < line.length; i++) {
        timeoutID = setTimeout(() => {
            spanChoice.textContent += line[i]
            badJokeGeneratorSpan.style.color = colors[i]
        }, i * 15);
        timeoutIDs.push(timeoutID)
    }
}


generateJoke.addEventListener('click', () => {
    setTimeout(() => {
        generateJoke.style.backgroundColor = 'lightcyan'
    }, 50);

    generateJoke.style.backgroundColor = 'white'

    generateBadJoke()
})
setupCheckbox.addEventListener('change', () => {
    if (setupCheckbox.checked) setupSpan.style.visibility = 'visible'
    else setupSpan.style.visibility = 'hidden'
})
punchlineCheckbox.addEventListener('change', () => {
    if (punchlineCheckbox.checked) punchlineSpan.style.visibility = 'visible'
    else punchlineSpan.style.visibility = 'hidden'
})
previousJoke.addEventListener('click', () => {
    let currentIndexForSetup = generatedJokesArr.indexOf(currentSetup)
    let currentIndexForPunchline = generatedJokesArr.indexOf(currentPunchline)

    currentSetup = generatedJokesArr[currentIndexForSetup - 2] ?? generatedJokesArr[currentIndexForSetup]
    currentPunchline = generatedJokesArr[currentIndexForPunchline - 2] ?? generatedJokesArr[currentIndexForPunchline]
    setupSpan.innerText = currentSetup
    punchlineSpan.innerText = currentPunchline
})
nextJoke.addEventListener('click', () => {
    let currentIndexForSetup = generatedJokesArr.indexOf(currentSetup)
    let currentIndexForPunchline = generatedJokesArr.indexOf(currentPunchline)

    currentSetup = generatedJokesArr[currentIndexForSetup + 2] ?? generatedJokesArr[currentIndexForSetup]
    currentPunchline = generatedJokesArr[currentIndexForPunchline + 2] ?? generatedJokesArr[currentIndexForPunchline]
    setupSpan.innerText = currentSetup
    punchlineSpan.innerText = currentPunchline
})

const showSavedJokes = document.getElementById('show-saved-jokes')
const deleteAllSavedJokes = document.getElementById('delete-all-saved-jokes')
const hideSavedJokes = document.getElementById('hide-saved-jokes')
const savedJokesDiv = document.getElementById('saved-jokes-div')
const deleteSelectedJokes = document.getElementById('delete-selected-jokes')
const saveShowDeleteHideBtns = document.querySelectorAll('.save-show-delete-hide-buttons')
let showingJokes = false

saveShowDeleteHideBtns.forEach(button => {
    button.addEventListener('click', () => {

        if (button.id === 'show-saved-jokes') {
            showingJokes = !showingJokes
            blockOrNone = showingJokes ? 'block' : 'none'
            showSavedJokes.textContent = showingJokes ? 'Hide saved jokes' : 'Show saved jokes'
            showingJokes ? console.log('local storage jokes: ', localStorage.jokes) : null
        }
        else if (button.id === 'delete-all-saved-jokes') deleteAllJokesPopUpDiv.style.visibility = 'visible'
        else if (button.id === 'save-joke') {

            const savedJokesArr = JSON.parse(localStorage.getItem('jokes')) || []

            if (!savedJokesArr.includes(currentPunchline)) {
                savedJokesArr.push(currentSetup, currentPunchline)
                localStorage.setItem('jokes', JSON.stringify(savedJokesArr))
                listJokesInParapgrahs()
                savedJokesParagraphs = document.querySelectorAll('#saved-jokes-parapgrah')
                console.log(savedJokesParagraphs)
            }
            console.log('local storage jokes: ', localStorage.getItem('jokes'))
        }
        else if (button.id === 'delete-selected-jokes') {

            const localStorageToSplice = JSON.parse(localStorage.getItem('jokes')) || []

            selectedJokesArr.forEach(selectedJoke => {
                let indexToRemove = localStorageToSplice.indexOf(selectedJoke)
                console.log(indexToRemove)
                localStorageToSplice.splice(indexToRemove - 1, 2)
                console.log('localStorageToSplice', localStorageToSplice)
                localStorage.setItem('jokes', JSON.stringify(localStorageToSplice))
            })
            listJokesInParapgrahs()
            selectedJokesArr.length = 0
        }

        savedJokesDiv.style.display = blockOrNone
        deleteSelectedJokes.style.display = blockOrNone
        deleteAllSavedJokes.style.display = blockOrNone
    })
})

const deleteOrNotButtons = document.querySelectorAll('.delete-or-not-buttons')
const deleteAllJokesPopUpDiv = document.getElementById('delete-all-pop-up-div')
deleteOrNotButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.id === 'delete-yes-button') {
            while (savedJokesDiv.childElementCount > 0) savedJokesDiv.removeChild(savedJokesDiv.lastChild)
            localStorage.clear()
            savedJokesParagraphs = ''
            idOfParagprah = 0
        }
        deleteAllJokesPopUpDiv.style.visibility = 'hidden'
        console.log(localStorage.jokes)
    })
})

savedJokesDiv.addEventListener('click', (e) => {

    console.log(e.target)
    
    if (Number(e.target.id) > 10000) {
        let text = e.target.firstElementChild.nextElementSibling.innerText
        if (e.target.style.border === '1px solid green') {
            let indexToSlice = selectedJokesArr.indexOf(text)
            selectedJokesArr.splice(indexToSlice, 1)
            e.target.style.border = '1px solid white'
        }
        else  {
            if (!selectedJokesArr.includes(text))
                selectedJokesArr.push(text)

            e.target.style.border = '1px solid green'
        }
    }
    else if (Number(e.target.id) < 10000 && Number(e.target.id) % 2) {

        let text = e.target.nextElementSibling.innerText
        if (e.target.parentElement.style.border === '1px solid green') {
            console.log(e.target.style.parentElement)
            let indexToSlice = selectedJokesArr.indexOf(text)
            selectedJokesArr.splice(indexToSlice, 1)
            e.target.parentElement.style.border = '1px solid white'
        }
        else {
            if (!selectedJokesArr.includes(text))
                selectedJokesArr.push(text)

            e.target.parentElement.style.border = '1px solid green'
        }
    }
    else if (Number(e.target.id) < 10000 && !(Number(e.target.id) % 2)) {
        let text = e.target.innerText
        if (e.target.parentElement.style.border === '1px solid green') {
            let indexToSlice = selectedJokesArr.indexOf(text)
            selectedJokesArr.splice(indexToSlice, 1)
            e.target.parentElement.style.border = '1px solid white'
        }
        else {
            if (!selectedJokesArr.includes(text))
                selectedJokesArr.push(text)

            e.target.parentElement.style.border = '1px solid green'
        }
    }

    console.log('selectedJokesArr', selectedJokesArr)
})

function listJokesInParapgrahs() {

    const localeStorageJokes = JSON.parse(localStorage.getItem('jokes')) || []
    while (savedJokesDiv.childElementCount > 0) savedJokesDiv.removeChild(savedJokesDiv.lastChild)

    for (let i = 0; i < localeStorageJokes.length; i += 2) {
        const p1 = document.createElement('p')
        const p2 = document.createElement('p')
        const div = document.createElement('div')
        p1.setAttribute('id', ++idOfParagprah)
        p2.setAttribute('id', ++idOfParagprah)
        div.setAttribute('id', idOfParagprah + 10000)
        div.style.border = '1px solid white'
        savedJokesDiv.appendChild(div)
        p1.innerText = localeStorageJokes[i]
        p2.innerText = localeStorageJokes[i + 1]
        p1.style.textAlign = 'center'
        p1.style.color = colors[i]
        p2.style.textAlign = 'center'
        p2.style.color = colors[i+1]
        p2.style.marginTop = '-10px'
        p2.style.marginBottom = '15px'
        div.appendChild(p1)
        div.appendChild(p2)
    }
}

listJokesInParapgrahs()


// localStorage.clear()