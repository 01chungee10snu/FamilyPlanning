/**
 * Main Application Entry Point
 * Presentation System for Family Planning Research
 *
 * ES6 Module Configuration:
 * - This file serves as the main module entry point
 * - Include in HTML with: <script type="module" src="js/app.js"></script>
 * - All imports use explicit .js extensions for browser compatibility
 * - Module loading is deferred until DOM is ready
 *
 * Error Boundaries:
 * - Global error handling for uncaught exceptions
 * - Module loading failure recovery
 * - User-friendly error display
 * - Performance monitoring and warnings
 */

// Core module imports
import { SlideManager } from './core/SlideManager.js';
import { NavigationController } from './core/NavigationController.js';
import { StateManager } from './core/StateManager.js';

// Data module imports
import { DataLoader } from './data/DataLoader.js';
import { CitationManager } from './data/CitationManager.js';

// Visualization module imports
import { VisualizationRenderer } from './visualizations/VisualizationRenderer.js';
import { PlotlyRenderer } from './visualizations/PlotlyRenderer.js';
import { LeafletRenderer } from './visualizations/LeafletRenderer.js';
import { TimelineRenderer } from './visualizations/TimelineRenderer.js';
import { ChartJSRenderer } from './visualizations/ChartJSRenderer.js';

// Utility imports
import { TOTAL_SLIDES, TOTAL_SECTIONS, PERFORMANCE_TARGETS, DATA_PATHS } from './utils/constants.js';
import * as helpers from './utils/helpers.js';

class PresentationApp {
    constructor() {
        this.slideManager = null;
        this.navigationController = null;
        this.stateManager = null;
        this.dataLoader = null;
        this.citationManager = null;
        this.visualizationRenderer = null;
        this.initialized = false;
    }

