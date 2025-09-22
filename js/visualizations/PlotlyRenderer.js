/**
 * Plotly Renderer
 * Handles Plotly.js visualization rendering with Korean/English support
 */

export class PlotlyRenderer {
    constructor() {
        this.plotlyLoaded = false;
        this.loadPromise = null;
        this.activeCharts = new Map();

        console.log('PlotlyRenderer initialized');
    }

    /**
     * Main render method
     */
    async render(config, container, options = {}) {
        await this.ensurePlotlyLoaded();

        const { chartType, data } = config;
        const chartContainer = container.chartContainer;

        // Prepare chart data based on type
        const plotData = this.prepareData(chartType, data, options);
        const layout = this.createLayout(config, options);
        const plotConfig = this.createConfig(options);

        // Create unique ID for the chart
        const chartId = `plotly-chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        chartContainer.id = chartId;

        try {
            // Create Plotly chart
            await Plotly.newPlot(chartId, plotData, layout, plotConfig);

            // Add event listeners
            this.attachEventListeners(chartId, options);

            // Store chart reference
            const chart = {
                id: chartId,
                element: chartContainer,
                data: plotData,
                layout,
                config: plotConfig
            };

            this.activeCharts.set(chartId, chart);
            return chart;

        } catch (error) {
            console.error('Plotly chart creation failed:', error);
            throw new Error(`Failed to create ${chartType} chart: ${error.message}`);
        }
    }

    /**
     * Prepare data based on chart type
     */
    prepareData(chartType, data, options) {
        const { theme, locale } = options;

        switch (chartType) {
            case 'line':
                return this.createLineData(data, theme, locale);
            case 'bar':
            case 'horizontalBar':
                return this.createBarData(data, theme, locale, chartType === 'horizontalBar');
            case 'scatter':
                return this.createScatterData(data, theme, locale);
            case 'pie':
                return this.createPieData(data, theme, locale);
            case 'area':
                return this.createAreaData(data, theme, locale);
            default:
                throw new Error(`Unsupported chart type: ${chartType}`);
        }
    }

    /**
     * Create line chart data
     */
    createLineData(data, theme, locale) {
        if (data.datasets) {
            // Multi-series line chart
            return data.datasets.map((dataset, index) => ({
                x: data.labels,
                y: dataset.data,
                type: 'scatter',
                mode: 'lines+markers',
                name: this.getLocalizedText(dataset.label, locale),
                line: {
                    color: dataset.borderColor || theme.primary,
                    width: 2
                },
                marker: {
                    size: 6,
                    color: dataset.backgroundColor || dataset.borderColor || theme.primary
                }
            }));
        } else {
            // Simple line chart
            return [{
                x: data.labels,
                y: data.values,
                type: 'scatter',
                mode: 'lines+markers',
                line: {
                    color: theme.primary,
                    width: 2
                },
                marker: {
                    size: 6,
                    color: theme.primary
                }
            }];
        }
    }

    /**
     * Create bar chart data
     */
    createBarData(data, theme, locale, horizontal = false) {
        const colors = data.colors || [theme.primary, theme.secondary, theme.accent];

        if (data.datasets) {
            // Multi-series bar chart
            return data.datasets.map((dataset, index) => ({
                [horizontal ? 'y' : 'x']: data.labels,
                [horizontal ? 'x' : 'y']: dataset.data,
                type: 'bar',
                name: this.getLocalizedText(dataset.label, locale),
                orientation: horizontal ? 'h' : 'v',
                marker: {
                    color: dataset.backgroundColor || colors[index % colors.length]
                }
            }));
        } else {
            // Simple bar chart
            return [{
                [horizontal ? 'y' : 'x']: data.labels,
                [horizontal ? 'x' : 'y']: data.values,
                type: 'bar',
                orientation: horizontal ? 'h' : 'v',
                marker: {
                    color: colors
                }
            }];
        }
    }

    /**
     * Create scatter plot data
     */
    createScatterData(data, theme, locale) {
        if (data.datasets) {
            return data.datasets.map((dataset, index) => ({
                x: dataset.x || dataset.data.map(d => d.x),
                y: dataset.y || dataset.data.map(d => d.y),
                type: 'scatter',
                mode: 'markers',
                name: this.getLocalizedText(dataset.label, locale),
                marker: {
                    size: 8,
                    color: dataset.backgroundColor || theme.primary
                }
            }));
        } else {
            return [{
                x: data.x,
                y: data.y,
                type: 'scatter',
                mode: 'markers',
                marker: {
                    size: 8,
                    color: theme.primary
                }
            }];
        }
    }

    /**
     * Create pie chart data
     */
    createPieData(data, theme, locale) {
        const colors = data.colors || [theme.primary, theme.secondary, theme.accent];

        return [{
            labels: data.labels,
            values: data.values,
            type: 'pie',
            marker: {
                colors: colors
            },
            textinfo: 'label+percent',
            textposition: 'outside'
        }];
    }

    /**
     * Create area chart data
     */
    createAreaData(data, theme, locale) {
        if (data.datasets) {
            return data.datasets.map((dataset, index) => ({
                x: data.labels,
                y: dataset.data,
                type: 'scatter',
                mode: 'lines',
                fill: index === 0 ? 'tozeroy' : 'tonexty',
                name: this.getLocalizedText(dataset.label, locale),
                line: {
                    color: dataset.borderColor || theme.primary
                },
                fillcolor: dataset.backgroundColor || `${theme.primary}30`
            }));
        } else {
            return [{
                x: data.labels,
                y: data.values,
                type: 'scatter',
                mode: 'lines',
                fill: 'tozeroy',
                line: {
                    color: theme.primary
                },
                fillcolor: `${theme.primary}30`
            }];
        }
    }

    /**
     * Create layout configuration
     */
    createLayout(config, options) {
        const { theme, locale } = options;

        const layout = {
            font: {
                family: 'Arial, sans-serif',
                size: 12,
                color: theme.text
            },
            paper_bgcolor: theme.background,
            plot_bgcolor: theme.background,
            margin: {
                l: 50,
                r: 50,
                t: 50,
                b: 50
            },
            hovermode: 'closest',
            showlegend: true,
            legend: {
                orientation: 'h',
                x: 0.5,
                xanchor: 'center',
                y: -0.1
            }
        };

        // Add axis titles if provided
        if (config.xAxis && config.xAxis.title) {
            layout.xaxis = {
                title: this.getLocalizedText(config.xAxis.title, locale),
                gridcolor: theme.grid,
                linecolor: theme.grid
            };
        }

        if (config.yAxis && config.yAxis.title) {
            layout.yaxis = {
                title: this.getLocalizedText(config.yAxis.title, locale),
                gridcolor: theme.grid,
                linecolor: theme.grid
            };
        }

        // Responsive layout
        layout.autosize = true;

        return layout;
    }

    /**
     * Create Plotly configuration
     */
    createConfig(options) {
        return {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
            displaylogo: false,
            toImageButtonOptions: {
                format: 'png',
                filename: 'chart',
                height: 600,
                width: 800,
                scale: 1
            },
            locale: options.locale === 'ko' ? 'ko' : 'en'
        };
    }

    /**
     * Attach event listeners for interactivity
     */
    attachEventListeners(chartId, options) {
        const chartElement = document.getElementById(chartId);

        // Hover events
        chartElement.on('plotly_hover', (data) => {
            if (options.onHover) {
                options.onHover(data);
            }
        });

        // Click events
        chartElement.on('plotly_click', (data) => {
            if (options.onClick) {
                options.onClick(data);
            }
        });

        // Zoom events
        chartElement.on('plotly_relayout', (eventData) => {
            if (options.onZoom) {
                options.onZoom(eventData);
            }
        });
    }

    /**
     * Resize chart
     */
    async resize(chart, container) {
        if (chart && chart.id) {
            try {
                await Plotly.Plots.resize(chart.id);
            } catch (error) {
                console.warn('Failed to resize Plotly chart:', error);
            }
        }
    }

    /**
     * Update chart data
     */
    async updateChart(chartId, newData, newLayout) {
        const chart = this.activeCharts.get(chartId);
        if (!chart) {
            throw new Error('Chart not found');
        }

        try {
            await Plotly.react(chartId, newData || chart.data, newLayout || chart.layout);

            // Update stored chart data
            if (newData) chart.data = newData;
            if (newLayout) chart.layout = { ...chart.layout, ...newLayout };

        } catch (error) {
            console.error('Failed to update chart:', error);
            throw error;
        }
    }

    /**
     * Export chart
     */
    async export(chart, format = 'png') {
        if (!chart || !chart.id) {
            throw new Error('Invalid chart for export');
        }

        try {
            const formats = {
                png: 'png',
                jpg: 'jpeg',
                jpeg: 'jpeg',
                svg: 'svg',
                pdf: 'pdf'
            };

            const exportFormat = formats[format.toLowerCase()] || 'png';

            await Plotly.downloadImage(chart.id, {
                format: exportFormat,
                width: 800,
                height: 600,
                filename: `chart-${chart.id}`
            });
        } catch (error) {
            console.error('Export failed:', error);
            throw new Error(`Failed to export chart as ${format}: ${error.message}`);
        }
    }

    /**
     * Update theme
     */
    async updateTheme(chart, newTheme) {
        if (!chart || !chart.id) return;

        const newLayout = {
            ...chart.layout,
            font: { ...chart.layout.font, color: newTheme.text },
            paper_bgcolor: newTheme.background,
            plot_bgcolor: newTheme.background
        };

        await this.updateChart(chart.id, null, newLayout);
    }

    /**
     * Set locale
     */
    setLocale(chart, locale) {
        // Plotly locale changes require re-rendering
        console.log(`Locale changed to ${locale} for chart ${chart.id}`);
    }

    /**
     * Destroy chart
     */
    destroy(chart) {
        if (chart && chart.id) {
            try {
                Plotly.purge(chart.id);
                this.activeCharts.delete(chart.id);
            } catch (error) {
                console.warn('Failed to destroy Plotly chart:', error);
            }
        }
    }

    /**
     * Ensure Plotly.js is loaded
     */
    async ensurePlotlyLoaded() {
        if (this.plotlyLoaded && typeof Plotly !== 'undefined') {
            return;
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this.loadPlotly();
        await this.loadPromise;
    }

    /**
     * Load Plotly.js dynamically
     */
    async loadPlotly() {
        if (typeof Plotly !== 'undefined') {
            this.plotlyLoaded = true;
            return;
        }

        try {
            // Try to load from CDN
            await this.loadScript('https://cdn.plot.ly/plotly-latest.min.js');

            // Load Korean locale if needed
            if (document.documentElement.lang === 'ko') {
                await this.loadScript('https://cdn.plot.ly/plotly-locale-ko-latest.js');
            }

            this.plotlyLoaded = true;
            console.log('Plotly.js loaded successfully');

        } catch (error) {
            console.error('Failed to load Plotly.js:', error);
            throw new Error('Plotly.js library could not be loaded. Please check your internet connection.');
        }
    }

    /**
     * Load script dynamically
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if script already exists
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }

    /**
     * Get localized text
     */
    getLocalizedText(text, locale = 'en') {
        if (typeof text === 'object' && text !== null) {
            return text[locale] || text.en || text.ko || Object.values(text)[0];
        }
        return text;
    }

    /**
     * Create sample population trend data
     */
    static createPopulationTrendData() {
        return {
            chartType: 'line',
            data: {
                labels: ['1950', '1975', '2000', '2025', '2050'],
                datasets: [{
                    label: {
                        ko: '세계 인구 (십억)',
                        en: 'World Population (Billions)'
                    },
                    data: [2.5, 4.1, 6.1, 8.0, 9.3],
                    borderColor: '#3498db',
                    backgroundColor: '#3498db20'
                }]
            },
            xAxis: {
                title: {
                    ko: '연도',
                    en: 'Year'
                }
            },
            yAxis: {
                title: {
                    ko: '인구 (십억)',
                    en: 'Population (Billions)'
                }
            }
        };
    }

    /**
     * Create sample regional comparison data
     */
    static createRegionalComparisonData() {
        return {
            chartType: 'horizontalBar',
            data: {
                labels: ['Sub-Saharan Africa', 'South Asia', 'Latin America', 'East Asia', 'Middle East'],
                values: [25, 22, 12, 8, 15],
                colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57']
            },
            xAxis: {
                title: {
                    ko: '미충족 요구 비율 (%)',
                    en: 'Unmet Need Rate (%)'
                }
            },
            yAxis: {
                title: {
                    ko: '지역',
                    en: 'Region'
                }
            }
        };
    }
}