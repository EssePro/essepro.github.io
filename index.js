document.addEventListener('DOMContentLoaded', () => {
    const flashcardsData = [
        { front: "What is the capital of France?", back: "Paris" },
        { front: "What is 2 + 2?", back: "4" },
        { front: "What is the chemical symbol for water?", back: "H₂O" },
        { front: "Who wrote 'Romeo and Juliet'?", back: "William Shakespeare" },
        { front: "What planet is known as the Red Planet?", back: "Mars" },
        { front: "What is the largest ocean on Earth?", back: "Pacific Ocean" }
    ];

    let currentCardIndex = 0;
    let knownCards = 0;
    let unknownCards = 0;
    let isFlipped = false;

    const flashcardContainer = document.querySelector('.flashcard-container');
    const flashcardEl = document.querySelector('.flashcard');
    const frontFaceEl = document.querySelector('.flashcard-front');
    const backFaceEl = document.querySelector('.flashcard-back');
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
            // Small delay to allow unflip animation if card was flipped
            if (isFlipped) {
                 // Unflip smoothly before changing content
                flashcardEl.classList.remove('is-flipped');
                setTimeout(() => {
                    loadCard(currentCardIndex);
                }, 300); // Half of transition time
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
        shuffleArray(flashcardsData); // Shuffle for a new order
        loadCard(currentCardIndex);

        flashcardContainer.style.display = 'block'; // Or 'flex' if needed by inner styles
        controlsEl.style.display = 'flex';
        progressIndicatorEl.style.display = 'block';
        resultsEl.style.display = 'none';
    }

    // Event Listeners
    flashcardContainer.addEventListener('click', flipCard);

    knowBtn.addEventListener('click', () => {
        if (!isFlipped) flipCard(); // Reveal answer if not already shown
        // Give a moment to see the answer before moving to next card
        setTimeout(() => nextCard(true), isFlipped ? 500 : 1000);
    });

    dontKnowBtn.addEventListener('click', () => {
        if (!isFlipped) flipCard(); // Reveal answer
        setTimeout(() => nextCard(false), isFlipped ? 500 : 1000);
    });

    restartBtn.addEventListener('click', restartQuiz);

    // Initial Setup
    function initialize() {
        if (flashcardsData.length === 0) {
            flashcardContainer.innerHTML = "<p>No flashcards available.</p>";
            controlsEl.style.display = 'none';
            progressIndicatorEl.style.display = 'none';
            return;
        }
        shuffleArray(flashcardsData);
        totalCardsNumEl.textContent = flashcardsData.length;
        loadCard(currentCardIndex);
    }

    initialize();
});