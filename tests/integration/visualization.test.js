/**
 * Visualization Integration Test Suite
 * Tests for chart rendering, updates, and interaction functionality
 */

// Simple assertion library (consistent with other tests)
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

// Mock visualization integration data
const mockVisualizationConfigs = {
    populationGrowthChart: {
        id: 'pop-growth-chart',
        type: 'plotly',
        data: [{
            x: ['1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020'],
            y: [2.5, 3.0, 3.7, 4.4, 5.3, 6.1, 6.9, 7.8],
            type: 'scatter',
            mode: 'lines+markers',
            name: 'World Population (Billions)',
            line: { color: '#1f77b4', width: 3 }
        }],
        layout: {
            title: 'Global Population Growth 1950-2020',
            xaxis: { title: 'Year' },
            yaxis: { title: 'Population (Billions)' },
            showlegend: true
        },
        config: { responsive: true, displayModeBar: false }
    },
    fertilityRatesMap: {
        id: 'fertility-map',
        type: 'leaflet',
        data: {
            center: [20, 0],
            zoom: 2,
            choroplethData: [
                { country: 'KOR', value: 0.84, name: 'South Korea' },
                { country: 'JPN', value: 1.36, name: 'Japan' },
                { country: 'USA', value: 1.78, name: 'United States' },
                { country: 'NGA', value: 5.32, name: 'Nigeria' }
            ]
        },
        config: {
            colorScale: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26'],
            valueRange: [0.5, 6.0],
            tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }
    },
    policyTimeline: {
        id: 'policy-timeline',
        type: 'timeline',
        data: [
            { date: '1952', event: 'India launches family planning program', category: 'policy', impact: 'high' },
            { date: '1960', event: 'FDA approves birth control pill', category: 'technology', impact: 'high' },
            { date: '1969', event: 'UNFPA established', category: 'international', impact: 'medium' },
            { date: '1979', event: 'China implements One-Child Policy', category: 'policy', impact: 'high' },
            { date: '1994', event: 'Cairo Conference on Population', category: 'international', impact: 'high' },
            { date: '2015', event: 'China ends One-Child Policy', category: 'policy', impact: 'high' }
        ],
        config: {
            height: 400,
            colorScale: {
                policy: '#ff7f0e',
                technology: '#2ca02c',
                international: '#1f77b4'
            },
            impactScale: {
                high: 8,
                medium: 6,
                low: 4
            }
        }
    }
};

// Mock VisualizationIntegrationManager class
class MockVisualizationIntegrationManager {
    constructor() {
        this.activeVisualizations = new Map();
        this.updateQueue = new Map();
        this.interactionHandlers = new Map();
        this.resizeObserver = null;
    }

    async renderVisualization(container, config) {
        if (!container || !config) {
            throw new Error('Container and configuration are required');
        }

        const visualization = await this.createVisualization(config);
        visualization.container = container;
        visualization.config = config;

        this.activeVisualizations.set(config.id, visualization);
        this.setupInteractionHandlers(visualization);
        this.setupResizeHandling(visualization);

        return visualization;
    }

    async createVisualization(config) {
        switch (config.type) {
            case 'plotly':
                return this.createPlotlyVisualization(config);
            case 'leaflet':
                return this.createLeafletVisualization(config);
            case 'timeline':
                return this.createTimelineVisualization(config);
            default:
                throw new Error(`Unsupported visualization type: ${config.type}`);
        }
    }

    async createPlotlyVisualization(config) {
        const element = document.createElement('div');
        element.className = 'plotly-visualization';
        element.id = config.id;
        element.dataset.type = 'plotly';
        element.dataset.config = JSON.stringify(config);

        // Mock Plotly rendering
        element.innerHTML = `
            <div class="chart-container">
                <div class="chart-title">${config.layout.title}</div>
                <div class="chart-data" data-points="${config.data[0].x.length}">
                    Mock Plotly Chart with ${config.data[0].x.length} data points
                </div>
            </div>
        `;

        return {
            type: 'plotly',
            element,
            isRendered: true,
            lastUpdate: Date.now(),
            dataPoints: config.data[0].x.length
        };
    }

