/**
 * Citation Manager
 * Handles academic citations and bibliography management fulfilling ICitationManager contract
 */

import { DataLoader } from './DataLoader.js';

// Citation Types
export const CitationType = {
    DIRECT_QUOTE: 'direct_quote',
    DATA_POINT: 'data_point',
    STATISTICAL: 'statistical',
    TABLE: 'table',
    FIGURE: 'figure',
    PANEL: 'panel'
};

// Citation Formats
export const CitationFormat = {
    INLINE: 'inline',      // (p.1810)
    FOOTNOTE: 'footnote',  // ¹ See page 1810
    TOOLTIP: 'tooltip',    // Hover display
    FULL: 'full'          // Complete citation
};

// Export Formats
export const ExportFormat = {
    JSON: 'json',
    CSV: 'csv',
    BIBTEX: 'bibtex',
    MARKDOWN: 'markdown'
};

export class CitationManager {
    constructor(dataLoader) {
        if (!dataLoader) {
            throw new Error('CitationManager requires a DataLoader instance.');
        }
        this.citations = new Map();
        this.slideIndex = new Map(); // slideId -> citationIds[]
        this.pageIndex = new Map();  // pageNumber -> citationIds[]
        this.elementLinks = new Map(); // citationId -> elementId

        this.dataLoader = dataLoader;
        this.currentTooltip = null;
        this.config = {};

        this.isInitialized = false;

        console.log('CitationManager initialized');
    }

    /**
     * Initialize the citation manager
     * @param {Object} config - Configuration object
     * @param {string} config.dataPath - Path to citation data
     * @param {string} config.locale - Default locale (en, ko)
     * @param {boolean} config.validateOnLoad - Validate citations on load
     * @returns {Promise<void>}
     */
    async initialize(config) {
        this.config = {
            dataPath: config.dataPath || 'data/citations.json',
            locale: config.locale || 'en',
            validateOnLoad: config.validateOnLoad ?? true,
            tooltipDelay: config.tooltipDelay || 500,
            enableTooltips: config.enableTooltips ?? true,
            ...config
        };
        
        // DataLoader is now injected via constructor.
        // loadCitations will be called externally.

        this.isInitialized = true;
        console.log('CitationManager configured.');
    }

    /**
     * Load citations from data source
     * @param {string} [source] - Optional specific source file
     * @returns {Promise<number>} Number of citations loaded
     */
    async loadCitations(source) {
        const citationFile = source || this.config.dataPath;

        try {
            const data = await this.dataLoader.loadJSON(citationFile);
            const citationsArray = data.citations || [];

            // Clear existing data
            this.citations.clear();
            this.slideIndex.clear();
            this.pageIndex.clear();

            // Process each citation
            for (const citation of citationsArray) {
                this._processCitation(citation);
            }

            // Validate if required
            if (this.config.validateOnLoad) {
                const validation = this.validateAllCitations();
                if (!validation.valid) {
                    console.warn('Citation validation warnings:', validation.errors);
                }
            }

            console.log(`Loaded ${this.citations.size} citations from ${citationFile}`);
            return this.citations.size;

        } catch (error) {
            console.error('Failed to load citations:', error);
            throw new Error(`Failed to load citations: ${error.message}`);
        }
    }

    /**
     * Get all citations for a specific slide
     * @param {number} slideId - Slide identifier
     * @returns {Citation[]} Array of citations
     */
    getCitationsBySlide(slideId) {
        const citationIds = this.slideIndex.get(slideId) || [];
        return citationIds.map(id => this.citations.get(id)).filter(Boolean);
    }

    /**
     * Get citation by ID
     * @param {string} citationId - Citation identifier
     * @returns {Citation} Citation object
     */
    getCitationById(citationId) {
        return this.citations.get(citationId) || null;
    }

    /**
     * Get citations by PDF page number
     * @param {string} pageNumber - Page number (e.g., "p.1810")
     * @returns {Citation[]} Array of citations from that page
     */
    getCitationsByPage(pageNumber) {
        const normalizedPage = this._normalizePageNumber(pageNumber);
        const citationIds = this.pageIndex.get(normalizedPage) || [];
        return citationIds.map(id => this.citations.get(id)).filter(Boolean);
    }

