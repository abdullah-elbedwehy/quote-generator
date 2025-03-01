export function createQuoteCardElement(quote) {
  const card = document.createElement("div");
  card.className = "quote-card";
  card.innerHTML = `
        <div class="quote-text">"${quote.quote}"</div>
        <div class="quote-author">- ${quote.author}</div>
    `;
  return card;
}

export function updateQuoteCardPosition(cardElement, body) {
  if (!cardElement || !body) return;

  const { x, y } = body.position;
  const angle = body.angle * (180 / Math.PI); // Convert radians to degrees

  // Calculate velocity-based effects
  const velocity = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
  const scale = Math.max(1 - velocity * 0.05, 0.8);
  const shadowBlur = Math.min(8 + velocity * 2, 20);

  const maxHeight = window.innerHeight;
  const relativeHeight = y / maxHeight;
  const shadowY = 4 + relativeHeight * 8;

  const offsetX = -125;
  const offsetY = -70;

  // Smoother scale calculation
  const velocityScale = Math.max(1 - velocity * 0.03, 0.85);

  cardElement.style.transform = `translate(${x + offsetX}px, ${
    y + offsetY
  }px) rotate(${angle}deg) scale(${velocityScale})`;
  cardElement.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${
    0.1 + velocity * 0.01
  })`;

  const parallaxX = body.velocity.x * -0.1;
  const parallaxY = body.velocity.y * -0.1;
  cardElement.style.backgroundPosition = `${parallaxX}px ${parallaxY}px`;
}