    async createLeafletVisualization(config) {
        const element = document.createElement('div');
        element.className = 'leaflet-visualization';
        element.id = config.id;
        element.dataset.type = 'leaflet';
        element.dataset.config = JSON.stringify(config);
        element.style.height = '400px';

        // Mock Leaflet rendering
        element.innerHTML = `
            <div class="map-container">
                <div class="map-info">
                    Center: [${config.data.center[0]}, ${config.data.center[1]}]
                    Zoom: ${config.data.zoom}
                </div>
                <div class="choropleth-data" data-countries="${config.data.choroplethData.length}">
                    Mock Choropleth Map with ${config.data.choroplethData.length} countries
                </div>
            </div>
        `;

        return {
            type: 'leaflet',
            element,
            isRendered: true,
            lastUpdate: Date.now(),
            dataLayers: config.data.choroplethData.length
        };
    }

    async createTimelineVisualization(config) {
        const element = document.createElement('div');
        element.className = 'timeline-visualization';
        element.id = config.id;
        element.dataset.type = 'timeline';
        element.dataset.config = JSON.stringify(config);
        element.style.height = `${config.config.height}px`;

        // Mock Timeline rendering
        element.innerHTML = `
            <div class="timeline-container">
                <div class="timeline-info">Timeline Events: ${config.data.length}</div>
                <div class="timeline-events">
                    ${config.data.map((event, index) => `
                        <div class="timeline-event" data-index="${index}" data-category="${event.category}">
                            ${event.date}: ${event.event}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        return {
            type: 'timeline',
            element,
            isRendered: true,
            lastUpdate: Date.now(),
            eventCount: config.data.length
        };
    }

    async updateVisualization(visualizationId, newData, animate = true) {
        const visualization = this.activeVisualizations.get(visualizationId);
        if (!visualization) {
            throw new Error(`Visualization ${visualizationId} not found`);
        }

        // Queue update to simulate async behavior
        this.updateQueue.set(visualizationId, {
            newData,
            animate,
            timestamp: Date.now()
        });

        // Simulate update processing
        await new Promise(resolve => setTimeout(resolve, 100));

        visualization.lastUpdate = Date.now();
        visualization.isUpdating = false;

        this.fireUpdateEvent(visualizationId, newData);
        return visualization;
    }

    setupInteractionHandlers(visualization) {
        const handlers = {
            click: (event) => this.handleClick(visualization, event),
            hover: (event) => this.handleHover(visualization, event),
            zoom: (event) => this.handleZoom(visualization, event)
        };

        this.interactionHandlers.set(visualization.config.id, handlers);

        // Simulate adding event listeners
        visualization.element.addEventListener('click', handlers.click);
        visualization.element.addEventListener('mouseover', handlers.hover);
    }

    setupResizeHandling(visualization) {
        // Mock ResizeObserver
        if (!this.resizeObserver) {
            this.resizeObserver = {
                observe: (element) => {
                    // Simulate resize detection
                    element.dataset.resizeObserved = 'true';
                },
                unobserve: (element) => {
                    element.dataset.resizeObserved = 'false';
                }
            };
        }

        this.resizeObserver.observe(visualization.element);
    }

    handleClick(visualization, event) {
        const clickData = {
            visualizationId: visualization.config.id,
            type: 'click',
            timestamp: Date.now(),
            coordinates: { x: event.clientX || 100, y: event.clientY || 100 }
        };

        this.fireInteractionEvent('click', clickData);
        return clickData;
    }

    handleHover(visualization, event) {
        const hoverData = {
            visualizationId: visualization.config.id,
            type: 'hover',
            timestamp: Date.now(),
            coordinates: { x: event.clientX || 100, y: event.clientY || 100 }
        };

        this.fireInteractionEvent('hover', hoverData);
        return hoverData;
    }

    handleZoom(visualization, event) {
        const zoomData = {
            visualizationId: visualization.config.id,
            type: 'zoom',
            timestamp: Date.now(),
            zoomLevel: event.zoomLevel || 1.5
        };

        this.fireInteractionEvent('zoom', zoomData);
        return zoomData;
    }

