/**
 * SlideManager Test Suite
 * Tests for slide loading, preloading, and rendering functionality
 */

// Simple assertion library
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

// Mock slide data
const mockSlideData = {
    slide1: {
        id: 'slide1',
        title: 'Introduction to Family Planning',
        content: '<h1>Family Planning Overview</h1><p>Test content for slide 1</p>',
        citations: ['Citation1', 'Citation2'],
        visualizations: []
    },
    slide2: {
        id: 'slide2',
        title: 'Population Trends',
        content: '<h1>Global Population Trends</h1><p>Test content for slide 2</p>',
        citations: ['Citation3'],
        visualizations: [
            {
                type: 'plotly',
                data: { x: [1, 2, 3], y: [1, 4, 9] },
                config: { title: 'Population Growth' }
            }
        ]
    },
    slide3: {
        id: 'slide3',
        title: 'Policy Implications',
        content: '<h1>Policy Analysis</h1><p>Test content for slide 3</p>',
        citations: ['Citation4', 'Citation5'],
        visualizations: [
            {
                type: 'leaflet',
                data: { lat: 37.5665, lng: 126.9780 },
                config: { zoom: 10 }
            }
        ]
    }
};

// Mock SlideManager class for testing
class MockSlideManager {
    constructor() {
        this.currentSlide = null;
        this.preloadedSlides = new Map();
        this.slideData = mockSlideData;
    }

    async loadSlide(slideId) {
        if (!this.slideData[slideId]) {
            throw new Error(`Slide ${slideId} not found`);
        }
        this.currentSlide = this.slideData[slideId];
        return this.currentSlide;
    }

    async preloadAdjacentSlides(currentSlideId) {
        const slideIds = Object.keys(this.slideData);
        const currentIndex = slideIds.indexOf(currentSlideId);

        const preloadPromises = [];

        // Preload previous slide
        if (currentIndex > 0) {
            const prevId = slideIds[currentIndex - 1];
            preloadPromises.push(this.preloadSlide(prevId));
        }

        // Preload next slide
        if (currentIndex < slideIds.length - 1) {
            const nextId = slideIds[currentIndex + 1];
            preloadPromises.push(this.preloadSlide(nextId));
        }

        return Promise.all(preloadPromises);
    }

    async preloadSlide(slideId) {
        if (!this.preloadedSlides.has(slideId)) {
            const slide = this.slideData[slideId];
            if (slide) {
                this.preloadedSlides.set(slideId, slide);
            }
        }
        return this.preloadedSlides.get(slideId);
    }

    renderSlide(slide, container) {
        if (!slide || !container) {
            throw new Error('Slide and container are required');
        }

        const slideElement = document.createElement('div');
        slideElement.className = 'slide';
        slideElement.innerHTML = `
            <div class="slide-header">
                <h1>${slide.title}</h1>
            </div>
            <div class="slide-content">
                ${slide.content}
            </div>
            <div class="slide-visualizations" data-visualizations='${JSON.stringify(slide.visualizations)}'>
                <!-- Visualizations will be rendered here -->
            </div>
        `;

        container.innerHTML = '';
        container.appendChild(slideElement);

        return slideElement;
    }
}

// Test suite
const SlideManagerTests = {
    async testLoadSlideWithValidId() {
        const manager = new MockSlideManager();
        const slide = await manager.loadSlide('slide1');

        assert.equal(slide.id, 'slide1', 'Should load slide with correct ID');
        assert.equal(slide.title, 'Introduction to Family Planning', 'Should load slide with correct title');
        assert.ok(slide.content.includes('Test content for slide 1'), 'Should load slide with correct content');
        assert.equal(manager.currentSlide, slide, 'Should set current slide');

        return 'testLoadSlideWithValidId passed';
    },

    async testLoadSlideWithInvalidId() {
        const manager = new MockSlideManager();

        try {
            await manager.loadSlide('nonexistent');
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('not found'), 'Should throw appropriate error for invalid slide ID');
        }

        return 'testLoadSlideWithInvalidId passed';
    },

    async testPreloadAdjacentSlides() {
        const manager = new MockSlideManager();

        // Test preloading from middle slide
        await manager.preloadAdjacentSlides('slide2');

        assert.ok(manager.preloadedSlides.has('slide1'), 'Should preload previous slide');
        assert.ok(manager.preloadedSlides.has('slide3'), 'Should preload next slide');
        assert.equal(manager.preloadedSlides.size, 2, 'Should preload exactly 2 slides');

        // Test preloading from first slide
        manager.preloadedSlides.clear();
        await manager.preloadAdjacentSlides('slide1');

        assert.ok(manager.preloadedSlides.has('slide2'), 'Should preload next slide from first slide');
        assert.equal(manager.preloadedSlides.size, 1, 'Should preload only next slide from first slide');

        // Test preloading from last slide
        manager.preloadedSlides.clear();
        await manager.preloadAdjacentSlides('slide3');

        assert.ok(manager.preloadedSlides.has('slide2'), 'Should preload previous slide from last slide');
        assert.equal(manager.preloadedSlides.size, 1, 'Should preload only previous slide from last slide');

        return 'testPreloadAdjacentSlides passed';
    },

    async testRenderSlideWithValidData() {
        const manager = new MockSlideManager();
        const container = document.createElement('div');
        const slide = mockSlideData.slide2;

        const renderedElement = manager.renderSlide(slide, container);

        assert.ok(renderedElement, 'Should return rendered element');
        assert.equal(renderedElement.className, 'slide', 'Should have correct CSS class');
        assert.ok(renderedElement.innerHTML.includes(slide.title), 'Should include slide title');
        assert.ok(renderedElement.innerHTML.includes('Test content for slide 2'), 'Should include slide content');
        assert.equal(container.children.length, 1, 'Should add exactly one child to container');

        // Test visualization data attribute
        const vizElement = renderedElement.querySelector('.slide-visualizations');
        assert.ok(vizElement, 'Should include visualizations container');
        const vizData = JSON.parse(vizElement.dataset.visualizations);
        assert.deepEqual(vizData, slide.visualizations, 'Should include visualization data');

        return 'testRenderSlideWithValidData passed';
    },

    async testRenderSlideWithInvalidData() {
        const manager = new MockSlideManager();
        const container = document.createElement('div');

        try {
            manager.renderSlide(null, container);
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('required'), 'Should throw error for null slide');
        }

        try {
            manager.renderSlide(mockSlideData.slide1, null);
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('required'), 'Should throw error for null container');
        }

        return 'testRenderSlideWithInvalidData passed';
    },

    async testSlideDataIntegrity() {
        const manager = new MockSlideManager();

        // Test that all mock slides have required properties
        Object.keys(mockSlideData).forEach(slideId => {
            const slide = mockSlideData[slideId];
            assert.ok(slide.id, 'Slide should have ID');
            assert.ok(slide.title, 'Slide should have title');
            assert.ok(slide.content, 'Slide should have content');
            assert.ok(Array.isArray(slide.citations), 'Slide should have citations array');
            assert.ok(Array.isArray(slide.visualizations), 'Slide should have visualizations array');
        });

        return 'testSlideDataIntegrity passed';
    }
};

// Export for test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SlideManagerTests, MockSlideManager, mockSlideData };
} else {
    window.SlideManagerTests = SlideManagerTests;
    window.MockSlideManager = MockSlideManager;
    window.mockSlideData = mockSlideData;
}