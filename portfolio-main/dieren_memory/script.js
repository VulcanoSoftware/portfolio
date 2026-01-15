class Kaart {
    constructor(element, id, naam, geluid) {
        this.element = element;
        this.id = id;
        this.naam = naam;
        this.geluid = geluid;
        this.isFlipped = false;
        this.element.addEventListener('click', () => this.flip());
    }

    flip() {
        if (!this.game || this.game.isLocked || this == this.game.firstCard) return;

        this.element.classList.add('flipped');
        this.isFlipped = true;
        this.game.KaartFlip(this);
    }

    unflip() {
        if (this.element.classList.contains('correct')) return;
        this.element.classList.remove('flipped');
        this.isFlipped = false;
    }

    disable() {
        this.element.removeEventListener('click', () => this.flip());
        this.element.classList.add('correct');
    }

    geluidaankaart() {
        this.element.addEventListener('click', () => {
            this.game.playSound(this.geluid);
        });
    }

    setGame(game) {
        this.game = game;
    }
}

class Game {
    constructor() {
        this.cards = [];
        this.score = 0;
        this.aantalCombos = 0;
        this.isLocked = false;
        this.firstCard = null;
        this.secondCard = null;
        this.audioPlayer = new Audio();
        this.scoreElement = document.getElementById('score');
        this.gewonnenDiv = document.getElementById('gewonnen');
        this.verlorenDiv = document.getElementById('verloren');
        this.winsdiv = document.getElementById('wins');
        this.timerdiv = document.getElementById('timer');

        this.kaartData = [
            { id: 1, naam: "hond", geluid: "./sounds/dog.mp3" },
            { id: 2, naam: "kat", geluid: "./sounds/cat.mp3" },
            { id: 3, naam: "konijn", geluid: "./sounds/konijn.mp3" },
            { id: 4, naam: "kip", geluid: "./sounds/chicken.mp3" },
            { id: 5, naam: "paard", geluid: "./sounds/paard.mp3" },
            { id: 6, naam: "schildpad", geluid: "./sounds/turtle.mp3" },
            { id: 7, naam: "leeuw", geluid: "./sounds/leeuw.mp3" },
            { id: 8, naam: "koe", geluid: "./sounds/koe.mp3" },
            { id: 9, naam: "varken", geluid: "./sounds/varken.mp3" },
            { id: 10, naam: "schaap", geluid: "./sounds/schaap.mp3" },
            { id: 11, naam: "papegaai", geluid: "./sounds/parrot.mp3" },
            { id: 12, naam: "ezel", geluid: "./sounds/incorrect.mp3" }
        ];

        this.start();
        this.timer();
    }

    resetGame() {
        this.score = 0;
        this.aantalCombos = 0;
        this.isLocked = false;
        this.firstCard = null;
        this.secondCard = null;
        this.scoreElement.textContent = this.score;
        this.hideElement(this.gewonnenDiv);
        this.hideElement(this.verlorenDiv);

        this.cards.forEach(card => {
            card.unflip();
            card.isFlipped = false;
            card.element.classList.remove('correct');
            card.element.classList.remove('flipped');
            card.element.removeEventListener('click', () => card.flip());
            card.element.addEventListener('click', () => card.flip());
        });

        this.shuffle();
        console.log("reset");
        this.timer();
    }

    timer() {
        this.now = parseInt(new Date().getTime());
        this.countdowntime = parseInt(this.now + 182 * 1000);

        this.interval = setInterval(() => {
            this.timenow = parseInt(new Date().getTime());
            this.distance = this.countdowntime - this.timenow;
            this.printdistance = Math.floor(this.distance / 1000);
            this.minuten = Math.floor(this.printdistance / 60);
            this.seconden = this.printdistance % 60;
            this.timerprint = (this.minuten + " : " + this.seconden)
            console.log(this.timerprint)
            this.timerdiv.textContent = this.timerprint;
            console.log(this.minuten, " minuten ", this.seconden, " seconden");

            if (this.minuten < 1 && this.seconden < 1) {
                console.log("ben je daar")
                this.timerdiv.innerHTML = "Tijd is om";
                clearInterval(this.interval);
            }
        }, 1000);
    }

    start() {
        this.hideElement(this.gewonnenDiv);
        this.hideElement(this.verlorenDiv);
        const cardElements = document.querySelectorAll('.memory-card');

        this.wins = 0
        if ("wins" in localStorage) {
            this.wins = parseInt(localStorage.getItem("wins"));
            console.log(this.wins)
        } else {
            this.wins = 0
        }

        this.winsdiv.textContent = this.wins;

        cardElements.forEach(element => {
            const cardId = element.dataset.card;
            const cardData = this.kaartData.find(data => data.id == cardId);
            const card = new Kaart(element, cardId, cardData.naam, cardData.geluid);
            card.setGame(this);
            this.cards.push(card);
        });

        this.shuffle();
    }

    KaartFlip(card) {
        if (!this.firstCard) {
            this.firstCard = card;
            return;
        }

        this.secondCard = card;
        this.checkForMatch();
    }

    checkForMatch() {
        const isMatch = this.firstCard.id == this.secondCard.id;

        if (isMatch) {
            this.handleMatch();
        } else {
            this.handleMismatch();
        }
    }

    handleMatch() {
        this.score += 1;
        this.scoreElement.textContent = this.score;
        this.playSound("./sounds/correct.mp3");

        this.firstCard.disable();
        this.secondCard.disable();

        this.firstCard.geluidaankaart();
        this.secondCard.geluidaankaart();

        this.aantalCombos++;

        if (this.aantalCombos == this.kaartData.length) {
            this.handleWin();
        }

        this.resetBoard();
    }

    handleMismatch() {
        this.isLocked = true;
        this.playSound("./sounds/incorrect.mp3");

        setTimeout(() => {
            this.firstCard.unflip();
            this.secondCard.unflip();
            this.resetBoard();
        }, 1000);
    }

    handleWin() {
        setTimeout(() => {
            if (this.minuten == 0 && this.seconden == 0) {
                console.log("niet binnen de tijd");
                alert("niet binnen de tijd")
                this.showElement(this.verlorenDiv);
                this.timerdiv.textContent = "Verloren"
            }
            else {
                this.wins += 1;
                localStorage.setItem("wins", this.wins);
                this.winsdiv.textContent = this.wins;
                console.log("gewonnen !");
                alert("gewonnen !");
                this.showElement(this.gewonnenDiv);
                this.timerdiv.textContent = "Gewonnen !"
            }
        }, 2000);
    }

    resetBoard() {
        this.isLocked = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    shuffle() {
        this.cards.forEach(card => {
            const randomPos = Math.floor(Math.random() * this.cards.length);
            card.element.style.order = randomPos;
        });
    }

    playSound(src) {
        if (!this.audioPlayer.paused) {
            this.audioPlayer.pause();
            this.audioPlayer.currentTime = 0;
        }
        this.audioPlayer.src = src;
        this.audioPlayer.play();
    }

    hideElement(element) {
        element.style.display = 'none';
    }

    showElement(element) {
        element.style.display = 'block';
    }
}

window.addEventListener('load', () => {
    let playagainbtn = document.getElementById('playagain');

    let game = new Game();
    playagainbtn.addEventListener('click', () => {
        game.resetGame();
    })
});