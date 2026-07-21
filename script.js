const confettiContainer = document.getElementById('confetti');
const makeWishButton = document.getElementById('wishButton');
const wishForm = document.getElementById('wishForm');
const wishInput = document.getElementById('wishInput');
const sendWishButton = document.getElementById('sendWishButton');
const wishFeedback = document.getElementById('wishFeedback');
const countdownDisplay = document.getElementById('countdownDisplay');
const surpriseImage2 = document.getElementById('surpriseImage2');
const surpriseImage = document.getElementById('surpriseImage');

let countdownValue = 10;

function startCountdown() {
	countdownDisplay.textContent = countdownValue;
	
	const countdownInterval = setInterval(() => {
		if (countdownValue === 0) {
			countdownDisplay.textContent = '0';
			clearInterval(countdownInterval);
			setTimeout(() => {
				// show celebration text first (styled via CSS)
				countdownDisplay.innerHTML = "<span class='celebration-text'>May your day sparkle with joy and every moment feel like a beautiful dream.</span>";
				// remove any inline sizing so CSS can control the celebration text size
				countdownDisplay.style.fontSize = '';
				// reveal images shortly after the emoji so the emoji remains fully visible
				setTimeout(() => {
					surpriseImage.classList.remove('hidden');
					surpriseImage2.classList.remove('hidden');
					surpriseImage.classList.add('fadeIn');
					surpriseImage2.classList.add('fadeIn');
					burstConfetti();
				}, 700);
			}, 1000);
			return;
		}
		
		countdownValue--;
		countdownDisplay.classList.add('pulse');
		
		setTimeout(() => {
			countdownDisplay.classList.remove('pulse');
		}, 300);
		countdownDisplay.textContent = countdownValue;
	}, 1000);
}

// Start countdown on page load
window.addEventListener('load', () => {
	// Ensure the surprise images remain hidden until the countdown finishes
	surpriseImage.classList.add('hidden');
	surpriseImage2.classList.add('hidden');
	surpriseImage.classList.remove('fadeIn');
	surpriseImage2.classList.remove('fadeIn');
	setTimeout(startCountdown, 500);
});

function createConfettiParticle() {
	const isSpark = Math.random() < 0.25;
	const particle = document.createElement('div');
	const size = isSpark ? Math.floor(Math.random() * 5) + 4 : Math.floor(Math.random() * 12) + 8;
	const colors = ['#ff9ae3', '#fcd3ff', '#b389f6', '#ff78b7', '#fff3a8'];
	const left = Math.random() * 100;
	const rotation = Math.random() * 360;

	particle.style.position = 'absolute';
	particle.style.left = `${left}%`;
	particle.style.width = `${size}px`;
	particle.style.height = isSpark ? `${size}px` : `${size * 0.35}px`;
	particle.style.background = isSpark
		? `radial-gradient(circle at 40% 40%, rgba(255,255,255,0.95), ${colors[Math.floor(Math.random() * colors.length)]} 55%, transparent 90%)`
		: colors[Math.floor(Math.random() * colors.length)];
	particle.style.boxShadow = isSpark ? '0 0 10px rgba(255,255,255,0.8)' : 'none';
	particle.style.opacity = '0.95';
	particle.style.borderRadius = '50%';
	particle.style.transform = `rotate(${rotation}deg)`;
	particle.style.willChange = 'transform, opacity';

	const duration = isSpark ? 1400 + Math.random() * 800 : 2200 + Math.random() * 1000;
	particle.animate([
		{ transform: `translateY(0px) ${isSpark ? 'scale(1)' : `rotate(${rotation}deg)`}`, opacity: 1 },
		{ transform: `translateY(${isSpark ? 80 : 110}vh) ${isSpark ? 'scale(0.7)' : `rotate(${rotation + 180}deg)`}`, opacity: 0 },
	], {
		duration,
		easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
	});

	setTimeout(() => {
		particle.remove();
	}, duration);

	confettiContainer.appendChild(particle);
}

function burstConfetti() {
	const total = 28;
	for (let i = 0; i < total; i += 1) {
		setTimeout(createConfettiParticle, i * 45);
	}
}

