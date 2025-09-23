/**
 * Constants Configuration
 * Presentation System for Family Planning Research
 */

// Presentation Structure
export const TOTAL_SLIDES = 60;
export const TOTAL_SECTIONS = 9;

// Performance Targets
export const PERFORMANCE_TARGETS = {
    loadTime: 3000,      // Maximum initial load time in milliseconds
    transitionTime: 300, // Maximum slide transition time in milliseconds
    fps: 60             // Target frames per second for animations
};

// Cache Configuration
export const CACHE_SIZE = 10;        // Number of slides to keep in memory
export const PRELOAD_RANGE = 1;      // Number of slides to preload ahead/behind

// Section Configuration
export const SECTIONS = {
    1: { name: "Introduction", slides: [1, 7] },
    2: { name: "Global Context", slides: [8, 15] },
    3: { name: "Current Challenges", slides: [16, 24] },
    4: { name: "Policy Framework", slides: [25, 32] },
    5: { name: "Implementation Strategies", slides: [33, 42] },
    6: { name: "Case Studies", slides: [43, 50] },
    7: { name: "Future Directions", slides: [51, 56] },
    8: { name: "Conclusions", slides: [57, 59] },
    9: { name: "References", slides: [60, 60] }
};

// Navigation Configuration
export const NAVIGATION = {
    autoAdvance: false,           // Automatic slide advancement
    autoAdvanceDelay: 5000,       // Delay for auto-advance in milliseconds
    enableKeyboardNavigation: true,
    enableTouchNavigation: true,
    enableMouseNavigation: true
};

// Visualization Configuration
export const VISUALIZATION_CONFIG = {
    defaultWidth: 800,
    defaultHeight: 600,
    responsive: true,
    animationDuration: 1000,
    colorScheme: {
        primary: '#2E86AB',
        secondary: '#A23B72',
        accent: '#F18F01',
        background: '#FFFFFF',
        text: '#333333'
    }
};

// Data Configuration
export const DATA_CONFIG = {
    apiEndpoint: '/api/data',
    cacheTimeout: 300000,        // 5 minutes in milliseconds
    retryAttempts: 3,
    retryDelay: 1000
};

// Data Paths
export const DATA_PATHS = Object.freeze({
    BASE: 'data',
    SLIDES: 'data/slides.json',
    SECTIONS: 'data/sections.json',
    VISUALIZATIONS: 'data/visualizations.json',
    CITATIONS: 'data/citations.json',
    METADATA: 'data/metadata.json'
});

// Citation Configuration
export const CITATION_CONFIG = {
    style: 'apa',                // Citation style: apa, mla, chicago
    showInline: true,            // Show inline citations
    showBibliography: true       // Show bibliography slide
};

// Error Messages
export const ERROR_MESSAGES = {
    SLIDE_NOT_FOUND: 'Slide not found',
    DATA_LOAD_FAILED: 'Failed to load data',
    VISUALIZATION_ERROR: 'Visualization rendering failed',
    NAVIGATION_ERROR: 'Navigation error occurred'
};

// Feature Flags
export const FEATURES = {
    enableAnalytics: false,
    enableOfflineMode: false,
    enableExportToPDF: false,
    enablePresentationMode: true,
    enableDebugMode: false
};