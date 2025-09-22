/**
 * State Manager
 * Manages application state and provides state persistence
 */

import { TOTAL_SLIDES, TOTAL_SECTIONS } from '../utils/constants.js';

export class StateManager {
    constructor() {
        // Core application state
        this.state = {
            currentSlide: 1,
            currentLanguage: 'ko',
            isPaused: false,
            isFullscreen: false,
            isPresentationMode: false,
            transition: 'fade',
            autoAdvance: false,
            autoAdvanceDelay: 5000,
            lastUpdateTime: Date.now(),
            sessionId: this.generateSessionId(),
            version: '1.0.0'
        };

        // Session state
        this.sessionState = {
            slideHistory: [],
            navigationHistory: [],
            bookmarks: new Map(),
            preferences: {
                theme: 'default',
                fontSize: 'medium',
                contrast: 'normal',
                animations: true,
                soundEnabled: true
            },
            performance: {
                loadTimes: [],
                navigationTimes: [],
                errorCount: 0,
                sessionDuration: 0
            }
        };

        // Persistent storage keys
        this.storageKeys = {
            state: 'familyPlanning_appState',
            session: 'familyPlanning_sessionState',
            bookmarks: 'familyPlanning_bookmarks',
            preferences: 'familyPlanning_preferences',
            history: 'familyPlanning_history'
        };

        // Auto-save configuration
        this.autoSaveEnabled = true;
        this.autoSaveInterval = 30000; // 30 seconds
        this.autoSaveTimer = null;

        // Event listeners
        this.eventListeners = new Map();

        // Recovery system
        this.recoveryEnabled = true;
        this.lastValidState = null;

        // Initialization
        this.initialize();

        console.log('StateManager initialized with session ID:', this.state.sessionId);
    }

