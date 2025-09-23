/**
 * Slide Manager
 * Handles slide navigation, state management, and content loading
 */

import {
    TOTAL_SLIDES,
    TOTAL_SECTIONS,
    CACHE_SIZE,
    PRELOAD_RANGE,
    PERFORMANCE_TARGETS,
    ERROR_MESSAGES,
    SECTIONS,
    DATA_PATHS
} from '../utils/constants.js';

import { performance as perfHelpers } from '../utils/helpers.js';

export class SlideManager {
    constructor(totalSlides = TOTAL_SLIDES, totalSections = TOTAL_SECTIONS) {
        this.totalSlides = totalSlides;
        this.totalSections = totalSections;
        this.currentSlide = 1;
        this.currentLanguage = 'ko';

        // Slide management
        this.slideHistory = [];
        this.slideCache = new Map();
        this.maxCacheSize = CACHE_SIZE;
        this.preloadRange = PRELOAD_RANGE;

        // Data storage
        this.slidesData = null;
        this.sectionsData = null;
        this.visualizationsData = null;
        this.citationsData = null;

        // Performance tracking
        this.performanceMetrics = {
            loadTimes: [],
            renderTimes: [],
            transitionTimes: [],
            cacheHitRate: 0,
            totalCacheRequests: 0,
            cacheHits: 0
        };

        // Event listeners
        this.eventListeners = new Map();

        // Transition settings
        this.transitionTypes = ['fade', 'slide', 'zoom'];
        this.currentTransition = 'fade';

        console.log('SlideManager initialized with', totalSlides, 'slides and', totalSections, 'sections');
    }

    /**
     * Initialize the slide manager by loading data
     */
    async initialize() {
        try {
            const startTime = performance.now();

            // Load all necessary data
            await this.loadSlidesData();
            await this.loadSectionsData();
            await this.loadVisualizationsData();
            await this.loadCitationsData();

            // Preload initial slides
            await this.preloadInitialSlides();

            const loadTime = performance.now() - startTime;
            this.performanceMetrics.loadTimes.push(loadTime);

            console.log(`SlideManager initialized in ${loadTime.toFixed(2)}ms`);

            return true;
        } catch (error) {
            console.error('Failed to initialize SlideManager:', error);
            throw new Error(`${ERROR_MESSAGES.DATA_LOAD_FAILED}: ${error.message}`);
        }
    }

    /**
     * Load slides data from JSON file
     */
    async loadSlidesData() {
        try {
            const response = await fetch(DATA_PATHS.SLIDES);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.slidesData = await response.json();
            return this.slidesData;
        } catch (error) {
            console.error('Failed to load slides data:', error);
            throw error;
        }
    }

    /**
     * Load sections data from JSON file
     */
    async loadSectionsData() {
        try {
            const response = await fetch(DATA_PATHS.SECTIONS);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.sectionsData = await response.json();
            return this.sectionsData;
        } catch (error) {
            console.error('Failed to load sections data:', error);
            throw error;
        }
    }

    /**
     * Load visualizations data from JSON file
     */
    async loadVisualizationsData() {
        try {
            const response = await fetch(DATA_PATHS.VISUALIZATIONS);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.visualizationsData = await response.json();
            return this.visualizationsData;
        } catch (error) {
            console.error('Failed to load visualizations data:', error);
            throw error;
        }
    }

    /**
     * Load citations data from JSON file
     */
    async loadCitationsData() {
        try {
            const response = await fetch(DATA_PATHS.CITATIONS);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.citationsData = await response.json();
            return this.citationsData;
        } catch (error) {
            console.error('Failed to load citations data:', error);
            throw error;
        }
    }

    /**
     * Preload initial slides for better performance
     */
    async preloadInitialSlides() {
        const slidesToPreload = [1, 2, 3]; // Preload first 3 slides

        for (const slideNumber of slidesToPreload) {
            await this.preloadSlide(slideNumber);
        }
    }

