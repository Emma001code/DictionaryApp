# Mini Oxford Dictionary App

A modern dictionary web application deployed accross multiple servers, with:
- Word definitions, pronunciations, and examples
- Word of the day feature
- Dark/light mode toggle
- Search history and favorites
- Responsive design for all devices

## Features
- **Word Search**: Get definitions, examples, and pronunciations
- **Word of the Day**: Discover new interesting words daily
- **Dark Mode**: Eye-friendly dark theme
- **Local Storage**: Saves your history and favorites
- **Responsive**: Works on mobile, tablet, and desktop

## Importance of the App 
- **Free Teacher**: Users get to know about unfamiliar English word, especially for non-English speaking countries
- **Words Pronounciation Integration**: Some english word are tricky and difficult to pronounce, mini oxford offers a solution.

## Tech Stack 💻
| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| API | [Free Dictionary API](https://dictionaryapi.dev/) |
| Hosting | Nginx + Load Balancing |
| Storage | Browser localStorage |
| Icons | Font Awesome 6 |
   

## API Usage
This project uses the [Free Dictionary API](https://dictionaryapi.dev/).
- Rate Limit: 10 requests/hour (client-side)
- No API key required  

## Security
- All data is stored locally in `localStorage`
- No tracking or analytics

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Emma001code/DictionaryApp.git  
2. cd DictionaryApp && open index.html

# Server deployment (Web01/Web02)
sudo apt update && sudo apt install nginx
sudo mkdir -p /var/www/dictionary
sudo chown -R $USER:$USER /var/www/dictionary
git clone https://github.com/Emma001code/DictionaryApp.git /var/www/dictionary
sudo systemctl restart nginx    

# App structure
DictionaryApp/
├── index.html
├── style.css
├── javascript.js
├── README.md
└── screenshots/
    └── demo-screenshot.png   

    

## Challenges Overcome
- **Audio Compatibility**: HTML5 Audio fallback implementation  
- **Voice Search**: Web Speech API polyfill for browser support  
- **State Sync**: localStorage for cross-tab consistency  

## Acknowledgement
Thanks to:
- dictionaryapi.dev: for their wonderful API 
- Icons by Font Awesome
- AfricanLeadership University for this Amazing at the same time challenging project.  

