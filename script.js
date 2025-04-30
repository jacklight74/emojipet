const musicController = {
    init(musicToggle, musicIcon, backgroundMusic) {
        let isMusicPlaying = true;
        
        backgroundMusic.volume = 0.6;
        backgroundMusic.play().then(() => {
            musicIcon.textContent = '🔇';
        }).catch(error => {
            isMusicPlaying = false;
        });

        musicToggle.addEventListener('click', () => {
            if (isMusicPlaying) {
                backgroundMusic.pause();
                musicIcon.textContent = '🔊';
            } else {
                backgroundMusic.play();
                musicIcon.textContent = '🔇';
            }
            isMusicPlaying = !isMusicPlaying;
        });
    }
};

const aiChatCompletion = async (message) => {
    const response = await fetch('https://ai.hackclub.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: [
                { role: 'system', content: 'You are just a game NPC giving simple answers. Never make your answer more than 50 characters long.' },
                { role: 'user', content: message }
            ],
        }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

const petController = {
    emojis: ['😚', '🥸', '🫠', '🤨', '😐', '🤔', '😎', '🤓'],
    placeholders: [
        'Ask me anything...',
        'How are you feeling today?',
        'What\'s on your mind?',
        'What do you want to do?',
        'Got any secrets?',
        'Let\'s chat!',
        'Curious about something?',
        'Feeling bored?'
    ],
    currentEmoji: '😴',
    isTyping: false,
    isFirstClick: true,

    init(pet, inputContainer, userInput, sendButton, response) {
        this.pet = pet;
        this.inputContainer = inputContainer;
        this.userInput = userInput;
        this.sendButton = sendButton;
        this.response = response;
        this.responseEmoji = response.querySelector('.response-emoji');
        this.responseText = response.querySelector('.response-text');

        this.pet.style.display = 'block';
        this.inputContainer.style.display = 'none';
        this.response.style.display = 'none';

        this.setupEventListeners();
        this.setupInitialState();
    },

    setupInitialState() {
        setTimeout(() => {
            this.showResponse(null, 'Touch me!');
        }, 500);
    },

    setupEventListeners() {
        const boundHandlePetClick = this.handlePetClick.bind(this);
        const boundHandleMessage = this.handleMessage.bind(this);

        this.pet.addEventListener('click', (e) => {
            boundHandlePetClick(e);
        });

        this.sendButton.addEventListener('click', (e) => {
            boundHandleMessage(e);
        });

        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                boundHandleMessage(e);
            }
        });
    },

    handlePetClick(e) {
        if (this.isTyping) return;

        if (this.isFirstClick) {
            this.isFirstClick = false;
            this.response.style.display = 'none';
            this.pet.style.display = 'block';
            this.inputContainer.style.display = 'flex';
            return;
        }

        const isVisible = this.inputContainer.style.display === 'flex';
        this.inputContainer.style.display = isVisible ? 'none' : 'flex';
        
        if (!isVisible) {
            const randomIndex = Math.floor(Math.random() * this.emojis.length);
            this.currentEmoji = this.emojis[randomIndex];
            this.pet.textContent = this.currentEmoji;
            this.userInput.placeholder = this.placeholders[randomIndex];
        }
    },

    typeText(text, element, callback) {
        let index = 0;
        element.textContent = '';
        
        function type() {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                setTimeout(type, 100);
            } else if (callback) {
                callback();
            }
        }
        
        type();
    },

    showResponse(emoji, text) {
        this.isTyping = true;
        this.inputContainer.style.display = 'none';
        this.response.style.display = 'flex';
        
        if (emoji) {
            this.responseEmoji.textContent = emoji;
            this.pet.style.display = 'none';
        } else {
            this.responseEmoji.textContent = '';
        }
        
        this.response.style.animation = 'fadeIn 0.5s ease-out forwards';

        if (this.isFirstClick) {
            this.typeText(text, this.responseText, () => {
                this.isTyping = false;
            });
        } else {
            this.typeText(text, this.responseText, () => {
                setTimeout(() => {
                    this.response.style.animation = 'fadeIn 0.5s ease-out reverse';
                    setTimeout(() => {
                        this.response.style.display = 'none';
                        this.pet.style.display = 'block';
                        this.inputContainer.style.display = 'flex';
                        this.pet.textContent = this.currentEmoji;
                        this.isTyping = false;
                    }, 500);
                }, 2000);
            });
        }
    },

    async handleMessage() {
        const message = this.userInput.value.trim();
        if (message === '' || this.isTyping) return;

        this.userInput.value = '';
        const response = await aiChatCompletion(message);
        this.showResponse(this.currentEmoji, response);
        const randomIndex = Math.floor(Math.random() * this.emojis.length);
        this.currentEmoji = this.emojis[randomIndex];
        this.pet.textContent = this.currentEmoji;
        this.userInput.placeholder = this.placeholders[randomIndex];
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = musicToggle.querySelector('.music-icon');
    const bgMusic = document.getElementById('bgMusic');
    let isMusicPlaying = true;

    bgMusic.volume = 0.6;
    bgMusic.play().then(() => {
        musicIcon.textContent = '🔇';
    }).catch(error => {
        isMusicPlaying = false;
    });

    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicIcon.textContent = '🔊';
        } else {
            bgMusic.play();
            musicIcon.textContent = '🔇';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    const pet = document.getElementById('pet');
    const inputContainer = document.querySelector('.input-container');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const response = document.getElementById('response');
    const responseEmoji = response.querySelector('.response-emoji');
    const responseText = response.querySelector('.response-text');
    let isTyping = false;
    let isFirstClick = true;

    const emojis = ['😚', '🥸', '🫠', '🤨', '😐', '🤔', '😎', '🤓'];
    const placeholders = [
        'Ask me anything...',
        'How are you feeling today?',
        'What\'s on your mind?',
        'What do you want to do?',
        'Got any secrets?',
        'Let\'s chat!',
        'Curious about something?',
        'Feeling bored?'
    ];
    let currentEmoji = '😴';

    setTimeout(() => {
        pet.style.display = 'block';
        showResponse(null, 'Touch me!');
    }, 500);

    pet.addEventListener('click', () => {
        if (!isTyping) {
            if (isFirstClick) {
                isFirstClick = false;
                response.style.display = 'none';
                pet.style.display = 'block';
                inputContainer.style.display = 'flex';
                return;
            }

            const isVisible = inputContainer.style.display === 'flex';
            inputContainer.style.display = isVisible ? 'none' : 'flex';
            
            if (!isVisible) {
                const randomIndex = Math.floor(Math.random() * emojis.length);
                currentEmoji = emojis[randomIndex];
                pet.textContent = currentEmoji;
                userInput.placeholder = placeholders[randomIndex];
            }
        }
    });

    function typeText(text, element, callback) {
        let index = 0;
        element.textContent = '';
        
        function type() {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                setTimeout(type, 100);
            } else if (callback) {
                callback();
            }
        }
        
        type();
    }

    function showResponse(emoji, text) {
        isTyping = true;
        inputContainer.style.display = 'none';
        response.style.display = 'flex';
        if (emoji) {
            responseEmoji.textContent = emoji;
            pet.style.display = 'none';
        } else {
            responseEmoji.textContent = '';
        }
        response.style.animation = 'fadeIn 0.5s ease-out forwards';

        if (isFirstClick) {
            typeText(text, responseText, () => {
                isTyping = false;
            });
        } else {
            typeText(text, responseText, () => {
                setTimeout(() => {
                    response.style.animation = 'fadeIn 0.5s ease-out reverse';
                    setTimeout(() => {
                        response.style.display = 'none';
                        pet.style.display = 'block';
                        inputContainer.style.display = 'flex';
                        pet.textContent = currentEmoji;
                        isTyping = false;
                    }, 500);
                }, 2000);
            });
        }
    }

    async function handleMessage() {
        const message = userInput.value.trim();
        if (message === '' || isTyping) return;

        userInput.value = '';
        const responseText = await aiChatCompletion(message);
        showResponse(currentEmoji, responseText);
        const randomIndex = Math.floor(Math.random() * emojis.length);
        currentEmoji = emojis[randomIndex];
        pet.textContent = currentEmoji;
        userInput.placeholder = placeholders[randomIndex];
    }

    sendButton.addEventListener('click', handleMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleMessage();
        }
    });
}); 