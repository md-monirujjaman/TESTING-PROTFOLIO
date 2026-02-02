// Typing Animation
const typed = new Typed('.text-animate', {
    strings: ['React Developer', 'Full-Stack Developer', 'MERN Specialist'],
    typeSpeed: 80,
    backSpeed: 50,
    backDelay: 1000,
    loop: true
});

// mobile navbar start

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    // ক্লিক করলে আইকনটি 'X' হয়ে যাবে এবং মেনু ওপেন হবে
    menuIcon.classList.toggle('bx-x'); 
    navbar.classList.toggle('active');
};
// mobile nabar end

// Mobile Navbar Toggle
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = parseInt(counter.getAttribute('data-target'));
                const count = parseInt(counter.innerText);
                const increment = target / 100;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            observer.disconnect(); 
        }
    }, { threshold: 0.5 });

    const targetSection = document.querySelector('.stats-wrapper');
    if(targetSection) {
        observer.observe(targetSection);
    }
});


// common question start

function toggleFaq(element) {
    // Shudhu ekta ekebare open thakbe (Optional)
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(item => {
        if (item !== element) item.classList.remove('active');
    });

    // Current item toggle
    element.classList.toggle('active');
}

// common question end

// --- নতুন অংশ: JSON ডেটা লোড করার জন্য ---
let chatbotData = { knowledge_base: [], default_answer: "আমি দুঃখিত, আপনার প্রশ্নটি বুঝতে পারছি না।" };

// আপনার API Key এখানে দিন
const GEMINI_API_KEY = "AIzaSyC_JgV0Xkd5p4WZJqSIw8BiPz6ANOGKYJY"; 

async function loadChatData() {
    try {
        const response = await fetch('data.json');
        chatbotData = await response.json();
        console.log("Aethera Knowledge Loaded!");
    } catch (error) {
        console.error("JSON ফাইল লোড করতে সমস্যা হয়েছে। নিশ্চিত করুন data.json ফাইলটি ঠিক আছে।");
    }
}
window.addEventListener('load', loadChatData);
// ------------------------------------------

// ১. চ্যাট ওপেন/টগল করা
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    const dot = document.getElementById('notification-dot');
    chatWindow.classList.toggle('hidden');
    dot.classList.add('hidden'); // খুললে ডট লুকাবে
}

// ২. চ্যাট পুরোপুরি বন্ধ করা (Close Button)
function closeChatWindow() {
    document.getElementById('chat-window').classList.add('hidden');
}

// ৩. পেজ লোড হওয়ার ৫ সেকেন্ড পর নোটিফাই করা
window.addEventListener('load', () => {
    setTimeout(() => {
        const dot = document.getElementById('notification-dot');
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow && chatWindow.classList.contains('hidden')) {
            dot.classList.remove('hidden');
        }
    }, 5000);
});

// ৪. মেসেজ পাঠানো (JSON চেক করবে, না পেলে API কল করবে)
async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const msg = inputField.value.trim();
    if (!msg) return;

    appendMsg('user-msg', msg);
    inputField.value = "";

    const userInput = msg.toLowerCase();
    
    // ক. প্রথমে JSON এর ভেতর থেকে কি-ওয়ার্ড ম্যাচ করা হচ্ছে
    const found = chatbotData.knowledge_base.find(item => 
        item.keywords.some(keyword => userInput.includes(keyword.toLowerCase()))
    );

    if (found) {
        // JSON-এ উত্তর পাওয়া গেলে সেটা ১ সেকেন্ড পর দেখাবে
        setTimeout(() => {
            appendMsg('ai-msg', found.answer);
        }, 1000);
    } else {
        // খ. JSON-এ না থাকলে Gemini API কল করবে
        const loadingDiv = appendMsg('ai-msg', "Aethera is thinking..."); 
        const aiResponse = await askGeminiAI(msg);
        
        // লোডিং লেখাটি পরিবর্তন করে আসল উত্তর বসানো
        loadingDiv.innerText = aiResponse;
    }
}

// --- নতুন ফাংশন: Gemini API কল করার জন্য ---
async function askGeminiAI(prompt) {
    // এটি Gemini 3 Flash variant ব্যবহার করবে যা দ্রুত রেসপন্স দেয়
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `You are Aethera, the AI assistant of MD Monirujjaman (a MERN Specialist). Answer this professionally and concisely: ${prompt}` }]
            }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("API Error:", error);
        return "I'm sorry, I am currently unable to access my online brain. Please check your connection!";
    }
}

function appendMsg(type, text) {
    const body = document.getElementById('chat-body');
    const div = document.createElement('div');
    div.classList.add('msg', type);
    div.innerText = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight; 
    return div; // রেফারেন্স রিটার্ন করা হচ্ছে যাতে পরে টেক্সট আপডেট করা যায়
}

// এন্টার চাপলে মেসেজ যাবে
document.getElementById('user-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
// ai bot end