    /**
     * Initialize state manager
     */
    initialize() {
        try {
            // Load saved state
            this.loadState();

            // Start auto-save if enabled
            if (this.autoSaveEnabled) {
                this.startAutoSave();
            }

            // Add window events for state persistence
            this.addWindowEventListeners();

            // Recovery mechanism
            this.saveRecoveryPoint();

            console.log('StateManager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize StateManager:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get current application state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Get session state
     */
    getSessionState() {
        return {
            ...this.sessionState,
            bookmarks: Array.from(this.sessionState.bookmarks.entries())
        };
    }

    /**
     * Set application state
     */
    setState(newState, persist = true) {
        try {
            // Validate state before updating
            const validatedState = this.validateState(newState);

            // Merge with existing state
            const previousState = { ...this.state };
            this.state = {
                ...this.state,
                ...validatedState,
                lastUpdateTime: Date.now()
            };

            // Emit state change event
            this.emit('stateChanged', {
                newState: this.state,
                previousState: previousState,
                changes: validatedState
            });

            // Auto-save if enabled
            if (persist && this.autoSaveEnabled) {
                this.saveState();
            }

            return true;
        } catch (error) {
            console.error('Failed to set state:', error);
            this.handleStateError(error);
            return false;
        }
    }

    /**
     * Update session state
     */
    setSessionState(newSessionState, persist = true) {
        try {
            const previousSessionState = { ...this.sessionState };

            // Handle bookmarks separately (convert array to Map if needed)
            if (newSessionState.bookmarks) {
                if (Array.isArray(newSessionState.bookmarks)) {
                    this.sessionState.bookmarks = new Map(newSessionState.bookmarks);
                } else if (newSessionState.bookmarks instanceof Map) {
                    this.sessionState.bookmarks = new Map(newSessionState.bookmarks);
                }
                delete newSessionState.bookmarks;
            }

            // Merge session state
            this.sessionState = {
                ...this.sessionState,
                ...newSessionState
            };

            // Emit session state change event
            this.emit('sessionStateChanged', {
                newSessionState: this.sessionState,
                previousSessionState: previousSessionState
            });

            // Auto-save if enabled
            if (persist && this.autoSaveEnabled) {
                this.saveSessionState();
            }

            return true;
        } catch (error) {
            console.error('Failed to set session state:', error);
            return false;
        }
    }

    /**
     * Set paused state
     */
    setPaused(paused) {
        return this.setState({ isPaused: paused });
    }

    /**
     * Set fullscreen state
     */
    setFullscreen(isFullscreen) {
        return this.setState({ isFullscreen });
    }

    /**
     * Set presentation mode
     */
    setPresentationMode(isPresentationMode) {
        return this.setState({ isPresentationMode });
    }

    /**
     * Set current slide
     */
    setCurrentSlide(slideNumber) {
        if (this.isValidSlideNumber(slideNumber)) {
            return this.setState({ currentSlide: slideNumber });
        }
        return false;
    }

    /**
     * Set current language
     */
    setLanguage(language) {
        if (['ko', 'en'].includes(language)) {
            return this.setState({ currentLanguage: language });
        }
        return false;
    }

    /**
     * Set transition type
     */
    setTransition(transition) {
        const validTransitions = ['fade', 'slide', 'zoom'];
        if (validTransitions.includes(transition)) {
            return this.setState({ transition });
        }
        return false;
    }

    /**
     * Add slide to history
     */
    addToSlideHistory(slideNumber) {
        const history = [...this.sessionState.slideHistory];
        history.push({
            slideNumber,
            timestamp: Date.now(),
            sessionId: this.state.sessionId
        });

        // Limit history size
        if (history.length > 100) {
            history.splice(0, history.length - 100);
        }

        return this.setSessionState({ slideHistory: history });
    }

    /**
     * Add navigation action to history
     */
    addToNavigationHistory(action, slideNumber, details = {}) {
        const history = [...this.sessionState.navigationHistory];
        history.push({
            action,
            slideNumber,
            timestamp: Date.now(),
            sessionId: this.state.sessionId,
            details
        });

        // Limit history size
        if (history.length > 200) {
            history.splice(0, history.length - 200);
        }

        return this.setSessionState({ navigationHistory: history });
    }

    /**
     * Bookmark management
     */
    addBookmark(name, slideNumber = this.state.currentSlide, description = '') {
        try {
            const bookmarks = new Map(this.sessionState.bookmarks);
            bookmarks.set(name, {
                slideNumber,
                description,
                timestamp: Date.now(),
                sessionId: this.state.sessionId
            });

            this.setSessionState({ bookmarks });
            this.emit('bookmarkAdded', { name, slideNumber, description });
            return true;
        } catch (error) {
            console.error('Failed to add bookmark:', error);
            return false;
        }
    }

    removeBookmark(name) {
        try {
            const bookmarks = new Map(this.sessionState.bookmarks);
            const removed = bookmarks.delete(name);

            if (removed) {
                this.setSessionState({ bookmarks });
                this.emit('bookmarkRemoved', { name });
            }

            return removed;
        } catch (error) {
            console.error('Failed to remove bookmark:', error);
            return false;
        }
    }

    getBookmarks() {
        return Array.from(this.sessionState.bookmarks.entries()).map(([name, data]) => ({
            name,
            ...data
        }));
    }

    getBookmark(name) {
        return this.sessionState.bookmarks.get(name);
    }

    /**
     * Preferences management
     */
    setPreference(key, value) {
        const preferences = {
            ...this.sessionState.preferences,
            [key]: value
        };

        const success = this.setSessionState({ preferences });

        if (success) {
            this.emit('preferenceChanged', { key, value, preferences });
        }

        return success;
    }

    getPreference(key) {
        return this.sessionState.preferences[key];
    }

    getAllPreferences() {
        return { ...this.sessionState.preferences };
    }

    resetPreferences() {
        const defaultPreferences = {
            theme: 'default',
            fontSize: 'medium',
            contrast: 'normal',
            animations: true,
            soundEnabled: true
        };

        return this.setSessionState({ preferences: defaultPreferences });
    }

    /**
     * Performance tracking
     */
    addPerformanceMetric(type, value, details = {}) {
        const performance = { ...this.sessionState.performance };

        switch (type) {
            case 'loadTime':
                performance.loadTimes.push({ value, timestamp: Date.now(), details });
                break;
            case 'navigationTime':
                performance.navigationTimes.push({ value, timestamp: Date.now(), details });
                break;
            case 'error':
                performance.errorCount++;
                break;
        }

        return this.setSessionState({ performance });
    }

    getPerformanceMetrics() {
        const performance = { ...this.sessionState.performance };

        // Calculate session duration
        performance.sessionDuration = Date.now() - (this.state.sessionId.split('_')[1] || Date.now());

        // Calculate averages
        if (performance.loadTimes.length > 0) {
            performance.averageLoadTime = performance.loadTimes.reduce((sum, item) => sum + item.value, 0) / performance.loadTimes.length;
        }

        if (performance.navigationTimes.length > 0) {
            performance.averageNavigationTime = performance.navigationTimes.reduce((sum, item) => sum + item.value, 0) / performance.navigationTimes.length;
        }

        return performance;
    }

    /**
     * State persistence
     */
    saveState() {
        try {
            if (typeof Storage === 'undefined') {
                console.warn('localStorage not available');
                return false;
            }

            // Save main state
            localStorage.setItem(this.storageKeys.state, JSON.stringify(this.state));

            // Save session state (excluding sensitive data)
            const sessionStateToSave = {
                ...this.sessionState,
                bookmarks: Array.from(this.sessionState.bookmarks.entries()),
                // Limit history size for storage
                slideHistory: this.sessionState.slideHistory.slice(-50),
                navigationHistory: this.sessionState.navigationHistory.slice(-100)
            };

            localStorage.setItem(this.storageKeys.session, JSON.stringify(sessionStateToSave));

            // Save individual components for better recovery
            localStorage.setItem(this.storageKeys.bookmarks, JSON.stringify(Array.from(this.sessionState.bookmarks.entries())));
            localStorage.setItem(this.storageKeys.preferences, JSON.stringify(this.sessionState.preferences));

            this.emit('stateSaved', { timestamp: Date.now() });
            return true;
        } catch (error) {
            console.error('Failed to save state:', error);
            this.handleSaveError(error);
            return false;
        }
    }

    saveSessionState() {
        try {
            if (typeof Storage === 'undefined') {
                return false;
            }

            const sessionStateToSave = {
                ...this.sessionState,
                bookmarks: Array.from(this.sessionState.bookmarks.entries())
            };

            localStorage.setItem(this.storageKeys.session, JSON.stringify(sessionStateToSave));
            return true;
        } catch (error) {
            console.error('Failed to save session state:', error);
            return false;
        }
    }

    loadState() {
        try {
            if (typeof Storage === 'undefined') {
                console.warn('localStorage not available, using default state');
                return false;
            }

            // Load main state
            const savedState = localStorage.getItem(this.storageKeys.state);
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                const validatedState = this.validateState(parsedState);

                // Preserve session ID for new session
                validatedState.sessionId = this.state.sessionId;
                validatedState.lastUpdateTime = Date.now();

                this.state = { ...this.state, ...validatedState };
            }

            // Load session state
            const savedSessionState = localStorage.getItem(this.storageKeys.session);
            if (savedSessionState) {
                const parsedSessionState = JSON.parse(savedSessionState);

                // Convert bookmarks array back to Map
                if (parsedSessionState.bookmarks) {
                    parsedSessionState.bookmarks = new Map(parsedSessionState.bookmarks);
                }

                this.sessionState = { ...this.sessionState, ...parsedSessionState };
            }

            // Load bookmarks separately for recovery
            this.loadBookmarks();

            // Load preferences separately
            this.loadPreferences();

            this.emit('stateLoaded', {
                state: this.state,
                sessionState: this.sessionState
            });

            return true;
        } catch (error) {
            console.error('Failed to load state:', error);
            this.handleLoadError(error);
            return false;
        }
    }

    loadBookmarks() {
        try {
            const savedBookmarks = localStorage.getItem(this.storageKeys.bookmarks);
            if (savedBookmarks) {
                const bookmarks = new Map(JSON.parse(savedBookmarks));
                this.sessionState.bookmarks = bookmarks;
            }
        } catch (error) {
            console.warn('Failed to load bookmarks:', error);
        }
    }

    loadPreferences() {
        try {
            const savedPreferences = localStorage.getItem(this.storageKeys.preferences);
            if (savedPreferences) {
                const preferences = JSON.parse(savedPreferences);
                this.sessionState.preferences = { ...this.sessionState.preferences, ...preferences };
            }
        } catch (error) {
            console.warn('Failed to load preferences:', error);
        }
    }

    /**
     * Clear all saved state
     */
    clearSavedState() {
        try {
            if (typeof Storage === 'undefined') {
                return false;
            }

            Object.values(this.storageKeys).forEach(key => {
                localStorage.removeItem(key);
            });

            this.emit('stateCleared', { timestamp: Date.now() });
            return true;
        } catch (error) {
            console.error('Failed to clear saved state:', error);
            return false;
        }
    }

    /**
     * Reset state to defaults
     */
    resetState() {
        const defaultState = {
            currentSlide: 1,
            currentLanguage: 'ko',
            isPaused: false,
            isFullscreen: false,
            isPresentationMode: false,
            transition: 'fade',
            autoAdvance: false,
            autoAdvanceDelay: 5000,
            lastUpdateTime: Date.now(),
            sessionId: this.generateSessionId(),
            version: '1.0.0'
        };

        const defaultSessionState = {
            slideHistory: [],
            navigationHistory: [],
            bookmarks: new Map(),
            preferences: {
                theme: 'default',
                fontSize: 'medium',
                contrast: 'normal',
                animations: true,
                soundEnabled: true
            },
            performance: {
                loadTimes: [],
                navigationTimes: [],
                errorCount: 0,
                sessionDuration: 0
            }
        };

        this.state = defaultState;
        this.sessionState = defaultSessionState;

        this.emit('stateReset', { timestamp: Date.now() });
        return true;
    }

    /**
     * Export state for backup
     */
    exportState() {
        try {
            const exportData = {
                state: this.state,
                sessionState: {
                    ...this.sessionState,
                    bookmarks: Array.from(this.sessionState.bookmarks.entries())
                },
                metadata: {
                    exportTimestamp: Date.now(),
                    version: this.state.version
                }
            };

            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('Failed to export state:', error);
            return null;
        }
    }

    /**
     * Import state from backup
     */
    importState(importData) {
        try {
            const parsedData = typeof importData === 'string' ? JSON.parse(importData) : importData;

            if (parsedData.state) {
                const validatedState = this.validateState(parsedData.state);
                this.state = { ...this.state, ...validatedState };
            }

            if (parsedData.sessionState) {
                const sessionState = parsedData.sessionState;

                // Convert bookmarks array back to Map
                if (sessionState.bookmarks) {
                    sessionState.bookmarks = new Map(sessionState.bookmarks);
                }

                this.sessionState = { ...this.sessionState, ...sessionState };
            }

            this.emit('stateImported', {
                metadata: parsedData.metadata,
                timestamp: Date.now()
            });

            return true;
        } catch (error) {
            console.error('Failed to import state:', error);
            return false;
        }
    }

    /**
     * Auto-save functionality
     */
    startAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }

        this.autoSaveTimer = setInterval(() => {
            this.saveState();
        }, this.autoSaveInterval);

        console.log(`Auto-save started with interval: ${this.autoSaveInterval}ms`);
    }

    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    setAutoSaveInterval(interval) {
        this.autoSaveInterval = interval;
        if (this.autoSaveEnabled) {
            this.startAutoSave();
        }
    }

