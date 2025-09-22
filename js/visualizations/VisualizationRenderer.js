/**
 * Main Visualization Renderer
 * Coordinates all visualization rendering with performance optimization and error handling
 */

export class VisualizationRenderer {
    constructor(renderers = {}) {
        this.renderers = renderers;
        this.activeVisualizations = new Map();
        this.config = {
            theme: 'light',
            responsive: true,
            exportEnabled: true,
            locale: 'en'
        };

        // Performance optimization
        this.resizeTimeout = null;
        this.renderQueue = [];
        this.isProcessing = false;

        // Initialize CSS variables
        this.initializeTheme();

        console.log('VisualizationRenderer initialized with renderers:', Object.keys(renderers));
    }

    /**
     * Initialize theme with CSS variables
     */
    initializeTheme() {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        this.theme = {
            primary: computedStyle.getPropertyValue('--primary-color') || '#3498db',
            secondary: computedStyle.getPropertyValue('--secondary-color') || '#2c3e50',
            accent: computedStyle.getPropertyValue('--accent-color') || '#e74c3c',
            background: computedStyle.getPropertyValue('--background-color') || '#ffffff',
            text: computedStyle.getPropertyValue('--text-color') || '#2c3e50',
            grid: computedStyle.getPropertyValue('--grid-color') || '#ecf0f1'
        };
    }

    /**
     * Main render method with error handling and performance optimization
     */
    async render(visualizationConfig, containerElement, options = {}) {
        try {
            // Validate inputs
            if (!visualizationConfig || !containerElement) {
                throw new Error('Visualization config and container are required');
            }

            const { type, id, config, title } = visualizationConfig;
            const renderer = this.getRenderer(type);

            if (!renderer) {
                throw new Error(`No renderer found for type: ${type}`);
            }

            // Prepare container
            const container = this.prepareContainer(containerElement, id);

            // Add to render queue for performance optimization
            const renderTask = {
                id,
                type,
                renderer,
                config,
                container,
                options: { ...options, theme: this.theme },
                title
            };

            return await this.processRender(renderTask);

        } catch (error) {
            console.error('Visualization render error:', error);
            this.renderError(containerElement, error.message);
            throw error;
        }
    }

    /**
     * Process render task with performance optimization
     */
    async processRender(renderTask) {
        const { id, type, renderer, config, container, options, title } = renderTask;

        // Show loading state
        this.showLoading(container);

        try {
            // Render visualization
            const visualization = await renderer.render(config, container, options);

            // Add title if provided
            if (title) {
                this.addTitle(container, title, options.locale || this.config.locale);
            }

            // Store active visualization
            this.activeVisualizations.set(id, {
                type,
                renderer,
                visualization,
                container,
                config,
                options
            });

            // Enable export functionality
            if (this.config.exportEnabled) {
                this.addExportControls(container, id);
            }

            this.hideLoading(container);
            return visualization;

        } catch (error) {
            this.hideLoading(container);
            throw error;
        }
    }

    /**
     * Prepare container with proper structure and responsive setup
     */
    prepareContainer(element, id) {
        // Clear container
        element.innerHTML = '';
        element.className = 'visualization-container';
        element.setAttribute('data-viz-id', id);

        // Create wrapper with responsive structure
        const wrapper = document.createElement('div');
        wrapper.className = 'viz-wrapper';

        const titleContainer = document.createElement('div');
        titleContainer.className = 'viz-title-container';

        const chartContainer = document.createElement('div');
        chartContainer.className = 'viz-chart-container';

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'viz-controls-container';

        wrapper.appendChild(titleContainer);
        wrapper.appendChild(chartContainer);
        wrapper.appendChild(controlsContainer);
        element.appendChild(wrapper);

        return {
            wrapper,
            titleContainer,
            chartContainer,
            controlsContainer,
            element
        };
    }

