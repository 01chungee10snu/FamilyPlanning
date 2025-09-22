/**
 * Navigation Integration Test Suite
 * Tests for slide navigation functionality and user interactions
 */

// Simple assertion library (consistent with other tests)
const assert = {
    equal: (actual, expected, message = '') => {
        if (actual !== expected) {
            throw new Error(`Assertion failed: ${message}\nExpected: ${expected}\nActual: ${actual}`);
        }
        return true;
    },
    deepEqual: (actual, expected, message = '') => {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        if (actualStr !== expectedStr) {
            throw new Error(`Assertion failed: ${message}\nExpected: ${expectedStr}\nActual: ${actualStr}`);
        }
        return true;
    },
    ok: (value, message = '') => {
        if (!value) {
            throw new Error(`Assertion failed: ${message}\nExpected truthy value, got: ${value}`);
        }
        return true;
    },
    notEqual: (actual, expected, message = '') => {
        if (actual === expected) {
            throw new Error(`Assertion failed: ${message}\nExpected values to be different, but both were: ${actual}`);
        }
        return true;
    }
};

// Mock navigation state and slide data
const mockNavigationData = {
    slides: [
        { id: 'slide1', title: 'Introduction', order: 1 },
        { id: 'slide2', title: 'Population Trends', order: 2 },
        { id: 'slide3', title: 'Policy Analysis', order: 3 },
        { id: 'slide4', title: 'Conclusion', order: 4 }
    ],
    initialSlide: 'slide1'
};

// Mock NavigationController class
class MockNavigationController {
    constructor(slides, initialSlideId = null) {
        this.slides = slides || [];
        this.currentSlideIndex = 0;
        this.navigationHistory = [];
        this.eventListeners = new Map();

        if (initialSlideId) {
            const index = this.slides.findIndex(slide => slide.id === initialSlideId);
            if (index !== -1) {
                this.currentSlideIndex = index;
            }
        }

        this.navigationHistory.push(this.getCurrentSlide().id);
    }

    getCurrentSlide() {
        return this.slides[this.currentSlideIndex] || null;
    }

    nextSlide() {
        if (this.canGoNext()) {
            this.currentSlideIndex++;
            this.addToHistory(this.getCurrentSlide().id);
            this.fireEvent('slideChange', {
                from: this.slides[this.currentSlideIndex - 1],
                to: this.getCurrentSlide(),
                direction: 'next'
            });
            return this.getCurrentSlide();
        }
        return null;
    }

    previousSlide() {
        if (this.canGoPrevious()) {
            this.currentSlideIndex--;
            this.addToHistory(this.getCurrentSlide().id);
            this.fireEvent('slideChange', {
                from: this.slides[this.currentSlideIndex + 1],
                to: this.getCurrentSlide(),
                direction: 'previous'
            });
            return this.getCurrentSlide();
        }
        return null;
    }

    goToSlide(slideId) {
        const targetIndex = this.slides.findIndex(slide => slide.id === slideId);
        if (targetIndex === -1) {
            throw new Error(`Slide ${slideId} not found`);
        }

        const fromSlide = this.getCurrentSlide();
        this.currentSlideIndex = targetIndex;
        this.addToHistory(slideId);

        this.fireEvent('slideChange', {
            from: fromSlide,
            to: this.getCurrentSlide(),
            direction: targetIndex > this.slides.findIndex(s => s.id === fromSlide.id) ? 'next' : 'previous'
        });

        return this.getCurrentSlide();
    }

    canGoNext() {
        return this.currentSlideIndex < this.slides.length - 1;
    }

    canGoPrevious() {
        return this.currentSlideIndex > 0;
    }

    getSlidePosition() {
        return {
            current: this.currentSlideIndex + 1,
            total: this.slides.length,
            percentage: ((this.currentSlideIndex + 1) / this.slides.length) * 100
        };
    }

    addToHistory(slideId) {
        this.navigationHistory.push(slideId);
        // Keep history limited to prevent memory issues
        if (this.navigationHistory.length > 50) {
            this.navigationHistory.shift();
        }
    }

    getNavigationHistory() {
        return [...this.navigationHistory];
    }

    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    removeEventListener(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    fireEvent(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in event listener:', error);
                }
            });
        }
    }
}

// Mock keyboard navigation handler
class MockKeyboardNavigationHandler {
    constructor(navigationController) {
        this.navigationController = navigationController;
        this.keyHandlers = new Map();
        this.isEnabled = true;

        this.setupDefaultHandlers();
    }

