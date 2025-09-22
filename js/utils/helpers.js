/**
 * Helper Utilities
 * Common utility functions for the presentation system
 */

/**
 * DOM manipulation helpers
 */
export const dom = {
    /**
     * Create element with optional class and content
     */
    createElement: (tag, className, textContent) => {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (textContent) {
            element.textContent = textContent;
        }
        return element;
    },

    /**
     * Find element by selector
     */
    findElement: (selector) => {
        return document.querySelector(selector);
    },

    /**
     * Find all elements by selector
     */
    findElements: (selector) => {
        return document.querySelectorAll(selector);
    },

    /**
     * Add class to element
     */
    addClass: (element, className) => {
        if (element && className) {
            element.classList.add(className);
        }
    },

    /**
     * Remove class from element
     */
    removeClass: (element, className) => {
        if (element && className) {
            element.classList.remove(className);
        }
    },

    /**
     * Toggle class on element
     */
    toggleClass: (element, className) => {
        if (element && className) {
            element.classList.toggle(className);
        }
    },

    /**
     * Check if element has class
     */
    hasClass: (element, className) => {
        return element && element.classList.contains(className);
    },

    /**
     * Set multiple attributes on element
     */
    setAttributes: (element, attributes) => {
        if (element && attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
    },

    /**
     * Remove element from DOM
     */
    removeElement: (element) => {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },

    /**
     * Empty element content
     */
    empty: (element) => {
        if (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    },

    /**
     * Get element position relative to viewport
     */
    getPosition: (element) => {
        if (!element) return { top: 0, left: 0, width: 0, height: 0 };
        return element.getBoundingClientRect();
    },

    /**
     * Check if element is visible in viewport
     */
    isInViewport: (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

/**
 * Animation helpers
 */
export const animation = {
    /**
     * Fade in element
     */
    fadeIn: (element, duration = 300) => {
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            element.style.opacity = '0';
            element.style.display = 'block';

            const startTime = performance.now();
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                element.style.opacity = progress.toString();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    },

    /**
     * Fade out element
     */
    fadeOut: (element, duration = 300) => {
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            const startOpacity = parseFloat(getComputedStyle(element).opacity) || 1;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                element.style.opacity = (startOpacity * (1 - progress)).toString();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    },

    /**
     * Slide transition between elements
     */
    slideTransition: (fromElement, toElement, direction = 'left') => {
        if (!fromElement || !toElement) return Promise.resolve();

        return new Promise((resolve) => {
            const container = fromElement.parentElement;
            const containerWidth = container.offsetWidth;

            // Set initial positions
            const slideDistance = direction === 'left' ? -containerWidth : containerWidth;
            toElement.style.transform = `translateX(${-slideDistance}px)`;
            toElement.style.position = 'absolute';
            toElement.style.top = '0';
            toElement.style.left = '0';
            toElement.style.width = '100%';

            container.appendChild(toElement);

            const duration = 300;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function
                const easeInOut = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                fromElement.style.transform = `translateX(${slideDistance * easeInOut}px)`;
                toElement.style.transform = `translateX(${-slideDistance * (1 - easeInOut)}px)`;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Cleanup
                    fromElement.remove();
                    toElement.style.position = '';
                    toElement.style.transform = '';
                    toElement.style.top = '';
                    toElement.style.left = '';
                    toElement.style.width = '';
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    },

    /**
     * Zoom transition
     */
    zoomTransition: (fromElement, toElement, zoomOut = false) => {
        if (!fromElement || !toElement) return Promise.resolve();

        return new Promise((resolve) => {
            const container = fromElement.parentElement;

            toElement.style.position = 'absolute';
            toElement.style.top = '0';
            toElement.style.left = '0';
            toElement.style.width = '100%';
            toElement.style.transform = zoomOut ? 'scale(1.2)' : 'scale(0.8)';
            toElement.style.opacity = '0';

            container.appendChild(toElement);

            const duration = 300;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function
                const easeInOut = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                // Animate from element
                const fromScale = zoomOut ? 1 + (0.2 * easeInOut) : 1 - (0.2 * easeInOut);
                fromElement.style.transform = `scale(${fromScale})`;
                fromElement.style.opacity = (1 - easeInOut).toString();

                // Animate to element
                const toScale = zoomOut ? 1.2 - (0.2 * easeInOut) : 0.8 + (0.2 * easeInOut);
                toElement.style.transform = `scale(${toScale})`;
                toElement.style.opacity = easeInOut.toString();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Cleanup
                    fromElement.remove();
                    toElement.style.position = '';
                    toElement.style.transform = '';
                    toElement.style.top = '';
                    toElement.style.left = '';
                    toElement.style.width = '';
                    toElement.style.opacity = '';
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    },

    /**
     * Animate element with CSS transforms
     */
    animateTransform: (element, fromTransform, toTransform, duration = 300) => {
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            element.style.transform = fromTransform;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Parse transform values (simplified for common cases)
                if (fromTransform.includes('translateX') && toTransform.includes('translateX')) {
                    const fromValue = parseFloat(fromTransform.match(/translateX\(([^)]+)\)/)[1]);
                    const toValue = parseFloat(toTransform.match(/translateX\(([^)]+)\)/)[1]);
                    const currentValue = fromValue + (toValue - fromValue) * progress;
                    element.style.transform = `translateX(${currentValue}px)`;
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = toTransform;
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }
};

/**
 * Utility functions
 */
export const utils = {
    /**
     * Debounce function calls
     */
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function calls
     */
    throttle: (func, limit) => {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Format number with locale
     */
    formatNumber: (number, locale = 'en-US', options = {}) => {
        try {
            return new Intl.NumberFormat(locale, options).format(number);
        } catch (error) {
            console.warn('Number formatting failed:', error);
            return number.toString();
        }
    },

    /**
     * Format date
     */
    formatDate: (date, format = 'YYYY-MM-DD', locale = 'en-US') => {
        try {
            const dateObj = date instanceof Date ? date : new Date(date);

            if (format === 'YYYY-MM-DD') {
                return dateObj.toISOString().split('T')[0];
            } else if (format === 'YYYY-MM-DD HH:mm') {
                return dateObj.toISOString().slice(0, 16).replace('T', ' ');
            } else {
                return dateObj.toLocaleDateString(locale);
            }
        } catch (error) {
            console.warn('Date formatting failed:', error);
            return date.toString();
        }
    },

    /**
     * Deep clone object
     */
    deepClone: (obj) => {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }

        if (obj instanceof Array) {
            return obj.map(item => utils.deepClone(item));
        }

        if (obj instanceof Map) {
            const cloned = new Map();
            obj.forEach((value, key) => {
                cloned.set(key, utils.deepClone(value));
            });
            return cloned;
        }

        if (obj instanceof Set) {
            const cloned = new Set();
            obj.forEach(value => {
                cloned.add(utils.deepClone(value));
            });
            return cloned;
        }

        if (typeof obj === 'object') {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = utils.deepClone(obj[key]);
            });
            return cloned;
        }

        return obj;
    },

    /**
     * Generate unique ID
     */
    generateId: (prefix = 'id') => {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Convert string to camelCase
     */
    toCamelCase: (str) => {
        return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    },

    /**
     * Convert camelCase to kebab-case
     */
    toKebabCase: (str) => {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    },

    /**
     * Check if value is empty
     */
    isEmpty: (value) => {
        if (value == null) return true;
        if (typeof value === 'string') return value.trim().length === 0;
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    },

    /**
     * Merge objects deeply
     */
    deepMerge: (target, ...sources) => {
        if (!sources.length) return target;
        const source = sources.shift();

        if (utils.isObject(target) && utils.isObject(source)) {
            for (const key in source) {
                if (utils.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    utils.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return utils.deepMerge(target, ...sources);
    },

    /**
     * Check if value is object
     */
    isObject: (item) => {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
};

/**
 * Performance helpers
 */
export const performance = {
    /**
     * Measure function execution time
     */
    measureTime: (label, fn) => {
        const startTime = window.performance.now();
        const result = fn();
        const endTime = window.performance.now();
        const duration = endTime - startTime;

        console.log(`${label}: ${duration.toFixed(2)}ms`);

        if (result instanceof Promise) {
            return result.then(data => {
                const finalTime = window.performance.now();
                console.log(`${label} (async): ${(finalTime - startTime).toFixed(2)}ms`);
                return data;
            });
        }

        return result;
    },

    /**
     * Preload image
     */
    preloadImage: (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
        });
    },

    /**
     * Preload multiple images
     */
    preloadImages: (sources) => {
        return Promise.all(sources.map(src => performance.preloadImage(src)));
    },

    /**
     * Lazy load with intersection observer
     */
    lazy: (fn, threshold = 100) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), threshold);
        };
    },

    /**
     * Request idle callback polyfill
     */
    requestIdleCallback: (callback, options = {}) => {
        if (window.requestIdleCallback) {
            return window.requestIdleCallback(callback, options);
        }

        // Polyfill
        const timeout = options.timeout || 0;
        const startTime = performance.now();

        return setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining() {
                    return Math.max(0, 50 - (performance.now() - startTime));
                }
            });
        }, timeout);
    },

    /**
     * Cancel idle callback
     */
    cancelIdleCallback: (id) => {
        if (window.cancelIdleCallback) {
            return window.cancelIdleCallback(id);
        }
        clearTimeout(id);
    },

    /**
     * Memory usage information
     */
    getMemoryInfo: () => {
        if (window.performance && window.performance.memory) {
            return {
                usedJSHeapSize: window.performance.memory.usedJSHeapSize,
                totalJSHeapSize: window.performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    },

    /**
     * FPS monitoring
     */
    createFPSMonitor: (callback, interval = 1000) => {
        let frames = 0;
        let lastTime = performance.now();

        const monitor = () => {
            frames++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= interval) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                callback(fps);
                frames = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(monitor);
        };

        requestAnimationFrame(monitor);
    }
};

/**
 * Validation helpers
 */
export const validation = {
    /**
     * Validate slide number
     */
    isValidSlideNumber: (slideNumber, totalSlides) => {
        return Number.isInteger(slideNumber) && slideNumber >= 1 && slideNumber <= totalSlides;
    },

    /**
     * Validate section number
     */
    isValidSection: (sectionNumber, totalSections) => {
        return Number.isInteger(sectionNumber) && sectionNumber >= 1 && sectionNumber <= totalSections;
    },

    /**
     * Validate email format
     */
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate URL format
     */
    isValidURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Validate color hex code
     */
    isValidHexColor: (color) => {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexRegex.test(color);
    },

    /**
     * Sanitize HTML to prevent XSS
     */
    sanitizeHTML: (html) => {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    },

    /**
     * Validate JSON string
     */
    isValidJSON: (str) => {
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    }
};

/**
 * Browser compatibility helpers
 */
export const browser = {
    /**
     * Check if feature is supported
     */
    supports: {
        localStorage: typeof(Storage) !== 'undefined',
        sessionStorage: typeof(sessionStorage) !== 'undefined',
        fullscreen: document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled,
        touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        webGL: (() => {
            try {
                const canvas = document.createElement('canvas');
                return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
            } catch {
                return false;
            }
        })(),
        worker: typeof(Worker) !== 'undefined',
        serviceWorker: 'serviceWorker' in navigator,
        intersectionObserver: 'IntersectionObserver' in window,
        resizeObserver: 'ResizeObserver' in window
    },

    /**
     * Get browser information
     */
    getBrowserInfo: () => {
        const ua = navigator.userAgent;
        const browsers = {
            chrome: /Chrome/i.test(ua) && !/Edge/i.test(ua),
            firefox: /Firefox/i.test(ua),
            safari: /Safari/i.test(ua) && !/Chrome/i.test(ua),
            edge: /Edge/i.test(ua),
            ie: /MSIE|Trident/i.test(ua),
            opera: /Opera/i.test(ua)
        };

        const browser = Object.keys(browsers).find(key => browsers[key]) || 'unknown';

        return {
            name: browser,
            userAgent: ua,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    }
};

// Export all helpers as default
export default {
    dom,
    animation,
    utils,
    performance,
    validation,
    browser
};