    /**
     * Format citation for display
     * @param {Citation} citation - Citation object
     * @param {string} format - Format type ('inline', 'footnote', 'tooltip')
     * @param {string} [locale] - Locale for formatting
     * @returns {string} Formatted citation text
     */
    formatCitation(citation, format = 'inline', locale) {
        if (!citation) return '';

        const currentLocale = locale || this.config.locale;

        switch (format) {
            case CitationFormat.INLINE:
                return this._formatInline(citation);

            case CitationFormat.FOOTNOTE:
                return this._formatFootnote(citation, currentLocale);

            case CitationFormat.TOOLTIP:
                return this._formatTooltip(citation, currentLocale);

            case CitationFormat.FULL:
                return this._formatFull(citation, currentLocale);

            default:
                return this._formatInline(citation);
        }
    }

    /**
     * Validate page number format
     * @param {string} pageNumber - Page number to validate
     * @returns {boolean} Validation result
     */
    validatePageNumber(pageNumber) {
        if (!pageNumber || typeof pageNumber !== 'string') {
            return false;
        }

        // Valid formats: p.1810, Table 1 p.1813, Figure 1 p.1816, Panel A p.1818
        const pagePatterns = [
            /^p\.\d+$/,                           // p.1810
            /^Table \d+ p\.\d+$/,                 // Table 1 p.1813
            /^Figure \d+ p\.\d+$/,                // Figure 1 p.1816
            /^Panel [A-Z] p\.\d+$/,               // Panel A p.1818
            /^p\.\d+-\d+$/,                       // p.1814-1815 (page range)
            /^Appendix [A-Z] p\.\d+$/,            // Appendix A p.1825
            /^Box \d+ p\.\d+$/                    // Box 1 p.1817
        ];

        return pagePatterns.some(pattern => pattern.test(pageNumber));
    }

    /**
     * Show citation tooltip on element hover
     * @param {HTMLElement} element - Target element
     * @param {string} citationId - Citation to show
     * @returns {void}
     */
    showCitationTooltip(element, citationId) {
        if (!this.config.enableTooltips) return;

        this.hideCitationTooltip(); // Hide any existing tooltip

        const citation = this.getCitationById(citationId);
        if (!citation) return;

        const tooltip = this._createTooltipElement(citation);
        if (!tooltip) return;

        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;

        // Position tooltip
        this._positionTooltip(tooltip, element);

        // Add event listeners for auto-hide
        this._setupTooltipEvents(tooltip, element);
    }

    /**
     * Hide citation tooltip
     * @returns {void}
     */
    hideCitationTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    /**
     * Link citation to visualization element
     * @param {string} citationId - Citation identifier
     * @param {string} elementId - Visualization element ID
     * @returns {void}
     */
    linkToElement(citationId, elementId) {
        this.elementLinks.set(citationId, elementId);

        // Update citation object
        const citation = this.getCitationById(citationId);
        if (citation) {
            citation.elementId = elementId;
        }

        console.log(`Linked citation ${citationId} to element ${elementId}`);
    }

    /**
     * Search citations by text
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @param {boolean} options.caseSensitive - Case sensitive search
     * @param {boolean} options.exactMatch - Exact match only
     * @returns {Citation[]} Matching citations
     */
    searchCitations(query, options = {}) {
        if (!query || typeof query !== 'string') {
            return Array.from(this.citations.values());
        }

        const { caseSensitive = false, exactMatch = false } = options;
        const searchQuery = caseSensitive ? query : query.toLowerCase();
        const results = [];

        for (const citation of this.citations.values()) {
            if (this._matchesCitation(citation, searchQuery, { caseSensitive, exactMatch })) {
                results.push(citation);
            }
        }

        return results;
    }

