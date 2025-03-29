/**
 * Dictionary App - Main JavaScript File
 * Handles all interactive functionality including:
 * - Theme toggling
 * - Word searching and display
 * - Local storage management
 * - Dynamic content updates
 */

// ===== DOM ELEMENT SELECTORS =====
const themeToggle = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const wordDisplay = document.getElementById('word-display');
const suggestionsContainer = document.getElementById('suggestions');
const historyList = document.getElementById('history-list');
const favoritesList = document.getElementById('favorites-list');

// ===== ERROR HANDLING =====
function showError(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    ${message}
  `;
  document.querySelector('.container').prepend(errorEl);
  setTimeout(() => errorEl.remove(), 3000);
}

// ===== THEME TOGGLE FUNCTIONALITY =====
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDarkMode 
        ? '<i class="fas fa-sun"></i><span>Light Mode</span>' 
        : '<i class="fas fa-moon"></i><span>Dark Mode</span>';
});

// ===== WORD OF THE DAY FUNCTIONALITY =====
const wotdWords = [
    { word: "Serendipity", meaning: "Finding something good without looking for it", fact: "Comes from a Persian fairy tale!" },
    { word: "Petrichor", meaning: "The smell of rain on dry earth", fact: "Coined in 1964 by Australian scientists" },
    { word: "Ephemeral", meaning: "Lasting for a very short time", fact: "From Greek 'ephemeros' (lasting a day)" },
    { word: "Liminal", meaning: "Relating to a transitional stage", fact: "Often used in psychology and architecture" },
    { word: "Sonder", meaning: "Realizing everyone has a complex life", fact: "Popularized by The Dictionary of Obscure Sorrows" }
];

function setWordOfTheDay() {
    const randomWord = wotdWords[Math.floor(Math.random() * wotdWords.length)];
    document.getElementById('wotd-word').textContent = randomWord.word;
    document.getElementById('wotd-meaning').textContent = randomWord.meaning;
    document.getElementById('wotd-fact').textContent = `Did you know? "${randomWord.fact}"`;
}
setWordOfTheDay();

// ===== WORD SUGGESTIONS FUNCTIONALITY =====
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

function loadSuggestions() {
    suggestionsContainer.innerHTML = interestingWords.map(word => `
        <div class="suggestion-card" data-word="${word.word}" role="button" tabindex="0">
            <div class="suggestion-word">${word.word}</div>
            <div class="suggestion-meaning">${word.meaning}</div>
        </div>
    `).join('');

    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', () => {
            searchInput.value = card.getAttribute('data-word');
            fetchWord(card.getAttribute('data-word'));
        });
    });
}
loadSuggestions();

// ===== DICTIONARY API INTEGRATION =====
async function fetchWord(word) {
    if (!word) return;

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        if (data.title === 'No Definitions Found') {
            showError('Word not found! check spelling or Try another.');
            return;
        }

        const wordData = data[0];
        const firstMeaning = wordData.meanings[0];
        
        const definition = firstMeaning.definitions[0].definition;
        const example = firstMeaning.definitions[0].example || "No example available";
        const synonyms = firstMeaning.synonyms.slice(0, 5);
        const phonetic = wordData.phonetic || wordData.phonetics.find(p => p.text)?.text || '';

        document.getElementById('searched-word').textContent = wordData.word;
        document.getElementById('phonetic').textContent = phonetic;
        document.getElementById('definition').textContent = definition;
        document.getElementById('example-text').textContent = example;
        
        const synonymsContainer = document.getElementById('synonyms');
        synonymsContainer.innerHTML = synonyms.length > 0 
            ? synonyms.map(syn => `<span class="synonym">${syn}</span>`).join('')
            : '<span>No synonyms found</span>';

        const audioBtn = document.getElementById('play-audio');
        const audioSrc = wordData.phonetics.find(p => p.audio)?.audio;
        if (audioSrc) {
            audioBtn.onclick = () => new Audio(audioSrc).play();
            audioBtn.style.display = 'flex';
        } else {
            audioBtn.style.display = 'none';
        }

        wordDisplay.style.display = 'block';
        addToHistory(wordData.word);

    } catch (error) {
        showError('Error fetching word. Try again later.');
        console.error('API Error:', error);
    }
}

// ===== SEARCH FUNCTIONALITY =====
searchBtn.addEventListener('click', () => {
    const word = searchInput.value.trim();
    if (word) fetchWord(word);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const word = searchInput.value.trim();
        if (word) fetchWord(word);
    }
});

// ===== HISTORY & FAVORITES MANAGEMENT =====
function addToHistory(word) {
    let history = JSON.parse(localStorage.getItem('wordHistory')) || [];
    if (!history.includes(word)) {
        history.unshift(word);
        if (history.length > 5) history.pop();
        localStorage.setItem('wordHistory', JSON.stringify(history));
        updateHistoryList();
    }
}

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

function removeFromHistory(word) {
    let history = JSON.parse(localStorage.getItem('wordHistory')) || [];
    history = history.filter(w => w !== word);
    localStorage.setItem('wordHistory', JSON.stringify(history));
    updateHistoryList();
}

document.getElementById('save-favorite').addEventListener('click', function() {
    const word = document.getElementById('searched-word').textContent;
    if (!word) return;
    
    let favorites = JSON.parse(localStorage.getItem('wordFavorites')) || [];
    
    if (!favorites.includes(word)) {
        favorites.push(word);
        localStorage.setItem('wordFavorites', JSON.stringify(favorites));
        updateFavoritesList();
        this.innerHTML = '<i class="fas fa-check"></i> Saved!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-heart"></i> Save to Favorites';
        }, 2000);
    } else {
        this.innerHTML = '<i class="fas fa-heart"></i> Already Saved';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-heart"></i> Save to Favorites';
        }, 2000);
    }
});

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

function removeFromFavorites(word) {
    let favorites = JSON.parse(localStorage.getItem('wordFavorites')) || [];
    favorites = favorites.filter(w => w !== word);
    localStorage.setItem('wordFavorites', JSON.stringify(favorites));
    updateFavoritesList();
    
    const currentWord = document.getElementById('searched-word').textContent;
    if (currentWord === word) {
        document.getElementById('save-favorite').innerHTML = '<i class="fas fa-heart"></i> Save to Favorites';
    }
}

updateHistoryList();
updateFavoritesList();   