    /**
     * Add title with localization support
     */
    addTitle(container, title, locale = 'en') {
        const titleText = typeof title === 'object' ? title[locale] || title.en : title;
        if (titleText) {
            container.titleContainer.innerHTML = `<h3 class="viz-title">${titleText}</h3>`;
        }
    }

    /**
     * Add export controls
     */
    addExportControls(container, id) {
        const exportBtn = document.createElement('button');
        exportBtn.className = 'viz-export-btn';
        exportBtn.innerHTML = '📊 Export';
        exportBtn.onclick = () => this.exportVisualization(id);

        container.controlsContainer.appendChild(exportBtn);
    }

    /**
     * Export visualization as PNG or SVG
     */
    async exportVisualization(id, format = 'png') {
        try {
            const viz = this.activeVisualizations.get(id);
            if (!viz) {
                throw new Error('Visualization not found');
            }

            if (viz.renderer.export) {
                await viz.renderer.export(viz.visualization, format);
            } else {
                // Fallback to HTML canvas export
                await this.fallbackExport(viz.container.chartContainer, id, format);
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed: ' + error.message);
        }
    }

    /**
     * Fallback export using html2canvas
     */
    async fallbackExport(element, id, format) {
        if (typeof html2canvas !== 'undefined') {
            const canvas = await html2canvas(element);
            const link = document.createElement('a');
            link.download = `${id}.${format}`;
            link.href = canvas.toDataURL();
            link.click();
        } else {
            console.warn('html2canvas not available for export');
        }
    }

    /**
     * Show loading state
     */
    showLoading(container) {
        container.chartContainer.innerHTML = '<div class="viz-loading">Loading visualization...</div>';
    }

    /**
     * Hide loading state
     */
    hideLoading(container) {
        const loading = container.chartContainer.querySelector('.viz-loading');
        if (loading) {
            loading.remove();
        }
    }

    /**
     * Render error state
     */
    renderError(containerElement, message) {
        containerElement.innerHTML = `
            <div class="viz-error">
                <div class="viz-error-icon">⚠️</div>
                <div class="viz-error-message">Visualization Error: ${message}</div>
            </div>
        `;
    }

    /**
     * Handle responsive resizing with debouncing
     */
    handleResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = setTimeout(() => {
            this.activeVisualizations.forEach((viz, id) => {
                if (viz.renderer.resize) {
                    viz.renderer.resize(viz.visualization, viz.container.chartContainer);
                }
            });
        }, 250);
    }

    /**
     * Get renderer by type
     */
    getRenderer(type) {
        return this.renderers[type];
    }

    /**
     * Register new renderer
     */
    registerRenderer(type, renderer) {
        this.renderers[type] = renderer;
        console.log(`Renderer registered for type: ${type}`);
    }

    /**
     * Destroy specific visualization
     */
    destroyVisualization(id) {
        const viz = this.activeVisualizations.get(id);
        if (viz) {
            if (viz.renderer.destroy) {
                viz.renderer.destroy(viz.visualization);
            }
            viz.container.element.innerHTML = '';
            this.activeVisualizations.delete(id);
        }
    }

    /**
     * Destroy all visualizations
     */
    destroyAll() {
        this.activeVisualizations.forEach((viz, id) => {
            this.destroyVisualization(id);
        });
    }

    /**
     * Update theme
     */
    updateTheme(newTheme) {
        this.theme = { ...this.theme, ...newTheme };
        this.initializeTheme();

        // Refresh all active visualizations
        this.activeVisualizations.forEach((viz, id) => {
            if (viz.renderer.updateTheme) {
                viz.renderer.updateTheme(viz.visualization, this.theme);
            }
        });
    }

    /**
     * Set locale for all visualizations
     */
    setLocale(locale) {
        this.config.locale = locale;

        // Update active visualizations if they support localization
        this.activeVisualizations.forEach((viz, id) => {
            if (viz.renderer.setLocale) {
                viz.renderer.setLocale(viz.visualization, locale);
            }
        });
    }
}