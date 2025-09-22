/**
 * Citation Integration Test Suite
 * Tests for citation tooltip interactions, formatting, and user interface
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

// Mock citation data for integration testing
const mockCitationIntegrationData = {
    citations: {
        'bongaarts2013': {
            id: 'bongaarts2013',
            title: 'Family Planning: The Unfinished Agenda',
            authors: ['John Bongaarts', 'John Casterline'],
            journal: 'Population and Development Review',
            volume: 39,
            issue: 2,
            pages: '221-240',
            year: 2013,
            doi: '10.1111/j.1728-4457.2013.00594.x',
            abstract: 'This paper examines the current state of family planning programs worldwide and identifies key challenges for the future.',
            type: 'journal-article'
        },
        'un2022': {
            id: 'un2022',
            title: 'World Population Prospects 2022',
            authors: ['United Nations Department of Economic and Social Affairs'],
            publisher: 'United Nations',
            pages: '1-52',
            year: 2022,
            url: 'https://population.un.org/wpp/',
            abstract: 'Comprehensive analysis of global population trends and projections through 2100.',
            type: 'report'
        },
        'mcnicoll2012': {
            id: 'mcnicoll2012',
            title: 'Population Policy in Developing Countries',
            authors: ['Geoffrey McNicoll'],
            journal: 'Annual Review of Sociology',
            volume: 38,
            issue: 1,
            pages: '423-442',
            year: 2012,
            doi: '10.1146/annurev-soc-071811-145508',
            abstract: 'Review of population policy approaches in developing nations.',
            type: 'journal-article'
        }
    },
    slideContent: `
        <h1>Family Planning Policies</h1>
        <p>Family planning has been a critical component of population policy for decades
        <cite data-citation="bongaarts2013">(Bongaarts & Casterline, 2013)</cite>.
        Current global trends show varying fertility rates across regions
        <cite data-citation="un2022">(UN DESA, 2022)</cite>.</p>

        <p>Policy approaches in developing countries have evolved significantly
        <cite data-citation="mcnicoll2012">(McNicoll, 2012)</cite>, though challenges remain
        in implementation and effectiveness.</p>
    `
};

// Mock CitationTooltipManager class
class MockCitationTooltipManager {
    constructor(citationDatabase) {
        this.citationDatabase = citationDatabase;
        this.activeTooltips = new Map();
        this.tooltipContainer = null;
        this.currentTooltip = null;
        this.isEnabled = true;
        this.settings = {
            showDelay: 300,
            hideDelay: 100,
            maxWidth: 400,
            formatStyle: 'apa'
        };
    }

    initialize(container) {
        this.tooltipContainer = container;
        this.setupEventListeners();
        this.createTooltipElement();
    }

    setupEventListeners() {
        if (!this.tooltipContainer) return;

        // Find all citation elements
        const citeElements = this.tooltipContainer.querySelectorAll('[data-citation]');

        citeElements.forEach(element => {
            element.addEventListener('mouseenter', (event) => this.handleMouseEnter(event));
            element.addEventListener('mouseleave', (event) => this.handleMouseLeave(event));
            element.addEventListener('click', (event) => this.handleClick(event));
            element.style.cursor = 'pointer';
            element.style.textDecoration = 'underline';
            element.style.color = '#0066cc';
        });
    }

    createTooltipElement() {
        const tooltip = document.createElement('div');
        tooltip.className = 'citation-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            max-width: ${this.settings.maxWidth}px;
            z-index: 1000;
            display: none;
            font-size: 14px;
            line-height: 1.4;
        `;

        document.body.appendChild(tooltip);
        this.tooltipElement = tooltip;
    }

    handleMouseEnter(event) {
        if (!this.isEnabled) return;

        const citationId = event.target.dataset.citation;
        if (!citationId) return;

        this.showTooltipTimeout = setTimeout(() => {
            this.showTooltip(event.target, citationId);
        }, this.settings.showDelay);
    }

    handleMouseLeave(event) {
        if (this.showTooltipTimeout) {
            clearTimeout(this.showTooltipTimeout);
        }

        this.hideTooltipTimeout = setTimeout(() => {
            this.hideTooltip();
        }, this.settings.hideDelay);
    }

    handleClick(event) {
        event.preventDefault();
        const citationId = event.target.dataset.citation;
        if (!citationId) return;

        this.showFullCitation(citationId);
    }

    showTooltip(triggerElement, citationId) {
        const citation = this.citationDatabase[citationId];
        if (!citation) {
            console.warn(`Citation ${citationId} not found`);
            return;
        }

        const content = this.formatTooltipContent(citation);
        this.tooltipElement.innerHTML = content;
        this.positionTooltip(triggerElement);
        this.tooltipElement.style.display = 'block';

        this.currentTooltip = {
            citationId,
            triggerElement,
            timestamp: Date.now()
        };

        // Add mouse events to tooltip to keep it visible
        this.tooltipElement.addEventListener('mouseenter', () => {
            if (this.hideTooltipTimeout) {
                clearTimeout(this.hideTooltipTimeout);
            }
        });

        this.tooltipElement.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    hideTooltip() {
        if (this.tooltipElement) {
            this.tooltipElement.style.display = 'none';
        }
        this.currentTooltip = null;
    }

    formatTooltipContent(citation) {
        const formattedCitation = this.formatCitation(citation, this.settings.formatStyle);
        const abstract = citation.abstract ? `<div class="citation-abstract">${citation.abstract}</div>` : '';

        return `
            <div class="citation-content">
                <div class="citation-formatted">${formattedCitation}</div>
                ${abstract}
                <div class="citation-actions">
                    <button class="copy-citation" data-citation="${citation.id}">Copy</button>
                    <button class="view-full" data-citation="${citation.id}">View Full</button>
                </div>
            </div>
        `;
    }

    formatCitation(citation, style = 'apa') {
        const authors = Array.isArray(citation.authors)
            ? citation.authors.join(', ')
            : citation.authors;

        switch (style.toLowerCase()) {
            case 'apa':
                let formatted = `${authors} (${citation.year}). ${citation.title}.`;
                if (citation.journal) {
                    formatted += ` <em>${citation.journal}</em>`;
                    if (citation.volume) {
                        formatted += `, ${citation.volume}`;
                        if (citation.issue) {
                            formatted += `(${citation.issue})`;
                        }
                    }
                    if (citation.pages) {
                        formatted += `, ${citation.pages}`;
                    }
                } else if (citation.publisher) {
                    formatted += ` ${citation.publisher}`;
                }
                return formatted;

            default:
                return `${authors}. ${citation.title}. ${citation.year}.`;
        }
    }

    positionTooltip(triggerElement) {
        const rect = triggerElement.getBoundingClientRect();
        const tooltip = this.tooltipElement;

        // Basic positioning - below the element
        let top = rect.bottom + window.scrollY + 5;
        let left = rect.left + window.scrollX;

        // Adjust if tooltip would go off-screen
        const tooltipRect = tooltip.getBoundingClientRect();
        if (left + this.settings.maxWidth > window.innerWidth) {
            left = window.innerWidth - this.settings.maxWidth - 10;
        }

        if (top + tooltipRect.height > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - tooltipRect.height - 5;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    showFullCitation(citationId) {
        const citation = this.citationDatabase[citationId];
        if (!citation) return;

        // Create modal-like display
        const modal = document.createElement('div');
        modal.className = 'citation-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        const content = document.createElement('div');
        content.className = 'citation-modal-content';
        content.style.cssText = `
            background: white;
            padding: 24px;
            border-radius: 8px;
            max-width: 600px;
            max-height: 80%;
            overflow-y: auto;
        `;

        content.innerHTML = `
            <h3>Citation Details</h3>
            <div class="citation-full">
                <h4>${citation.title}</h4>
                <p><strong>Authors:</strong> ${Array.isArray(citation.authors) ? citation.authors.join(', ') : citation.authors}</p>
                <p><strong>Year:</strong> ${citation.year}</p>
                ${citation.journal ? `<p><strong>Journal:</strong> ${citation.journal}</p>` : ''}
                ${citation.publisher ? `<p><strong>Publisher:</strong> ${citation.publisher}</p>` : ''}
                ${citation.pages ? `<p><strong>Pages:</strong> ${citation.pages}</p>` : ''}
                ${citation.doi ? `<p><strong>DOI:</strong> <a href="https://doi.org/${citation.doi}" target="_blank">${citation.doi}</a></p>` : ''}
                ${citation.url ? `<p><strong>URL:</strong> <a href="${citation.url}" target="_blank">${citation.url}</a></p>` : ''}
                ${citation.abstract ? `<div class="abstract"><strong>Abstract:</strong><p>${citation.abstract}</p></div>` : ''}
            </div>
            <button class="close-modal">Close</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Add close functionality
        const closeBtn = content.querySelector('.close-modal');
        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        return modal;
    }

    copyCitation(citationId) {
        const citation = this.citationDatabase[citationId];
        if (!citation) return false;

        const formattedCitation = this.formatCitation(citation, this.settings.formatStyle);

        // Mock clipboard API
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            return navigator.clipboard.writeText(formattedCitation);
        } else {
            // Fallback for testing
            console.log('Copied to clipboard:', formattedCitation);
            return Promise.resolve();
        }
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
        this.hideTooltip();
    }

    getCurrentTooltip() {
        return this.currentTooltip;
    }

    cleanup() {
        if (this.tooltipElement && this.tooltipElement.parentNode) {
            this.tooltipElement.parentNode.removeChild(this.tooltipElement);
        }
        if (this.showTooltipTimeout) {
            clearTimeout(this.showTooltipTimeout);
        }
        if (this.hideTooltipTimeout) {
            clearTimeout(this.hideTooltipTimeout);
        }
    }
}

// Test suite
const CitationIntegrationTests = {
    async testTooltipInitialization() {
        const manager = new MockCitationTooltipManager(mockCitationIntegrationData.citations);
        const container = document.createElement('div');
        container.innerHTML = mockCitationIntegrationData.slideContent;

        manager.initialize(container);

        // Check that citation elements are styled
        const citeElements = container.querySelectorAll('[data-citation]');
        assert.equal(citeElements.length, 3, 'Should find all citation elements');

        citeElements.forEach(element => {
            assert.equal(element.style.cursor, 'pointer', 'Should set cursor style');
            assert.equal(element.style.textDecoration, 'underline', 'Should set underline style');
            assert.equal(element.style.color, 'rgb(0, 102, 204)', 'Should set color style');
        });

        // Check tooltip element creation
        const tooltips = document.querySelectorAll('.citation-tooltip');
        assert.equal(tooltips.length, 1, 'Should create tooltip element');
        assert.equal(tooltips[0].style.display, 'none', 'Should initially hide tooltip');

        manager.cleanup();
        return 'testTooltipInitialization passed';
    },

    async testTooltipShowHide() {
        const manager = new MockCitationTooltipManager(mockCitationIntegrationData.citations);
        const container = document.createElement('div');
        container.innerHTML = mockCitationIntegrationData.slideContent;
        manager.initialize(container);

        const citeElement = container.querySelector('[data-citation="bongaarts2013"]');

        // Test showing tooltip
        manager.showTooltip(citeElement, 'bongaarts2013');

        assert.equal(manager.tooltipElement.style.display, 'block', 'Should show tooltip');
        assert.ok(manager.getCurrentTooltip(), 'Should track current tooltip');
        assert.equal(manager.getCurrentTooltip().citationId, 'bongaarts2013', 'Should track correct citation');

        // Test tooltip content
        const tooltipContent = manager.tooltipElement.innerHTML;
        assert.ok(tooltipContent.includes('Bongaarts'), 'Should include author name');
        assert.ok(tooltipContent.includes('Family Planning: The Unfinished Agenda'), 'Should include title');
        assert.ok(tooltipContent.includes('2013'), 'Should include year');

        // Test hiding tooltip
        manager.hideTooltip();
        assert.equal(manager.tooltipElement.style.display, 'none', 'Should hide tooltip');
        assert.ok(!manager.getCurrentTooltip(), 'Should clear current tooltip');

        manager.cleanup();
        return 'testTooltipShowHide passed';
    },

    async testTooltipPositioning() {
        const manager = new MockCitationTooltipManager(mockCitationIntegrationData.citations);
        const container = document.createElement('div');
        container.innerHTML = mockCitationIntegrationData.slideContent;
        manager.initialize(container);

        const citeElement = container.querySelector('[data-citation="un2022"]');

        // Mock getBoundingClientRect
        citeElement.getBoundingClientRect = () => ({
            bottom: 100,
            left: 50,
            top: 80,
            right: 200
        });

        manager.showTooltip(citeElement, 'un2022');

        // Check positioning
        const tooltip = manager.tooltipElement;
        assert.ok(parseInt(tooltip.style.top) > 100, 'Should position below element');
        assert.ok(parseInt(tooltip.style.left) >= 50, 'Should position near element left');

        manager.cleanup();
        return 'testTooltipPositioning passed';
    },

    async testCitationFormatting() {
        const manager = new MockCitationTooltipManager(mockCitationIntegrationData.citations);
        const citation = mockCitationIntegrationData.citations.bongaarts2013;

        // Test APA formatting
        const apaFormatted = manager.formatCitation(citation, 'apa');
        assert.ok(apaFormatted.includes('John Bongaarts, John Casterline'), 'Should include authors');
        assert.ok(apaFormatted.includes('(2013)'), 'Should include year in parentheses');
        assert.ok(apaFormatted.includes('<em>Population and Development Review</em>'), 'Should italicize journal');
        assert.ok(apaFormatted.includes('39(2)'), 'Should include volume and issue');

        // Test with report citation
        const reportCitation = mockCitationIntegrationData.citations.un2022;
        const reportFormatted = manager.formatCitation(reportCitation, 'apa');
        assert.ok(reportFormatted.includes('United Nations'), 'Should include publisher for reports');
        assert.ok(reportFormatted.includes('(2022)'), 'Should include year');

        return 'testCitationFormatting passed';
    },

    async testFullCitationModal() {
        const manager = new MockCitationTooltipManager(mockCitationIntegrationData.citations);

        const modal = manager.showFullCitation('mcnicoll2012');

        assert.ok(modal, 'Should return modal element');
        assert.ok(modal.className.includes('citation-modal'), 'Should have correct class');
        assert.ok(modal.innerHTML.includes('Population Policy in Developing Countries'), 'Should include citation title');
        assert.ok(modal.innerHTML.includes('Geoffrey McNicoll'), 'Should include author');
        assert.ok(modal.innerHTML.includes('10.1146/annurev-soc-071811-145508'), 'Should include DOI');

        // Test modal close button
        const closeBtn = modal.querySelector('.close-modal');
        assert.ok(closeBtn, 'Should include close button');

        // Cleanup
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }

        return 'testFullCitationModal passed';
    },

    async testCitationCopying() {
        const manager = new MockCitationTooltipManager(mockCitationIntegrationData.citations);

        // Test copying citation
        const copyPromise = manager.copyCitation('bongaarts2013');
        assert.ok(copyPromise instanceof Promise, 'Should return promise for copy operation');

        // Test copying non-existent citation
        const invalidCopy = manager.copyCitation('nonexistent');
        assert.equal(invalidCopy, false, 'Should return false for invalid citation');

        return 'testCitationCopying passed';
    },

    async testTooltipSettings() {
        const manager = new MockCitationTooltipManager(mockCitationIntegrationData.citations);

        // Test default settings
        assert.equal(manager.settings.showDelay, 300, 'Should have default show delay');
        assert.equal(manager.settings.formatStyle, 'apa', 'Should have default format style');

        // Test updating settings
        manager.updateSettings({
            showDelay: 500,
            formatStyle: 'mla',
            maxWidth: 300
        });

        assert.equal(manager.settings.showDelay, 500, 'Should update show delay');
        assert.equal(manager.settings.formatStyle, 'mla', 'Should update format style');
        assert.equal(manager.settings.maxWidth, 300, 'Should update max width');
        assert.equal(manager.settings.hideDelay, 100, 'Should preserve unchanged settings');

        return 'testTooltipSettings passed';
    },

    async testTooltipEnableDisable() {
        const manager = new MockCitationTooltipManager(mockCitationIntegrationData.citations);
        const container = document.createElement('div');
        container.innerHTML = mockCitationIntegrationData.slideContent;
        manager.initialize(container);

        // Test disabling
        manager.disable();
        assert.ok(!manager.isEnabled, 'Should disable manager');

        // Test that disabled manager doesn't show tooltips
        const citeElement = container.querySelector('[data-citation="bongaarts2013"]');
        const mockEvent = { target: citeElement };
        manager.handleMouseEnter(mockEvent);

        // Should not show tooltip when disabled
        setTimeout(() => {
            assert.equal(manager.tooltipElement.style.display, 'none', 'Should not show tooltip when disabled');
        }, 350);

        // Test re-enabling
        manager.enable();
        assert.ok(manager.isEnabled, 'Should re-enable manager');

        manager.cleanup();
        return 'testTooltipEnableDisable passed';
    }
};

// Export for test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CitationIntegrationTests,
        MockCitationTooltipManager,
        mockCitationIntegrationData
    };
} else {
    window.CitationIntegrationTests = CitationIntegrationTests;
    window.MockCitationTooltipManager = MockCitationTooltipManager;
    window.mockCitationIntegrationData = mockCitationIntegrationData;
}