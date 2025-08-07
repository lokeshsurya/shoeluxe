// Shoe Carousel Controller
class ShoeCarousel {
    constructor() {
        this.currentFrame = 3; // Start with middle shoe (shoe3) selected
        this.totalFrames = 5; // We have 5 shoes, so 5 frames
        this.isAnimating = false;
        this.autoScrollPaused = true; // Keep auto-scroll permanently disabled
        this.userInteractionTimeout = null;

        // Get DOM elements
        this.carousel = document.getElementById('shoeCarousel');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.querySelectorAll('.indicator');

        // Debug: Check if elements are found
        console.log('Carousel elements:', {
            carousel: this.carousel,
            prevBtn: this.prevBtn,
            nextBtn: this.nextBtn,
            indicators: this.indicators.length
        });

        // Initialize
        this.init();
    }
    
    init() {
        // Set initial frame to middle shoe (frame 3)
        this.setFrame(3);
        
        // Enable navigation buttons
        this.prevBtn.addEventListener('click', () => {
            console.log('Previous button clicked, current frame:', this.currentFrame);
            this.previousFrame();
        });
        this.nextBtn.addEventListener('click', () => {
            console.log('Next button clicked, current frame:', this.currentFrame);
            this.nextFrame();
        });
        
        // Enable indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToFrame(index + 1);
            });
        });
        
        // Enable keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousFrame();
            } else if (e.key === 'ArrowRight') {
                this.nextFrame();
            }
        });

        // Add Shop Now button handlers
        this.addShopNowHandlers();

        // Set initial frame to middle shoe (frame 3)
        this.setFrame(3);

        // Auto-scroll disabled - keep static layout
        // this.startAutoScroll();
    }
    
    setFrame(frameNumber) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.currentFrame = frameNumber;

        console.log(`Setting frame to ${frameNumber}`);

        // Calculate offset to center the selected card
        // Card width (220px) + margin (40px) = 260px spacing
        const cardSpacing = 260;
        const centerOffset = (frameNumber - 3) * -cardSpacing; // Frame 3 is center (0 offset)

        // Apply the offset to move carousel
        this.carousel.style.setProperty('--carousel-offset', `${centerOffset}px`);

        // Update carousel data attribute
        this.carousel.setAttribute('data-frame', frameNumber);

        // Update center shoe class
        this.updateCenterShoe(frameNumber);

        // Update indicators
        this.updateIndicators();

        // Update button states
        this.updateButtons();

        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 600); // Match CSS transition duration
    }

    updateCenterShoe(frameNumber) {
        // Remove center-shoe class from all shoes
        const allShoes = this.carousel.querySelectorAll('.shoe-container');
        allShoes.forEach(shoe => {
            shoe.classList.remove('center-shoe');
        });

        // Add center-shoe class to the appropriate shoe based on frame
        let centerShoeClass;
        switch(frameNumber) {
            case 1:
                centerShoeClass = '.shoe1';  // Shoe1 is center
                break;
            case 2:
                centerShoeClass = '.shoe2';  // Shoe2 is center
                break;
            case 3:
                centerShoeClass = '.shoe3';  // Shoe3 is center
                break;
            case 4:
                centerShoeClass = '.shoe4';  // Shoe4 is center
                break;
            case 5:
                centerShoeClass = '.shoe5';  // Shoe5 is center
                break;
            default:
                centerShoeClass = '.shoe3';
        }

        // Add center-shoe class with smooth transition
        setTimeout(() => {
            const centerShoe = this.carousel.querySelector(centerShoeClass);
            if (centerShoe) {
                centerShoe.classList.add('center-shoe');
                console.log(`Center shoe updated to ${centerShoeClass} with smooth scaling`);
            }
        }, 200); // Small delay for smooth transition
    }

    addShopNowHandlers() {
        const shopNowButtons = this.carousel.querySelectorAll('.shop-now-btn');
        shopNowButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const shoeNumber = index + 1;
                this.handleShopNowClick(shoeNumber);
            });
        });
    }

    handleShopNowClick(shoeNumber) {
        // Handle Shop Now button click
        console.log(`Shop Now clicked for Shoe ${shoeNumber}`);
        // Add your shop now logic here
        // For example: window.location.href = `/shop/shoe-${shoeNumber}`;
        alert(`Shopping for Shoe ${shoeNumber}!`);
    }

    handleButtonClick() {
        // Pause auto-scroll when user clicks navigation buttons
        this.autoScrollPaused = true;
        this.stopAutoScroll();

        // Clear any existing timeout
        if (this.userInteractionTimeout) {
            clearTimeout(this.userInteractionTimeout);
        }

        // Show pause indicator
        this.showPauseIndicator();

        // Resume auto-scroll after 3 seconds of no button clicks
        this.userInteractionTimeout = setTimeout(() => {
            this.autoScrollPaused = false;
            this.startAutoScroll();
            this.hidePauseIndicator();
            console.log('Auto-scroll resumed after button click pause');
        }, 3000);

        console.log('Auto-scroll paused due to button click');
    }

    showPauseIndicator() {
        // Create or show pause indicator
        let indicator = document.querySelector('.pause-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'pause-indicator';
            indicator.innerHTML = '⏸️ Navigation paused';
            document.querySelector('.hero-section').appendChild(indicator);
        }
        indicator.style.opacity = '1';
        indicator.style.visibility = 'visible';
    }

    hidePauseIndicator() {
        const indicator = document.querySelector('.pause-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
            indicator.style.visibility = 'hidden';
        }
    }



    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            if (index + 1 === this.currentFrame) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    updateButtons() {
        // Enable all buttons - allow continuous cycling
        this.prevBtn.disabled = false;
        this.nextBtn.disabled = false;
    }
    
    nextFrame() {
        if (this.currentFrame < this.totalFrames) {
            this.setFrame(this.currentFrame + 1);
        } else {
            // Loop back to first frame
            this.setFrame(1);
        }
    }

    previousFrame() {
        console.log('previousFrame called, current frame:', this.currentFrame);
        if (this.currentFrame > 1) {
            console.log('Going to frame:', this.currentFrame - 1);
            this.setFrame(this.currentFrame - 1);
        } else {
            // Loop to last frame
            console.log('Looping to last frame:', this.totalFrames);
            this.setFrame(this.totalFrames);
        }
    }
    
    goToFrame(frameNumber) {
        if (frameNumber >= 1 && frameNumber <= this.totalFrames) {
            this.setFrame(frameNumber);
        }
    }
    
    startAutoScroll() {
        // Don't start if already paused by user interaction
        if (this.autoScrollPaused) {
            return;
        }

        // Stop any existing interval
        this.stopAutoScroll();

        // Auto-scroll every 2.5 seconds (faster)
        this.autoScrollInterval = setInterval(() => {
            // Only auto-scroll if not paused by user interaction
            if (!this.autoScrollPaused) {
                this.nextFrame(); // Use nextFrame which handles cycling automatically
            }
        }, 2500);
        
        // Pause auto-scroll on hover
        this.carousel.addEventListener('mouseenter', () => {
            clearInterval(this.autoScrollInterval);
        });
        
        // Resume auto-scroll when mouse leaves
        this.carousel.addEventListener('mouseleave', () => {
            this.startAutoScroll();
        });
    }
    
    // Public method to stop auto-scroll
    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
        }
    }
    
    // Public method to restart auto-scroll
    restartAutoScroll() {
        this.stopAutoScroll();
        this.startAutoScroll();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const shoeCarousel = new ShoeCarousel();
    
    // Make carousel globally accessible for debugging
    window.shoeCarousel = shoeCarousel;
});

// Add touch/swipe support for mobile
class TouchHandler {
    constructor(carousel) {
        this.carousel = carousel;
        this.startX = 0;
        this.endX = 0;
        this.minSwipeDistance = 50;
        
        this.addTouchListeners();
    }
    
    addTouchListeners() {
        const carouselElement = this.carousel.carousel;
        
        carouselElement.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
        });
        
        carouselElement.addEventListener('touchend', (e) => {
            this.endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
    }
    
    handleSwipe() {
        const swipeDistance = this.startX - this.endX;
        
        if (Math.abs(swipeDistance) > this.minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swipe left - next frame
                this.carousel.nextFrame();
            } else {
                // Swipe right - previous frame
                this.carousel.previousFrame();
            }
        }
    }
}

// Initialize touch handler after carousel is created
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.shoeCarousel) {
            new TouchHandler(window.shoeCarousel);
        }
    }, 100);
});
