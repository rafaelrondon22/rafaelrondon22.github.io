/**
 * ChatWidget.js
 * Handles the logic for the floating chat widget.
 * Simulates n8n webhook interaction.
 */

export class ChatWidget {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isOpen = false;
        this.messages = [];
        this.n8nWebhookUrl = 'https://YOUR_N8N_INSTANCE/webhook/chat'; // Placeholder

        this.init();
    }

    init() {
        this.render();
        this.cacheDOM();
        this.bindEvents();
        
        // Initial bot greeting
        setTimeout(() => {
            this.addMessage("¡Hola! 🐾 Soy el asistente virtual de TrasLaMascota. ¿En qué puedo ayudarte hoy?", 'bot');
        }, 1000);
    }

    render() {
        this.container.innerHTML = `
            <div class="chat-widget">
                <!-- Chat Window -->
                <div class="chat-widget__window" id="chatWindow">
                    <div class="chat-widget__header">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 8px; height: 8px; background: #2ecc71; border-radius: 50%;"></div>
                            <h4>Asistente Virtual</h4>
                        </div>
                        <button class="close-btn" id="closeChat"><i class="fa-solid fa-times"></i></button>
                    </div>
                    
                    <div class="chat-widget__messages" id="chatMessages">
                        <!-- Messages go here -->
                    </div>

                    <div class="chat-widget__input-area">
                        <input type="text" id="chatInput" placeholder="Escribe tu mensaje..." autocomplete="off">
                        <button id="sendMessage"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>

                <!-- Toggle Button -->
                <button class="chat-widget__toggle" id="toggleChat">
                    <i class="fa-solid fa-comment-dots"></i>
                </button>
            </div>
        `;
    }

    cacheDOM() {
        this.chatWindow = document.getElementById('chatWindow');
        this.toggleBtn = document.getElementById('toggleChat');
        this.closeBtn = document.getElementById('closeChat');
        this.messageContainer = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendMessage');
    }

    bindEvents() {
        this.toggleBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());
        
        this.sendBtn.addEventListener('click', () => this.handleSend());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatWindow.classList.toggle('active', this.isOpen);
        
        // Focus input when opening
        if (this.isOpen) setTimeout(() => this.input.focus(), 300);
    }

    handleSend() {
        const text = this.input.value.trim();
        if (!text) return;

        // 1. Add User Message
        this.addMessage(text, 'user');
        this.input.value = '';

        // 2. Simulate "Typing"
        const typingId = this.showTypingIndicator();

        // 3. Simulate n8n Request (Mock)
        this.mockN8nResponse(text)
            .then(reply => {
                this.removeTypingIndicator(typingId);
                this.addMessage(reply, 'bot');
            })
            .catch(err => {
                console.error(err);
                this.removeTypingIndicator(typingId);
                this.addMessage("Lo siento, tuve un problema conectando con el servidor.", 'bot');
            });
    }

    addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', `message--${sender}`);
        msgDiv.textContent = text;
        
        this.messageContainer.appendChild(msgDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }

    showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const indicator = document.createElement('div');
        indicator.id = id;
        indicator.classList.add('message', 'message--bot');
        indicator.style.fontStyle = 'italic';
        indicator.style.opacity = '0.7';
        indicator.textContent = 'Escribiendo...';
        this.messageContainer.appendChild(indicator);
        this.scrollToBottom();
        return id;
    }

    removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // --- MOCK LOGIC for n8n ---
    async mockN8nResponse(input) {
        return new Promise(resolve => {
            // Simulate network delay (1-2s)
            setTimeout(() => {
                const lowerInput = input.toLowerCase();
                let reply = "Interesante... cuéntame más.";

                if (lowerInput.includes('precio') || lowerInput.includes('costo')) {
                    reply = "Nuestros traslados base empiezan desde $15. ¿Desde qué zona sería la recogida?";
                } else if (lowerInput.includes('veterinario')) {
                    reply = "¡Claro! Hacemos acompañamiento a veterinarias. ¿Necesitas que nos quedemos durante la consulta?";
                } else if (lowerInput.includes('hola') || lowerInput.includes('buenos')) {
                    reply = "¡Hola! ¿Cómo se llama tu mascota? 🐶🐱";
                }

                resolve(reply);
            }, 1500);
        });
    }
}
