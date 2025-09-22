/**
 * Navigation Controller
 * Handles user navigation inputs and slide transitions
 */

import { NAVIGATION, TOTAL_SLIDES, ERROR_MESSAGES } from '../utils/constants.js';
import { utils } from '../utils/helpers.js';

export class NavigationController {
    constructor(slideManager) {
        this.slideManager = slideManager;

        // Navigation state
        this.isNavigating = false;
        this.navigationHistory = [];
        this.maxHistorySize = 100;

        // Touch navigation
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.touchThreshold = 50; // Minimum distance for swipe

        // Keyboard navigation
        this.keyboardEnabled = NAVIGATION.enableKeyboardNavigation;
        this.keyboardMap = new Map([
            ['ArrowRight', 'next'],
            ['ArrowLeft', 'previous'],
            ['ArrowDown', 'next'],
            ['ArrowUp', 'previous'],
            ['Space', 'next'],
            ['PageDown', 'next'],
            ['PageUp', 'previous'],
            ['Home', 'first'],
            ['End', 'last'],
            ['Escape', 'toggleFullscreen'],
            ['f', 'toggleFullscreen'],
            ['F', 'toggleFullscreen'],
            ['p', 'togglePresentation'],
            ['P', 'togglePresentation'],
            ['r', 'refresh'],
            ['R', 'refresh'],
            ['h', 'help'],
            ['H', 'help'],
            ['?', 'help']
        ]);

        // Mouse navigation
        this.mouseEnabled = NAVIGATION.enableMouseNavigation;
        this.clickThreshold = 300; // Maximum time for click
        this.clickStartTime = 0;

        // Auto-advance
        this.autoAdvanceEnabled = NAVIGATION.autoAdvance;
        this.autoAdvanceDelay = NAVIGATION.autoAdvanceDelay;
        this.autoAdvanceTimer = null;

        // Event listeners storage
        this.eventListeners = new Map();

        // Presentation mode
        this.isPresentationMode = false;
        this.isFullscreen = false;

        // Bookmarks
        this.bookmarks = new Map();

        // Initialize navigation
        this.initialize();

        console.log('NavigationController initialized');
    }

    /**
     * Initialize navigation event listeners
     */
    initialize() {
        try {
            // Keyboard navigation
            if (this.keyboardEnabled) {
                this.addKeyboardListeners();
            }

            // Mouse navigation
            if (this.mouseEnabled) {
                this.addMouseListeners();
            }

            // Touch navigation
            if (NAVIGATION.enableTouchNavigation) {
                this.addTouchListeners();
            }

            // Slide manager events
            this.addSlideManagerListeners();

            // Auto-advance
            if (this.autoAdvanceEnabled) {
                this.startAutoAdvance();
            }

            console.log('Navigation initialized with:', {
                keyboard: this.keyboardEnabled,
                mouse: this.mouseEnabled,
                touch: NAVIGATION.enableTouchNavigation,
                autoAdvance: this.autoAdvanceEnabled
            });
        } catch (error) {
            console.error('Failed to initialize navigation:', error);
            throw error;
        }
    }

    /**
     * Add keyboard event listeners
     */
    addKeyboardListeners() {
        const keydownHandler = (event) => {
            // Prevent default for navigation keys
            if (this.keyboardMap.has(event.code) || this.keyboardMap.has(event.key)) {
                event.preventDefault();
                this.handleKeyboard(event);
            }

            // Number keys for direct slide navigation
            if (/^[0-9]$/.test(event.key) && !event.ctrlKey && !event.altKey) {
                this.handleNumberInput(event.key);
            }
        };

        document.addEventListener('keydown', keydownHandler);
        this.eventListeners.set('keydown', keydownHandler);
    }

