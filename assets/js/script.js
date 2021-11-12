(function () {

    const numbersTableElement = document.getElementById('numbers');
    const timerElement = document.getElementById('timer');
    const currentElement = document.getElementById('currentNumber');
    const bestScoreElement = document.getElementById('bestScore');
    const themeSwitchElement = document.getElementById('themeSwitch');

    const user = window.localStorage['user'] ? JSON.parse(window.localStorage['user']) : {dark: false, best: 0};
    const gameIntervals = [
        { min: 0, max: 29, message: "غیرقابل باور!! عالی!!" },
        { min: 30, max: 39, message: "شما جزء برترین‌ها هستید :)" },
        { min: 40, max: 59, message: "سرعت‌عمل بالایی دارید." },
        { min: 60, max: 79, message: "خوب هستید و جای پیشرفت دارید." },
        { min: 80, max: 99, message: "در وضعیت مناسب و طبیعی قرار دارید." },
        { min: 100, max: 130, message: "با تمرین و تلاش می‌توانید به درجات بالایی برسید." }
    ];

    let timer;
    let currentNumber = 1;
    let seconds = 0;

    const random = (min, max) => Math.floor(Math.random() * (max - min) + min);

    const setUserStatus = (user, status, value) => {
        user[status] = value;
        window.localStorage['user'] = JSON.stringify(user);
    }

    const getRandomPosition = (positions) => {
        while (true) {
            const randomPos = random(0, 25);
            if (positions[randomPos] === undefined || positions[randomPos].length < 2) return randomPos;
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

    const getScore = () => {
        const result = { message: 'در آستانه پیر مغزی هستید.', target: document.querySelector('[data-range="130>="]') };

        for (const interval of gameIntervals) {
            if (interval.min <= seconds && seconds <= interval.max) {
                result.message = interval.message;
                result.target = document.querySelector(`[data-range="${interval.min}-${interval.max}"]`);
                break;
            }
        }

        return result;
    };

    const initResult = () => {
        clearInterval(timer);
        seconds = seconds.toFixed(0);
        numbersTableElement.innerHTML = "تمام شد.";

        const score = getScore();
        document.getElementById('message').innerHTML = score.message;
        score.target.classList = score.target.classList.toString().replace('btn-outline', 'btn');
        document.getElementById('score').innerHTML = seconds;

        const resultElement = document.getElementById('result');
        resultElement.classList.remove('visually-hidden');

        if (seconds < user.best) {
            bestScoreElement.innerHTML = seconds;
            setUserStatus(user, 'best', seconds);
        }
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

    const changeTheme = (dark) => {
        document.body.style = dark ? "--bs-body-bg: var(--bs-dark); --bs-body-color: var(--bs-light);" : "";
        setUserStatus(user, 'dark', dark);
    }
    
    initBlocks();

    themeSwitchElement.addEventListener('change', () => changeTheme(themeSwitchElement.checked));
    if (user.dark)
        changeTheme(true);

    themeSwitchElement.checked = user.dark;
    bestScoreElement.innerHTML = user.best;

    document.getElementById('reset').addEventListener('click', () => location.reload());
})();