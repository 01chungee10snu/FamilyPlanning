/**
 * CitationManager Interface Contract
 * Manages PDF citations and references
 *
 * @interface CitationManager
 * @version 1.0.0
 */

/**
 * Core citation management interface
 */
class ICitationManager {
  /**
   * Initialize the citation manager
   * @param {Object} config - Configuration object
   * @param {string} config.dataPath - Path to citation data
   * @param {string} config.locale - Default locale (en, ko)
   * @param {boolean} config.validateOnLoad - Validate citations on load
   * @returns {Promise<void>}
   */
  async initialize(config) {
    throw new Error('Not implemented');
  }

  /**
   * Load citations from data source
   * @param {string} [source] - Optional specific source file
   * @returns {Promise<number>} Number of citations loaded
   */
  async loadCitations(source) {
    throw new Error('Not implemented');
  }

  /**
   * Get all citations for a specific slide
   * @param {number} slideId - Slide identifier
   * @returns {Citation[]} Array of citations
   */
  getCitationsBySlide(slideId) {
    throw new Error('Not implemented');
  }

  /**
   * Get citation by ID
   * @param {string} citationId - Citation identifier
   * @returns {Citation} Citation object
   */
  getCitationById(citationId) {
    throw new Error('Not implemented');
  }

  /**
   * Get citations by PDF page number
   * @param {string} pageNumber - Page number (e.g., "p.1810")
   * @returns {Citation[]} Array of citations from that page
   */
  getCitationsByPage(pageNumber) {
    throw new Error('Not implemented');
  }

  /**
   * Format citation for display
   * @param {Citation} citation - Citation object
   * @param {string} format - Format type ('inline', 'footnote', 'tooltip')
   * @param {string} [locale] - Locale for formatting
   * @returns {string} Formatted citation text
   */
  formatCitation(citation, format = 'inline', locale) {
    throw new Error('Not implemented');
  }

  /**
   * Validate page number format
   * @param {string} pageNumber - Page number to validate
   * @returns {boolean} Validation result
   */
  validatePageNumber(pageNumber) {
    throw new Error('Not implemented');
  }

  /**
   * Show citation tooltip on element hover
   * @param {HTMLElement} element - Target element
   * @param {string} citationId - Citation to show
   * @returns {void}
   */
  showCitationTooltip(element, citationId) {
    throw new Error('Not implemented');
  }

  /**
   * Hide citation tooltip
   * @returns {void}
   */
  hideCitationTooltip() {
    throw new Error('Not implemented');
  }

  /**
   * Link citation to visualization element
   * @param {string} citationId - Citation identifier
   * @param {string} elementId - Visualization element ID
   * @returns {void}
   */
  linkToElement(citationId, elementId) {
    throw new Error('Not implemented');
  }

  /**
   * Search citations by text
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @param {boolean} options.caseSensitive - Case sensitive search
   * @param {boolean} options.exactMatch - Exact match only
   * @returns {Citation[]} Matching citations
   */
  searchCitations(query, options = {}) {
    throw new Error('Not implemented');
  }

  /**
   * Validate all citations
   * @returns {ValidationResult} Validation results
   */
  validateAllCitations() {
    throw new Error('Not implemented');
  }

  /**
   * Export citations in various formats
   * @param {string} format - Export format ('json', 'csv', 'bibtex')
   * @param {number[]} [slideIds] - Specific slides to export
   * @returns {string} Exported data
   */
  exportCitations(format, slideIds) {
    throw new Error('Not implemented');
  }

  /**
   * Get citation statistics
   * @returns {CitationStats} Statistics object
   */
  getStatistics() {
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
 * Citation structure
 * @typedef {Object} Citation
 * @property {string} id - Unique identifier
 * @property {number} slideId - Associated slide
 * @property {string} pageNumber - PDF page reference
 * @property {string} text - Quoted text
 * @property {string} [textKo] - Korean translation
 * @property {string} context - Surrounding context
 * @property {CitationType} type - Citation type
 * @property {string} [elementId] - Linked element
 */

/**
 * Citation type enum
 * @enum {string}
 */
const CitationType = {
  DIRECT_QUOTE: 'direct_quote',
  DATA_POINT: 'data_point',
  STATISTICAL: 'statistical',
  TABLE: 'table',
  FIGURE: 'figure',
  PANEL: 'panel'
};

/**
 * Citation format enum
 * @enum {string}
 */
const CitationFormat = {
  INLINE: 'inline',      // (p.1810)
  FOOTNOTE: 'footnote',  // ¹ See page 1810
  TOOLTIP: 'tooltip',    // Hover display
  FULL: 'full'          // Complete citation
};

/**
 * Validation result structure
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Overall validation status
 * @property {number} totalCitations - Total citations checked
 * @property {number} validCitations - Valid citations
 * @property {ValidationError[]} errors - List of errors
 */

/**
 * Validation error structure
 * @typedef {Object} ValidationError
 * @property {string} citationId - Citation with error
 * @property {string} field - Field with error
 * @property {string} message - Error message
 * @property {string} severity - Error severity
 */

/**
 * Citation statistics structure
 * @typedef {Object} CitationStats
 * @property {number} total - Total citations
 * @property {number} bySlide - Average per slide
 * @property {Object} byType - Count by type
 * @property {Object} byPage - Count by PDF page
 * @property {number} translated - Korean translations
 */

/**
 * Export format enum
 * @enum {string}
 */
const ExportFormat = {
  JSON: 'json',
  CSV: 'csv',
  BIBTEX: 'bibtex',
  MARKDOWN: 'markdown'
};

export { ICitationManager, CitationType, CitationFormat, ExportFormat };