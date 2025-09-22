/**
 * VisualizationRenderer Interface Contract
 * Handles rendering of various visualization types
 *
 * @interface VisualizationRenderer
 * @version 1.0.0
 */

/**
 * Core visualization rendering interface
 */
class IVisualizationRenderer {
  /**
   * Initialize the renderer with required libraries
   * @param {Object} config - Configuration object
   * @param {boolean} config.lazyLoad - Lazy load visualization libraries
   * @param {string} config.theme - Default theme name
   * @returns {Promise<void>}
   */
  async initialize(config) {
    throw new Error('Not implemented');
  }

  /**
   * Render Plotly chart
   * @param {HTMLElement} container - Target container
   * @param {PlotlyConfig} config - Plotly configuration
   * @returns {Promise<PlotlyChart>} Rendered chart instance
   */
  async renderPlotly(container, config) {
    throw new Error('Not implemented');
  }

  /**
   * Render Leaflet map
   * @param {HTMLElement} container - Target container
   * @param {LeafletConfig} config - Leaflet configuration
   * @returns {Promise<LeafletMap>} Rendered map instance
   */
  async renderLeaflet(container, config) {
    throw new Error('Not implemented');
  }

  /**
   * Render D3 timeline
   * @param {HTMLElement} container - Target container
   * @param {TimelineConfig} config - Timeline configuration
   * @returns {Promise<D3Timeline>} Rendered timeline instance
   */
  async renderTimeline(container, config) {
    throw new Error('Not implemented');
  }

  /**
   * Render Chart.js chart
   * @param {HTMLElement} container - Target container
   * @param {ChartJSConfig} config - Chart.js configuration
   * @returns {Promise<Chart>} Rendered chart instance
   */
  async renderChartJS(container, config) {
    throw new Error('Not implemented');
  }

  /**
   * Update existing visualization with new data
   * @param {string} visualizationId - Visualization identifier
   * @param {Object} newData - Updated data
   * @param {boolean} animate - Animate the update
   * @returns {Promise<void>}
   */
  async updateVisualization(visualizationId, newData, animate = true) {
    throw new Error('Not implemented');
  }

  /**
   * Resize visualization to fit container
   * @param {string} visualizationId - Visualization identifier
   * @returns {Promise<void>}
   */
  async resizeVisualization(visualizationId) {
    throw new Error('Not implemented');
  }

  /**
   * Export visualization as image
   * @param {string} visualizationId - Visualization identifier
   * @param {string} format - Export format ('png', 'svg', 'jpeg')
   * @returns {Promise<Blob>} Image data
   */
  async exportVisualization(visualizationId, format = 'png') {
    throw new Error('Not implemented');
  }

  /**
   * Destroy visualization and free resources
   * @param {string} visualizationId - Visualization identifier
   * @returns {void}
   */
  destroyVisualization(visualizationId) {
    throw new Error('Not implemented');
  }

  /**
   * Apply theme to all visualizations
   * @param {string} themeName - Theme identifier
   * @returns {Promise<void>}
   */
  async applyTheme(themeName) {
    throw new Error('Not implemented');
  }

  /**
   * Get all active visualizations
   * @returns {Map<string, Visualization>} Map of active visualizations
   */
  getActiveVisualizations() {
    throw new Error('Not implemented');
  }

  /**
   * Check if visualization type is supported
   * @param {string} type - Visualization type
   * @returns {boolean} Support status
   */
  isSupported(type) {
    throw new Error('Not implemented');
  }

  /**
   * Dispose of all resources
   * @returns {void}
   */
  dispose() {
    throw new Error('Not implemented');
  }
}

/**
 * Plotly configuration structure
 * @typedef {Object} PlotlyConfig
 * @property {Array} data - Plotly data array
 * @property {Object} layout - Plotly layout object
 * @property {Object} config - Plotly config options
 * @property {boolean} responsive - Enable responsive sizing
 */

/**
 * Leaflet configuration structure
 * @typedef {Object} LeafletConfig
 * @property {[number, number]} center - Map center coordinates
 * @property {number} zoom - Initial zoom level
 * @property {Array} layers - Map layers configuration
 * @property {Object} [markers] - Marker configurations
 * @property {Object} [choropleth] - Choropleth data
 */

/**
 * Timeline configuration structure
 * @typedef {Object} TimelineConfig
 * @property {Array} events - Timeline events
 * @property {Date} startDate - Timeline start
 * @property {Date} endDate - Timeline end
 * @property {Object} style - Visual styling options
 * @property {boolean} interactive - Enable interactions
 */

/**
 * Chart.js configuration structure
 * @typedef {Object} ChartJSConfig
 * @property {string} type - Chart type
 * @property {Object} data - Chart data
 * @property {Object} options - Chart options
 */

/**
 * Visualization types enum
 * @enum {string}
 */
const VisualizationType = {
  PLOTLY: 'plotly',
  LEAFLET: 'leaflet',
  CHARTJS: 'chartjs',
  D3: 'd3',
  TIMELINE: 'timeline'
};

/**
 * Export formats enum
 * @enum {string}
 */
const ExportFormat = {
  PNG: 'png',
  SVG: 'svg',
  JPEG: 'jpeg',
  PDF: 'pdf'
};

export { IVisualizationRenderer, VisualizationType, ExportFormat };