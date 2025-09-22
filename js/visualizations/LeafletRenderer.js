/**
 * Leaflet Renderer
 * Handles Leaflet map rendering with choropleth support
 */

export class LeafletRenderer {
    constructor() {
        this.leafletLoaded = false;
        this.loadPromise = null;
        this.activeMaps = new Map();
        this.geoDataCache = new Map();

        console.log('LeafletRenderer initialized');
    }

    /**
     * Main render method
     */
    async render(config, container, options = {}) {
        await this.ensureLeafletLoaded();

        const { chartType, data } = config;
        const mapContainer = container.chartContainer;

        // Prepare map container
        const mapId = `leaflet-map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        mapContainer.id = mapId;
        mapContainer.style.height = options.height || '400px';
        mapContainer.style.width = '100%';

        try {
            // Create Leaflet map
            const map = this.createMap(mapId, options);

            // Add data layer based on type
            let dataLayer;
            switch (chartType) {
                case 'choropleth':
                    dataLayer = await this.createChoroplethLayer(data, options);
                    break;
                case 'markers':
                    dataLayer = this.createMarkersLayer(data, options);
                    break;
                case 'heatmap':
                    dataLayer = await this.createHeatmapLayer(data, options);
                    break;
                default:
                    throw new Error(`Unsupported map type: ${chartType}`);
            }

            if (dataLayer) {
                dataLayer.addTo(map);
            }

            // Add legend if data has values
            if (data.values && chartType === 'choropleth') {
                this.addLegend(map, data, options);
            }

            // Store map reference
            const mapObject = {
                id: mapId,
                map,
                dataLayer,
                container: mapContainer,
                config,
                options
            };

            this.activeMaps.set(mapId, mapObject);
            return mapObject;

        } catch (error) {
            console.error('Leaflet map creation failed:', error);
            throw new Error(`Failed to create ${chartType} map: ${error.message}`);
        }
    }

    /**
     * Create base Leaflet map
     */
    createMap(mapId, options) {
        const { theme } = options;

        // Create map with default view
        const map = L.map(mapId, {
            center: options.center || [20, 0], // World center
            zoom: options.zoom || 2,
            scrollWheelZoom: true,
            zoomControl: true,
            attributionControl: true
        });

        // Add tile layer
        const tileLayer = options.tileLayer || 'openstreetmap';
        this.addTileLayer(map, tileLayer, theme);

        // Add zoom controls
        L.control.zoom({
            position: 'topright'
        }).addTo(map);

        return map;
    }

    /**
     * Add tile layer based on type
     */
    addTileLayer(map, type, theme) {
        const tileLayers = {
            openstreetmap: {
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            cartodb: {
                url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            },
            dark: {
                url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }
        };

        const selectedLayer = tileLayers[type] || tileLayers.openstreetmap;

        L.tileLayer(selectedLayer.url, {
            attribution: selectedLayer.attribution,
            maxZoom: 18
        }).addTo(map);
    }

    /**
     * Create choropleth layer
     */
    async createChoroplethLayer(data, options) {
        const { theme, locale } = options;

        // Load world countries GeoJSON
        const geoData = await this.loadGeoData('world-countries');

        // Prepare data mapping
        const dataMap = new Map();
        if (data.countries && data.values) {
            data.countries.forEach((country, index) => {
                dataMap.set(country, data.values[index]);
            });
        }

        // Calculate value range for color scaling
        const values = Array.from(dataMap.values()).filter(v => v !== null && v !== undefined);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

        // Create choropleth layer
        const choroplethLayer = L.geoJSON(geoData, {
            style: (feature) => {
                const countryName = feature.properties.NAME || feature.properties.name || feature.properties.NAME_EN;
                const value = dataMap.get(countryName);

                return {
                    fillColor: this.getColor(value, minValue, maxValue, theme),
                    weight: 1,
                    opacity: 1,
                    color: theme.grid || '#666666',
                    fillOpacity: value !== undefined ? 0.7 : 0.1
                };
            },
            onEachFeature: (feature, layer) => {
                const countryName = feature.properties.NAME || feature.properties.name || feature.properties.NAME_EN;
                const value = dataMap.get(countryName);

                // Create popup content
                const popupContent = this.createPopupContent(countryName, value, data.unit, locale);
                layer.bindPopup(popupContent);

                // Add hover effects
                layer.on({
                    mouseover: (e) => {
                        const layer = e.target;
                        layer.setStyle({
                            weight: 3,
                            color: theme.accent || '#e74c3c',
                            fillOpacity: 0.9
                        });
                        layer.bringToFront();
                    },
                    mouseout: (e) => {
                        choroplethLayer.resetStyle(e.target);
                    },
                    click: (e) => {
                        if (options.onClick) {
                            options.onClick({
                                country: countryName,
                                value: value,
                                feature: feature
                            });
                        }
                    }
                });
            }
        });

        return choroplethLayer;
    }

    /**
     * Create markers layer
     */
    createMarkersLayer(data, options) {
        const { theme } = options;

        const markersGroup = L.layerGroup();

        if (data.markers) {
            data.markers.forEach(marker => {
                const leafletMarker = L.marker([marker.lat, marker.lng], {
                    icon: this.createCustomIcon(marker.icon, theme)
                });

                if (marker.popup) {
                    leafletMarker.bindPopup(marker.popup);
                }

                leafletMarker.addTo(markersGroup);
            });
        }

        return markersGroup;
    }

    /**
     * Create heatmap layer (requires leaflet.heat plugin)
     */
    async createHeatmapLayer(data, options) {
        // Ensure heatmap plugin is loaded
        await this.ensureHeatmapPluginLoaded();

        if (!data.points || !L.heatLayer) {
            throw new Error('Heatmap data or plugin not available');
        }

        const heatmapData = data.points.map(point => [point.lat, point.lng, point.intensity || 1]);

        return L.heatLayer(heatmapData, {
            radius: options.radius || 25,
            blur: options.blur || 15,
            maxZoom: options.maxZoom || 17
        });
    }

    /**
     * Get color for choropleth based on value
     */
    getColor(value, min, max, theme) {
        if (value === undefined || value === null) {
            return '#cccccc'; // No data color
        }

        // Normalize value between 0 and 1
        const normalized = (value - min) / (max - min);

        // Color scale from light to dark
        const colors = [
            theme.primary + '20',
            theme.primary + '40',
            theme.primary + '60',
            theme.primary + '80',
            theme.primary
        ];

        const index = Math.floor(normalized * (colors.length - 1));
        return colors[Math.min(index, colors.length - 1)];
    }

    /**
     * Create popup content
     */
    createPopupContent(countryName, value, unit, locale) {
        const displayValue = value !== undefined ?
            `${value}${unit ? ' ' + unit : ''}` :
            (locale === 'ko' ? '데이터 없음' : 'No data');

        return `
            <div class="leaflet-popup-content">
                <h4>${countryName}</h4>
                <p><strong>${displayValue}</strong></p>
            </div>
        `;
    }

    /**
     * Create custom marker icon
     */
    createCustomIcon(iconConfig, theme) {
        if (!iconConfig) {
            return new L.Icon.Default();
        }

        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${theme.primary}; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px;">${iconConfig.text || '•'}</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    }

    /**
     * Add legend to map
     */
    addLegend(map, data, options) {
        const { theme, locale } = options;

        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function() {
            const div = L.DomUtil.create('div', 'leaflet-legend');
            div.style.backgroundColor = 'white';
            div.style.padding = '10px';
            div.style.border = '2px solid #ccc';
            div.style.borderRadius = '5px';

            // Calculate value range
            const values = data.values.filter(v => v !== null && v !== undefined);
            const min = Math.min(...values);
            const max = Math.max(...values);

            // Create legend content
            div.innerHTML = `
                <h4 style="margin: 0 0 10px 0; font-size: 14px;">
                    ${data.title ? (typeof data.title === 'object' ? data.title[locale] || data.title.en : data.title) : 'Legend'}
                </h4>
            `;

            // Add color scale
            const steps = 5;
            for (let i = 0; i < steps; i++) {
                const value = min + (max - min) * (i / (steps - 1));
                const color = this.getColor(value, min, max, theme);

                div.innerHTML += `
                    <div style="display: flex; align-items: center; margin: 2px 0;">
                        <div style="width: 20px; height: 15px; background-color: ${color}; margin-right: 8px; border: 1px solid #ccc;"></div>
                        <span style="font-size: 12px;">${value.toFixed(1)}${data.unit || ''}</span>
                    </div>
                `;
            }

            return div;
        }.bind(this);

        legend.addTo(map);
    }

    /**
     * Resize map
     */
    resize(mapObject) {
        if (mapObject && mapObject.map) {
            setTimeout(() => {
                mapObject.map.invalidateSize();
            }, 100);
        }
    }

    /**
     * Update map theme
     */
    updateTheme(mapObject, newTheme) {
        if (!mapObject || !mapObject.map) return;

        // Update data layer colors if it's a choropleth
        if (mapObject.dataLayer && mapObject.config.chartType === 'choropleth') {
            mapObject.dataLayer.eachLayer(layer => {
                const currentStyle = layer.options;
                layer.setStyle({
                    ...currentStyle,
                    color: newTheme.grid || '#666666'
                });
            });
        }
    }

    /**
     * Export map
     */
    async export(mapObject, format = 'png') {
        if (!mapObject || !mapObject.map) {
            throw new Error('Invalid map for export');
        }

        try {
            // Use leaflet-image plugin if available
            if (typeof leafletImage !== 'undefined') {
                return new Promise((resolve, reject) => {
                    leafletImage(mapObject.map, (err, canvas) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const link = document.createElement('a');
                        link.download = `map-${mapObject.id}.${format}`;
                        link.href = canvas.toDataURL();
                        link.click();
                        resolve();
                    });
                });
            } else {
                // Fallback to html2canvas
                if (typeof html2canvas !== 'undefined') {
                    const canvas = await html2canvas(mapObject.container);
                    const link = document.createElement('a');
                    link.download = `map-${mapObject.id}.${format}`;
                    link.href = canvas.toDataURL();
                    link.click();
                } else {
                    throw new Error('No export library available');
                }
            }
        } catch (error) {
            console.error('Map export failed:', error);
            throw new Error(`Failed to export map as ${format}: ${error.message}`);
        }
    }

    /**
     * Destroy map
     */
    destroy(mapObject) {
        if (mapObject && mapObject.map) {
            try {
                mapObject.map.remove();
                this.activeMaps.delete(mapObject.id);
            } catch (error) {
                console.warn('Failed to destroy Leaflet map:', error);
            }
        }
    }

    /**
     * Load geographic data
     */
    async loadGeoData(type) {
        if (this.geoDataCache.has(type)) {
            return this.geoDataCache.get(type);
        }

        try {
            let url;
            switch (type) {
                case 'world-countries':
                    url = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
                    break;
                default:
                    throw new Error(`Unknown geo data type: ${type}`);
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load geo data: ${response.statusText}`);
            }

            const geoData = await response.json();
            this.geoDataCache.set(type, geoData);
            return geoData;

        } catch (error) {
            console.error('Failed to load geo data:', error);
            throw new Error(`Failed to load geographic data: ${error.message}`);
        }
    }

    /**
     * Ensure Leaflet is loaded
     */
    async ensureLeafletLoaded() {
        if (this.leafletLoaded && typeof L !== 'undefined') {
            return;
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this.loadLeaflet();
        await this.loadPromise;
    }

    /**
     * Load Leaflet library
     */
    async loadLeaflet() {
        if (typeof L !== 'undefined') {
            this.leafletLoaded = true;
            return;
        }

        try {
            // Load CSS first
            await this.loadCSS('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

            // Load JavaScript
            await this.loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');

            this.leafletLoaded = true;
            console.log('Leaflet loaded successfully');

        } catch (error) {
            console.error('Failed to load Leaflet:', error);
            throw new Error('Leaflet library could not be loaded. Please check your internet connection.');
        }
    }

    /**
     * Ensure heatmap plugin is loaded
     */
    async ensureHeatmapPluginLoaded() {
        if (typeof L !== 'undefined' && L.heatLayer) {
            return;
        }

        try {
            await this.loadScript('https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js');
            console.log('Leaflet heatmap plugin loaded successfully');
        } catch (error) {
            console.warn('Failed to load heatmap plugin:', error);
        }
    }

    /**
     * Load CSS file
     */
    loadCSS(href) {
        return new Promise((resolve, reject) => {
            // Check if CSS already exists
            if (document.querySelector(`link[href="${href}"]`)) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
            document.head.appendChild(link);
        });
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
     * Create sample world map data
     */
    static createWorldMapData() {
        return {
            chartType: 'choropleth',
            data: {
                title: {
                    ko: '지역별 피임 미충족 요구',
                    en: 'Unmet Contraceptive Need by Region'
                },
                countries: [
                    'Nigeria', 'India', 'Pakistan', 'Bangladesh', 'Ethiopia',
                    'Brazil', 'Mexico', 'China', 'Indonesia', 'Philippines'
                ],
                values: [25, 22, 18, 15, 28, 12, 14, 8, 16, 19],
                unit: '%'
            }
        };
    }

    /**
     * Create sample markers data
     */
    static createMarkersData() {
        return {
            chartType: 'markers',
            data: {
                markers: [
                    { lat: 9.0820, lng: 8.6753, popup: 'Nigeria', icon: { text: 'NG' } },
                    { lat: 20.5937, lng: 78.9629, popup: 'India', icon: { text: 'IN' } },
                    { lat: 30.3753, lng: 69.3451, popup: 'Pakistan', icon: { text: 'PK' } },
                    { lat: 23.6850, lng: 90.3563, popup: 'Bangladesh', icon: { text: 'BD' } },
                    { lat: 9.1450, lng: 40.4897, popup: 'Ethiopia', icon: { text: 'ET' } }
                ]
            }
        };
    }
}