    fireInteractionEvent(type, data) {
        // Mock event firing
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            const event = new CustomEvent(`visualization${type}`, { detail: data });
            window.dispatchEvent(event);
        }
    }

    fireUpdateEvent(visualizationId, newData) {
        // Mock update event
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            const event = new CustomEvent('visualizationUpdate', {
                detail: { visualizationId, newData, timestamp: Date.now() }
            });
            window.dispatchEvent(event);
        }
    }

    getVisualization(visualizationId) {
        return this.activeVisualizations.get(visualizationId);
    }

    getAllVisualizations() {
        return Array.from(this.activeVisualizations.values());
    }

    removeVisualization(visualizationId) {
        const visualization = this.activeVisualizations.get(visualizationId);
        if (visualization) {
            // Cleanup
            if (this.resizeObserver && visualization.element) {
                this.resizeObserver.unobserve(visualization.element);
            }

            this.interactionHandlers.delete(visualizationId);
            this.activeVisualizations.delete(visualizationId);
            this.updateQueue.delete(visualizationId);
        }
        return visualization;
    }
}

// Test suite
const VisualizationIntegrationTests = {
    async testRenderPlotlyChart() {
        const manager = new MockVisualizationIntegrationManager();
        const container = document.createElement('div');
        const config = mockVisualizationConfigs.populationGrowthChart;

        const visualization = await manager.renderVisualization(container, config);

        assert.ok(visualization, 'Should return visualization object');
        assert.equal(visualization.type, 'plotly', 'Should have correct type');
        assert.ok(visualization.isRendered, 'Should be marked as rendered');
        assert.equal(visualization.dataPoints, 8, 'Should track correct number of data points');
        assert.ok(visualization.element.innerHTML.includes('Mock Plotly Chart'), 'Should render chart content');
        assert.equal(visualization.element.className, 'plotly-visualization', 'Should have correct CSS class');

        const storedViz = manager.getVisualization(config.id);
        assert.equal(storedViz, visualization, 'Should store visualization in manager');

        return 'testRenderPlotlyChart passed';
    },

    async testRenderLeafletMap() {
        const manager = new MockVisualizationIntegrationManager();
        const container = document.createElement('div');
        const config = mockVisualizationConfigs.fertilityRatesMap;

        const visualization = await manager.renderVisualization(container, config);

        assert.ok(visualization, 'Should return visualization object');
        assert.equal(visualization.type, 'leaflet', 'Should have correct type');
        assert.ok(visualization.isRendered, 'Should be marked as rendered');
        assert.equal(visualization.dataLayers, 4, 'Should track correct number of data layers');
        assert.ok(visualization.element.innerHTML.includes('Mock Choropleth Map'), 'Should render map content');
        assert.equal(visualization.element.style.height, '400px', 'Should set correct height');

        return 'testRenderLeafletMap passed';
    },

    async testRenderTimeline() {
        const manager = new MockVisualizationIntegrationManager();
        const container = document.createElement('div');
        const config = mockVisualizationConfigs.policyTimeline;

        const visualization = await manager.renderVisualization(container, config);

        assert.ok(visualization, 'Should return visualization object');
        assert.equal(visualization.type, 'timeline', 'Should have correct type');
        assert.ok(visualization.isRendered, 'Should be marked as rendered');
        assert.equal(visualization.eventCount, 6, 'Should track correct number of events');

        // Check that all events are rendered
        const eventElements = visualization.element.querySelectorAll('.timeline-event');
        assert.equal(eventElements.length, 6, 'Should render all timeline events');
        assert.ok(visualization.element.innerHTML.includes('China implements One-Child Policy'), 'Should include specific events');

        return 'testRenderTimeline passed';
    },

    async testVisualizationUpdates() {
        const manager = new MockVisualizationIntegrationManager();
        const container = document.createElement('div');
        const config = mockVisualizationConfigs.populationGrowthChart;

        const visualization = await manager.renderVisualization(container, config);
        const initialUpdateTime = visualization.lastUpdate;

        // Wait a bit to ensure timestamp difference
        await new Promise(resolve => setTimeout(resolve, 50));

        // Test updating visualization
        const newData = [{
            x: ['1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020', '2030'],
            y: [2.5, 3.0, 3.7, 4.4, 5.3, 6.1, 6.9, 7.8, 8.5],
            type: 'scatter',
            mode: 'lines+markers',
            name: 'World Population (Billions) - Updated'
        }];

        const updatedViz = await manager.updateVisualization(config.id, newData, true);

        assert.ok(updatedViz.lastUpdate > initialUpdateTime, 'Should update timestamp');
        assert.ok(!updatedViz.isUpdating, 'Should clear updating flag');

        // Test updating non-existent visualization
        try {
            await manager.updateVisualization('nonexistent', newData);
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('not found'), 'Should throw error for non-existent visualization');
        }

        return 'testVisualizationUpdates passed';
    },

    async testInteractionHandling() {
        const manager = new MockVisualizationIntegrationManager();
        const container = document.createElement('div');
        const config = mockVisualizationConfigs.populationGrowthChart;

        const visualization = await manager.renderVisualization(container, config);

        // Test click handling
        const mockClickEvent = { clientX: 150, clientY: 200 };
        const clickData = manager.handleClick(visualization, mockClickEvent);

        assert.equal(clickData.visualizationId, config.id, 'Should include correct visualization ID');
        assert.equal(clickData.type, 'click', 'Should have correct interaction type');
        assert.equal(clickData.coordinates.x, 150, 'Should capture click coordinates');

        // Test hover handling
        const mockHoverEvent = { clientX: 100, clientY: 150 };
        const hoverData = manager.handleHover(visualization, mockHoverEvent);

        assert.equal(hoverData.type, 'hover', 'Should handle hover events');
        assert.ok(hoverData.timestamp, 'Should include timestamp');

        // Test zoom handling
        const mockZoomEvent = { zoomLevel: 2.0 };
        const zoomData = manager.handleZoom(visualization, mockZoomEvent);

        assert.equal(zoomData.type, 'zoom', 'Should handle zoom events');
        assert.equal(zoomData.zoomLevel, 2.0, 'Should capture zoom level');

        return 'testInteractionHandling passed';
    },

    async testResizeHandling() {
        const manager = new MockVisualizationIntegrationManager();
        const container = document.createElement('div');
        const config = mockVisualizationConfigs.fertilityRatesMap;

        const visualization = await manager.renderVisualization(container, config);

        // Check that resize observer is set up
        assert.equal(visualization.element.dataset.resizeObserved, 'true', 'Should set up resize observation');

        // Test cleanup removes resize observer
        manager.removeVisualization(config.id);
        assert.equal(visualization.element.dataset.resizeObserved, 'false', 'Should clean up resize observation');

        return 'testResizeHandling passed';
    },

    async testVisualizationManagement() {
        const manager = new MockVisualizationIntegrationManager();
        const container1 = document.createElement('div');
        const container2 = document.createElement('div');

        // Render multiple visualizations
        await manager.renderVisualization(container1, mockVisualizationConfigs.populationGrowthChart);
        await manager.renderVisualization(container2, mockVisualizationConfigs.fertilityRatesMap);

        // Test getting all visualizations
        const allViz = manager.getAllVisualizations();
        assert.equal(allViz.length, 2, 'Should track multiple visualizations');

        // Test getting specific visualization
        const chartViz = manager.getVisualization('pop-growth-chart');
        assert.ok(chartViz, 'Should retrieve specific visualization');
        assert.equal(chartViz.type, 'plotly', 'Should retrieve correct visualization type');

        // Test removing visualization
        const removedViz = manager.removeVisualization('pop-growth-chart');
        assert.ok(removedViz, 'Should return removed visualization');
        assert.ok(!manager.getVisualization('pop-growth-chart'), 'Should remove from tracking');

        const remainingViz = manager.getAllVisualizations();
        assert.equal(remainingViz.length, 1, 'Should have correct number after removal');

        return 'testVisualizationManagement passed';
    },

    async testInvalidVisualizationHandling() {
        const manager = new MockVisualizationIntegrationManager();
        const container = document.createElement('div');

        // Test invalid visualization type
        const invalidConfig = {
            id: 'invalid-viz',
            type: 'unsupported',
            data: {},
            config: {}
        };

        try {
            await manager.renderVisualization(container, invalidConfig);
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('Unsupported visualization type'), 'Should throw error for unsupported type');
        }

        // Test missing parameters
        try {
            await manager.renderVisualization(null, mockVisualizationConfigs.populationGrowthChart);
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('Container and configuration are required'), 'Should throw error for missing container');
        }

        return 'testInvalidVisualizationHandling passed';
    }
};

// Export for test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        VisualizationIntegrationTests,
        MockVisualizationIntegrationManager,
        mockVisualizationConfigs
    };
} else {
    window.VisualizationIntegrationTests = VisualizationIntegrationTests;
    window.MockVisualizationIntegrationManager = MockVisualizationIntegrationManager;
    window.mockVisualizationConfigs = mockVisualizationConfigs;
}