    /**
     * Initialize the presentation system
     */
    async init() {
        try {
            console.log('Initializing Presentation System...');

            // Initialize core components
            this.stateManager = new StateManager();
            this.slideManager = new SlideManager(TOTAL_SLIDES, TOTAL_SECTIONS);
            this.navigationController = new NavigationController(this.slideManager);

            // Initialize data components
            this.dataLoader = new DataLoader();

            // Initialize CitationManager with DataLoader (now required by constructor)
            this.citationManager = new CitationManager(this.dataLoader);

            try {
                await this.citationManager.initialize({
                    dataPath: DATA_PATHS.CITATIONS,
                    locale: 'ko',
                    validateOnLoad: false
                });

                // Try loading citations
                await this.citationManager.loadCitations();
            } catch (citationError) {
                console.warn('CitationManager initialization warning:', citationError);
                // Continue without citation manager - it's not critical for basic operation
            }

            // Initialize visualization components
            this.visualizationRenderer = new VisualizationRenderer({
                plotly: new PlotlyRenderer(),
                leaflet: new LeafletRenderer(),
                timeline: new TimelineRenderer(),
                chartjs: new ChartJSRenderer()
            });

            // Setup event listeners
            this.setupEventListeners();

            // Load initial data - handle missing files gracefully
            try {
                await this.loadInitialData();
            } catch (dataError) {
                console.warn('Some data files may be missing, continuing with defaults:', dataError);
                // Continue with empty or default data
            }

            // Try to load legacy slides if available
            await this.loadLegacySlides();

            this.initialized = true;
            console.log('Presentation System initialized successfully');

        } catch (error) {
            console.error('Failed to initialize presentation system:', error);
            throw error;
        }
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardNavigation(event);
        });

        // Window resize handling
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Visibility change handling (for performance optimization)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Error handling
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event);
        });
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboardNavigation(event) {
        if (!this.initialized) return;

        switch (event.key) {
            case 'ArrowRight':
            case ' ':
                event.preventDefault();
                this.navigationController.nextSlide();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.navigationController.previousSlide();
                break;
            case 'Home':
                event.preventDefault();
                this.navigationController.goToSlide(1);
                break;
            case 'End':
                event.preventDefault();
                this.navigationController.goToSlide(TOTAL_SLIDES);
                break;
            case 'f':
            case 'F11':
                if (event.key === 'f') {
                    event.preventDefault();
                    this.toggleFullscreen();
                }
                break;
        }
    }

    /**
     * Handle window resize events
     */
    handleWindowResize() {
        if (this.visualizationRenderer) {
            this.visualizationRenderer.handleResize();
        }
    }

    /**
     * Handle visibility change for performance optimization
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations, reduce performance overhead
            this.stateManager.setPaused(true);
        } else {
            // Resume normal operation
            this.stateManager.setPaused(false);
        }
    }

    /**
     * Handle global errors
     */
    handleGlobalError(event) {
        console.error('Global error:', event.error);
        // Implement error reporting/recovery logic
    }

    /**
     * Load initial data required for the presentation
     */
    async loadInitialData() {
        const startTime = performance.now();

        try {
            // Try to load data files if they exist
            const dataFiles = [
                DATA_PATHS.SLIDES,
                DATA_PATHS.SECTIONS,
                DATA_PATHS.CITATIONS,
                DATA_PATHS.VISUALIZATIONS
            ];

            for (const file of dataFiles) {
                try {
                    await this.dataLoader.loadJSON(file);
                } catch (err) {
                    console.warn(`Optional data file not found: ${file}`);
                }
            }

            const loadTime = performance.now() - startTime;

            if (loadTime > PERFORMANCE_TARGETS.loadTime) {
                console.warn(`Initial load time (${loadTime}ms) exceeded target (${PERFORMANCE_TARGETS.loadTime}ms)`);
            }

        } catch (error) {
            console.error('Failed to load initial data:', error);
            // Don't throw - continue with legacy system
        }
    }

    /**
     * Load legacy slide files from the slides/ directory
     */
    async loadLegacySlides() {
        try {
            // Legacy slide deck with updated file references
            const slides = [
                { file: 'slides/slide01-title.html', menuTitle: '1. 제목' },
                { file: 'slides/slide02-core-message.html', menuTitle: '2. 핵심 메시지' },
                { file: 'slides/slide03-timeline.html', menuTitle: '3. 역사적 발전 과정' },
                { file: 'slides/slide04-population.html', menuTitle: '4. 인구 증가 전망' },
                { file: 'slides/slide05-world-map.html', menuTitle: '5. 세계 현황 지도' },
                { file: 'slides/slide06-impact.html', menuTitle: '6. 가족계획의 영향' },
                { file: 'slides/slide07-health-benefits.html', menuTitle: '7. 보건 효과' },
                { file: 'slides/slide08-economic.html', menuTitle: '8. 경제 효과' },
                { file: 'slides/slide09-niger.html', menuTitle: '9. 니제르: 위기 진단' },
                { file: 'slides/slide10-kenya.html', menuTitle: '10. 케냐: 성공과 도전' },
                { file: 'slides/slide11-comparison.html', menuTitle: '11. 방글라데시 vs 파키스탄' },
                { file: 'slides/slide12-cases.html', menuTitle: '12. 현장 접근 혁신' },
                { file: 'slides/slide13-methods.html', menuTitle: '13. 피임 방법 효과성' },
                { file: 'slides/slide14-funding.html', menuTitle: '14. 자금 조달 위기' },
                { file: 'slides/slide15-scenarios.html', menuTitle: '15. 미래 시나리오' },
                { file: 'slides/slide16-recommendations.html', menuTitle: '16. 정책 권고' }
            ];

            const container = document.getElementById('slideContainer');
            if (!container) return;

            // Clear loading indicator
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }

            // Load each slide file
            for (let i = 0; i < slides.length; i++) {
                try {
                    const response = await fetch(slides[i].file);
                    if (response.ok) {
                        const html = await response.text();
                        const slideDiv = document.createElement('div');
                        slideDiv.innerHTML = html;

                        // Ensure the slide has proper ID and class
                        const slide = slideDiv.firstElementChild || slideDiv;
                        if (!slide.id) {
                            slide.id = `slide-${i + 1}`;
                        }
                        if (!slide.classList.contains('slide')) {
                            slide.classList.add('slide');
                        }

                        container.appendChild(slide);
                    } else {
                        // Create placeholder slide
                        const placeholder = document.createElement('div');
                        placeholder.className = 'slide';
                        placeholder.id = `slide-${i + 1}`;
                        const placeholderTitle = slides[i]?.menuTitle || `슬라이드 ${i + 1}`;
                        placeholder.innerHTML = `
                            <div class="slide-header">
                                <h1>${placeholderTitle}</h1>
                            </div>
                            <div class="slide-content">
                                <p>슬라이드를 로드할 수 없습니다.</p>
                            </div>
                        `;
                        container.appendChild(placeholder);
                    }
                } catch (error) {
                    console.error(`Error loading slide ${i + 1}:`, error);
                }
            }

            // Update total slides count
            const totalSlides = container.querySelectorAll('.slide').length;
            const totalSlidesEl = document.getElementById('totalSlides');
            if (totalSlidesEl) {
                totalSlidesEl.textContent = totalSlides;
            }

            if (this.slideManager) {
                this.slideManager.totalSlides = totalSlides;
            }

            this.updateSlideMenu(slides);

            // Show first slide
            this.showSlide(1);

            // Setup navigation button handlers
            this.setupNavigationButtons();

            console.log(`Loaded ${totalSlides} slides`);

        } catch (error) {
            console.error('Failed to load legacy slides:', error);
        }
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Show specific slide by number
     */
    showSlide(slideNumber) {
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;

        // Validate slide number
        if (slideNumber < 1) slideNumber = 1;
        if (slideNumber > totalSlides) slideNumber = totalSlides;

        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });

        // Show current slide by index (slideNumber is 1-based, array is 0-based)
        if (slides[slideNumber - 1]) {
            const currentSlide = slides[slideNumber - 1];
            currentSlide.style.display = 'block';
            currentSlide.classList.add('active');

            // Initialize any visualizations on this slide
            this.initializeSlideVisualizations(currentSlide);
        }

        // Update slide counter
        const currentSlideEl = document.getElementById('currentSlide');
        if (currentSlideEl) {
            currentSlideEl.textContent = slideNumber;
        }

        // Store current slide number
        this.currentSlideNumber = slideNumber;

        // Update navigation buttons
        this.updateNavigationButtons(slideNumber, totalSlides);
    }

    /**
     * Setup navigation button handlers
     */
    setupNavigationButtons() {
        // Previous button
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const current = this.currentSlideNumber || 1;
                this.showSlide(current - 1);
            });
        }

        // Next button
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const current = this.currentSlideNumber || 1;
                this.showSlide(current + 1);
            });
        }

        // Menu button
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                this.toggleMenu();
            });
        }

        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Section navigation
        for (let i = 1; i <= 9; i++) {
            const sectionBtn = document.getElementById(`section${i}`);
            if (sectionBtn) {
                sectionBtn.addEventListener('click', () => {
                    this.goToSection(i);
                });
            }
        }
    }

    /**
     * Update slide menu with dynamically loaded slides
     */
    updateSlideMenu(slides) {
        const menuList = document.getElementById('slideMenuList');
        if (!menuList) return;

        menuList.innerHTML = '';

        slides.forEach((slideInfo, index) => {
            const menuItem = document.createElement('li');
            menuItem.dataset.slide = String(index + 1);
            menuItem.textContent = slideInfo?.menuTitle || `슬라이드 ${index + 1}`;
            menuItem.addEventListener('click', () => {
                this.showSlide(index + 1);
                this.toggleMenu(false);
            });

            menuList.appendChild(menuItem);
        });
    }

    /**
     * Update navigation button states
     */
    updateNavigationButtons(currentSlide, totalSlides) {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.disabled = currentSlide <= 1;
        }

        if (nextBtn) {
            nextBtn.disabled = currentSlide >= totalSlides;
        }
    }

    /**
     * Initialize visualizations on current slide
     */
    initializeSlideVisualizations(slideElement) {
        // Find visualization containers in the slide
        const vizContainers = slideElement.querySelectorAll('[data-viz-type]');

        vizContainers.forEach(container => {
            const vizType = container.dataset.vizType;
            const vizData = container.dataset.vizData;

            if (this.visualizationRenderer && vizType && vizData) {
                try {
                    this.visualizationRenderer.render(vizType, container, JSON.parse(vizData));
                } catch (error) {
                    console.warn('Failed to initialize visualization:', error);
                }
            }
        });
    }

    /**
     * Toggle navigation menu
     */
    toggleMenu(forceState) {
        const menu = document.getElementById('slideMenu');
        if (!menu) return;

        if (typeof forceState === 'boolean') {
            menu.style.display = forceState ? 'block' : 'none';
            return;
        }

        const isHidden = window.getComputedStyle(menu).display === 'none';
        menu.style.display = isHidden ? 'block' : 'none';
    }

    /**
     * Go to specific section
     */
    goToSection(sectionNumber) {
        const sectionMap = {
            1: 1,   // Title
            2: 3,   // Global context & timeline
            3: 7,   // Health impact
            4: 9,   // Country cases
            5: 11,  // Comparative success factors
            6: 13,  // Family planning methods
            7: 14,  // Funding trends
            8: 15,  // Future scenarios
            9: 16   // Recommendations
        };

        const targetSlide = sectionMap[sectionNumber] || 1;
        this.showSlide(targetSlide);

        // Close menu after navigation
        this.toggleMenu(false);
    }

    /**
     * Get current application state
     */
    getState() {
        return {
            initialized: this.initialized,
            currentSlide: this.currentSlideNumber || this.slideManager?.getCurrentSlide() || 1,
            totalSlides: TOTAL_SLIDES,
            isFullscreen: !!document.fullscreenElement,
            isPresentationMode: this.navigationController?.isPresentationMode || false
        };
    }

    /**
     * Public API methods for backwards compatibility
     */
    nextSlide() {
        return this.navigationController?.nextSlide();
    }

    previousSlide() {
        return this.navigationController?.previousSlide();
    }

    goToSlide(slideNumber) {
        return this.navigationController?.goToSlide(slideNumber);
    }

    getCurrentSlide() {
        return this.slideManager?.getCurrentSlide() || 1;
    }

    getTotalSlides() {
        return TOTAL_SLIDES;
    }
}

