/**
 * Data Loader
 * Handles loading and caching of presentation data with error handling and performance tracking
 */

export class DataLoader {
    constructor(config = {}) {
        this.cache = new Map();
        this.loadingPromises = new Map();
        this.performanceMetrics = new Map();

        // Configuration with defaults
        this.config = {
            cacheTimeout: config.cacheTimeout || 300000, // 5 minutes
            retryAttempts: config.retryAttempts || 3,
            retryDelay: config.retryDelay || 1000,
            enablePreloading: config.enablePreloading ?? true,
            maxCacheSize: config.maxCacheSize || 50,
            ...config
        };

        // Performance tracking
        this.stats = {
            totalRequests: 0,
            cacheHits: 0,
            cacheMisses: 0,
            failedRequests: 0,
            totalLoadTime: 0
        };

        console.log('DataLoader initialized with config:', this.config);
    }

    /**
     * Load JSON data from file with caching and error handling
     * @param {string} filePath - Path to JSON file
     * @param {Object} options - Loading options
     * @returns {Promise<Object>} Loaded data
     */
    async loadJSON(filePath, options = {}) {
        const startTime = performance.now();
        const cacheKey = this._getCacheKey(filePath, options);

        try {
            this.stats.totalRequests++;

            // Check cache first
            if (this._isCacheValid(cacheKey)) {
                this.stats.cacheHits++;
                const cachedData = this.cache.get(cacheKey);
                this._trackPerformance(filePath, performance.now() - startTime, true);
                return cachedData.data;
            }

            // Check if already loading
            if (this.loadingPromises.has(cacheKey)) {
                return await this.loadingPromises.get(cacheKey);
            }

            // Load with retry logic
            const loadPromise = this._loadWithRetry(filePath, options);
            this.loadingPromises.set(cacheKey, loadPromise);

            const data = await loadPromise;

            // Cache the result
            this._cacheData(cacheKey, data);
            this.loadingPromises.delete(cacheKey);

            this.stats.cacheMisses++;
            this._trackPerformance(filePath, performance.now() - startTime, false);

            return data;

        } catch (error) {
            this.stats.failedRequests++;
            this.loadingPromises.delete(cacheKey);
            this._trackPerformance(filePath, performance.now() - startTime, false, error);
            throw new Error(`Failed to load ${filePath}: ${error.message}`);
        }
    }

    /**
     * Load presentation data
     * @returns {Promise<Object>} Presentation data
     */
    async loadPresentationData() {
        console.log('Loading presentation data...');

        const dataFiles = [
            'data/slides.json',
            'data/sections.json',
            'data/metadata.json',
            'data/visualizations.json'
        ];

        try {
            const [slides, sections, metadata, visualizations] = await Promise.all(
                dataFiles.map(file => this.loadJSON(file))
            );

            return {
                slides: slides.slides || slides,
                sections: sections.sections || sections,
                metadata: metadata,
                visualizations: visualizations.visualizations || visualizations
            };
        } catch (error) {
            throw new Error(`Failed to load presentation data: ${error.message}`);
        }
    }

    /**
     * Load slide-specific data
     * @param {number} slideNumber - Slide number
     * @returns {Promise<Object>} Slide data
     */
    async loadSlideData(slideNumber) {
        const presentationData = await this.loadPresentationData();
        const slide = presentationData.slides.find(s => s.id === slideNumber);

        if (!slide) {
            throw new Error(`Slide ${slideNumber} not found`);
        }

        // Load additional data if needed
        const slideData = {
            ...slide,
            visualizations: presentationData.visualizations.filter(v =>
                v.slideId === slideNumber
            )
        };

        return slideData;
    }

    /**
     * Preload data for better performance
     * @param {string[]} filePaths - Files to preload
     * @returns {Promise<void>}
     */
    async preloadData(filePaths) {
        if (!this.config.enablePreloading) {
            return;
        }

        console.log('Preloading data files:', filePaths);

        const preloadPromises = filePaths.map(async (filePath) => {
            try {
                await this.loadJSON(filePath, { priority: 'low' });
            } catch (error) {
                console.warn(`Failed to preload ${filePath}:`, error.message);
            }
        });

        await Promise.allSettled(preloadPromises);
    }

    /**
     * Fetch data from API endpoint
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} API response data
     */
    async fetchData(endpoint, options = {}) {
        const startTime = performance.now();
        const cacheKey = this._getCacheKey(endpoint, options);

        try {
            this.stats.totalRequests++;

            // Check cache
            if (this._isCacheValid(cacheKey)) {
                this.stats.cacheHits++;
                const cachedData = this.cache.get(cacheKey);
                this._trackPerformance(endpoint, performance.now() - startTime, true);
                return cachedData.data;
            }

            // Fetch with retry
            const response = await this._fetchWithRetry(endpoint, options);
            const data = await response.json();

            // Cache the result
            this._cacheData(cacheKey, data);
            this.stats.cacheMisses++;
            this._trackPerformance(endpoint, performance.now() - startTime, false);

            return data;

        } catch (error) {
            this.stats.failedRequests++;
            this._trackPerformance(endpoint, performance.now() - startTime, false, error);
            throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
        }
    }

    /**
     * Cache data with metadata
     * @param {string} key - Cache key
     * @param {*} data - Data to cache
     */
    cacheData(key, data) {
        this._cacheData(key, data);
    }