    /**
     * Recovery system
     */
    saveRecoveryPoint() {
        this.lastValidState = {
            state: { ...this.state },
            sessionState: {
                ...this.sessionState,
                bookmarks: new Map(this.sessionState.bookmarks)
            },
            timestamp: Date.now()
        };
    }

    recoverFromLastValidState() {
        if (this.lastValidState && this.recoveryEnabled) {
            this.state = { ...this.lastValidState.state };
            this.sessionState = {
                ...this.lastValidState.sessionState,
                bookmarks: new Map(this.lastValidState.sessionState.bookmarks)
            };

            this.emit('stateRecovered', {
                recoveryTimestamp: this.lastValidState.timestamp,
                currentTimestamp: Date.now()
            });

            return true;
        }
        return false;
    }

    /**
     * Window event listeners
     */
    addWindowEventListeners() {
        // Save state before page unload
        const beforeUnloadHandler = () => {
            this.saveState();
        };

        // Handle visibility change
        const visibilityChangeHandler = () => {
            if (document.hidden) {
                this.saveState();
            }
        };

        window.addEventListener('beforeunload', beforeUnloadHandler);
        document.addEventListener('visibilitychange', visibilityChangeHandler);

        this.eventListeners.set('beforeunload', beforeUnloadHandler);
        this.eventListeners.set('visibilitychange', visibilityChangeHandler);
    }