    /**
     * Get current slide number
     */
    getCurrentSlide() {
        return this.currentSlide;
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Set current language
     */
    setLanguage(language) {
        if (['ko', 'en'].includes(language)) {
            this.currentLanguage = language;
            this.emit('languageChanged', { language });
        }
    }

    /**
     * Navigate to a specific slide
     */
    async goToSlide(slideNumber, transition = this.currentTransition) {
        try {
            const startTime = performance.now();

            // Validate slide number
            if (!this.isValidSlideNumber(slideNumber)) {
                throw new Error(`${ERROR_MESSAGES.SLIDE_NOT_FOUND}: ${slideNumber}`);
            }

            // Store previous slide in history
            if (this.currentSlide !== slideNumber) {
                this.slideHistory.push(this.currentSlide);

                // Limit history size
                if (this.slideHistory.length > 50) {
                    this.slideHistory = this.slideHistory.slice(-50);
                }
            }

            const previousSlide = this.currentSlide;
            this.currentSlide = slideNumber;

            // Preload adjacent slides
            await this.preloadAdjacentSlides(slideNumber);

            // Get slide content
            const slideContent = await this.getSlideContent(slideNumber);

            // Render slide with transition
            await this.renderSlide(slideContent, transition);

            const transitionTime = performance.now() - startTime;
            this.performanceMetrics.transitionTimes.push(transitionTime);

            // Emit navigation event
            this.emit('slideChanged', {
                currentSlide: slideNumber,
                previousSlide: previousSlide,
                transition: transition,
                slideContent: slideContent
            });

            console.log(`Navigated to slide ${slideNumber} in ${transitionTime.toFixed(2)}ms`);

            return slideContent;
        } catch (error) {
            console.error(`Failed to navigate to slide ${slideNumber}:`, error);
            throw error;
        }
    }

    /**
     * Navigate to next slide
     */
    async nextSlide(transition) {
        const nextSlideNumber = Math.min(this.currentSlide + 1, this.totalSlides);
        if (nextSlideNumber !== this.currentSlide) {
            return await this.goToSlide(nextSlideNumber, transition);
        }
        return null;
    }

    /**
     * Navigate to previous slide
     */
    async previousSlide(transition) {
        const previousSlideNumber = Math.max(this.currentSlide - 1, 1);
        if (previousSlideNumber !== this.currentSlide) {
            return await this.goToSlide(previousSlideNumber, transition);
        }
        return null;
    }

    /**
     * Go back to the last visited slide
     */
    async goBack(transition) {
        if (this.slideHistory.length > 0) {
            const lastSlide = this.slideHistory.pop();
            // Use direct assignment to avoid adding to history again
            const temp = this.currentSlide;
            this.currentSlide = lastSlide;
            await this.goToSlide(temp, transition);
        }
    }

    /**
     * Get slide content with caching
     */
    async getSlideContent(slideNumber) {
        try {
            this.performanceMetrics.totalCacheRequests++;

            // Check cache first
            if (this.slideCache.has(slideNumber)) {
                this.performanceMetrics.cacheHits++;
                this.updateCacheHitRate();
                return this.slideCache.get(slideNumber);
            }

            // Load slide from data
            const slide = this.slidesData?.slides?.find(s => s.order === slideNumber);
            if (!slide) {
                throw new Error(`${ERROR_MESSAGES.SLIDE_NOT_FOUND}: ${slideNumber}`);
            }

            // Enrich slide with additional data
            const enrichedSlide = await this.enrichSlideContent(slide);

            // Cache the slide
            this.cacheSlide(slideNumber, enrichedSlide);

            return enrichedSlide;
        } catch (error) {
            console.error(`Failed to get slide content for slide ${slideNumber}:`, error);
            throw error;
        }
    }

    /**
     * Enrich slide content with visualizations and citations
     */
    async enrichSlideContent(slide) {
        const enrichedSlide = { ...slide };

        // Add visualization data if present
        if (slide.visualizations && slide.visualizations.length > 0) {
            enrichedSlide.visualizationData = slide.visualizations.map(vizId => {
                return this.visualizationsData?.visualizations?.find(v => v.id === vizId);
            }).filter(Boolean);
        }

        // Add citation data if present
        if (slide.citations && slide.citations.length > 0) {
            enrichedSlide.citationData = slide.citations.map(citationId => {
                return this.citationsData?.citations?.find(c => c.id === citationId);
            }).filter(Boolean);
        }

        // Add section information
        const section = this.sectionsData?.sections?.find(s => s.id === slide.sectionId);
        if (section) {
            enrichedSlide.sectionData = section;
        }

        return enrichedSlide;
    }

    /**
     * Cache a slide with LRU eviction
     */
    cacheSlide(slideNumber, slideContent) {
        // Remove if already exists
        if (this.slideCache.has(slideNumber)) {
            this.slideCache.delete(slideNumber);
        }

        // Add to cache
        this.slideCache.set(slideNumber, slideContent);

        // Evict oldest entries if cache is full
        if (this.slideCache.size > this.maxCacheSize) {
            const firstKey = this.slideCache.keys().next().value;
            this.slideCache.delete(firstKey);
        }
    }

    /**
     * Preload a specific slide
     */
    async preloadSlide(slideNumber) {
        try {
            if (!this.isValidSlideNumber(slideNumber) || this.slideCache.has(slideNumber)) {
                return;
            }

            await this.getSlideContent(slideNumber);
            console.log(`Preloaded slide ${slideNumber}`);
        } catch (error) {
            console.warn(`Failed to preload slide ${slideNumber}:`, error);
        }
    }

    /**
     * Preload slides adjacent to current slide
     */
    async preloadAdjacentSlides(currentSlide) {
        const promises = [];

        // Preload previous slides
        for (let i = 1; i <= this.preloadRange; i++) {
            const slideNumber = currentSlide - i;
            if (slideNumber >= 1) {
                promises.push(this.preloadSlide(slideNumber));
            }
        }

        // Preload next slides
        for (let i = 1; i <= this.preloadRange; i++) {
            const slideNumber = currentSlide + i;
            if (slideNumber <= this.totalSlides) {
                promises.push(this.preloadSlide(slideNumber));
            }
        }

        await Promise.all(promises);
    }

    /**
     * Render slide to DOM
     */
    async renderSlide(slideContent, transition = 'fade') {
        try {
            const startTime = performance.now();

            const slideContainer = document.getElementById('slide-container');
            if (!slideContainer) {
                throw new Error('Slide container not found');
            }

            // Create slide element
            const slideElement = this.createSlideElement(slideContent);

            // Apply transition
            await this.applyTransition(slideContainer, slideElement, transition);

            const renderTime = performance.now() - startTime;
            this.performanceMetrics.renderTimes.push(renderTime);

            console.log(`Rendered slide in ${renderTime.toFixed(2)}ms`);
        } catch (error) {
            console.error('Failed to render slide:', error);
            throw error;
        }
    }

    /**
     * Create slide DOM element
     */
    createSlideElement(slideContent) {
        const slideElement = document.createElement('div');
        slideElement.className = 'slide';
        slideElement.setAttribute('data-slide-id', slideContent.id);
        slideElement.setAttribute('data-slide-order', slideContent.order);

        // Create slide structure
        const slideHTML = `
            <div class="slide-header">
                <h1 class="slide-title">${slideContent.title}</h1>
                ${slideContent.subtitle ? `<h2 class="slide-subtitle">${slideContent.subtitle}</h2>` : ''}
            </div>
            <div class="slide-content">
                <div class="slide-text">
                    ${this.formatSlideContent(slideContent.content[this.currentLanguage])}
                </div>
                ${this.createVisualizationsHTML(slideContent.visualizationData)}
                ${this.createCitationsHTML(slideContent.citationData)}
            </div>
            <div class="slide-footer">
                <div class="slide-progress">
                    <span class="current-slide">${slideContent.order}</span>
                    <span class="separator">/</span>
                    <span class="total-slides">${this.totalSlides}</span>
                </div>
                ${slideContent.sectionData ? `<div class="section-name">${slideContent.sectionData.title[this.currentLanguage]}</div>` : ''}
            </div>
        `;

        slideElement.innerHTML = slideHTML;
        return slideElement;
    }

    /**
     * Format slide content (handle line breaks, lists, etc.)
     */
    formatSlideContent(content) {
        if (!content) return '';

        return content
            .split('\n')
            .map(line => {
                line = line.trim();
                if (line.startsWith('•')) {
                    return `<li>${line.substring(1).trim()}</li>`;
                } else if (line.length > 0) {
                    return `<p>${line}</p>`;
                }
                return '';
            })
            .join('')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    }

    /**
     * Create visualizations HTML
     */
    createVisualizationsHTML(visualizations) {
        if (!visualizations || visualizations.length === 0) {
            return '';
        }

        return `
            <div class="slide-visualizations">
                ${visualizations.map(viz => `
                    <div class="visualization" data-viz-id="${viz.id}">
                        <div class="viz-placeholder">
                            Visualization: ${viz.title || viz.id}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Create citations HTML
     */
    createCitationsHTML(citations) {
        if (!citations || citations.length === 0) {
            return '';
        }

        return `
            <div class="slide-citations">
                ${citations.map(citation => `
                    <div class="citation" data-citation-id="${citation.id}">
                        <small>${citation.shortForm || citation.id}</small>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Apply slide transition
     */
    async applyTransition(container, newSlideElement, transition) {
        const currentSlide = container.querySelector('.slide');

        switch (transition) {
            case 'fade':
                await this.fadeTransition(container, currentSlide, newSlideElement);
                break;
            case 'slide':
                await this.slideTransition(container, currentSlide, newSlideElement);
                break;
            case 'zoom':
                await this.zoomTransition(container, currentSlide, newSlideElement);
                break;
            default:
                await this.fadeTransition(container, currentSlide, newSlideElement);
        }
    }

    /**
     * Fade transition
     */
    async fadeTransition(container, currentSlide, newSlide) {
        return new Promise((resolve) => {
            if (currentSlide) {
                currentSlide.style.opacity = '0';
                setTimeout(() => {
                    currentSlide.remove();
                    newSlide.style.opacity = '0';
                    container.appendChild(newSlide);

                    requestAnimationFrame(() => {
                        newSlide.style.transition = 'opacity 300ms ease-in-out';
                        newSlide.style.opacity = '1';
                        setTimeout(resolve, 300);
                    });
                }, 150);
            } else {
                container.appendChild(newSlide);
                resolve();
            }
        });
    }

    /**
     * Slide transition
     */
    async slideTransition(container, currentSlide, newSlide) {
        return new Promise((resolve) => {
            if (currentSlide) {
                newSlide.style.transform = 'translateX(100%)';
                container.appendChild(newSlide);

                requestAnimationFrame(() => {
                    currentSlide.style.transition = 'transform 300ms ease-in-out';
                    newSlide.style.transition = 'transform 300ms ease-in-out';

                    currentSlide.style.transform = 'translateX(-100%)';
                    newSlide.style.transform = 'translateX(0)';

                    setTimeout(() => {
                        currentSlide.remove();
                        resolve();
                    }, 300);
                });
            } else {
                container.appendChild(newSlide);
                resolve();
            }
        });
    }

    /**
     * Zoom transition
     */
    async zoomTransition(container, currentSlide, newSlide) {
        return new Promise((resolve) => {
            if (currentSlide) {
                newSlide.style.transform = 'scale(0.8)';
                newSlide.style.opacity = '0';
                container.appendChild(newSlide);

                requestAnimationFrame(() => {
                    currentSlide.style.transition = 'transform 300ms ease-in-out, opacity 300ms ease-in-out';
                    newSlide.style.transition = 'transform 300ms ease-in-out, opacity 300ms ease-in-out';

                    currentSlide.style.transform = 'scale(1.2)';
                    currentSlide.style.opacity = '0';
                    newSlide.style.transform = 'scale(1)';
                    newSlide.style.opacity = '1';

                    setTimeout(() => {
                        currentSlide.remove();
                        resolve();
                    }, 300);
                });
            } else {
                container.appendChild(newSlide);
                resolve();
            }
        });
    }

    /**
     * Validate slide number
     */
    isValidSlideNumber(slideNumber) {
        return Number.isInteger(slideNumber) && slideNumber >= 1 && slideNumber <= this.totalSlides;
    }

    /**
     * Get slide section
     */
    getSlideSection(slideNumber) {
        for (const [sectionNum, sectionData] of Object.entries(SECTIONS)) {
            const [start, end] = sectionData.slides;
            if (slideNumber >= start && slideNumber <= end) {
                return parseInt(sectionNum);
            }
        }
        return null;
    }

    /**
     * Update cache hit rate
     */
    updateCacheHitRate() {
        this.performanceMetrics.cacheHitRate =
            (this.performanceMetrics.cacheHits / this.performanceMetrics.totalCacheRequests) * 100;
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        const metrics = { ...this.performanceMetrics };

        // Calculate averages
        metrics.averageLoadTime = metrics.loadTimes.length > 0 ?
            metrics.loadTimes.reduce((a, b) => a + b, 0) / metrics.loadTimes.length : 0;

        metrics.averageRenderTime = metrics.renderTimes.length > 0 ?
            metrics.renderTimes.reduce((a, b) => a + b, 0) / metrics.renderTimes.length : 0;

        metrics.averageTransitionTime = metrics.transitionTimes.length > 0 ?
            metrics.transitionTimes.reduce((a, b) => a + b, 0) / metrics.transitionTimes.length : 0;

        return metrics;
    }

    /**
     * Clear slide cache
     */
    clearCache() {
        this.slideCache.clear();
        this.performanceMetrics.cacheHits = 0;
        this.performanceMetrics.totalCacheRequests = 0;
        this.performanceMetrics.cacheHitRate = 0;
    }

    /**
     * Set transition type
     */
    setTransition(transitionType) {
        if (this.transitionTypes.includes(transitionType)) {
            this.currentTransition = transitionType;
        }
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
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.clearCache();
        this.eventListeners.clear();
        this.slideHistory = [];
        console.log('SlideManager destroyed');
    }
}