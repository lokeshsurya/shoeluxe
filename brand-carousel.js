// Brand Carousel Controller
class BrandCarousel {
    constructor() {
        this.currentFrame = 3; // Start with middle brand (brand3) selected
        this.totalFrames = 5; // We have 5 brands, so 5 frames
        this.isAnimating = false;
        this.autoScrollPaused = true; // Keep auto-scroll permanently disabled
        this.userInteractionTimeout = null;

        // Get DOM elements
        this.carousel = document.getElementById('shoeCarousel');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.querySelectorAll('.indicator');

        // Debug: Check if elements are found
        console.log('Brand Carousel elements:', {
            carousel: this.carousel,
            prevBtn: this.prevBtn,
            nextBtn: this.nextBtn,
            indicators: this.indicators.length
        });

        // Initialize
        this.init();
    }
    
    init() {
        // Set initial frame to middle brand (frame 3)
        this.setFrame(3);
        
        // Enable navigation buttons with better mobile support
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Previous button clicked, current frame:', this.currentFrame);
            this.previousFrame();
        });
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next button clicked, current frame:', this.currentFrame);
            this.nextFrame();
        });

        // Add touch events for better mobile support
        this.prevBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.previousFrame();
        });
        this.nextBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.nextFrame();
        });

        // Enable indicator clicks with better mobile support
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToFrame(index + 1);
            });
            indicator.addEventListener('touchend', (e) => {
                e.preventDefault();
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

        // Add window resize listener for responsive behavior
        window.addEventListener('resize', () => {
            // Debounce resize events
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.setFrame(this.currentFrame);
            }, 100);
        });

        // Add Brand button handlers
        this.addBrandHandlers();

        // Set initial frame to middle brand (frame 3)
        this.setFrame(3);
    }
    
    setFrame(frameNumber) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.currentFrame = frameNumber;

        console.log(`Setting frame to ${frameNumber}`);

        // Get responsive card spacing based on screen size
        const cardSpacing = this.getCardSpacing();
        const centerOffset = (frameNumber - 3) * -cardSpacing; // Frame 3 is center (0 offset)

        // Apply the offset to move carousel
        this.carousel.style.setProperty('--carousel-offset', `${centerOffset}px`);

        // Update carousel data attribute
        this.carousel.setAttribute('data-frame', frameNumber);

        // Update center brand class
        this.updateCenterBrand(frameNumber);

        // Update indicators
        this.updateIndicators();

        // Update button states
        this.updateButtons();

        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 600); // Match CSS transition duration
    }

    getCardSpacing() {
        // Get responsive card spacing based on screen width
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 360) {
            // Extra small mobile: 120px card + 12px margin = 132px spacing
            return 132;
        } else if (screenWidth <= 480) {
            // Small mobile: 140px card + 16px margin = 156px spacing
            return 156;
        } else if (screenWidth <= 768) {
            // Tablet: 160px card + 20px margin = 180px spacing
            return 180;
        } else {
            // Desktop: 220px card + 40px margin = 260px spacing
            return 260;
        }
    }

    updateCenterBrand(frameNumber) {
        // Remove center-shoe class from all brands
        const allBrands = this.carousel.querySelectorAll('.shoe-container');
        allBrands.forEach(brand => {
            brand.classList.remove('center-shoe');
        });

        // Add center-shoe class to the appropriate brand based on frame
        let centerBrandClass;
        switch(frameNumber) {
            case 1:
                centerBrandClass = '.shoe1';  // Brand1 is center
                break;
            case 2:
                centerBrandClass = '.shoe2';  // Brand2 is center
                break;
            case 3:
                centerBrandClass = '.shoe3';  // Brand3 is center
                break;
            case 4:
                centerBrandClass = '.shoe4';  // Brand4 is center
                break;
            case 5:
                centerBrandClass = '.shoe5';  // Brand5 is center
                break;
            default:
                centerBrandClass = '.shoe3';
        }

        // Add center-shoe class with smooth transition
        setTimeout(() => {
            const centerBrand = this.carousel.querySelector(centerBrandClass);
            if (centerBrand) {
                centerBrand.classList.add('center-shoe');
                console.log(`Center brand updated to ${centerBrandClass} with smooth scaling`);
            }
        }, 200); // Small delay for smooth transition
    }

    addBrandHandlers() {
        const brandCards = this.carousel.querySelectorAll('.brand-card');
        brandCards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                // Only handle click if this is the center card
                if (card.classList.contains('center-shoe')) {
                    console.log(`Brand ${index + 1} clicked`);
                    // The onclick handlers in HTML will handle navigation
                } else {
                    // If not center, make it center
                    e.preventDefault();
                    this.goToFrame(index + 1);
                }
            });
        });
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
}

// Initialize brand carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const brandCarousel = new BrandCarousel();
    
    // Make carousel globally accessible for debugging
    window.brandCarousel = brandCarousel;
});

// Add touch/swipe support for mobile
class BrandTouchHandler {
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
        if (window.brandCarousel) {
            new BrandTouchHandler(window.brandCarousel);
        }
    }, 100);
});
