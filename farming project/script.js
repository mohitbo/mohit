
// Enhanced JavaScript for Krishi Sakhi Website

let currentPage = 'login';
let pageHistory = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    setupEventListeners();
    showPage('login');
});

// Create particle animation
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Enter key support for inputs
    document.getElementById('chatInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    document.getElementById('phone-input')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitPhone();
        }
    });

    document.getElementById('otp-input')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyOTP();
        }
    });

    // Auto-format phone input
    document.getElementById('phone-input')?.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').substring(0, 10);
    });

    // Auto-format OTP input
    document.getElementById('otp-input')?.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').substring(0, 6);
    });
}

// Page navigation with animations
function showPage(pageId, addToHistory = true) {
    const currentPageElement = document.getElementById(currentPage + '-page');
    const newPageElement = document.getElementById(pageId + '-page');

    if (!newPageElement) {
        console.error('Page not found:', pageId);
        return;
    }

    // Add to history for back button
    if (addToHistory && currentPage !== pageId) {
        pageHistory.push(currentPage);
    }

    // Hide current page with animation
    if (currentPageElement && currentPage !== pageId) {
        currentPageElement.style.transform = 'translateX(-100px)';
        currentPageElement.style.opacity = '0';
        
        setTimeout(() => {
            currentPageElement.classList.remove('active');
        }, 300);
    }

    // Show new page with animation
    setTimeout(() => {
        newPageElement.classList.add('active');
        currentPage = pageId;
        
        // Update back button visibility
        updateBackButton();
        
        // Add staggered animations for elements
        addStaggeredAnimations(newPageElement);
        
    }, currentPage === pageId ? 0 : 300);
}

// Update back button visibility and functionality
function updateBackButton() {
    const backButton = document.getElementById('backButton');
    
    if (pageHistory.length > 0 && currentPage !== 'login') {
        backButton.style.display = 'flex';
        backButton.style.animation = 'fadeIn 0.3s ease-out';
    } else {
        backButton.style.display = 'none';
    }
}

// Go back to previous page
function goBack() {
    if (pageHistory.length > 0) {
        const previousPage = pageHistory.pop();
        showPage(previousPage, false);
    }
}

// Add staggered animations to page elements
function addStaggeredAnimations(pageElement) {
    const animatedElements = pageElement.querySelectorAll('.feature-card, .input-group, .login-option');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100 + 200);
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Navigation functions
function showPhonePage() {
    showToast('Redirecting to phone verification...');
    setTimeout(() => showPage('phone'), 500);
}

function showHomePage() {
    showToast('Welcome! Entering as guest...');
    setTimeout(() => showPage('home'), 500);
}

function submitPhone() {
    const phoneInput = document.getElementById('phone-input');
    const phone = phoneInput.value.trim();
    
    if (phone.length !== 10) {
        showToast('Please enter a valid 10-digit phone number', 'error');
        phoneInput.focus();
        phoneInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => phoneInput.style.animation = '', 500);
        return;
    }
    
    // Animate button
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.innerHTML = '<span>Send OTP</span><i class="fas fa-arrow-right"></i>';
        showToast(`OTP sent to +91 ${phone}`);
        showPage('otp');
    }, 1500);
}

function verifyOTP() {
    const otpInput = document.getElementById('otp-input');
    const otp = otpInput.value.trim();
    
    if (otp.length !== 6) {
        showToast('Please enter a valid 6-digit OTP', 'error');
        otpInput.focus();
        otpInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => otpInput.style.animation = '', 500);
        return;
    }
    
    // Animate verification
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.innerHTML = '<span>Verify</span><i class="fas fa-check"></i>';
        showToast('OTP verified successfully!');
        showPage('profile');
    }, 2000);
}