// Global app instance
let app = null;

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        app = new PresentationApp();
        await app.init();

        // Make app globally accessible for debugging
        window.presentationApp = app;

    } catch (error) {
        console.error('Failed to start presentation application:', error);

        // Show user-friendly error message
        document.body.innerHTML = `
            <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
                <h2>Presentation System Error</h2>
                <p>Failed to initialize the presentation system. Please refresh the page.</p>
                <p style="color: #666; font-size: 0.9em;">Error: ${error.message}</p>
            </div>
        `;
    }
});

// Module loading error boundary
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    // Show user-friendly error for module loading issues
    if (event.reason?.message?.includes('module') || event.reason?.message?.includes('import')) {
        document.body.innerHTML = `
            <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; margin: 20px;">
                <h2 style="color: #856404;">Module Loading Error</h2>
                <p>Failed to load presentation modules. This may be due to:</p>
                <ul style="text-align: left; display: inline-block; color: #856404;">
                    <li>Missing files in the js/ directory</li>
                    <li>Network connectivity issues</li>
                    <li>Browser compatibility (requires modern browser with ES6 module support)</li>
                </ul>
                <p><strong>Solution:</strong> Ensure all module files are present and use a development server</p>
                <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    }
});

// Module initialization sequence tracking
const moduleLoadTracker = {
    startTime: performance.now(),
    loaded: new Set(),

    markLoaded(moduleName) {
        this.loaded.add(moduleName);
        console.log(`Module loaded: ${moduleName} (${this.loaded.size} total)`);
    },

    getLoadTime() {
        return performance.now() - this.startTime;
    }
};

// Mark main module as loaded
moduleLoadTracker.markLoaded('app.js');

// Export for module use
export { PresentationApp, moduleLoadTracker };