    /**
     * Add mouse event listeners
     */
    addMouseListeners() {
        const mouseDownHandler = (event) => {
            this.clickStartTime = Date.now();
        };

        const mouseUpHandler = (event) => {
            const clickDuration = Date.now() - this.clickStartTime;
            if (clickDuration <= this.clickThreshold) {
                this.handleMouseClick(event);
            }
        };

        const wheelHandler = (event) => {
            event.preventDefault();
            this.handleMouseWheel(event);
        };

        document.addEventListener('mousedown', mouseDownHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        document.addEventListener('wheel', wheelHandler, { passive: false });

        this.eventListeners.set('mousedown', mouseDownHandler);
        this.eventListeners.set('mouseup', mouseUpHandler);
        this.eventListeners.set('wheel', wheelHandler);
    }

    /**
     * Add touch event listeners
     */
    addTouchListeners() {
        const touchStartHandler = (event) => {
            this.handleTouchStart(event);
        };

        const touchEndHandler = (event) => {
            this.handleTouchEnd(event);
        };

        const touchMoveHandler = (event) => {
            // Prevent scrolling during touch navigation
            if (Math.abs(this.touchStartX - event.touches[0].clientX) > 10) {
                event.preventDefault();
            }
        };

        document.addEventListener('touchstart', touchStartHandler, { passive: true });
        document.addEventListener('touchend', touchEndHandler, { passive: true });
        document.addEventListener('touchmove', touchMoveHandler, { passive: false });

        this.eventListeners.set('touchstart', touchStartHandler);
        this.eventListeners.set('touchend', touchEndHandler);
        this.eventListeners.set('touchmove', touchMoveHandler);
    }

    /**
     * Add slide manager event listeners
     */
    addSlideManagerListeners() {
        this.slideManager.on('slideChanged', (data) => {
            this.onSlideChanged(data);
        });

        this.slideManager.on('languageChanged', (data) => {
            this.onLanguageChanged(data);
        });
    }

    /**
     * Handle keyboard navigation
     */
    async handleKeyboard(event) {
        if (this.isNavigating) return;

        try {
            const action = this.keyboardMap.get(event.code) || this.keyboardMap.get(event.key);

            switch (action) {
                case 'next':
                    await this.nextSlide();
                    break;
                case 'previous':
                    await this.previousSlide();
                    break;
                case 'first':
                    await this.goToSlide(1);
                    break;
                case 'last':
                    await this.goToSlide(TOTAL_SLIDES);
                    break;
                case 'toggleFullscreen':
                    await this.toggleFullscreen();
                    break;
                case 'togglePresentation':
                    await this.togglePresentationMode();
                    break;
                case 'refresh':
                    await this.refresh();
                    break;
                case 'help':
                    this.showHelp();
                    break;
            }
        } catch (error) {
            console.error('Keyboard navigation error:', error);
        }
    }

    /**
     * Handle number key input for direct navigation
     */
    handleNumberInput(digit) {
        // Simple implementation - could be enhanced for multi-digit input
        const slideNumber = parseInt(digit);
        if (slideNumber >= 1 && slideNumber <= 9) {
            this.goToSlide(slideNumber);
        }
    }

    /**
     * Handle mouse click navigation
     */
    async handleMouseClick(event) {
        if (this.isNavigating) return;

        try {
            const containerWidth = document.body.clientWidth;
            const clickX = event.clientX;

            // Left half = previous, right half = next
            if (clickX < containerWidth / 2) {
                await this.previousSlide();
            } else {
                await this.nextSlide();
            }
        } catch (error) {
            console.error('Mouse navigation error:', error);
        }
    }

    /**
     * Handle mouse wheel navigation
     */
    async handleMouseWheel(event) {
        if (this.isNavigating) return;

        try {
            // Debounce wheel events
            if (!this.wheelDebounceTimer) {
                if (event.deltaY > 0) {
                    await this.nextSlide();
                } else if (event.deltaY < 0) {
                    await this.previousSlide();
                }

                this.wheelDebounceTimer = setTimeout(() => {
                    this.wheelDebounceTimer = null;
                }, 100);
            }
        } catch (error) {
            console.error('Mouse wheel navigation error:', error);
        }
    }

    /**
     * Handle touch start
     */
    handleTouchStart(event) {
        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
    }

    /**
     * Handle touch end and detect swipe
     */
    async handleTouchEnd(event) {
        if (this.isNavigating) return;

        this.touchEndX = event.changedTouches[0].clientX;
        this.touchEndY = event.changedTouches[0].clientY;

        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;

        // Check if horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.touchThreshold) {
            try {
                if (deltaX > 0) {
                    // Swipe right = previous slide
                    await this.previousSlide();
                } else {
                    // Swipe left = next slide
                    await this.nextSlide();
                }
            } catch (error) {
                console.error('Touch navigation error:', error);
            }
        }
    }

