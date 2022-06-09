const size = 14
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const words = ['MAÇÃ', 'PERA', 'BANANA', 'MAMÃO', 'MORANGO']
const main = document.querySelector('main')
var lettersPicked = []
var rowsTaken = []
var table = []
var foundWords = 0
var audio = new Audio()

for (let x = 0; x < size; x++) {
	for (let y = 0; y < size; y++) {
		let div
		if (!table[x]) {
			table[x] = []
			div = document.createElement('div')
			main.appendChild(div)
		}
		div = document.querySelector(`div:nth-of-type(${x + 1})`)
		table[x][y] = letters[Math.floor(Math.random() * letters.length)]
		let el = document.createElement('span')
		el.setAttribute(`data-x-y`, `${x}-${y}`)
		el.innerHTML = table[x][y]
		div.appendChild(el)
	}
}

words.forEach(w => {
	let letters = w.split('')
	let row = getRandomRow()
	let start = getRandomColumn(row, w)
	rowsTaken.push(row)
	for (let i = 0; i < letters.length; i++) {
		table[row][i + start] = letters[i]
		let span = document.querySelector(`span[data-x-y='${row}-${i + start}']`)
		span.innerHTML = letters[i]
		span.setAttribute('data-word', w)
	}
})

function getRandomRow() {
	let row = table.indexOf(table[Math.floor(Math.random() * table.length)])
	if (rowsTaken.includes(row)) return getRandomRow()
	return row
}

function getRandomColumn(row, word) {
	let column = table[row].indexOf(table[row][Math.floor(Math.random() * table[row].length)])
	if ((column + word.length) > table[row].length) return getRandomColumn(row, word)
	return column
}

document.onclick = e => {
	if (e.target.tagName.toLocaleLowerCase() != 'span') return
	if (e.target.classList.contains('active')) {
		e.target.classList.remove('active')
		let i = lettersPicked.indexOf(e.target)
		lettersPicked.splice(i, 1)
		audio.src = 'audio/cancel.mp3'
		audio.currentTime = 0
		audio.play()
	} else if (!e.target.classList.contains('found')) {
		audio.src = 'audio/cursor.mp3'
		audio.currentTime = 0
		audio.play()
		e.target.classList.add('active')
		if (e.target.getAttribute('data-word')) lettersPicked.push(e.target)
	}
	words.some(w => {
		let letters = w.split('').sort().toString()
		let picked = lettersPicked.slice().filter(el => el.getAttribute('data-word') == w).map(el => el.innerHTML).filter(el => el).sort().toString()
		let match = letters == picked
		if (match) {
			foundWords++
			setTimeout(() => {
				if (foundWords == words.length) audio.src = 'audio/fanfare.mp3'
				else audio.src = 'audio/score.mp3'
				audio.currentTime = 0
				audio.play()
			}, 150)
			lettersPicked.splice(0)
			let spans = document.querySelectorAll(`span[data-word='${w}']`)
			spans.forEach(s => {
				s.classList.remove('active')
				s.classList.add('found')
			})
		}
		return match
	})
}