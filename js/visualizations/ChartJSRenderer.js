/**
 * Chart.js Renderer
 * Handles Chart.js visualization rendering for basic chart types
 */

export class ChartJSRenderer {
    constructor() {
        this.chartjsLoaded = false;
        this.loadPromise = null;
        this.activeCharts = new Map();

        console.log('ChartJSRenderer initialized');
    }

    /**
     * Main render method
     */
    async render(config, container, options = {}) {
        await this.ensureChartJSLoaded();

        const { chartType, data } = config;
        const chartContainer = container.chartContainer;

        // Create canvas element
        const canvas = document.createElement('canvas');
        const chartId = `chartjs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        canvas.id = chartId;
        chartContainer.appendChild(canvas);

        try {
            // Get chart context
            const ctx = canvas.getContext('2d');

            // Prepare chart configuration
            const chartConfig = this.createChartConfig(chartType, data, options);

            // Create Chart.js instance
            const chart = new Chart(ctx, chartConfig);

            // Store chart reference
            const chartObject = {
                id: chartId,
                chart,
                canvas,
                container: chartContainer,
                config,
                options
            };

            this.activeCharts.set(chartId, chartObject);
            return chartObject;

        } catch (error) {
            console.error('Chart.js chart creation failed:', error);
            throw new Error(`Failed to create ${chartType} chart: ${error.message}`);
        }
    }

    /**
     * Create Chart.js configuration
     */
    createChartConfig(chartType, data, options) {
        const { theme, locale } = options;

        const baseConfig = {
            type: this.mapChartType(chartType),
            data: this.prepareChartData(chartType, data, theme, locale),
            options: this.createChartOptions(chartType, data, theme, locale, options)
        };

        return baseConfig;
    }

    /**
     * Map custom chart types to Chart.js types
     */
    mapChartType(chartType) {
        const typeMap = {
            'line': 'line',
            'bar': 'bar',
            'horizontalBar': 'bar',
            'pie': 'pie',
            'doughnut': 'doughnut',
            'donut': 'doughnut',
            'scatter': 'scatter',
            'area': 'line',
            'radar': 'radar',
            'polarArea': 'polarArea'
        };

        return typeMap[chartType] || 'bar';
    }

    /**
     * Prepare chart data for Chart.js
     */
    prepareChartData(chartType, data, theme, locale) {
        const chartData = {
            labels: [],
            datasets: []
        };

        // Handle different data structures
        if (data.datasets) {
            // Multi-dataset format
            chartData.labels = data.labels || [];
            chartData.datasets = data.datasets.map((dataset, index) => {
                return this.createDataset(chartType, dataset, theme, locale, index);
            });
        } else if (data.labels && data.values) {
            // Simple format
            chartData.labels = data.labels;
            chartData.datasets = [{
                label: this.getLocalizedText(data.label || 'Data', locale),
                data: data.values,
                ...this.getDatasetStyling(chartType, theme, 0, data.colors)
            }];
        } else {
            // Fallback
            chartData.labels = ['No Data'];
            chartData.datasets = [{
                label: 'No Data',
                data: [0],
                backgroundColor: theme.grid
            }];
        }

        return chartData;
    }

    /**
     * Create individual dataset configuration
     */
    createDataset(chartType, dataset, theme, locale, index) {
        const baseDataset = {
            label: this.getLocalizedText(dataset.label, locale),
            data: dataset.data,
            ...this.getDatasetStyling(chartType, theme, index, dataset.colors || dataset.backgroundColor)
        };

        // Add chart-specific properties
        switch (chartType) {
            case 'line':
            case 'area':
                Object.assign(baseDataset, {
                    borderColor: dataset.borderColor || theme.primary,
                    backgroundColor: dataset.backgroundColor || (chartType === 'area' ? `${theme.primary}30` : 'transparent'),
                    borderWidth: 2,
                    fill: chartType === 'area',
                    tension: 0.4,
                    pointBackgroundColor: dataset.pointBackgroundColor || theme.primary,
                    pointBorderColor: dataset.pointBorderColor || theme.background,
                    pointRadius: 4,
                    pointHoverRadius: 6
                });
                break;

            case 'bar':
            case 'horizontalBar':
                Object.assign(baseDataset, {
                    backgroundColor: dataset.backgroundColor || theme.primary,
                    borderColor: dataset.borderColor || theme.primary,
                    borderWidth: 1
                });
                break;

            case 'scatter':
                Object.assign(baseDataset, {
                    backgroundColor: dataset.backgroundColor || theme.primary,
                    borderColor: dataset.borderColor || theme.primary,
                    pointRadius: 6,
                    pointHoverRadius: 8
                });
                break;
        }

        return baseDataset;
    }

    /**
     * Get dataset styling based on chart type and theme
     */
    getDatasetStyling(chartType, theme, index, customColors) {
        const defaultColors = [
            theme.primary,
            theme.secondary,
            theme.accent,
            '#f39c12',
            '#27ae60',
            '#9b59b6',
            '#e67e22'
        ];

        const color = customColors ?
            (Array.isArray(customColors) ? customColors[index % customColors.length] : customColors) :
            defaultColors[index % defaultColors.length];

        const styling = {
            backgroundColor: color,
            borderColor: color
        };

        // Pie and doughnut charts need array of colors for segments
        if (['pie', 'doughnut', 'donut', 'polarArea'].includes(chartType)) {
            styling.backgroundColor = customColors || defaultColors;
        }

        return styling;
    }

    /**
     * Create Chart.js options
     */
    createChartOptions(chartType, data, theme, locale, options) {
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: theme.text,
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: theme.background,
                    titleColor: theme.text,
                    bodyColor: theme.text,
                    borderColor: theme.grid,
                    borderWidth: 1,
                    cornerRadius: 6,
                    displayColors: true,
                    callbacks: {
                        title: (context) => {
                            return context[0].label;
                        },
                        label: (context) => {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y || context.parsed;
                            if (data.unit) {
                                label += ' ' + data.unit;
                            }
                            return label;
                        }
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        };

        // Add chart-specific options
        this.addChartSpecificOptions(chartOptions, chartType, data, theme, locale, options);

        return chartOptions;
    }

    /**
     * Add chart-specific options
     */
    addChartSpecificOptions(chartOptions, chartType, data, theme, locale, options) {
        switch (chartType) {
            case 'bar':
                chartOptions.indexAxis = 'x';
                chartOptions.scales = this.createScales(data, theme, locale, false);
                break;

            case 'horizontalBar':
                chartOptions.indexAxis = 'y';
                chartOptions.scales = this.createScales(data, theme, locale, true);
                break;

            case 'line':
            case 'area':
            case 'scatter':
                chartOptions.scales = this.createScales(data, theme, locale, false);
                break;

            case 'pie':
            case 'doughnut':
            case 'donut':
                chartOptions.plugins.legend.position = 'right';
                if (chartType === 'doughnut' || chartType === 'donut') {
                    chartOptions.cutout = '50%';
                }
                break;

            case 'radar':
                chartOptions.scales = {
                    r: {
                        angleLines: {
                            color: theme.grid
                        },
                        grid: {
                            color: theme.grid
                        },
                        ticks: {
                            color: theme.text,
                            backdropColor: 'transparent'
                        }
                    }
                };
                break;
        }

        // Add click handlers
        if (options.onClick) {
            chartOptions.onClick = (event, elements) => {
                if (elements.length > 0) {
                    const element = elements[0];
                    const dataIndex = element.index;
                    const datasetIndex = element.datasetIndex;

                    options.onClick({
                        dataIndex,
                        datasetIndex,
                        value: chartOptions.data.datasets[datasetIndex].data[dataIndex],
                        label: chartOptions.data.labels[dataIndex]
                    });
                }
            };
        }
    }

    /**
     * Create scales configuration
     */
    createScales(data, theme, locale, horizontal = false) {
        const scales = {};

        const xAxisKey = horizontal ? 'y' : 'x';
        const yAxisKey = horizontal ? 'x' : 'y';

        // X-axis (or Y-axis for horizontal)
        scales[xAxisKey] = {
            grid: {
                color: theme.grid,
                borderColor: theme.grid
            },
            ticks: {
                color: theme.text
            }
        };

        // Y-axis (or X-axis for horizontal)
        scales[yAxisKey] = {
            grid: {
                color: theme.grid,
                borderColor: theme.grid
            },
            ticks: {
                color: theme.text
            },
            beginAtZero: true
        };

        // Add axis titles if provided
        if (data.xAxis && data.xAxis.title) {
            scales[xAxisKey].title = {
                display: true,
                text: this.getLocalizedText(data.xAxis.title, locale),
                color: theme.text
            };
        }

        if (data.yAxis && data.yAxis.title) {
            scales[yAxisKey].title = {
                display: true,
                text: this.getLocalizedText(data.yAxis.title, locale),
                color: theme.text
            };
        }

        return scales;
    }

    /**
     * Resize chart
     */
    resize(chartObject) {
        if (chartObject && chartObject.chart) {
            chartObject.chart.resize();
        }
    }

    /**
     * Update chart data
     */
    updateChart(chartId, newData) {
        const chartObject = this.activeCharts.get(chartId);
        if (!chartObject) {
            throw new Error('Chart not found');
        }

        // Update chart data
        const newChartData = this.prepareChartData(
            chartObject.config.chartType,
            newData,
            chartObject.options.theme,
            chartObject.options.locale
        );

        chartObject.chart.data = newChartData;
        chartObject.chart.update('active');
    }

    /**
     * Export chart
     */
    async export(chartObject, format = 'png') {
        if (!chartObject || !chartObject.chart) {
            throw new Error('Invalid chart for export');
        }

        try {
            const canvas = chartObject.canvas;
            const link = document.createElement('a');

            link.download = `chart-${chartObject.id}.${format}`;
            link.href = canvas.toDataURL(`image/${format}`, 1.0);
            link.click();
        } catch (error) {
            console.error('Chart export failed:', error);
            throw new Error(`Failed to export chart as ${format}: ${error.message}`);
        }
    }

    /**
     * Update theme
     */
    updateTheme(chartObject, newTheme) {
        if (!chartObject || !chartObject.chart) return;

        const chart = chartObject.chart;

        // Update chart options with new theme
        if (chart.options.plugins && chart.options.plugins.legend) {
            chart.options.plugins.legend.labels.color = newTheme.text;
        }

        if (chart.options.plugins && chart.options.plugins.tooltip) {
            chart.options.plugins.tooltip.backgroundColor = newTheme.background;
            chart.options.plugins.tooltip.titleColor = newTheme.text;
            chart.options.plugins.tooltip.bodyColor = newTheme.text;
            chart.options.plugins.tooltip.borderColor = newTheme.grid;
        }

        if (chart.options.scales) {
            Object.values(chart.options.scales).forEach(scale => {
                if (scale.grid) {
                    scale.grid.color = newTheme.grid;
                    scale.grid.borderColor = newTheme.grid;
                }
                if (scale.ticks) {
                    scale.ticks.color = newTheme.text;
                }
                if (scale.title) {
                    scale.title.color = newTheme.text;
                }
            });
        }

        chart.update('none');
    }

    /**
     * Destroy chart
     */
    destroy(chartObject) {
        if (chartObject && chartObject.chart) {
            try {
                chartObject.chart.destroy();
                this.activeCharts.delete(chartObject.id);
            } catch (error) {
                console.warn('Failed to destroy Chart.js chart:', error);
            }
        }
    }

    /**
     * Ensure Chart.js is loaded
     */
    async ensureChartJSLoaded() {
        if (this.chartjsLoaded && typeof Chart !== 'undefined') {
            return;
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this.loadChartJS();
        await this.loadPromise;
    }

    /**
     * Load Chart.js library
     */
    async loadChartJS() {
        if (typeof Chart !== 'undefined') {
            this.chartjsLoaded = true;
            return;
        }

        try {
            await this.loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js');
            this.chartjsLoaded = true;
            console.log('Chart.js loaded successfully');
        } catch (error) {
            console.error('Failed to load Chart.js:', error);
            throw new Error('Chart.js library could not be loaded. Please check your internet connection.');
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
     * Create sample bar chart data
     */
    static createSampleBarData() {
        return {
            chartType: 'bar',
            data: {
                labels: ['Sub-Saharan Africa', 'South Asia', 'Latin America', 'East Asia', 'Middle East'],
                datasets: [{
                    label: {
                        ko: '미충족 요구 비율 (%)',
                        en: 'Unmet Need Rate (%)'
                    },
                    data: [25, 22, 12, 8, 15],
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57']
                }]
            },
            xAxis: {
                title: {
                    ko: '지역',
                    en: 'Region'
                }
            },
            yAxis: {
                title: {
                    ko: '비율 (%)',
                    en: 'Rate (%)'
                }
            }
        };
    }

    /**
     * Create sample pie chart data
     */
    static createSamplePieData() {
        return {
            chartType: 'pie',
            data: {
                labels: ['아시아', '아프리카', '유럽', '북미', '남미'],
                datasets: [{
                    label: {
                        ko: '지역별 분포',
                        en: 'Distribution by Region'
                    },
                    data: [35, 30, 15, 12, 8],
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57']
                }]
            }
        };
    }

    /**
     * Create sample line chart data
     */
    static createSampleLineData() {
        return {
            chartType: 'line',
            data: {
                labels: ['1990', '1995', '2000', '2005', '2010', '2015', '2020'],
                datasets: [{
                    label: {
                        ko: '인구 증가율 (%)',
                        en: 'Population Growth Rate (%)'
                    },
                    data: [2.1, 1.8, 1.5, 1.3, 1.1, 1.0, 0.9],
                    borderColor: '#3498db',
                    backgroundColor: '#3498db20',
                    tension: 0.4
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
                    ko: '증가율 (%)',
                    en: 'Growth Rate (%)'
                }
            }
        };
    }
}