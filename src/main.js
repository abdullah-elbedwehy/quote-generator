import Matter from 'matter-js';
import { loadQuotesFromCsv } from './quotes_data.js';
import { createPhysicsEngine, startPhysicsEngine, createQuoteBody, addToWorld, removeFromWorld } from './physics/engine.js';
import { createQuoteCardElement, updateQuoteCardPosition } from './components/QuoteCard.js';

const quoteCards = new Map();
let currentDraggedBody = null;
let stackPosition = { x: 0, y: 0 };

async function initializeApp() {
    try {
        // Create container for quote cards
        const quoteContainer = document.createElement('div');
        quoteContainer.id = 'quote-container';
        document.body.appendChild(quoteContainer);

        // Initialize physics engine
        const { engine, render, mouseConstraint } = createPhysicsEngine(document.body);
        
        // Load quotes - use the default quotes in quotes_data.js
        const quotes = await loadQuotesFromCsv();
        
        // Set stack position to center of screen
        stackPosition = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        // Create quote cards with physics
        const quotesToShow = quotes.slice(0, 10);
        quotesToShow.forEach((quote, index) => {
            // Position cards in a tighter stack with minimal offset
            const offset = index === quotesToShow.length - 1 ? 0 : (Math.random() * 2 - 1);
            const x = stackPosition.x + (Math.random() * 4 - 2);
            const y = stackPosition.y + (Math.random() * 4 - 2);
            
            // Create physics body with adjusted size
            const body = createQuoteBody(x, y, 250, 140);
            // Add minimal rotation
            Matter.Body.setAngle(body, offset * Math.PI / 360);
            
            // Create visual element
            const cardElement = createQuoteCardElement(quote);
            quoteContainer.appendChild(cardElement);
            
            // Store reference
            quoteCards.set(body, cardElement);
            
            // Add to physics world
            addToWorld(engine, body);
        });

        // Start physics simulation
        startPhysicsEngine(engine, render);

        // Update visual elements on each tick
        Matter.Events.on(engine, 'afterUpdate', () => {
            quoteCards.forEach((element, body) => {
                updateQuoteCardPosition(element, body);
                
                // Check if card should be removed
                if (shouldRemoveCard(body)) {
                    removeCard(engine, body);
                } else if (!currentDraggedBody) {
                    // If not being dragged, apply force to return to stack
                    const dx = stackPosition.x - body.position.x;
                    const dy = stackPosition.y - body.position.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 5) {
                        // Smoother angular velocity damping
                        Matter.Body.setAngularVelocity(body, body.angularVelocity * 0.97);
                        
                        // Stronger force when cards are further apart
                        const forceMagnitude = Math.min(distance * 0.00002, 0.0004);
                        // Add a slight clustering force
                        const clusterForce = distance > 100 ? 0.0001 : 0.00001;
                        
                        Matter.Body.applyForce(body, body.position, {
                            x: dx * (forceMagnitude + clusterForce),
                            y: dy * (forceMagnitude + clusterForce)
                        });
                    }
                }
            });
        });

        // Handle mouse interaction state
        Matter.Events.on(mouseConstraint, 'startdrag', ({ body }) => {
            if (!body) return;
            currentDraggedBody = body;
            const draggedElement = quoteCards.get(body);
            if (draggedElement) {
                // Bring dragged element to front
                draggedElement.style.zIndex = '1000';
                draggedElement.style.filter = 'none';
            }
            
            // Add blur to all other cards
            quoteCards.forEach((element, otherBody) => {
                if (otherBody !== body) {
                    element.style.filter = 'blur(3px)';
                    element.style.zIndex = '1';
                }
            });
        });

        Matter.Events.on(mouseConstraint, 'enddrag', () => {
            // Remove blur from all cards
            quoteCards.forEach((element) => {
                element.style.filter = 'none';
                element.style.zIndex = '';
            });
            currentDraggedBody = null;
        });

        // Update instructions
        const instructions = document.querySelector('.instructions');
        if (instructions) {
            instructions.textContent = 'Grab quotes from the stack! Throw them far to remove.';
            // Remove loading spinner if it exists
            const spinner = document.querySelector('.loading-spinner');
            if (spinner) spinner.remove();
        }

    } catch (error) {
        console.error('Error initializing app:', error);
        const instructions = document.querySelector('.instructions');
        if (instructions) {
            instructions.textContent = 'Error: ' + error.message;
            // Remove loading spinner if it exists
            const spinner = document.querySelector('.loading-spinner');
            if (spinner) spinner.remove();
        }
        const errorLog = document.querySelector('.error-log');
        if (errorLog) {
            errorLog.textContent += '\n' + error.toString();
        }
    }
}

// Check if a card should be removed based on position and velocity
function shouldRemoveCard(body) {
    const velocity = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
    const distanceFromCenter = Math.sqrt(
        (body.position.x - window.innerWidth/2) ** 2 + 
        (body.position.y - window.innerHeight/2) ** 2
    );
    
    // Remove if moving fast enough and far enough from center
    return velocity > 15 && distanceFromCenter > Math.max(window.innerWidth, window.innerHeight) * 0.75;
}

// Remove a card from the game
function removeCard(engine, body) {
    const element = quoteCards.get(body);
    if (element) {
        // Add removing animation class
        element.classList.add('removing');
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            removeFromWorld(engine, body);
            element.remove();
            quoteCards.delete(body);
        }, 300);
    }
}

// Add a new random quote to the stack
async function addRandomQuote(engine, quotes) {
    if (!quotes || quotes.length === 0) return;
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteContainer = document.getElementById('quote-container');
    
    // Create physics body at stack position
    const body = createQuoteBody(stackPosition.x, stackPosition.y, 250, 140);
    // Add slight random rotation
    Matter.Body.setAngle(body, (Math.random() * 6 - 3) * Math.PI / 180);
    
    // Create visual element
    const cardElement = createQuoteCardElement(randomQuote);
    quoteContainer.appendChild(cardElement);
    
    // Store reference and add to physics world
    quoteCards.set(body, cardElement);
    addToWorld(engine, body);
}

// Track last space press to prevent spam
let lastSpacePress = 0;
const SPACE_COOLDOWN = 500; // ms

// Handle keyboard events
document.addEventListener('keydown', async (event) => {
    if (event.code === 'Space' && !event.repeat) {
        const now = Date.now();
        if (now - lastSpacePress >= SPACE_COOLDOWN) {
            lastSpacePress = now;
            const quotes = await loadQuotesFromCsv();
            addRandomQuote(engine, quotes);
        }
    }
});

// Start the application when everything is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initializeApp, 100));
} else {
    setTimeout(initializeApp, 100);
}
