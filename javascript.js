/**
 * Dictionary App - Main JavaScript File
 * Handles all interactive functionality including:
 * - Theme toggling
 * - Word searching and display
 * - Local storage management
 * - Dynamic content updates
 */

// ===== DOM ELEMENT SELECTORS =====
// Get references to all interactive elements
const themeToggle = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const wordDisplay = document.getElementById('word-display');
const wordOfTheDay = document.getElementById('word-of-the-day');
const suggestionsContainer = document.getElementById('suggestions');
const historyList = document.getElementById('history-list');
const favoritesList = document.getElementById('favorites-list');

// ===== THEME TOGGLE FUNCTIONALITY =====
/**
 * Toggles between dark and light color themes
 * Updates button icon and text to reflect current theme
 */
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDarkMode 
        ? '<i class="fas fa-sun"></i><span>Light Mode</span>' 
        : '<i class="fas fa-moon"></i><span>Dark Mode</span>';
});

// ===== WORD OF THE DAY FUNCTIONALITY =====
/**
 * Array of words with their meanings and interesting facts
 * Used to display a different word each day
 */
const wotdWords = [
    { word: "Serendipity", meaning: "Finding something good without looking for it", fact: "Comes from a Persian fairy tale!" },
    { word: "Petrichor", meaning: "The smell of rain on dry earth", fact: "Coined in 1964 by Australian scientists" },
    { word: "Ephemeral", meaning: "Lasting for a very short time", fact: "From Greek 'ephemeros' (lasting a day)" },
    { word: "Liminal", meaning: "Relating to a transitional stage", fact: "Often used in psychology and architecture" },
    { word: "Sonder", meaning: "Realizing everyone has a complex life", fact: "Popularized by The Dictionary of Obscure Sorrows" }
];

/**
 * Selects and displays a random word from the wotdWords array
 */
function setWordOfTheDay() {
    const randomWord = wotdWords[Math.floor(Math.random() * wotdWords.length)];
    document.getElementById('wotd-word').textContent = randomWord.word;
    document.getElementById('wotd-meaning').textContent = randomWord.meaning;
    document.getElementById('wotd-fact').textContent = `Did you know? "${randomWord.fact}"`;
}

// Initialize word of the day on page load
setWordOfTheDay();

// ===== WORD SUGGESTIONS FUNCTIONALITY =====
/**
 * Array of interesting words to suggest to users
 */
const interestingWords = [
    { word: "Defenestration", meaning: "The act of throwing someone out a window" },
    { word: "Hiraeth", meaning: "Nostalgia for a home you can't return to" },
    { word: "Mellifluous", meaning: "Sweet or musical sounding" },
    { word: "Sesquipedalian", meaning: "Given to using long words" },
    { word: "Zephyr", meaning: "A gentle breeze" },
    { word: "Quixotic", meaning: "Extremely idealistic" },
    { word: "Luminous", meaning: "Full of light" },
    { word: "Ineffable", meaning: "Too great to be expressed in words" }
];

/**
 * Creates suggestion cards for each word in interestingWords array
 * Sets up click handlers to populate search field and fetch word data
 */
function loadSuggestions() {
    suggestionsContainer.innerHTML = interestingWords.map(word => `
        <div class="suggestion-card" data-word="${word.word}" role="button" tabindex="0">
            <div class="suggestion-word">${word.word}</div>
            <div class="suggestion-meaning">${word.meaning}</div>
        </div>
    `).join('');

    // Add click event to each suggestion card
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', () => {
            searchInput.value = card.getAttribute('data-word');
            fetchWord(card.getAttribute('data-word'));
        });
    });
}

// Load suggestions on page initialization
loadSuggestions();

// ===== DICTIONARY API INTEGRATION =====
/**
 * Fetches word data from the dictionary API
 * @param {string} word - The word to look up
 */