function submitProfile() {
    const name = document.getElementById('farmer-name').value.trim();
    const location = document.getElementById('farm-location').value.trim();
    const landSize = document.getElementById('land-size').value.trim();
    const cropType = document.getElementById('crop-type').value;
    const soilType = document.getElementById('soil-type').value;
    const irrigationType = document.getElementById('irrigation-type').value;
    
    if (!name || !location || !landSize) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Save profile data
    localStorage.setItem('farmerProfile', JSON.stringify({
        name, location, landSize, cropType, soilType, irrigationType
    }));
    
    // Animate completion
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.innerHTML = '<span>Complete Setup</span><i class="fas fa-check-circle"></i>';
        showToast('Profile created successfully!');
        
        // Update dashboard with profile data
        updateDashboardProfile();
        showPage('home');
    }, 2000);
}

// Update dashboard with profile information
function updateDashboardProfile() {
    const profile = JSON.parse(localStorage.getItem('farmerProfile') || '{}');
    
    if (profile.name) {
        document.getElementById('farmer-name-display').textContent = profile.name;
    }
    if (profile.location) {
        document.getElementById('farm-location-display').textContent = profile.location;
    }
}

// Feature page navigation
function showWeatherPage() {
    showToast('Weather feature coming soon!');
}

function showActivityPage() {
    showToast('Activity logs feature coming soon!');
}

function showInsightsPage() {
    showToast('AI insights feature coming soon!');
}

function showSoilPage() {
    showToast('Soil analysis feature coming soon!');
}

function showIrrigationPage() {
    showToast('Irrigation management feature coming soon!');
}

function showRemindersPage() {
    showToast('Reminders feature coming soon!');
}

function showChatPage() {
    showPage('chat');
}

// Chat functionality
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessageToChat(message, 'user');
    input.value = '';
    
    // Show typing indicator
    addTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
        removeTypingIndicator();
        const response = generateAIResponse(message);
        addMessageToChat(response, 'bot');
    }, 1500 + Math.random() * 1000);
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${message}</p>`;
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageElement.appendChild(avatar);
    messageElement.appendChild(content);
    messageElement.appendChild(time);
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Animate message appearance
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        messageElement.style.transition = 'all 0.5s ease-out';
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 100);
}

function addTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingElement = document.createElement('div');
    typingElement.className = 'message bot-message typing-indicator';
    typingElement.id = 'typing-indicator';
    
    typingElement.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateAIResponse(message) {
    const responses = {
        'weather': 'Today\'s weather in Kerala: 28°C with partly cloudy skies. Humidity is at 75%. Good conditions for most farming activities.',
        'crop': 'Based on the current season, I recommend planting vegetables like tomatoes, brinjal, and beans. The weather conditions are favorable.',
        'irrigation': 'For your soil type, I suggest drip irrigation early morning or evening. This will conserve water and ensure better absorption.',
        'pest': 'Common pests this season include aphids and whiteflies. Use neem oil spray as an organic solution. Apply every 3-4 days.',
        'fertilizer': 'For vegetable crops, use a balanced NPK fertilizer (10-10-10). Apply 2-3 weeks after transplanting.',
        'harvest': 'Monitor your crops daily. Most vegetables are ready for harvest when they reach full size and color. Morning is the best time to harvest.',
        'default': 'I\'m here to help with all your farming questions! You can ask me about weather, crops, irrigation, pest control, fertilizers, and more. How can I assist you today?'
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return responses.default;
}

function startVoiceInput() {
    showToast('Voice input feature will be available soon!');
    
    // Animate microphone button
    const button = event.target;
    button.style.transform = 'scale(1.2)';
    button.style.background = '#f44336';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.style.background = '#ff9800';
    }, 200);
}

// Add CSS for typing indicator
const style = document.createElement('style');
style.textContent = `
    .typing-dots {
        display: flex;
        gap: 4px;
        padding: 10px 0;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        background: #4caf50;
        border-radius: 50%;
        animation: typing 1.4s infinite;
    }
    
    .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing {
        0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
        }
        30% {
            transform: translateY(-10px);
            opacity: 1;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Auto-load profile on page load
window.addEventListener('load', function() {
    updateDashboardProfile();
});