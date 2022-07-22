const startBtn = document.querySelector('#start'),
    screens = document.querySelectorAll('.screen'),
    timeList = document.querySelector('#time-list'),
    timeEl = document.querySelector('#time'),
    board = document.querySelector('#board'),
    lastEl = document.querySelector('#last-score'),
    bestEl = document.querySelector('#best-score-info'),
    gameEl = document.querySelector('#play-count'),
    playSpeedEl = document.querySelector('#play-speed'),
    colors = ['#ed7c7c', '#72bad5', '#72d57e', '#ebe893', '#ff3737', '#1ac517', '#f5ae10', '#b210f5', '#fff']

let time = 0,
    scores = 0,
    timeReady = 3,
    check = false,
    lifeTime = 900,
    bestScore = 0,
    lastScore = 0,
    playCount = 0,
    currentMode = 0

const playMode = {
    mode5: { lastScore: 0, bestScore: 0, playCount: 0 },
    mode10: { lastScore: 0, bestScore: 0, playCount: 0 },
    mode20: { lastScore: 0, bestScore: 0, playCount: 0 },
    mode30: { lastScore: 0, bestScore: 0, playCount: 0 },
}

startBtn.addEventListener('click', event => {
    event.preventDefault()
    screens[0].classList.add('up')
})

timeList.addEventListener('click', event => {
    if (event.target.classList.contains('time-btn')) {
        time = parseInt(event.target.getAttribute('data-time'))
        currentMode = time
        scores = 0
        timeReady = 3
        screens[1].classList.add('up')
        ready()
        startGame()
    }
})

function startGame() {
    bestScore = playMode[`mode${currentMode}`].bestScore
    lastScore = playMode[`mode${currentMode}`].lastScore
    playCount = playMode[`mode${currentMode}`].playCount
    lastEl.innerHTML = playMode[`mode${currentMode}`].lastScore
    bestEl.innerHTML = playMode[`mode${currentMode}`].bestScore
    gameEl.innerHTML = playMode[`mode${currentMode}`].playCount
    playSpeedEl.innerHTML = `${currentMode}`

    timeEl.parentNode.classList.remove('hide')
    currentMode < 10 ? setTime(`0${currentMode}`) : setTime(currentMode)
    setTimeout(decreaseTime, 3000)
}

board.addEventListener('click', event => {
    if (event.target.classList.contains('circle')) {
        scores++
        event.target.remove()
        check = true
        createRandomCircle()
    }
})

board.addEventListener('click', event => {
    if (event.target.classList.contains('new-game')) {
        screens[1].classList.remove('up')
        playCount = playMode[`mode${currentMode}`].playCount
    }
})

function circleInterval() {
    const newCircleInterval = setInterval(() => {
        const circle = document.querySelector('.circle')
        if (circle) {
            if (check) {
                check = false
                clearInterval(newCircleInterval)
                circleInterval()
            } else {
                board.innerHTML = ''
                createRandomCircle()
            }
        } else {
            clearInterval(newCircleInterval)
        }

    }, lifeTime)
}

function ready() {
    board.innerHTML = `<h1>${timeReady}</h1>`
    const readyInterval = setInterval(() => {
        if (timeReady === 1) {
            clearInterval(readyInterval)
            board.innerHTML = ''
        } else {
            --timeReady
            board.innerHTML = `<h1>${timeReady}</h1>`
        }
    }, 1000)
}

function decreaseTime() {
    createRandomCircle()
    const interval = setInterval(() => {
        if (time === 0) {
            clearInterval(interval)
            finishGame()
        } else {
            let current = --time
            if (current < 10) {
                current = `0${current}`
            }
            setTime(current)
        }
    }, 1000)
    circleInterval()
}

function finishGame() {
    if (scores > bestScore) {
        bestScore = scores
    }
    lastScore = scores
    playCount++
    timeEl.parentNode.classList.add('hide')
    board.innerHTML = `<h1>Счёт: <span class="primary">${scores}</span></h1><p class="bestScore">Ваш лучший результат: ${bestScore}</p><hr><a class="new-game">Начать новую игру</a>`
    bestEl.innerHTML = `${bestScore}`
    gameEl.innerHTML = `${playCount}`

    playMode[`mode${currentMode}`].lastScore = lastScore
    playMode[`mode${currentMode}`].bestScore = bestScore
    playMode[`mode${currentMode}`].playCount = playCount

    console.log(playMode)
}

function setTime(value) {
    timeEl.innerHTML = `00:${value}`
}

function createRandomCircle() {
    const circle = document.createElement('div')
    const sizeCircle = randomSize(10, 50)
    const colorCircle = randomColor()
    const { width, height } = board.getBoundingClientRect()

    const x = randomSize(0, width - (sizeCircle + 10))
    const y = randomSize(0, height - (sizeCircle + 10))

    circle.classList.add('circle')
    circle.style.width = `${sizeCircle}px`
    circle.style.height = `${sizeCircle}px`
    circle.style.top = `${y}px`
    circle.style.left = `${x}px`
    circle.style.background = colors[colorCircle]

    board.append(circle)
}

function randomSize(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function randomColor() {
    return Math.floor(Math.random() * colors.length)
}