    /**
     * Validate all citations
     * @returns {ValidationResult} Validation results
     */
    validateAllCitations() {
        const errors = [];
        let validCount = 0;

        for (const citation of this.citations.values()) {
            const citationErrors = this._validateCitation(citation);
            if (citationErrors.length === 0) {
                validCount++;
            } else {
                errors.push(...citationErrors);
            }
        }

        return {
            valid: errors.length === 0,
            totalCitations: this.citations.size,
            validCitations: validCount,
            errors
        };
    }

    /**
     * Export citations in various formats
     * @param {string} format - Export format ('json', 'csv', 'bibtex')
     * @param {number[]} [slideIds] - Specific slides to export
     * @returns {string} Exported data
     */
    exportCitations(format, slideIds) {
        let citationsToExport;

        if (slideIds && slideIds.length > 0) {
            citationsToExport = [];
            for (const slideId of slideIds) {
                citationsToExport.push(...this.getCitationsBySlide(slideId));
            }
        } else {
            citationsToExport = Array.from(this.citations.values());
        }

        switch (format) {
            case ExportFormat.JSON:
                return this._exportJSON(citationsToExport);

            case ExportFormat.CSV:
                return this._exportCSV(citationsToExport);

            case ExportFormat.BIBTEX:
                return this._exportBibTeX(citationsToExport);

            case ExportFormat.MARKDOWN:
                return this._exportMarkdown(citationsToExport);

            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    /**
     * Get citation statistics
     * @returns {CitationStats} Statistics object
     */
    getStatistics() {
        const totalCitations = this.citations.size;
        const typeCount = {};
        const pageCount = {};
        let translatedCount = 0;

        for (const citation of this.citations.values()) {
            // Count by type
            const type = citation.type || 'unknown';
            typeCount[type] = (typeCount[type] || 0) + 1;

            // Count by page
            const page = citation.pageReference || 'unknown';
            pageCount[page] = (pageCount[page] || 0) + 1;

            // Count translations
            if (citation.content && citation.content.ko) {
                translatedCount++;
            }
        }

        const slideCount = this.slideIndex.size;
        const avgPerSlide = slideCount > 0 ? totalCitations / slideCount : 0;

        return {
            total: totalCitations,
            bySlide: Math.round(avgPerSlide * 100) / 100,
            byType: typeCount,
            byPage: pageCount,
            translated: translatedCount
        };
    }

    /**
     * Dispose of resources
     * @returns {void}
     */
    dispose() {
        this.hideCitationTooltip();
        this.citations.clear();
        this.slideIndex.clear();
        this.pageIndex.clear();
        this.elementLinks.clear();

        if (this.dataLoader) {
            this.dataLoader.dispose();
        }

        this.isInitialized = false;
        console.log('CitationManager disposed');
    }

    // Private methods

    /**
     * Process and index a citation
     * @private
     */
    _processCitation(citation) {
        // Ensure required fields
        if (!citation.id) {
            console.warn('Citation missing ID:', citation);
            return;
        }

        // Enhance citation object
        const processedCitation = {
            id: citation.id,
            type: citation.type || CitationType.DIRECT_QUOTE,
            title: citation.title || '',
            authors: citation.authors || [],
            journal: citation.journal || citation.source || '',
            volume: citation.volume,
            issue: citation.issue,
            pages: citation.pages,
            year: citation.year,
            doi: citation.doi,
            pageReference: citation.pageReference || '',
            content: citation.content || {},
            slideId: citation.slideId,
            elementId: citation.elementId,
            ...citation
        };

        // Store citation
        this.citations.set(citation.id, processedCitation);

        // Index by slide
        if (processedCitation.slideId) {
            const slideIds = Array.isArray(processedCitation.slideId)
                ? processedCitation.slideId
                : [processedCitation.slideId];

            for (const slideId of slideIds) {
                if (!this.slideIndex.has(slideId)) {
                    this.slideIndex.set(slideId, []);
                }
                this.slideIndex.get(slideId).push(citation.id);
            }
        }

        // Index by page
        if (processedCitation.pageReference) {
            const normalizedPage = this._normalizePageNumber(processedCitation.pageReference);
            if (!this.pageIndex.has(normalizedPage)) {
                this.pageIndex.set(normalizedPage, []);
            }
            this.pageIndex.get(normalizedPage).push(citation.id);
        }
    }

    /**
     * Normalize page number for indexing
     * @private
     */
    _normalizePageNumber(pageNumber) {
        if (!pageNumber) return '';
        // Extract just the page number for indexing
        const match = pageNumber.match(/p\.(\d+)/);
        return match ? `p.${match[1]}` : pageNumber;
    }

    /**
     * Format citation inline
     * @private
     */
    _formatInline(citation) {
        return `(${citation.pageReference || 'p.???'})`;
    }

    /**
     * Format citation as footnote
     * @private
     */
    _formatFootnote(citation, locale) {
        const content = this._getCitationContent(citation, locale);
        const pageRef = citation.pageReference || 'p.???';
        return `See ${pageRef}${content ? ': ' + content : ''}`;
    }

    /**
     * Format citation for tooltip
     * @private
     */
    _formatTooltip(citation, locale) {
        const content = this._getCitationContent(citation, locale);
        const title = citation.title || 'Untitled';
        const pageRef = citation.pageReference || 'p.???';

        let tooltip = `<strong>${title}</strong><br>`;
        if (content) {
            tooltip += `${content}<br>`;
        }
        tooltip += `<em>${pageRef}</em>`;

        return tooltip;
    }

    /**
     * Format full citation
     * @private
     */
    _formatFull(citation, locale) {
        const content = this._getCitationContent(citation, locale);
        let full = '';

        if (citation.authors && citation.authors.length > 0) {
            full += citation.authors.join(', ') + '. ';
        }

        if (citation.title) {
            full += `"${citation.title}." `;
        }

        if (citation.journal) {
            full += `${citation.journal}`;
        }

        if (citation.volume) {
            full += ` ${citation.volume}`;
        }

        if (citation.issue) {
            full += ` (${citation.issue})`;
        }

        if (citation.year) {
            full += ` (${citation.year})`;
        }

        if (citation.pages) {
            full += `: ${citation.pages}`;
        }

        if (citation.pageReference) {
            full += `. ${citation.pageReference}`;
        }

        if (content) {
            full += ` - ${content}`;
        }

        return full;
    }

    /**
     * Get content in specified locale
     * @private
     */
    _getCitationContent(citation, locale) {
        if (!citation.content) return '';

        if (locale === 'ko' && citation.content.ko) {
            return citation.content.ko;
        }

        return citation.content.en || citation.content[Object.keys(citation.content)[0]] || '';
    }

    /**
     * Create tooltip element
     * @private
     */
    _createTooltipElement(citation) {
        const tooltip = document.createElement('div');
        tooltip.className = 'citation-tooltip';
        tooltip.innerHTML = this.formatCitation(citation, CitationFormat.TOOLTIP);

        // Add CSS styles
        Object.assign(tooltip.style, {
            position: 'absolute',
            background: '#333',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            maxWidth: '300px',
            zIndex: '10000',
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        // Fade in
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);

        return tooltip;
    }

    /**
     * Position tooltip relative to element
     * @private
     */
    _positionTooltip(tooltip, element) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;

        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }

        if (top < 10) {
            top = rect.bottom + 10;
        }

        tooltip.style.left = `${left + window.scrollX}px`;
        tooltip.style.top = `${top + window.scrollY}px`;
    }

    /**
     * Setup tooltip event handlers
     * @private
     */
    _setupTooltipEvents(tooltip, element) {
        const hideTooltip = () => {
            this.hideCitationTooltip();
        };

        // Hide on mouse leave
        element.addEventListener('mouseleave', hideTooltip);

        // Hide on scroll
        window.addEventListener('scroll', hideTooltip, { once: true });

        // Hide on click elsewhere
        document.addEventListener('click', hideTooltip, { once: true });
    }

    /**
     * Check if citation matches search query
     * @private
     */
    _matchesCitation(citation, query, options) {
        const { caseSensitive, exactMatch } = options;

        const searchFields = [
            citation.title,
            citation.journal,
            citation.pageReference,
            ...(citation.authors || []),
            citation.content?.en,
            citation.content?.ko
        ].filter(Boolean);

        for (const field of searchFields) {
            const fieldValue = caseSensitive ? field : field.toLowerCase();

            if (exactMatch) {
                if (fieldValue === query) return true;
            } else {
                if (fieldValue.includes(query)) return true;
            }
        }

        return false;
    }

    /**
     * Validate individual citation
     * @private
     */
    _validateCitation(citation) {
        const errors = [];

        if (!citation.id) {
            errors.push({
                citationId: citation.id || 'unknown',
                field: 'id',
                message: 'Citation ID is required',
                severity: 'error'
            });
        }

        if (!citation.pageReference) {
            errors.push({
                citationId: citation.id,
                field: 'pageReference',
                message: 'Page reference is required',
                severity: 'warning'
            });
        } else if (!this.validatePageNumber(citation.pageReference)) {
            errors.push({
                citationId: citation.id,
                field: 'pageReference',
                message: 'Invalid page reference format',
                severity: 'error'
            });
        }

        if (!citation.title) {
            errors.push({
                citationId: citation.id,
                field: 'title',
                message: 'Citation title is missing',
                severity: 'warning'
            });
        }

        return errors;
    }

    /**
     * Export citations as JSON
     * @private
     */
    _exportJSON(citations) {
        return JSON.stringify({ citations }, null, 2);
    }

    /**
     * Export citations as CSV
     * @private
     */
    _exportCSV(citations) {
        const headers = ['ID', 'Type', 'Title', 'Authors', 'Page Reference', 'Content (EN)', 'Content (KO)'];
        const rows = [headers.join(',')];

        for (const citation of citations) {
            const row = [
                citation.id || '',
                citation.type || '',
                `"${(citation.title || '').replace(/"/g, '""')}"`,
                `"${(citation.authors || []).join('; ')}"`,
                citation.pageReference || '',
                `"${(citation.content?.en || '').replace(/"/g, '""')}"`,
                `"${(citation.content?.ko || '').replace(/"/g, '""')}"`
            ];
            rows.push(row.join(','));
        }

        return rows.join('\n');
    }

    /**
     * Export citations as BibTeX
     * @private
     */
    _exportBibTeX(citations) {
        const entries = [];

        for (const citation of citations) {
            let entry = `@article{${citation.id},\n`;

            if (citation.title) {
                entry += `  title={${citation.title}},\n`;
            }

            if (citation.authors && citation.authors.length > 0) {
                entry += `  author={${citation.authors.join(' and ')}},\n`;
            }

            if (citation.journal) {
                entry += `  journal={${citation.journal}},\n`;
            }

            if (citation.volume) {
                entry += `  volume={${citation.volume}},\n`;
            }

            if (citation.issue) {
                entry += `  number={${citation.issue}},\n`;
            }

            if (citation.pages) {
                entry += `  pages={${citation.pages}},\n`;
            }

            if (citation.year) {
                entry += `  year={${citation.year}},\n`;
            }

            if (citation.doi) {
                entry += `  doi={${citation.doi}},\n`;
            }

            entry = entry.replace(/,\n$/, '\n'); // Remove trailing comma
            entry += '}\n';

            entries.push(entry);
        }

        return entries.join('\n');
    }

    /**
     * Export citations as Markdown
     * @private
     */
    _exportMarkdown(citations) {
        let markdown = '# Citations\n\n';

        for (const citation of citations) {
            markdown += `## ${citation.title || 'Untitled'}\n\n`;

            if (citation.authors && citation.authors.length > 0) {
                markdown += `**Authors:** ${citation.authors.join(', ')}\n\n`;
            }

            if (citation.journal) {
                markdown += `**Journal:** ${citation.journal}\n\n`;
            }

            if (citation.pageReference) {
                markdown += `**Page:** ${citation.pageReference}\n\n`;
            }

            if (citation.content?.en) {
                markdown += `**Content (English):** ${citation.content.en}\n\n`;
            }

            if (citation.content?.ko) {
                markdown += `**Content (Korean):** ${citation.content.ko}\n\n`;
            }

            markdown += '---\n\n';
        }

        return markdown;
    }
}