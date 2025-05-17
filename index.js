document.addEventListener('DOMContentLoaded', () => {
    // in real app, data generation would be done on the server side
    // and sent to the client
    const user = {id: 1, name: "John Doe", email: "John@Doe@com"};
    const flashcardsDataset = [ {matter: "math", flashcards: [
        { front: "What is 2 + 2?", back: "4" },
        { front: "What is the square root of 16?", back: "4" },
        { front: "What is the derivative of x^2?", back: "2x" },
        { front: "What is the integral of 1/x?", back: "ln|x| + C" },
        { front: "What is the value of pi?", back: "3.14" }]},
        {matter: "chemistry", flashcards: [
        { front: "What is the chemical symbol for water?", back: "H2O" },
        { front: "What is the pH of pure water?", back: "7" },
        { front: "What is the atomic number of carbon?", back: "6" },
        { front: "What is the formula for glucose?", back: "C6H12O6" },
        { front: "What is the main gas in Earth's atmosphere?", back: "Nitrogen (N2)" }]},
        {matter: "geography", flashcards: [
        { front: "What is the capital of France?", back: "Paris" },
        { front: "Which continent is Egypt located in?", back: "Africa" },
        { front: "What is the longest river in the world?", back: "Nile River" },
        { front: "Which ocean is the largest?", back: "Pacific Ocean" },
        { front: "What is the tallest mountain in the world?", back: "Mount Everest" }]}
    ];

    const matterData = [
        { icon: "fa-square-root-variable", id: "math", label: "math"}, 
        { icon: "fa-flask-vial", id: "chemistry", label: "chemistry"},    
        { icon: "fa-earth-europe", id: "geography", label: "geography"}, 
    ];


    let flashcardsData = [];
    let currentCardIndex = 0;
    let knownCards = 0;
    let unknownCards = 0;
    let isFlipped = false;

    const navlinks = document.getElementById('nav-links');
    const flashcardTitleEl = document.querySelector('.flashcard-app H1');
    const flashcardContainer = document.querySelector('.flashcard-container');
    const flashcardEl = document.querySelector('.flashcard');
    const frontFaceEl = document.querySelector('.flashcard-front');
    const backFaceEl = document.querySelector('.flashcard-back');
    const noFlashcardEl = document.querySelector('.noflashcard');
    const knowBtn = document.getElementById('know-btn');
    const dontKnowBtn = document.getElementById('dont-know-btn');
    const currentCardNumEl = document.getElementById('current-card-num');
    const totalCardsNumEl = document.getElementById('total-cards-num');
    const resultsEl = document.querySelector('.results');
    const knownCountEl = document.getElementById('known-count');
    const unknownCountEl = document.getElementById('unknown-count');
    const restartBtn = document.getElementById('restart-btn');
    const controlsEl = document.querySelector('.controls');
    const progressIndicatorEl = document.querySelector('.progress-indicator');
    const progressBarEl = document.querySelector('.progress-indicator div');

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    function loadCard(index) {
        if (index < 0 || index >= flashcardsData.length) {
            console.error("Invalid card index");
            return;
        }
        const card = flashcardsData[index];
        frontFaceEl.textContent = card.front;
        backFaceEl.textContent = card.back;
        currentCardNumEl.textContent = index + 1;
        progressBarEl.style.width = `${((index + 1) / flashcardsData.length) * 100}%`;
        isFlipped = false;
        flashcardEl.classList.remove('is-flipped');
    }

    function flipCard() {
        isFlipped = !isFlipped;
        flashcardEl.classList.toggle('is-flipped');
    }

    function nextCard(knewIt) {
        if (knewIt) {
            knownCards++;
        } else {
            unknownCards++;
        }

        currentCardIndex++;
        if (currentCardIndex < flashcardsData.length) {
            if (isFlipped) {
                flashcardEl.classList.remove('is-flipped');
                setTimeout(() => {
                    loadCard(currentCardIndex);
                }, 300);
            } else {
                loadCard(currentCardIndex);
            }
        } else {
            showResults();
        }
    }

    function showResults() {
        flashcardContainer.style.display = 'none';
        controlsEl.style.display = 'none';
        progressIndicatorEl.style.display = 'none';
        resultsEl.style.display = 'block';
        knownCountEl.textContent = knownCards;
        unknownCountEl.textContent = unknownCards;
    }

    function restartQuiz() {
        currentCardIndex = 0;
        knownCards = 0;
        unknownCards = 0;
        isFlipped = false;
        flashcardContainer.style.display = 'block';
        resultsEl.style.display = 'none';

        if (flashcardsData.length === 0) {
            flashcardEl.style.display = 'none';
            noFlashcardEl.innerHTML = `hello <b>${user.name}</b>, 
            <br>select matter on the left menu
            <br>to start the learning session 
            <br><br><i class="fa-solid fa-3x fa-user-graduate"></i>`;
            noFlashcardEl.style.display = 'block';
            controlsEl.style.display = 'none';
            progressIndicatorEl.style.display = 'none';
        } else {
            totalCardsNumEl.textContent = flashcardsData.length;
            shuffleArray(flashcardsData);
            loadCard(currentCardIndex);
            flashcardEl.style.display = 'block';
            noFlashcardEl.style.display = 'none';
            controlsEl.style.display = 'flex';
            progressIndicatorEl.style.display = 'block';
        }
    }

    // Event Listeners
    flashcardContainer.addEventListener('click', flipCard);

    knowBtn.addEventListener('click', () => {
        if (!isFlipped) flipCard();
        setTimeout(() => nextCard(true), isFlipped ? 500 : 1000);
    });

    dontKnowBtn.addEventListener('click', () => {
        if (!isFlipped) flipCard();
        setTimeout(() => nextCard(false), isFlipped ? 500 : 1000);
    });

    restartBtn.addEventListener('click', restartQuiz);

    // Initial Setup
    function initialize() {
        navlinks.innerHTML = matterData.map(item => `
            <li>
                <i class="fa-solid ${item.icon}"></i>
                <input type="radio" name="matter" id="${item.id}" />
                <label for="${item.id}">${item.label}</label>
            </li>
        `).join('');

        document.querySelectorAll('input[name="matter"]').forEach(input => {
            input.addEventListener('change', (event) => {
                const selectedMatter = event.target.id;
                const item = matterData.find(dataset => dataset.id === selectedMatter);
                flashcardTitleEl.innerHTML = `${item.label.toUpperCase()}<br><i class="fa-solid ${item.icon}"></i>`;
                flashcardsData = flashcardsDataset.find(dataset => dataset.matter === selectedMatter).flashcards;
                restartQuiz();
            });
        });
        restartQuiz();        
    }

    initialize();
});