    /**
     * Navigate to next slide
     */
    async nextSlide(transition) {
        if (this.isNavigating) return false;

        try {
            this.isNavigating = true;
            this.resetAutoAdvance();

            const result = await this.slideManager.nextSlide(transition);

            this.addToHistory('next', this.slideManager.getCurrentSlide());

            if (this.autoAdvanceEnabled) {
                this.startAutoAdvance();
            }

            return result !== null;
        } catch (error) {
            console.error('Failed to navigate to next slide:', error);
            return false;
        } finally {
            this.isNavigating = false;
        }
    }

    /**
     * Navigate to previous slide
     */
    async previousSlide(transition) {
        if (this.isNavigating) return false;

        try {
            this.isNavigating = true;
            this.resetAutoAdvance();

            const result = await this.slideManager.previousSlide(transition);

            this.addToHistory('previous', this.slideManager.getCurrentSlide());

            if (this.autoAdvanceEnabled) {
                this.startAutoAdvance();
            }

            return result !== null;
        } catch (error) {
            console.error('Failed to navigate to previous slide:', error);
            return false;
        } finally {
            this.isNavigating = false;
        }
    }

    /**
     * Navigate to specific slide
     */
    async goToSlide(slideNumber, transition) {
        if (this.isNavigating || !this.isValidSlideNumber(slideNumber)) {
            return false;
        }

        try {
            this.isNavigating = true;
            this.resetAutoAdvance();

            const result = await this.slideManager.goToSlide(slideNumber, transition);

            this.addToHistory('goto', slideNumber);

            if (this.autoAdvanceEnabled) {
                this.startAutoAdvance();
            }

            return true;
        } catch (error) {
            console.error(`Failed to navigate to slide ${slideNumber}:`, error);
            return false;
        } finally {
            this.isNavigating = false;
        }
    }

    /**
     * Go back in navigation history
     */
    async goBack(transition) {
        if (this.slideManager.slideHistory.length > 0) {
            return await this.slideManager.goBack(transition);
        }
        return false;
    }