    /**
     * Validation helpers
     */
    validateState(state) {
        const validatedState = {};

        // Validate and clean state properties
        if (typeof state.currentSlide === 'number' && this.isValidSlideNumber(state.currentSlide)) {
            validatedState.currentSlide = state.currentSlide;
        }

        if (['ko', 'en'].includes(state.currentLanguage)) {
            validatedState.currentLanguage = state.currentLanguage;
        }

        if (typeof state.isPaused === 'boolean') {
            validatedState.isPaused = state.isPaused;
        }

        if (typeof state.isFullscreen === 'boolean') {
            validatedState.isFullscreen = state.isFullscreen;
        }

        if (typeof state.isPresentationMode === 'boolean') {
            validatedState.isPresentationMode = state.isPresentationMode;
        }

        if (['fade', 'slide', 'zoom'].includes(state.transition)) {
            validatedState.transition = state.transition;
        }

        if (typeof state.autoAdvance === 'boolean') {
            validatedState.autoAdvance = state.autoAdvance;
        }

        if (typeof state.autoAdvanceDelay === 'number' && state.autoAdvanceDelay > 0) {
            validatedState.autoAdvanceDelay = state.autoAdvanceDelay;
        }

        return validatedState;
    }

    isValidSlideNumber(slideNumber) {
        return Number.isInteger(slideNumber) && slideNumber >= 1 && slideNumber <= TOTAL_SLIDES;
    }

    /**
     * Error handlers
     */
    handleInitializationError(error) {
        console.error('StateManager initialization failed:', error);
        // Use default state and continue
        this.resetState();
    }

    handleStateError(error) {
        console.error('State operation failed:', error);
        if (this.recoveryEnabled) {
            this.recoverFromLastValidState();
        }
    }

    handleSaveError(error) {
        console.error('State save failed:', error);
        this.emit('saveError', { error: error.message, timestamp: Date.now() });
    }

    handleLoadError(error) {
        console.error('State load failed:', error);
        this.emit('loadError', { error: error.message, timestamp: Date.now() });
        // Clear corrupted data and use defaults
        this.clearSavedState();
        this.resetState();
    }

    /**
     * Event system
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in state event listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Save final state
        this.saveState();

        // Stop auto-save
        this.stopAutoSave();

        // Remove window event listeners
        for (const [eventType, handler] of this.eventListeners.entries()) {
            if (eventType === 'beforeunload') {
                window.removeEventListener(eventType, handler);
            } else if (eventType === 'visibilitychange') {
                document.removeEventListener(eventType, handler);
            }
        }

        // Clear event listeners
        this.eventListeners.clear();

        console.log('StateManager destroyed');
    }
}