makeWishButton.addEventListener('click', () => {
	wishForm.classList.remove('hidden');
	wishInput.focus();
	makeWishButton.classList.add('hidden');
});

sendWishButton.addEventListener('click', () => {
	const wishText = wishInput.value.trim();
	if (!wishText) {
		wishInput.focus();
		return;
	}

	wishInput.disabled = true;
	sendWishButton.disabled = true;
	wishFeedback.classList.remove('hidden');
	wishFeedback.textContent = 'Wish sent! 🎉';
	burstConfetti();
	setTimeout(() => {
		wishFeedback.textContent = 'Thank you for your wish!';
	}, 1800);
});

// Memory Slide Functionality
const memorySlides = Array.from(document.querySelectorAll('.memory-slide'));
const prevMemoryButton = document.querySelector('.slide-button.prev');
const nextMemoryButton = document.querySelector('.slide-button.next');
const memoryIndicators = document.querySelector('.slide-indicators');
let activeMemoryIndex = 0;

function createMemoryIndicators() {
	if (!memoryIndicators) return;
	memoryIndicators.innerHTML = '';
	memorySlides.forEach((slide, index) => {
		const dot = document.createElement('button');
		dot.type = 'button';
		dot.className = 'dot';
		dot.setAttribute('aria-label', `Go to memory ${index + 1}`);
		dot.dataset.index = index;
		memoryIndicators.appendChild(dot);
	});
}

function updateMemorySlides() {
	memorySlides.forEach((slide, index) => {
		slide.classList.toggle('active', index === activeMemoryIndex);
	});
	if (prevMemoryButton) {
		prevMemoryButton.disabled = activeMemoryIndex === 0;
	}
	if (nextMemoryButton) {
		nextMemoryButton.disabled = activeMemoryIndex === memorySlides.length - 1;
	}
	if (memoryIndicators) {
		const dots = memoryIndicators.querySelectorAll('.dot');
		dots.forEach((dot, index) => {
			dot.classList.toggle('active', index === activeMemoryIndex);
		});
	}
}

function attachMemoryHandlers() {
	if (prevMemoryButton) {
		prevMemoryButton.addEventListener('click', () => {
			if (activeMemoryIndex > 0) {
				activeMemoryIndex -= 1;
				updateMemorySlides();
			}
		});
	}
	if (nextMemoryButton) {
		nextMemoryButton.addEventListener('click', () => {
			if (activeMemoryIndex < memorySlides.length - 1) {
				activeMemoryIndex += 1;
				updateMemorySlides();
			}
		});
	}
	if (memoryIndicators) {
		memoryIndicators.addEventListener('click', (event) => {
			const button = event.target.closest('.dot');
			if (!button) return;
			const index = Number(button.dataset.index);
			if (!Number.isNaN(index)) {
				activeMemoryIndex = index;
				updateMemorySlides();
			}
		});
	}
}

createMemoryIndicators();
updateMemorySlides();
attachMemoryHandlers();

// Cake section is now static; remove candle interactivity to avoid layout issues.

function pad(num) {
	return String(num).padStart(2, '0');
}

function startSinceCounter() {
	// Fixed start date as requested by user
	const start = new Date(2026, 5, 15, 0, 0, 0); // June 15, 2026 (month 5)
	const daysEl = document.getElementById('sinceDays');
	const hrsEl = document.getElementById('sinceHours');
	const minsEl = document.getElementById('sinceMinutes');
	const secsEl = document.getElementById('sinceSeconds');

	function update() {
		const now = new Date();
		let diffMs = now - start; // milliseconds elapsed since start

		// If start is in the future, show zeros (or could be adapted to countdown)
		if (diffMs < 0) diffMs = 0;

		const totalSeconds = Math.floor(diffMs / 1000);
		const days = Math.floor(totalSeconds / 86400);
		const hours = Math.floor((totalSeconds % 86400) / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		if (daysEl) daysEl.textContent = String(days);
		if (hrsEl) hrsEl.textContent = pad(hours);
		if (minsEl) minsEl.textContent = pad(minutes);
		if (secsEl) secsEl.textContent = pad(seconds);
	}

	update();
	setInterval(update, 1000);
}

// Start the since-counter after load
window.addEventListener('load', () => {
	startSinceCounter();
});
