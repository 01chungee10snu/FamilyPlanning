/**
 * Timeline Renderer
 * Handles D3.js timeline visualization with interactive events
 */

export class TimelineRenderer {
    constructor() {
        this.d3Loaded = false;
        this.loadPromise = null;
        this.activeTimelines = new Map();

        console.log('TimelineRenderer initialized');
    }

    /**
     * Main render method
     */
    async render(config, container, options = {}) {
        await this.ensureD3Loaded();

        const { chartType, data } = config;
        const timelineContainer = container.chartContainer;

        // Prepare timeline container
        const timelineId = `timeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        timelineContainer.id = timelineId;

        try {
            // Create timeline based on type
            let timeline;
            switch (chartType) {
                case 'timeline':
                    timeline = this.createTimeline(timelineId, data, options);
                    break;
                case 'gantt':
                    timeline = this.createGanttChart(timelineId, data, options);
                    break;
                default:
                    throw new Error(`Unsupported timeline type: ${chartType}`);
            }

            // Store timeline reference
            const timelineObject = {
                id: timelineId,
                timeline,
                container: timelineContainer,
                config,
                options,
                data
            };

            this.activeTimelines.set(timelineId, timelineObject);
            return timelineObject;

        } catch (error) {
            console.error('Timeline creation failed:', error);
            throw new Error(`Failed to create ${chartType} timeline: ${error.message}`);
        }
    }

    /**
     * Create interactive timeline
     */
    createTimeline(containerId, data, options) {
        const { theme, locale } = options;

        // Set up dimensions
        const margin = { top: 20, right: 80, bottom: 30, left: 80 };
        const container = d3.select(`#${containerId}`);
        const containerRect = container.node().getBoundingClientRect();
        const width = (containerRect.width || 800) - margin.left - margin.right;
        const height = (options.height || 400) - margin.top - margin.bottom;

        // Parse dates and sort events
        const events = data.map(d => ({
            ...d,
            year: new Date(d.year, 0, 1),
            event: this.getLocalizedText(d.event, locale)
        })).sort((a, b) => a.year - b.year);

        // Create scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(events, d => d.year))
            .range([0, width]);

        const yScale = d3.scaleBand()
            .domain(events.map((d, i) => i))
            .range([0, height])
            .padding(0.1);

        // Create SVG
        const svg = container.append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .style('background-color', theme.background);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create timeline line
        g.append('line')
            .attr('class', 'timeline-line')
            .attr('x1', 0)
            .attr('y1', height / 2)
            .attr('x2', width)
            .attr('y2', height / 2)
            .attr('stroke', theme.primary)
            .attr('stroke-width', 3);

        // Create x-axis
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat('%Y'))
            .ticks(d3.timeYear.every(5));

        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis)
            .selectAll('text')
            .style('fill', theme.text);

        // Create events
        const eventGroups = g.selectAll('.event-group')
            .data(events)
            .enter()
            .append('g')
            .attr('class', 'event-group')
            .attr('transform', (d, i) => {
                const x = xScale(d.year);
                const y = (i % 2 === 0) ? height / 2 - 40 : height / 2 + 40;
                return `translate(${x}, ${y})`;
            });

        // Add event circles
        eventGroups.append('circle')
            .attr('class', 'event-circle')
            .attr('r', 8)
            .attr('fill', (d, i) => data.colors ? data.colors[i % data.colors.length] : theme.primary)
            .attr('stroke', theme.background)
            .attr('stroke-width', 2)
            .style('cursor', 'pointer');

        // Add event lines connecting to main timeline
        eventGroups.append('line')
            .attr('class', 'event-line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', (d, i) => (i % 2 === 0) ? 32 : -32)
            .attr('stroke', theme.grid)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3');

        // Add event text
        eventGroups.append('text')
            .attr('class', 'event-text')
            .attr('dy', (d, i) => (i % 2 === 0) ? '-0.5em' : '1.2em')
            .attr('text-anchor', 'middle')
            .style('fill', theme.text)
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(d => d.year.getFullYear());

        // Add event descriptions
        eventGroups.append('text')
            .attr('class', 'event-description')
            .attr('dy', (d, i) => (i % 2 === 0) ? '-1.5em' : '2.2em')
            .attr('text-anchor', 'middle')
            .style('fill', theme.text)
            .style('font-size', '10px')
            .style('max-width', '120px')
            .text(d => d.event.length > 30 ? d.event.substring(0, 27) + '...' : d.event);

        // Add interactivity
        this.addTimelineInteractivity(eventGroups, events, options);

        // Add tooltip
        this.createTooltip(container, theme);

        return {
            svg,
            events,
            xScale,
            yScale,
            eventGroups
        };
    }

    /**
     * Create Gantt chart
     */
    createGanttChart(containerId, data, options) {
        const { theme, locale } = options;

        // Set up dimensions
        const margin = { top: 20, right: 20, bottom: 30, left: 100 };
        const container = d3.select(`#${containerId}`);
        const containerRect = container.node().getBoundingClientRect();
        const width = (containerRect.width || 800) - margin.left - margin.right;
        const height = (options.height || 400) - margin.top - margin.bottom;

        // Process data
        const tasks = data.map(d => ({
            ...d,
            startDate: new Date(d.startYear, 0, 1),
            endDate: new Date(d.endYear, 11, 31),
            task: this.getLocalizedText(d.task, locale)
        }));

        // Create scales
        const xScale = d3.scaleTime()
            .domain(d3.extent([...tasks.map(d => d.startDate), ...tasks.map(d => d.endDate)]))
            .range([0, width]);

        const yScale = d3.scaleBand()
            .domain(tasks.map(d => d.task))
            .range([0, height])
            .padding(0.1);

        // Create SVG
        const svg = container.append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .style('background-color', theme.background);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create axes
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat('%Y'));

        const yAxis = d3.axisLeft(yScale);

        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis)
            .selectAll('text')
            .style('fill', theme.text);

        g.append('g')
            .attr('class', 'y-axis')
            .call(yAxis)
            .selectAll('text')
            .style('fill', theme.text);

        // Create task bars
        const bars = g.selectAll('.task-bar')
            .data(tasks)
            .enter()
            .append('rect')
            .attr('class', 'task-bar')
            .attr('x', d => xScale(d.startDate))
            .attr('y', d => yScale(d.task))
            .attr('width', d => xScale(d.endDate) - xScale(d.startDate))
            .attr('height', yScale.bandwidth())
            .attr('fill', (d, i) => data.colors ? data.colors[i % data.colors.length] : theme.primary)
            .attr('opacity', 0.8)
            .style('cursor', 'pointer');

        // Add interactivity
        this.addGanttInteractivity(bars, tasks, options);

        return {
            svg,
            tasks,
            xScale,
            yScale,
            bars
        };
    }

    /**
     * Add interactivity to timeline
     */
    addTimelineInteractivity(eventGroups, events, options) {
        const tooltip = d3.select('.timeline-tooltip');

        eventGroups
            .on('mouseover', (event, d) => {
                // Highlight event
                d3.select(event.currentTarget)
                    .select('.event-circle')
                    .transition()
                    .duration(200)
                    .attr('r', 12);

                // Show tooltip
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);

                tooltip.html(`
                    <strong>${d.year.getFullYear()}</strong><br/>
                    ${d.event}
                `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');

                if (options.onHover) {
                    options.onHover(d);
                }
            })
            .on('mouseout', (event, d) => {
                // Reset event
                d3.select(event.currentTarget)
                    .select('.event-circle')
                    .transition()
                    .duration(200)
                    .attr('r', 8);

                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .on('click', (event, d) => {
                if (options.onClick) {
                    options.onClick(d);
                }
            });
    }

    /**
     * Add interactivity to Gantt chart
     */
    addGanttInteractivity(bars, tasks, options) {
        const tooltip = d3.select('.timeline-tooltip');

        bars
            .on('mouseover', (event, d) => {
                // Highlight bar
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr('opacity', 1);

                // Show tooltip
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);

                tooltip.html(`
                    <strong>${d.task}</strong><br/>
                    ${d.startDate.getFullYear()} - ${d.endDate.getFullYear()}
                `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');

                if (options.onHover) {
                    options.onHover(d);
                }
            })
            .on('mouseout', (event, d) => {
                // Reset bar
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.8);

                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .on('click', (event, d) => {
                if (options.onClick) {
                    options.onClick(d);
                }
            });
    }

    /**
     * Create tooltip
     */
    createTooltip(container, theme) {
        const tooltip = d3.select('body').selectAll('.timeline-tooltip')
            .data([0]);

        tooltip.enter()
            .append('div')
            .attr('class', 'timeline-tooltip')
            .style('position', 'absolute')
            .style('padding', '10px')
            .style('background', theme.background)
            .style('border', `1px solid ${theme.grid}`)
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .style('font-size', '12px')
            .style('color', theme.text)
            .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
            .style('z-index', '1000');
    }

    /**
     * Resize timeline
     */
    resize(timelineObject) {
        if (timelineObject && timelineObject.timeline && timelineObject.timeline.svg) {
            // Get new dimensions
            const containerRect = timelineObject.container.getBoundingClientRect();
            const newWidth = containerRect.width;

            // Update SVG width
            timelineObject.timeline.svg
                .attr('width', newWidth);

            // Recreate timeline with new dimensions
            timelineObject.container.innerHTML = '';
            this.render(timelineObject.config, { chartContainer: timelineObject.container }, timelineObject.options);
        }
    }

    /**
     * Update timeline data
     */
    updateTimeline(timelineId, newData) {
        const timelineObject = this.activeTimelines.get(timelineId);
        if (!timelineObject) {
            throw new Error('Timeline not found');
        }

        // Clear container and re-render with new data
        timelineObject.container.innerHTML = '';
        const newConfig = { ...timelineObject.config, data: newData };

        return this.render(newConfig, { chartContainer: timelineObject.container }, timelineObject.options);
    }

    /**
     * Export timeline
     */
    async export(timelineObject, format = 'png') {
        if (!timelineObject || !timelineObject.timeline) {
            throw new Error('Invalid timeline for export');
        }

        try {
            const svg = timelineObject.timeline.svg.node();

            if (format === 'svg') {
                // Export as SVG
                const svgData = new XMLSerializer().serializeToString(svg);
                const blob = new Blob([svgData], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.download = `timeline-${timelineObject.id}.svg`;
                link.href = url;
                link.click();

                URL.revokeObjectURL(url);
            } else {
                // Export as PNG using html2canvas
                if (typeof html2canvas !== 'undefined') {
                    const canvas = await html2canvas(timelineObject.container);
                    const link = document.createElement('a');
                    link.download = `timeline-${timelineObject.id}.${format}`;
                    link.href = canvas.toDataURL();
                    link.click();
                } else {
                    throw new Error('html2canvas not available for PNG export');
                }
            }
        } catch (error) {
            console.error('Timeline export failed:', error);
            throw new Error(`Failed to export timeline as ${format}: ${error.message}`);
        }
    }

    /**
     * Update theme
     */
    updateTheme(timelineObject, newTheme) {
        if (!timelineObject || !timelineObject.timeline) return;

        const { svg } = timelineObject.timeline;

        // Update background
        svg.style('background-color', newTheme.background);

        // Update text colors
        svg.selectAll('text').style('fill', newTheme.text);

        // Update timeline line
        svg.select('.timeline-line').attr('stroke', newTheme.primary);

        // Update grid colors
        svg.selectAll('.event-line').attr('stroke', newTheme.grid);
    }

    /**
     * Destroy timeline
     */
    destroy(timelineObject) {
        if (timelineObject && timelineObject.container) {
            try {
                // Remove D3 elements
                d3.select(`#${timelineObject.id}`).selectAll('*').remove();

                // Clear container
                timelineObject.container.innerHTML = '';

                // Remove from active timelines
                this.activeTimelines.delete(timelineObject.id);
            } catch (error) {
                console.warn('Failed to destroy timeline:', error);
            }
        }
    }

    /**
     * Ensure D3.js is loaded
     */
    async ensureD3Loaded() {
        if (this.d3Loaded && typeof d3 !== 'undefined') {
            return;
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this.loadD3();
        await this.loadPromise;
    }

    /**
     * Load D3.js library
     */
    async loadD3() {
        if (typeof d3 !== 'undefined') {
            this.d3Loaded = true;
            return;
        }

        try {
            await this.loadScript('https://d3js.org/d3.v7.min.js');
            this.d3Loaded = true;
            console.log('D3.js loaded successfully');
        } catch (error) {
            console.error('Failed to load D3.js:', error);
            throw new Error('D3.js library could not be loaded. Please check your internet connection.');
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
     * Create sample timeline data
     */
    static createFamilyPlanningTimelineData() {
        return {
            chartType: 'timeline',
            data: [
                {
                    year: 1960,
                    event: {
                        ko: '인구 폭발 우려 시작',
                        en: 'Population explosion concerns begin'
                    }
                },
                {
                    year: 1970,
                    event: {
                        ko: '대규모 가족계획 프로그램 확산',
                        en: 'Large-scale family planning programs expand'
                    }
                },
                {
                    year: 1994,
                    event: {
                        ko: '카이로 회의: 인권 기반 접근법',
                        en: 'Cairo Conference: Rights-based approach'
                    }
                },
                {
                    year: 2000,
                    event: {
                        ko: 'MDGs와 가족계획 연계',
                        en: 'MDGs link with family planning'
                    }
                },
                {
                    year: 2015,
                    event: {
                        ko: 'SDGs 시대의 새로운 도전',
                        en: 'New challenges in SDGs era'
                    }
                }
            ],
            colors: ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#592E83']
        };
    }

    /**
     * Create sample Gantt chart data
     */
    static createProjectTimelineData() {
        return {
            chartType: 'gantt',
            data: [
                {
                    task: {
                        ko: '연구 설계',
                        en: 'Research Design'
                    },
                    startYear: 2020,
                    endYear: 2021
                },
                {
                    task: {
                        ko: '데이터 수집',
                        en: 'Data Collection'
                    },
                    startYear: 2021,
                    endYear: 2022
                },
                {
                    task: {
                        ko: '분석 및 결과',
                        en: 'Analysis & Results'
                    },
                    startYear: 2022,
                    endYear: 2023
                },
                {
                    task: {
                        ko: '논문 작성',
                        en: 'Paper Writing'
                    },
                    startYear: 2023,
                    endYear: 2024
                }
            ],
            colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60']
        };
    }
}