/**
 * VisualizationRenderer Test Suite
 * Tests for Plotly, Leaflet, and Timeline rendering functionality
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

// Mock visualization data
const mockVisualizationData = {
    plotlyChart: {
        type: 'plotly',
        data: [{
            x: ['2000', '2005', '2010', '2015', '2020'],
            y: [6.1, 6.5, 6.9, 7.3, 7.8],
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Global Population (Billions)'
        }],
        layout: {
            title: 'Global Population Growth',
            xaxis: { title: 'Year' },
            yaxis: { title: 'Population (Billions)' }
        },
        config: { responsive: true }
    },
    leafletMap: {
        type: 'leaflet',
        data: {
            center: [37.5665, 126.9780],
            zoom: 10,
            markers: [
                { lat: 37.5665, lng: 126.9780, popup: 'Seoul, South Korea' },
                { lat: 37.4563, lng: 126.7052, popup: 'Incheon, South Korea' }
            ]
        },
        config: {
            tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '© OpenStreetMap contributors'
        }
    },
    timelineChart: {
        type: 'timeline',
        data: [
            { date: '1950', event: 'Post-war baby boom begins', category: 'demographic' },
            { date: '1960', event: 'Birth control pill approved', category: 'policy' },
            { date: '1979', event: 'China One-Child Policy implemented', category: 'policy' },
            { date: '2015', event: 'China ends One-Child Policy', category: 'policy' }
        ],
        config: {
            height: 400,
            colorScale: { demographic: '#1f77b4', policy: '#ff7f0e' }
        }
    }
};

// Mock VisualizationRenderer class
class MockVisualizationRenderer {
    constructor() {
        this.renderedVisualizations = new Map();
    }

    async renderPlotly(container, data, layout, config) {
        if (!container || !data) {
            throw new Error('Container and data are required for Plotly rendering');
        }

        // Simulate Plotly rendering
        const plotDiv = document.createElement('div');
        plotDiv.className = 'plotly-chart';
        plotDiv.dataset.chart = JSON.stringify({ data, layout, config });
        plotDiv.innerHTML = `<div class="plotly-mock">Plotly Chart: ${layout?.title || 'Untitled'}</div>`;

        container.appendChild(plotDiv);
        this.renderedVisualizations.set(container, { type: 'plotly', element: plotDiv });

        return plotDiv;
    }

    async renderLeaflet(container, mapData, config) {
        if (!container || !mapData) {
            throw new Error('Container and map data are required for Leaflet rendering');
        }

        // Simulate Leaflet rendering
        const mapDiv = document.createElement('div');
        mapDiv.className = 'leaflet-map';
        mapDiv.style.height = '400px';
        mapDiv.dataset.mapConfig = JSON.stringify({ mapData, config });

        const mockMapContent = document.createElement('div');
        mockMapContent.className = 'leaflet-mock';
        mockMapContent.innerHTML = `
            <div>Leaflet Map</div>
            <div>Center: [${mapData.center[0]}, ${mapData.center[1]}]</div>
            <div>Zoom: ${mapData.zoom}</div>
            <div>Markers: ${mapData.markers?.length || 0}</div>
        `;
        mapDiv.appendChild(mockMapContent);

        container.appendChild(mapDiv);
        this.renderedVisualizations.set(container, { type: 'leaflet', element: mapDiv });

        return mapDiv;
    }

    async renderTimeline(container, timelineData, config) {
        if (!container || !timelineData) {
            throw new Error('Container and timeline data are required for Timeline rendering');
        }

        // Simulate Timeline rendering
        const timelineDiv = document.createElement('div');
        timelineDiv.className = 'timeline-chart';
        timelineDiv.style.height = `${config?.height || 300}px`;
        timelineDiv.dataset.timelineConfig = JSON.stringify({ timelineData, config });

        const mockTimelineContent = document.createElement('div');
        mockTimelineContent.className = 'timeline-mock';
        mockTimelineContent.innerHTML = `
            <div>Timeline Chart</div>
            <div>Events: ${timelineData.length}</div>
            <div class="timeline-events">
                ${timelineData.map(event => `
                    <div class="timeline-event" data-category="${event.category}">
                        ${event.date}: ${event.event}
                    </div>
                `).join('')}
            </div>
        `;
        timelineDiv.appendChild(mockTimelineContent);

        container.appendChild(timelineDiv);
        this.renderedVisualizations.set(container, { type: 'timeline', element: timelineDiv });

        return timelineDiv;
    }

    getRenderedVisualization(container) {
        return this.renderedVisualizations.get(container);
    }

    clearVisualization(container) {
        if (this.renderedVisualizations.has(container)) {
            container.innerHTML = '';
            this.renderedVisualizations.delete(container);
        }
    }
}

// Test suite
const VisualizationRendererTests = {
    async testRenderPlotlyWithValidData() {
        const renderer = new MockVisualizationRenderer();
        const container = document.createElement('div');
        const { data, layout, config } = mockVisualizationData.plotlyChart;

        const plotElement = await renderer.renderPlotly(container, data, layout, config);

        assert.ok(plotElement, 'Should return plot element');
        assert.equal(plotElement.className, 'plotly-chart', 'Should have correct CSS class');
        assert.ok(plotElement.innerHTML.includes('Global Population Growth'), 'Should include chart title');
        assert.equal(container.children.length, 1, 'Should add exactly one child to container');

        const chartData = JSON.parse(plotElement.dataset.chart);
        assert.deepEqual(chartData.data, data, 'Should store correct chart data');
        assert.deepEqual(chartData.layout, layout, 'Should store correct layout');

        const rendered = renderer.getRenderedVisualization(container);
        assert.equal(rendered.type, 'plotly', 'Should track rendered visualization type');

        return 'testRenderPlotlyWithValidData passed';
    },

    async testRenderPlotlyWithInvalidData() {
        const renderer = new MockVisualizationRenderer();
        const container = document.createElement('div');

        try {
            await renderer.renderPlotly(null, [], {}, {});
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('Container and data are required'), 'Should throw error for null container');
        }

        try {
            await renderer.renderPlotly(container, null, {}, {});
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('Container and data are required'), 'Should throw error for null data');
        }

        return 'testRenderPlotlyWithInvalidData passed';
    },

    async testRenderLeafletWithValidData() {
        const renderer = new MockVisualizationRenderer();
        const container = document.createElement('div');
        const { data, config } = mockVisualizationData.leafletMap;

        const mapElement = await renderer.renderLeaflet(container, data, config);

        assert.ok(mapElement, 'Should return map element');
        assert.equal(mapElement.className, 'leaflet-map', 'Should have correct CSS class');
        assert.equal(mapElement.style.height, '400px', 'Should set correct height');
        assert.ok(mapElement.innerHTML.includes('Leaflet Map'), 'Should include map identifier');
        assert.ok(mapElement.innerHTML.includes('37.5665'), 'Should include center coordinates');
        assert.ok(mapElement.innerHTML.includes('Markers: 2'), 'Should show correct marker count');

        const mapConfig = JSON.parse(mapElement.dataset.mapConfig);
        assert.deepEqual(mapConfig.mapData, data, 'Should store correct map data');

        const rendered = renderer.getRenderedVisualization(container);
        assert.equal(rendered.type, 'leaflet', 'Should track rendered visualization type');

        return 'testRenderLeafletWithValidData passed';
    },

    async testRenderLeafletWithInvalidData() {
        const renderer = new MockVisualizationRenderer();
        const container = document.createElement('div');

        try {
            await renderer.renderLeaflet(null, {}, {});
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('Container and map data are required'), 'Should throw error for null container');
        }

        try {
            await renderer.renderLeaflet(container, null, {});
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('Container and map data are required'), 'Should throw error for null data');
        }

        return 'testRenderLeafletWithInvalidData passed';
    },

    async testRenderTimelineWithValidData() {
        const renderer = new MockVisualizationRenderer();
        const container = document.createElement('div');
        const { data, config } = mockVisualizationData.timelineChart;

        const timelineElement = await renderer.renderTimeline(container, data, config);

        assert.ok(timelineElement, 'Should return timeline element');
        assert.equal(timelineElement.className, 'timeline-chart', 'Should have correct CSS class');
        assert.equal(timelineElement.style.height, '400px', 'Should set correct height');
        assert.ok(timelineElement.innerHTML.includes('Timeline Chart'), 'Should include timeline identifier');
        assert.ok(timelineElement.innerHTML.includes('Events: 4'), 'Should show correct event count');

        // Test that all events are rendered
        const eventElements = timelineElement.querySelectorAll('.timeline-event');
        assert.equal(eventElements.length, 4, 'Should render all events');
        assert.ok(timelineElement.innerHTML.includes('Birth control pill approved'), 'Should include specific event');
        assert.ok(timelineElement.innerHTML.includes('China One-Child Policy'), 'Should include policy events');

        const timelineConfig = JSON.parse(timelineElement.dataset.timelineConfig);
        assert.deepEqual(timelineConfig.timelineData, data, 'Should store correct timeline data');

        const rendered = renderer.getRenderedVisualization(container);
        assert.equal(rendered.type, 'timeline', 'Should track rendered visualization type');

        return 'testRenderTimelineWithValidData passed';
    },

    async testRenderTimelineWithInvalidData() {
        const renderer = new MockVisualizationRenderer();
        const container = document.createElement('div');

        try {
            await renderer.renderTimeline(null, [], {});
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('Container and timeline data are required'), 'Should throw error for null container');
        }

        try {
            await renderer.renderTimeline(container, null, {});
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('Container and timeline data are required'), 'Should throw error for null data');
        }

        return 'testRenderTimelineWithInvalidData passed';
    },

    async testVisualizationTracking() {
        const renderer = new MockVisualizationRenderer();
        const container1 = document.createElement('div');
        const container2 = document.createElement('div');

        // Render different visualizations in different containers
        await renderer.renderPlotly(container1, mockVisualizationData.plotlyChart.data,
                                  mockVisualizationData.plotlyChart.layout,
                                  mockVisualizationData.plotlyChart.config);

        await renderer.renderLeaflet(container2, mockVisualizationData.leafletMap.data,
                                   mockVisualizationData.leafletMap.config);

        // Test tracking
        const viz1 = renderer.getRenderedVisualization(container1);
        const viz2 = renderer.getRenderedVisualization(container2);

        assert.equal(viz1.type, 'plotly', 'Should track first visualization type');
        assert.equal(viz2.type, 'leaflet', 'Should track second visualization type');
        assert.notEqual(viz1.element, viz2.element, 'Should track different elements');

        // Test clearing
        renderer.clearVisualization(container1);
        assert.equal(container1.children.length, 0, 'Should clear container');
        assert.ok(!renderer.getRenderedVisualization(container1), 'Should remove from tracking');
        assert.ok(renderer.getRenderedVisualization(container2), 'Should keep other visualizations');

        return 'testVisualizationTracking passed';
    }
};

// Export for test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisualizationRendererTests, MockVisualizationRenderer, mockVisualizationData };
} else {
    window.VisualizationRendererTests = VisualizationRendererTests;
    window.MockVisualizationRenderer = MockVisualizationRenderer;
    window.mockVisualizationData = mockVisualizationData;
}