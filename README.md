# Mini Oxford Dictionary App 
[App preview](https://www.realemmanuel.tech)

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

## Importance 🎯
- **Language Learning**: Helps non-native speakers master English vocabulary
- **Pronunciation Guide**: Audio playback for proper pronounciation for tricky English words

## Tech Stack 💻
| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| API | [Free Dictionary API](https://dictionaryapi.dev/) |
| Hosting | Nginx + Load Balancing + web01 + web02 |
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

## Server deployment processes (Web01/Web02)
- git clone git clone https://github.com/Emma001code/DictionaryApp.git in both severs 
- sudo apt update upgrade -y  && sudo apt install nginx
- sudo apt install python3 python3-pip python3-venv -y
- cd /var/www/html/ && git clone git clone https://github.com/Emma001code/DictionaryApp.git
- cd Dictionaryapp
- sudo cp * ..
- follow this process on both servers for deployment  

## App structure
DictionaryApp/
├── index.html
├── style.css
├── javascript.js
├── README.md 

    
## Challenges Overcome
- **Audio Compatibility**: HTML5 Audio fallback implementation  
- **Voice Search**: Web Speech API polyfill for browser support  
- **State Sync**: localStorage for cross-tab consistency  

## Acknowledgement
Thanks to:
- dictionaryapi.dev: for their wonderful API 
- Icons by Font Awesome
- AfricanLeadership University for this Amazing at the same time challenging project.  

