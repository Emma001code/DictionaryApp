// ===== DOM ELEMENTS =====
const themeToggle = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const wordDisplay = document.getElementById('word-display');
const wordOfTheDay = document.getElementById('word-of-the-day');
const suggestionsContainer = document.getElementById('suggestions');
const historyList = document.getElementById('history-list');
const favoritesList = document.getElementById('favorites-list');

// ===== THEME TOGGLE =====
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDarkMode 
        ? '<i class="fas fa-sun"></i><span>Light Mode</span>' 
        : '<i class="fas fa-moon"></i><span>Dark Mode</span>';
});

// ===== WORD OF THE DAY =====
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

// ===== WORD SUGGESTIONS =====
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
        <div class="suggestion-card" data-word="${word.word}">
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

// ===== DICTIONARY API =====
async function fetchWord(word) {
    if (!word) return;

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        if (data.title === 'No Definitions Found') {
            alert('Word not found! Try another.');
            return;
        }

        const wordData = data[0];
        const firstMeaning = wordData.meanings[0];
        const definition = firstMeaning.definitions[0].definition;
        const example = firstMeaning.definitions[0].example || "No example available";
        const synonyms = firstMeaning.synonyms.slice(0, 5);
        const phonetic = wordData.phonetic || wordData.phonetics.find(p => p.text)?.text || '';

        // Display the word
        document.getElementById('searched-word').textContent = wordData.word;
        document.getElementById('phonetic').textContent = phonetic;
        document.getElementById('definition').textContent = definition;
        document.getElementById('example-text').textContent = example;
        
        // Update synonyms
        const synonymsContainer = document.getElementById('synonyms');
        synonymsContainer.innerHTML = synonyms.length > 0 
            ? synonyms.map(syn => `<span class="synonym">${syn}</span>`).join('')
            : '<span>No synonyms found</span>';

        // Audio pronunciation
        const audioBtn = document.getElementById('play-audio');
        const audioSrc = wordData.phonetics.find(p => p.audio)?.audio;
        if (audioSrc) {
            audioBtn.onclick = () => new Audio(audioSrc).play();
            audioBtn.style.display = 'flex';
        } else {
            audioBtn.style.display = 'none';
        }

        // Show word display
        wordDisplay.style.display = 'block';

        // Add to history
        addToHistory(wordData.word);

    } catch (error) {
        alert('Error fetching word. Try again later.');
        console.error(error);
    }
}

// ===== SEARCH FUNCTIONALITY =====
searchBtn.addEventListener('click', () => fetchWord(searchInput.value.trim()));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWord(searchInput.value.trim());
});

// ===== HISTORY & FAVORITES =====
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
            <button class="delete-btn" onclick="removeFromHistory('${word}')">
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
            <button class="delete-btn" onclick="removeFromFavorites('${word}')">
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
    
    // Update favorite button state if viewing removed word
    const currentWord = document.getElementById('searched-word').textContent;
    if (currentWord === word) {
        document.getElementById('save-favorite').innerHTML = '<i class="fas fa-heart"></i> Save to Favorites';
    }
}

// Initialize lists
updateHistoryList();
updateFavoritesList();