async function fetchWord(word) {
    if (!word) return;

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        // Handle case where word isn't found
        if (data.title === 'No Definitions Found') {
            alert('Word not found! Try another.');
            return;
        }

        const wordData = data[0];
        const firstMeaning = wordData.meanings[0];
        
        // Extract word details from API response
        const definition = firstMeaning.definitions[0].definition;
        const example = firstMeaning.definitions[0].example || "No example available";
        const synonyms = firstMeaning.synonyms.slice(0, 5);
        const phonetic = wordData.phonetic || wordData.phonetics.find(p => p.text)?.text || '';

        // Update DOM with fetched word data
        document.getElementById('searched-word').textContent = wordData.word;
        document.getElementById('phonetic').textContent = phonetic;
        document.getElementById('definition').textContent = definition;
        document.getElementById('example-text').textContent = example;
        
        // Update synonyms display
        const synonymsContainer = document.getElementById('synonyms');
        synonymsContainer.innerHTML = synonyms.length > 0 
            ? synonyms.map(syn => `<span class="synonym">${syn}</span>`).join('')
            : '<span>No synonyms found</span>';

        // Handle audio pronunciation if available
        const audioBtn = document.getElementById('play-audio');
        const audioSrc = wordData.phonetics.find(p => p.audio)?.audio;
        if (audioSrc) {
            audioBtn.onclick = () => new Audio(audioSrc).play();
            audioBtn.style.display = 'flex';
        } else {
            audioBtn.style.display = 'none';
        }

        // Show the word display section
        wordDisplay.style.display = 'block';

        // Add to search history
        addToHistory(wordData.word);

    } catch (error) {
        alert('Error fetching word. Try again later.');
        console.error('API Error:', error);
    }
}

// ===== SEARCH FUNCTIONALITY =====
// Handle search button click
searchBtn.addEventListener('click', () => {
    const word = searchInput.value.trim();
    if (word) fetchWord(word);
});

// Handle Enter key in search input
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const word = searchInput.value.trim();
        if (word) fetchWord(word);
    }
});

// ===== HISTORY & FAVORITES MANAGEMENT =====
/**
 * Adds a word to search history in localStorage
 * @param {string} word - The word to add to history
 */
function addToHistory(word) {
    let history = JSON.parse(localStorage.getItem('wordHistory')) || [];
    if (!history.includes(word)) {
        history.unshift(word);
        // Keep only the 5 most recent searches
        if (history.length > 5) history.pop();
        localStorage.setItem('wordHistory', JSON.stringify(history));
        updateHistoryList();
    }
}

/**
 * Updates the history list in the DOM
 */
function updateHistoryList() {
    const history = JSON.parse(localStorage.getItem('wordHistory')) || [];
    historyList.innerHTML = history.map(word => `
        <li>
            <span class="word-text" onclick="fetchWord('${word}')">${word}</span>
            <button class="delete-btn" onclick="removeFromHistory('${word}')" aria-label="Remove from history">
                <i class="fas fa-times"></i>
            </button>
        </li>
    `).join('');
}

/**
 * Removes a word from history
 * @param {string} word - The word to remove
 */
function removeFromHistory(word) {
    let history = JSON.parse(localStorage.getItem('wordHistory')) || [];
    history = history.filter(w => w !== word);
    localStorage.setItem('wordHistory', JSON.stringify(history));
    updateHistoryList();
}

/**
 * Handles saving/unsaving words to favorites
 */
document.getElementById('save-favorite').addEventListener('click', function() {
    const word = document.getElementById('searched-word').textContent;
    if (!word) return;
    
    let favorites = JSON.parse(localStorage.getItem('wordFavorites')) || [];
    
    if (!favorites.includes(word)) {
        // Add to favorites
        favorites.push(word);
        localStorage.setItem('wordFavorites', JSON.stringify(favorites));
        updateFavoritesList();
        this.innerHTML = '<i class="fas fa-check"></i> Saved!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-heart"></i> Save to Favorites';
        }, 2000);
    } else {
        // Already in favorites
        this.innerHTML = '<i class="fas fa-heart"></i> Already Saved';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-heart"></i> Save to Favorites';
        }, 2000);
    }
});

/**
 * Updates the favorites list in the DOM
 */
function updateFavoritesList() {
    const favorites = JSON.parse(localStorage.getItem('wordFavorites')) || [];
    favoritesList.innerHTML = favorites.map(word => `
        <li>
            <span class="word-text" onclick="fetchWord('${word}')">${word}</span>
            <button class="delete-btn" onclick="removeFromFavorites('${word}')" aria-label="Remove from favorites">
                <i class="fas fa-times"></i>
            </button>
        </li>
    `).join('');
}

/**
 * Removes a word from favorites
 * @param {string} word - The word to remove
 */
function removeFromFavorites(word) {
    let favorites = JSON.parse(localStorage.getItem('wordFavorites')) || [];
    favorites = favorites.filter(w => w !== word);
    localStorage.setItem('wordFavorites', JSON.stringify(favorites));
    updateFavoritesList();
    
    // Update favorite button if viewing removed word
    const currentWord = document.getElementById('searched-word').textContent;
    if (currentWord === word) {
        document.getElementById('save-favorite').innerHTML = '<i class="fas fa-heart"></i> Save to Favorites';
    }
}

// Initialize history and favorites lists on page load
updateHistoryList();
updateFavoritesList();     