    /**
     * Toggle fullscreen mode
     */
    async toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                this.isFullscreen = true;
            } else {
                await document.exitFullscreen();
                this.isFullscreen = false;
            }

            this.emit('fullscreenChanged', { isFullscreen: this.isFullscreen });
        } catch (error) {
            console.error('Failed to toggle fullscreen:', error);
        }
    }

    /**
     * Toggle presentation mode
     */
    async togglePresentationMode() {
        this.isPresentationMode = !this.isPresentationMode;

        document.body.classList.toggle('presentation-mode', this.isPresentationMode);

        if (this.isPresentationMode) {
            document.body.style.cursor = 'none';

            // Hide cursor after inactivity
            this.hideCursorTimer = setTimeout(() => {
                document.body.style.cursor = 'none';
            }, 3000);
        } else {
            document.body.style.cursor = 'default';
            clearTimeout(this.hideCursorTimer);
        }

        this.emit('presentationModeChanged', { isPresentationMode: this.isPresentationMode });
    }

    /**
     * Refresh current slide
     */
    async refresh() {
        try {
            const currentSlide = this.slideManager.getCurrentSlide();
            this.slideManager.clearCache();
            await this.slideManager.goToSlide(currentSlide);
        } catch (error) {
            console.error('Failed to refresh slide:', error);
        }
    }

    /**
     * Show help dialog
     */
    showHelp() {
        const helpContent = `
            <div class="help-dialog">
                <h3>Navigation Help</h3>
                <div class="help-section">
                    <h4>Keyboard Navigation:</h4>
                    <ul>
                        <li>→ / ↓ / Space / Page Down: Next slide</li>
                        <li>← / ↑ / Page Up: Previous slide</li>
                        <li>Home: First slide</li>
                        <li>End: Last slide</li>
                        <li>1-9: Go to slide number</li>
                        <li>F / Escape: Toggle fullscreen</li>
                        <li>P: Toggle presentation mode</li>
                        <li>R: Refresh current slide</li>
                        <li>H / ?: Show this help</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>Mouse Navigation:</h4>
                    <ul>
                        <li>Click left half: Previous slide</li>
                        <li>Click right half: Next slide</li>
                        <li>Mouse wheel: Navigate slides</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>Touch Navigation:</h4>
                    <ul>
                        <li>Swipe left: Next slide</li>
                        <li>Swipe right: Previous slide</li>
                    </ul>
                </div>
                <button onclick="this.parentElement.remove()">Close</button>
            </div>
        `;

        const helpElement = document.createElement('div');
        helpElement.className = 'help-overlay';
        helpElement.innerHTML = helpContent;
        document.body.appendChild(helpElement);

        // Auto-close after 10 seconds
        setTimeout(() => {
            if (helpElement.parentElement) {
                helpElement.remove();
            }
        }, 10000);
    }

    /**
     * Auto-advance functionality
     */
    startAutoAdvance() {
        if (!this.autoAdvanceEnabled) return;

        this.resetAutoAdvance();

        this.autoAdvanceTimer = setTimeout(async () => {
            const hasNext = await this.nextSlide();
            if (hasNext) {
                this.startAutoAdvance();
            } else {
                this.autoAdvanceEnabled = false;
            }
        }, this.autoAdvanceDelay);
    }

    resetAutoAdvance() {
        if (this.autoAdvanceTimer) {
            clearTimeout(this.autoAdvanceTimer);
            this.autoAdvanceTimer = null;
        }
    }

    setAutoAdvance(enabled, delay = this.autoAdvanceDelay) {
        this.autoAdvanceEnabled = enabled;
        this.autoAdvanceDelay = delay;

        if (enabled) {
            this.startAutoAdvance();
        } else {
            this.resetAutoAdvance();
        }
    }

    /**
     * Bookmark management
     */
    addBookmark(name, slideNumber = this.slideManager.getCurrentSlide()) {
        this.bookmarks.set(name, slideNumber);
        this.emit('bookmarkAdded', { name, slideNumber });
    }

    removeBookmark(name) {
        const removed = this.bookmarks.delete(name);
        if (removed) {
            this.emit('bookmarkRemoved', { name });
        }
        return removed;
    }

    async goToBookmark(name) {
        const slideNumber = this.bookmarks.get(name);
        if (slideNumber) {
            return await this.goToSlide(slideNumber);
        }
        return false;
    }

    getBookmarks() {
        return Array.from(this.bookmarks.entries()).map(([name, slideNumber]) => ({
            name,
            slideNumber
        }));
    }

    /**
     * Navigation history management
     */
    addToHistory(action, slideNumber) {
        this.navigationHistory.push({
            action,
            slideNumber,
            timestamp: Date.now()
        });

        // Limit history size
        if (this.navigationHistory.length > this.maxHistorySize) {
            this.navigationHistory = this.navigationHistory.slice(-this.maxHistorySize);
        }
    }

    getNavigationHistory() {
        return [...this.navigationHistory];
    }

    clearHistory() {
        this.navigationHistory = [];
    }

    /**
     * Event handlers
     */
    onSlideChanged(data) {
        // Update presentation state
        this.emit('navigationCompleted', data);

        // Update URL if browser supports it
        if (history.pushState) {
            const url = new URL(window.location);
            url.searchParams.set('slide', data.currentSlide);
            history.pushState({ slide: data.currentSlide }, '', url);
        }
    }

    onLanguageChanged(data) {
        this.emit('languageChanged', data);
    }

    /**
     * Utility methods
     */
    isValidSlideNumber(slideNumber) {
        return Number.isInteger(slideNumber) && slideNumber >= 1 && slideNumber <= TOTAL_SLIDES;
    }

    getCurrentSlide() {
        return this.slideManager.getCurrentSlide();
    }

    getTotalSlides() {
        return TOTAL_SLIDES;
    }

    /**
     * Event system
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in navigation event listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Remove all event listeners
        for (const [eventType, handler] of this.eventListeners.entries()) {
            if (['keydown', 'mousedown', 'mouseup', 'wheel', 'touchstart', 'touchend', 'touchmove'].includes(eventType)) {
                document.removeEventListener(eventType, handler);
            }
        }

        // Clear timers
        this.resetAutoAdvance();
        if (this.wheelDebounceTimer) {
            clearTimeout(this.wheelDebounceTimer);
        }
        if (this.hideCursorTimer) {
            clearTimeout(this.hideCursorTimer);
        }

        // Clear data
        this.eventListeners.clear();
        this.navigationHistory = [];
        this.bookmarks.clear();

        console.log('NavigationController destroyed');
    }
}