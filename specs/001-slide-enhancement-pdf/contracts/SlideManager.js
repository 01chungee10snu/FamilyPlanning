/**
 * SlideManager Interface Contract
 * Manages slide loading, caching, and transitions
 *
 * @interface SlideManager
 * @version 1.0.0
 */

/**
 * Core slide management interface
 */
class ISlideManager {
  /**
   * Initialize the slide manager with configuration
   * @param {Object} config - Configuration object
   * @param {string} config.dataPath - Path to slide data files
   * @param {boolean} config.preload - Enable adjacent slide preloading
   * @param {number} config.cacheSize - Maximum cached slides
   * @returns {Promise<void>}
   */
  async initialize(config) {
    throw new Error('Not implemented');
  }

  /**
   * Load a specific slide by ID
   * @param {number} slideId - Slide identifier (1-60)
   * @returns {Promise<Slide>} Loaded slide object
   * @throws {Error} If slide not found or invalid ID
   */
  async loadSlide(slideId) {
    throw new Error('Not implemented');
  }

  /**
   * Preload adjacent slides for smooth navigation
   * @param {number} currentSlideId - Current slide ID
   * @param {number} range - Number of slides to preload in each direction
   * @returns {Promise<void>}
   */
  async preloadAdjacentSlides(currentSlideId, range = 1) {
    throw new Error('Not implemented');
  }

  /**
   * Render slide content to the DOM
   * @param {Slide} slide - Slide object to render
   * @param {HTMLElement} container - Target container element
   * @returns {Promise<void>}
   */
  async renderSlide(slide, container) {
    throw new Error('Not implemented');
  }

  /**
   * Handle slide transition animation
   * @param {number} fromSlideId - Source slide ID
   * @param {number} toSlideId - Target slide ID
   * @param {string} transitionType - Type of transition
   * @returns {Promise<void>}
   */
  async handleTransition(fromSlideId, toSlideId, transitionType = 'fade') {
    throw new Error('Not implemented');
  }

  /**
   * Get slide by section and order
   * @param {number} sectionId - Section identifier
   * @param {number} order - Order within section
   * @returns {Promise<Slide>} Matching slide
   */
  async getSlideByPosition(sectionId, order) {
    throw new Error('Not implemented');
  }

  /**
   * Get all slides for a section
   * @param {number} sectionId - Section identifier
   * @returns {Promise<Slide[]>} Array of slides
   */
  async getSlidesBySection(sectionId) {
    throw new Error('Not implemented');
  }

  /**
   * Clear slide cache
   * @param {boolean} force - Force clear even if slides in use
   * @returns {void}
   */
  clearCache(force = false) {
    throw new Error('Not implemented');
  }

  /**
   * Get current cache status
   * @returns {Object} Cache statistics
   */
  getCacheStatus() {
    throw new Error('Not implemented');
  }

  /**
   * Dispose of resources
   * @returns {void}
   */
  dispose() {
    throw new Error('Not implemented');
  }
}

/**
 * Expected Slide structure
 * @typedef {Object} Slide
 * @property {number} id - Unique identifier
 * @property {number} sectionId - Parent section
 * @property {string} title - Slide title
 * @property {string} [subtitle] - Optional subtitle
 * @property {SlideContent} content - Main content
 * @property {Citation[]} citations - PDF references
 * @property {Visualization[]} visualizations - Charts/maps
 * @property {string} [notes] - Speaker notes
 * @property {number} [duration] - Estimated time in seconds
 */

/**
 * Transition types enum
 * @enum {string}
 */
const TransitionType = {
  FADE: 'fade',
  SLIDE: 'slide',
  ZOOM: 'zoom',
  NONE: 'none'
};

/**
 * Cache status structure
 * @typedef {Object} CacheStatus
 * @property {number} size - Current cache size
 * @property {number} maxSize - Maximum cache size
 * @property {number[]} cachedSlides - Array of cached slide IDs
 * @property {number} hitRate - Cache hit percentage
 * @property {number} memoryUsage - Memory usage in bytes
 */

export { ISlideManager, TransitionType };