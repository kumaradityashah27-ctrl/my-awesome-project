/**
 * ==========================================================================
 * Spotify Clone - Fully Functional Audio Control Engine Architecture
 * ==========================================================================
 */

// 1. Audio Sample Track Playlist Array Repository (Verified Streaming Outlets)
const trackPlaylist = [
    {
        title: "Mahiye Jinna Sohna",
        artist: "Darshan Raval",
        cover: "card2img.jpeg", // Matches your default HTML image source local file
       source: "Maniya Jirna Somna Dard 128 Kbps.mp3" 

    },
    {
        title: "Mere Paas Tum Ho",
        artist: "Rahat Fateh Ali Khan",
        cover: "card3img.jpeg",
        source: "https://soundhelix.com"
    },
    {
        title: "Naa Ready (From 'Leo')",
        artist: "Anirudh Ravichander, Thalapathy Vijay",
        cover: "card4img.jpeg",
        source: "https://soundhelix.com"
    },
    {
        title: "Top 50 - Global",
        artist: "Spotify International",
        cover: "card1img.jpeg",
        source: "https://soundhelix.com"
    }
];

let currentTrackIndex = 0;
let isSeeking = false; // Tracks if the user is actively dragging the progress bar slider

// 2. DOM Node Element Selections Framework
const audio = new Audio();
const playBtn = document.querySelector('.play-btn');
const prevBtn = document.querySelector('.fa-backward-step');
const nextBtn = document.querySelector('.fa-forward-step');
const progressBar = document.querySelector('.progress-bar');
const volumeBar = document.querySelector('.volume-bar');
const volumeIcon = document.querySelector('.volume-box i');
const currTimeDisplay = document.querySelector('.curr-time');
const totTimeDisplay = document.querySelector('.tot-time');

const trackNameDisplay = document.querySelector('.track-name');
const artistNameDisplay = document.querySelector('.artist-name');
const albumArtDisplay = document.querySelector('.album-art');
const dashboardCards = document.querySelectorAll('.card');

// 3. Audio State Utility Methods
function initTrack(index) {
    const track = trackPlaylist[index];
    audio.src = track.source;
    
    // Update bottom metadata view panels safely
    trackNameDisplay.textContent = track.title;
    artistNameDisplay.textContent = track.artist;
    albumArtDisplay.src = track.cover;
    
    // Fallback error trap: If local images are missing, load a high-quality streaming placeholder
    albumArtDisplay.onerror = function() {
        this.src = "https://unsplash.com";
    };
    
    // Reset range sliders and duration readouts
    progressBar.value = 0;
    currTimeDisplay.textContent = "0:00";
    totTimeDisplay.textContent = "0:00";
}

function togglePlay() {
    if (audio.paused) {
        audio.play()
            .then(() => {
                // Smoothly swap icon classes using standard Font Awesome design frameworks
                playBtn.classList.replace('fa-circle-play', 'fa-circle-pause');
            })
            .catch(err => console.error("Playback initialization failed safely:", err));
    } else {
        audio.pause();
        playBtn.classList.replace('fa-circle-pause', 'fa-circle-play');
    }
}

function changeTrack(direction) {
    if (direction === 'next') {
        currentTrackIndex = (currentTrackIndex + 1) % trackPlaylist.length;
    } else {
        currentTrackIndex = (currentTrackIndex - 1 + trackPlaylist.length) % trackPlaylist.length;
    }
    
    const wasPlaying = !audio.paused;
    initTrack(currentTrackIndex);
    
    if (wasPlaying) {
        audio.play().then(() => {
            playBtn.classList.replace('fa-circle-play', 'fa-circle-pause');
        });
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 4. Runtime System Event Binding
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeTrack('prev'));
nextBtn.addEventListener('click', () => changeTrack('next'));

// Update track duration parameters once media handles stream over network links
audio.addEventListener('loadedmetadata', () => {
    totTimeDisplay.textContent = formatTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});

// Sync tracking slider values alongside ongoing music progress timestamps
audio.addEventListener('timeupdate', () => {
    if (!isSeeking && !audio.paused) {
        progressBar.value = Math.floor(audio.currentTime);
        currTimeDisplay.textContent = formatTime(audio.currentTime);
    }
});

// Auto-advance skip forward callback loop parameters when stream hits terminal end
audio.addEventListener('ended', () => {
    changeTrack('next');
    audio.play();
});

// Handle live slider manual dragging overrides smoothly
progressBar.addEventListener('input', () => {
    isSeeking = true;
    currTimeDisplay.textContent = formatTime(progressBar.value);
});

progressBar.addEventListener('change', () => {
    audio.currentTime = progressBar.value;
    isSeeking = false;
});

// Configure Volume deck range modifiers
volumeBar.addEventListener('input', () => {
    const volumeValue = volumeBar.value / 100;
    audio.volume = volumeValue;
    
    // Alter standard output icon nodes automatically based on level boundaries
    if (volumeValue === 0) {
        volumeIcon.className = "fa-solid fa-volume-xmark control-icon";
    } else if (volumeValue < 0.4) {
        volumeIcon.className = "fa-solid fa-volume-low control-icon";
    } else {
        volumeIcon.className = "fa-solid fa-volume-high control-icon";
    }
});

// 5. Connect Dashboard Main View Cards to Audio Engine using data-index attributes
// 5. Connect Dashboard Main View Cards to Audio Engine using data-index attributes
dashboardCards.forEach((card) => {
    card.addEventListener('click', () => {
        const trackIndex = parseInt(card.getAttribute('data-index'), 10);
        
        if (!isNaN(trackIndex) && trackIndex < trackPlaylist.length) {
            currentTrackIndex = trackIndex;
            initTrack(currentTrackIndex);
            audio.play().then(() => {
                playBtn.classList.replace('fa-circle-play', 'fa-circle-pause');
            });
        }
    });
});
