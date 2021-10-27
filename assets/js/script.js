document.getElementById('reset').addEventListener('click', () => location.reload());
const numbersTableElement = document.getElementById('numbers');
const timerElement = document.getElementById('timer');
const currentElement = document.getElementById('currentNumber');

const gameIntervals = [
    {max: 7, min: 0, message: 'غیر قابل باور!! عالی'},
    {max: 10, min: 8, message: 'فوق العاده هستید.'},
    {max: 15, min: 11, message: 'بسیار سریع هستید. عالی!'},
    {max: 20, min: 16, message: '!نسبت به سایرین سرعت عمل خوبی دارید. احسنت.'},
    {max: 30, min: 21, message: 'دمت گرم! عجب سرعتی!'},
    {max: 40, min: 31, message: 'سرعت خوبی دارید، با تمرین می‌تونید بهتر عمل کنید.'},
    {max: 50, min: 41, message: 'بد نبود! قطعا می‌تونی بهتر از این باشی!'},
    {max: 70, min: 51, message: 'دوباره امتحان کن، حدس می‌زنم بهتر از این می‌شه.'},
    {max: 90, min: 71, message: 'تلاش کن بهتر از این بشه!'},
    {max: 120, min: 91, message: 'سرعت عملت خوب نبود، اما قطعا می‌تونی بهتر از این عمل کنی.'}    
];

let timer;
let currentNumber = 1;
let seconds = 0;

const random = (min, max) => Math.floor(Math.random() * (max - min) + min);


const getRandomPosition = (positions) => {
    while (true) {
        const randomPos = random(0, 25);
        if (!positions[randomPos] || positions[randomPos].length < 2) return randomPos;
    }
}

const getPositions = () => {
    const positions = [];
    for (let i = 1; i <= 50; i++) {
        const randomPosition = getRandomPosition(positions);
        if (!positions[randomPosition])
            positions[randomPosition] = [];

        positions[randomPosition].push(i);
    }
    return positions;
}

const getScoreMessage = () => {
    let result = '';

    for (const interval of gameIntervals) {
        if (interval.min <= seconds && seconds <= interval.max) {
            result = interval.message;
            break;
        }
    }

    return result ? result : 'متاسفانه سرعت عمل تون کافی نبود، مجدد تلاش کنید.';
};

const initResult = () => {
    clearInterval(timer);
    numbersTableElement.innerHTML = "تمام شد.";
    document.getElementById('message').innerHTML = getScoreMessage();
    document.getElementById('score').innerHTML = seconds.toFixed(0);

    const resultElement = document.getElementById('result');
    resultElement.classList.remove('visually-hidden');
    resultElement.classList.add('zoom-effect');
};

const initBlocks = () => {
    const positions = getPositions();

    numbersTableElement.innerHTML = "";
    let block = document.createElement('div');
    block.classList.add('block');

    for (let i = 0; i < positions.length; i++) {
        const cell = document.createElement('span');
        cell.classList.add('cell');
        cell.setAttribute('data-numbers', positions[i].toString());
        cell.innerHTML = positions[i][0];

        cell.addEventListener('click', function () {
            const cellCurrentNumber = Number(this.innerHTML);

            if (currentNumber !== cellCurrentNumber)
                return;

            if (currentNumber === 1 && cellCurrentNumber === 1) timer = setInterval(() => timerElement.innerHTML = (seconds += 0.1).toFixed(2), 100);
            else if (currentNumber === 50 && cellCurrentNumber === 50) initResult();

            const cellNumbers = this.getAttribute('data-numbers').split(',');
            const nextNumber = cellNumbers[cellNumbers.indexOf(this.innerHTML) + 1];

            if (nextNumber === undefined)
                this.classList.add('hidden');
            else
                this.innerHTML = nextNumber;

            currentElement.innerHTML = currentNumber === 50 ? "پایان" : ++currentNumber;
        });

        block.appendChild(cell);

        if ((i + 1) % 5 === 0) {
            numbersTableElement.appendChild(block);
            block = document.createElement('div');
            block.classList.add('block');
        }
    }

}



initBlocks();