    setupDefaultHandlers() {
        this.keyHandlers.set('ArrowRight', () => this.navigationController.nextSlide());
        this.keyHandlers.set('ArrowLeft', () => this.navigationController.previousSlide());
        this.keyHandlers.set('Space', () => this.navigationController.nextSlide());
        this.keyHandlers.set('Backspace', () => this.navigationController.previousSlide());
        this.keyHandlers.set('Home', () => this.navigationController.goToSlide(this.navigationController.slides[0].id));
        this.keyHandlers.set('End', () => {
            const lastSlide = this.navigationController.slides[this.navigationController.slides.length - 1];
            return this.navigationController.goToSlide(lastSlide.id);
        });
    }

    handleKeyPress(key) {
        if (!this.isEnabled) {
            return false;
        }

        if (this.keyHandlers.has(key)) {
            this.keyHandlers.get(key)();
            return true;
        }

        return false;
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
    }

    addCustomHandler(key, handler) {
        this.keyHandlers.set(key, handler);
    }

    removeHandler(key) {
        this.keyHandlers.delete(key);
    }
}

// Test suite
const NavigationIntegrationTests = {
    async testBasicNavigation() {
        const controller = new MockNavigationController(mockNavigationData.slides, 'slide1');

        // Test initial state
        assert.equal(controller.getCurrentSlide().id, 'slide1', 'Should start on correct slide');
        assert.ok(controller.canGoNext(), 'Should be able to go next from first slide');
        assert.ok(!controller.canGoPrevious(), 'Should not be able to go previous from first slide');

        // Test next navigation
        const nextSlide = controller.nextSlide();
        assert.equal(nextSlide.id, 'slide2', 'Should navigate to next slide');
        assert.equal(controller.getCurrentSlide().id, 'slide2', 'Should update current slide');

        // Test previous navigation
        const prevSlide = controller.previousSlide();
        assert.equal(prevSlide.id, 'slide1', 'Should navigate to previous slide');
        assert.equal(controller.getCurrentSlide().id, 'slide1', 'Should update current slide');

        return 'testBasicNavigation passed';
    },

    async testNavigationBoundaries() {
        const controller = new MockNavigationController(mockNavigationData.slides, 'slide1');

        // Test can't go before first slide
        assert.equal(controller.previousSlide(), null, 'Should return null when trying to go before first slide');
        assert.equal(controller.getCurrentSlide().id, 'slide1', 'Should stay on first slide');

        // Navigate to last slide
        controller.goToSlide('slide4');
        assert.equal(controller.getCurrentSlide().id, 'slide4', 'Should navigate to last slide');

        // Test can't go past last slide
        assert.equal(controller.nextSlide(), null, 'Should return null when trying to go past last slide');
        assert.equal(controller.getCurrentSlide().id, 'slide4', 'Should stay on last slide');
        assert.ok(!controller.canGoNext(), 'Should not be able to go next from last slide');

        return 'testNavigationBoundaries passed';
    },

    async testDirectSlideNavigation() {
        const controller = new MockNavigationController(mockNavigationData.slides, 'slide1');

        // Test jumping to specific slide
        const targetSlide = controller.goToSlide('slide3');
        assert.equal(targetSlide.id, 'slide3', 'Should navigate directly to target slide');
        assert.equal(controller.getCurrentSlide().id, 'slide3', 'Should update current slide');

        // Test navigation to non-existent slide
        try {
            controller.goToSlide('nonexistent');
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('not found'), 'Should throw error for non-existent slide');
        }

        return 'testDirectSlideNavigation passed';
    },

    async testNavigationEvents() {
        const controller = new MockNavigationController(mockNavigationData.slides, 'slide1');
        const eventLog = [];

        // Add event listener
        controller.addEventListener('slideChange', (data) => {
            eventLog.push({
                from: data.from.id,
                to: data.to.id,
                direction: data.direction
            });
        });

        // Test next navigation event
        controller.nextSlide();
        assert.equal(eventLog.length, 1, 'Should fire event for next navigation');
        assert.equal(eventLog[0].from, 'slide1', 'Should include correct from slide');
        assert.equal(eventLog[0].to, 'slide2', 'Should include correct to slide');
        assert.equal(eventLog[0].direction, 'next', 'Should include correct direction');

        // Test previous navigation event
        controller.previousSlide();
        assert.equal(eventLog.length, 2, 'Should fire event for previous navigation');
        assert.equal(eventLog[1].direction, 'previous', 'Should include correct direction for previous');

        // Test direct navigation event
        controller.goToSlide('slide4');
        assert.equal(eventLog.length, 3, 'Should fire event for direct navigation');
        assert.equal(eventLog[2].to, 'slide4', 'Should include correct target slide');

        return 'testNavigationEvents passed';
    },

    async testKeyboardNavigation() {
        const controller = new MockNavigationController(mockNavigationData.slides, 'slide1');
        const keyHandler = new MockKeyboardNavigationHandler(controller);

        // Test arrow key navigation
        keyHandler.handleKeyPress('ArrowRight');
        assert.equal(controller.getCurrentSlide().id, 'slide2', 'Should navigate next with right arrow');

        keyHandler.handleKeyPress('ArrowLeft');
        assert.equal(controller.getCurrentSlide().id, 'slide1', 'Should navigate previous with left arrow');

        // Test space bar navigation
        keyHandler.handleKeyPress('Space');
        assert.equal(controller.getCurrentSlide().id, 'slide2', 'Should navigate next with space');

        // Test home/end keys
        keyHandler.handleKeyPress('End');
        assert.equal(controller.getCurrentSlide().id, 'slide4', 'Should navigate to last slide with End');

        keyHandler.handleKeyPress('Home');
        assert.equal(controller.getCurrentSlide().id, 'slide1', 'Should navigate to first slide with Home');

        return 'testKeyboardNavigation passed';
    },

    async testKeyboardNavigationDisabling() {
        const controller = new MockNavigationController(mockNavigationData.slides, 'slide1');
        const keyHandler = new MockKeyboardNavigationHandler(controller);

        // Test disabling keyboard navigation
        keyHandler.disable();
        const handled = keyHandler.handleKeyPress('ArrowRight');
        assert.ok(!handled, 'Should not handle key when disabled');
        assert.equal(controller.getCurrentSlide().id, 'slide1', 'Should not navigate when disabled');

        // Test re-enabling
        keyHandler.enable();
        const handledAfterEnable = keyHandler.handleKeyPress('ArrowRight');
        assert.ok(handledAfterEnable, 'Should handle key when re-enabled');
        assert.equal(controller.getCurrentSlide().id, 'slide2', 'Should navigate when re-enabled');

        return 'testKeyboardNavigationDisabling passed';
    },

    async testNavigationHistory() {
        const controller = new MockNavigationController(mockNavigationData.slides, 'slide1');

        // Check initial history
        let history = controller.getNavigationHistory();
        assert.equal(history.length, 1, 'Should have initial slide in history');
        assert.equal(history[0], 'slide1', 'Should have correct initial slide in history');

        // Navigate and check history
        controller.nextSlide();
        controller.nextSlide();
        controller.previousSlide();
        controller.goToSlide('slide4');

        history = controller.getNavigationHistory();
        assert.equal(history.length, 5, 'Should track all navigation steps');
        assert.deepEqual(history, ['slide1', 'slide2', 'slide3', 'slide2', 'slide4'], 'Should maintain correct navigation order');

        return 'testNavigationHistory passed';
    },

    async testSlidePositionTracking() {
        const controller = new MockNavigationController(mockNavigationData.slides, 'slide1');

        // Test position on first slide
        let position = controller.getSlidePosition();
        assert.equal(position.current, 1, 'Should show correct current position');
        assert.equal(position.total, 4, 'Should show correct total slides');
        assert.equal(position.percentage, 25, 'Should calculate correct percentage');

        // Test position on middle slide
        controller.goToSlide('slide3');
        position = controller.getSlidePosition();
        assert.equal(position.current, 3, 'Should update current position');
        assert.equal(position.percentage, 75, 'Should update percentage');

        // Test position on last slide
        controller.goToSlide('slide4');
        position = controller.getSlidePosition();
        assert.equal(position.current, 4, 'Should show correct position on last slide');
        assert.equal(position.percentage, 100, 'Should show 100% on last slide');

        return 'testSlidePositionTracking passed';
    }
};

// Export for test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NavigationIntegrationTests,
        MockNavigationController,
        MockKeyboardNavigationHandler,
        mockNavigationData
    };
} else {
    window.NavigationIntegrationTests = NavigationIntegrationTests;
    window.MockNavigationController = MockNavigationController;
    window.MockKeyboardNavigationHandler = MockKeyboardNavigationHandler;
    window.mockNavigationData = mockNavigationData;
}