    /**
     * Clear cache
     * @param {string} [pattern] - Optional pattern to match keys
     */
    clearCache(pattern = null) {
        if (pattern) {
            const regex = new RegExp(pattern);
            for (const [key] of this.cache) {
                if (regex.test(key)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
        console.log('Cache cleared', pattern ? `for pattern: ${pattern}` : '');
    }

    /**
     * Get performance statistics
     * @returns {Object} Performance stats
     */
    getPerformanceStats() {
        const avgLoadTime = this.stats.totalRequests > 0
            ? this.stats.totalLoadTime / this.stats.totalRequests
            : 0;

        const cacheHitRate = this.stats.totalRequests > 0
            ? (this.stats.cacheHits / this.stats.totalRequests) * 100
            : 0;

        return {
            ...this.stats,
            averageLoadTime: Math.round(avgLoadTime * 100) / 100,
            cacheHitRate: Math.round(cacheHitRate * 100) / 100,
            cacheSize: this.cache.size,
            performanceMetrics: Object.fromEntries(this.performanceMetrics)
        };
    }

    /**
     * Get cache information
     * @returns {Object} Cache info
     */
    getCacheInfo() {
        const cacheEntries = [];
        for (const [key, entry] of this.cache) {
            cacheEntries.push({
                key,
                timestamp: entry.timestamp,
                size: JSON.stringify(entry.data).length,
                isExpired: this._isCacheExpired(entry)
            });
        }

        return {
            size: this.cache.size,
            maxSize: this.config.maxCacheSize,
            entries: cacheEntries
        };
    }

    /**
     * Private method: Load with retry logic
     * @private
     */
    async _loadWithRetry(filePath, options, attempt = 1) {
        try {
            const response = await fetch(filePath, {
                headers: {
                    'Content-Type': 'application/json',
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            if (attempt < this.config.retryAttempts) {
                console.warn(`Retry ${attempt}/${this.config.retryAttempts} for ${filePath}:`, error.message);
                await this._delay(this.config.retryDelay * attempt);
                return this._loadWithRetry(filePath, options, attempt + 1);
            }
            throw error;
        }
    }

    /**
     * Private method: Fetch with retry logic
     * @private
     */
    async _fetchWithRetry(endpoint, options, attempt = 1) {
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return response;

        } catch (error) {
            if (attempt < this.config.retryAttempts) {
                console.warn(`Retry ${attempt}/${this.config.retryAttempts} for ${endpoint}:`, error.message);
                await this._delay(this.config.retryDelay * attempt);
                return this._fetchWithRetry(endpoint, options, attempt + 1);
            }
            throw error;
        }
    }

    /**
     * Private method: Cache data with metadata
     * @private
     */
    _cacheData(key, data) {
        // Clean up old entries if cache is full
        if (this.cache.size >= this.config.maxCacheSize) {
            this._cleanupCache();
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            accessCount: 0
        });
    }

    /**
     * Private method: Check if cache entry is valid
     * @private
     */
    _isCacheValid(key) {
        const entry = this.cache.get(key);
        if (!entry) return false;

        // Update access count
        entry.accessCount++;

        return !this._isCacheExpired(entry);
    }

    /**
     * Private method: Check if cache entry is expired
     * @private
     */
    _isCacheExpired(entry) {
        return Date.now() - entry.timestamp > this.config.cacheTimeout;
    }

    /**
     * Private method: Generate cache key
     * @private
     */
    _getCacheKey(path, options) {
        const optionsKey = Object.keys(options).length > 0
            ? JSON.stringify(options)
            : '';
        return `${path}:${optionsKey}`;
    }

    /**
     * Private method: Clean up expired cache entries
     * @private
     */
    _cleanupCache() {
        const expiredKeys = [];

        for (const [key, entry] of this.cache) {
            if (this._isCacheExpired(entry)) {
                expiredKeys.push(key);
            }
        }

        // Remove expired entries
        expiredKeys.forEach(key => this.cache.delete(key));

        // If still too large, remove least recently used
        if (this.cache.size >= this.config.maxCacheSize) {
            const entries = Array.from(this.cache.entries());
            entries.sort((a, b) => a[1].accessCount - b[1].accessCount);

            const toRemove = entries.slice(0, Math.ceil(this.config.maxCacheSize * 0.2));
            toRemove.forEach(([key]) => this.cache.delete(key));
        }
    }

    /**
     * Private method: Track performance metrics
     * @private
     */
    _trackPerformance(resource, loadTime, fromCache, error = null) {
        this.stats.totalLoadTime += loadTime;

        if (!this.performanceMetrics.has(resource)) {
            this.performanceMetrics.set(resource, {
                requests: 0,
                totalTime: 0,
                errors: 0,
                cacheHits: 0
            });
        }

        const metrics = this.performanceMetrics.get(resource);
        metrics.requests++;
        metrics.totalTime += loadTime;

        if (error) {
            metrics.errors++;
        }

        if (fromCache) {
            metrics.cacheHits++;
        }
    }

    /**
     * Private method: Delay utility
     * @private
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Dispose of resources
     */
    dispose() {
        this.clearCache();
        this.loadingPromises.clear();
        this.performanceMetrics.clear();
        console.log('DataLoader disposed');
    }
}