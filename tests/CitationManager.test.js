/**
 * CitationManager Test Suite
 * Tests for citation retrieval, formatting, and page number validation
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

// Mock citation database
const mockCitationDatabase = {
    'Citation1': {
        id: 'Citation1',
        title: 'Family Planning: The Unfinished Agenda',
        authors: ['John Bongaarts', 'John Casterline'],
        journal: 'Population and Development Review',
        volume: 39,
        issue: 2,
        pages: '221-240',
        year: 2013,
        doi: '10.1111/j.1728-4457.2013.00594.x',
        type: 'journal-article'
    },
    'Citation2': {
        id: 'Citation2',
        title: 'The Demographic Transition: Causes and Consequences',
        authors: ['Ron Lesthaeghe'],
        journal: 'International Perspectives on Population Dynamics',
        volume: 1,
        issue: 1,
        pages: '15-32',
        year: 2010,
        doi: '10.1007/978-90-481-8978-6_2',
        type: 'journal-article'
    },
    'Citation3': {
        id: 'Citation3',
        title: 'World Population Prospects 2022',
        authors: ['United Nations Department of Economic and Social Affairs'],
        publisher: 'United Nations',
        pages: '1-52',
        year: 2022,
        url: 'https://population.un.org/wpp/',
        type: 'report'
    },
    'Citation4': {
        id: 'Citation4',
        title: 'Population Policy in Developing Countries',
        authors: ['Geoffrey McNicoll'],
        journal: 'Annual Review of Sociology',
        volume: 38,
        issue: 1,
        pages: '423-442',
        year: 2012,
        doi: '10.1146/annurev-soc-071811-145508',
        type: 'journal-article'
    },
    'Citation5': {
        id: 'Citation5',
        title: 'Fertility Policies and Population Aging',
        authors: ['Stuart Basten', 'Tomáš Sobotka'],
        journal: 'Vienna Yearbook of Population Research',
        volume: 11,
        pages: '1-24',
        year: 2013,
        doi: '10.1553/populationyearbook2013s1',
        type: 'journal-article'
    }
};

// Mock slide-citation mapping
const mockSlideCitations = {
    'slide1': ['Citation1', 'Citation2'],
    'slide2': ['Citation3'],
    'slide3': ['Citation4', 'Citation5'],
    'slide4': ['Citation1', 'Citation3', 'Citation4']
};

// Mock CitationManager class
class MockCitationManager {
    constructor() {
        this.citationDatabase = mockCitationDatabase;
        this.slideCitations = mockSlideCitations;
    }

    getCitationsBySlide(slideId) {
        if (!slideId) {
            throw new Error('Slide ID is required');
        }

        const citationIds = this.slideCitations[slideId];
        if (!citationIds) {
            return [];
        }

        return citationIds.map(id => {
            const citation = this.citationDatabase[id];
            if (!citation) {
                console.warn(`Citation ${id} not found in database`);
                return null;
            }
            return citation;
        }).filter(citation => citation !== null);
    }

    formatCitation(citation, style = 'apa') {
        if (!citation) {
            throw new Error('Citation object is required');
        }

        switch (style.toLowerCase()) {
            case 'apa':
                return this.formatAPA(citation);
            case 'mla':
                return this.formatMLA(citation);
            case 'chicago':
                return this.formatChicago(citation);
            default:
                throw new Error(`Unsupported citation style: ${style}`);
        }
    }

    formatAPA(citation) {
        const authors = Array.isArray(citation.authors)
            ? citation.authors.join(', ')
            : citation.authors;

        let formatted = `${authors} (${citation.year}). ${citation.title}.`;

        if (citation.journal) {
            formatted += ` *${citation.journal}*`;
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

        if (citation.doi) {
            formatted += `. https://doi.org/${citation.doi}`;
        } else if (citation.url) {
            formatted += `. ${citation.url}`;
        }

        return formatted;
    }

    formatMLA(citation) {
        const authors = Array.isArray(citation.authors)
            ? citation.authors.join(', ')
            : citation.authors;

        let formatted = `${authors}. "${citation.title}."`;

        if (citation.journal) {
            formatted += ` *${citation.journal}*`;
            if (citation.volume) {
                formatted += `, vol. ${citation.volume}`;
                if (citation.issue) {
                    formatted += `, no. ${citation.issue}`;
                }
            }
            formatted += `, ${citation.year}`;
            if (citation.pages) {
                formatted += `, pp. ${citation.pages}`;
            }
        } else if (citation.publisher) {
            formatted += ` ${citation.publisher}, ${citation.year}`;
        }

        return formatted;
    }

    formatChicago(citation) {
        const authors = Array.isArray(citation.authors)
            ? citation.authors.join(', ')
            : citation.authors;

        let formatted = `${authors}. "${citation.title}."`;

        if (citation.journal) {
            formatted += ` *${citation.journal}*`;
            if (citation.volume) {
                formatted += ` ${citation.volume}`;
                if (citation.issue) {
                    formatted += `, no. ${citation.issue}`;
                }
            }
            formatted += ` (${citation.year})`;
            if (citation.pages) {
                formatted += `: ${citation.pages}`;
            }
        } else if (citation.publisher) {
            formatted += ` ${citation.publisher}, ${citation.year}`;
        }

        return formatted;
    }

    validatePageNumber(pageString) {
        if (!pageString) {
            return { valid: false, error: 'Page number is required' };
        }

        const pageStr = pageString.toString().trim();

        // Valid formats: "123", "123-456", "123-456, 789-012"
        const patterns = [
            /^\d+$/,                          // Single page: "123"
            /^\d+-\d+$/,                      // Page range: "123-456"
            /^(\d+(-\d+)?)(,\s*\d+(-\d+)?)*$/ // Multiple pages/ranges: "123-456, 789"
        ];

        const isValid = patterns.some(pattern => pattern.test(pageStr));

        if (!isValid) {
            return {
                valid: false,
                error: 'Invalid page format. Use single pages (123), ranges (123-456), or comma-separated (123-456, 789)'
            };
        }

        // Additional validation for logical page ranges
        const ranges = pageStr.split(',').map(s => s.trim());
        for (const range of ranges) {
            if (range.includes('-')) {
                const [start, end] = range.split('-').map(p => parseInt(p.trim()));
                if (start >= end) {
                    return {
                        valid: false,
                        error: `Invalid page range: ${range}. Start page must be less than end page`
                    };
                }
            }
        }

        return { valid: true, normalized: pageStr };
    }

    getCitationById(citationId) {
        return this.citationDatabase[citationId] || null;
    }

    getAllCitations() {
        return Object.values(this.citationDatabase);
    }
}

// Test suite
const CitationManagerTests = {
    async testGetCitationsBySlideWithValidId() {
        const manager = new MockCitationManager();
        const citations = manager.getCitationsBySlide('slide1');

        assert.equal(citations.length, 2, 'Should return correct number of citations');
        assert.equal(citations[0].id, 'Citation1', 'Should return correct first citation');
        assert.equal(citations[1].id, 'Citation2', 'Should return correct second citation');
        assert.ok(citations[0].title.includes('Family Planning'), 'Should include citation details');

        return 'testGetCitationsBySlideWithValidId passed';
    },

    async testGetCitationsBySlideWithNonexistentId() {
        const manager = new MockCitationManager();
        const citations = manager.getCitationsBySlide('nonexistent');

        assert.deepEqual(citations, [], 'Should return empty array for nonexistent slide');

        return 'testGetCitationsBySlideWithNonexistentId passed';
    },

    async testGetCitationsBySlideWithInvalidInput() {
        const manager = new MockCitationManager();

        try {
            manager.getCitationsBySlide(null);
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('required'), 'Should throw error for null slide ID');
        }

        try {
            manager.getCitationsBySlide('');
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('required'), 'Should throw error for empty slide ID');
        }

        return 'testGetCitationsBySlideWithInvalidInput passed';
    },

    async testFormatCitationAPA() {
        const manager = new MockCitationManager();
        const citation = mockCitationDatabase.Citation1;
        const formatted = manager.formatCitation(citation, 'apa');

        assert.ok(formatted.includes('John Bongaarts, John Casterline'), 'Should include authors');
        assert.ok(formatted.includes('(2013)'), 'Should include year in parentheses');
        assert.ok(formatted.includes('Family Planning: The Unfinished Agenda'), 'Should include title');
        assert.ok(formatted.includes('*Population and Development Review*'), 'Should include italicized journal');
        assert.ok(formatted.includes('39(2)'), 'Should include volume and issue');
        assert.ok(formatted.includes('221-240'), 'Should include page range');
        assert.ok(formatted.includes('https://doi.org/'), 'Should include DOI link');

        return 'testFormatCitationAPA passed';
    },

    async testFormatCitationMLA() {
        const manager = new MockCitationManager();
        const citation = mockCitationDatabase.Citation1;
        const formatted = manager.formatCitation(citation, 'mla');

        assert.ok(formatted.includes('John Bongaarts, John Casterline'), 'Should include authors');
        assert.ok(formatted.includes('"Family Planning: The Unfinished Agenda."'), 'Should include quoted title');
        assert.ok(formatted.includes('*Population and Development Review*'), 'Should include italicized journal');
        assert.ok(formatted.includes('vol. 39'), 'Should include volume with "vol."');
        assert.ok(formatted.includes('no. 2'), 'Should include issue with "no."');
        assert.ok(formatted.includes('2013'), 'Should include year');
        assert.ok(formatted.includes('pp. 221-240'), 'Should include pages with "pp."');

        return 'testFormatCitationMLA passed';
    },

    async testFormatCitationChicago() {
        const manager = new MockCitationManager();
        const citation = mockCitationDatabase.Citation1;
        const formatted = manager.formatCitation(citation, 'chicago');

        assert.ok(formatted.includes('John Bongaarts, John Casterline'), 'Should include authors');
        assert.ok(formatted.includes('"Family Planning: The Unfinished Agenda."'), 'Should include quoted title');
        assert.ok(formatted.includes('*Population and Development Review*'), 'Should include italicized journal');
        assert.ok(formatted.includes('39, no. 2'), 'Should include volume and issue');
        assert.ok(formatted.includes('(2013)'), 'Should include year in parentheses');
        assert.ok(formatted.includes(': 221-240'), 'Should include pages with colon');

        return 'testFormatCitationChicago passed';
    },

    async testFormatCitationWithInvalidInput() {
        const manager = new MockCitationManager();

        try {
            manager.formatCitation(null);
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('required'), 'Should throw error for null citation');
        }

        try {
            manager.formatCitation(mockCitationDatabase.Citation1, 'invalid');
            throw new Error('Should have thrown an error');
        } catch (error) {
            assert.ok(error.message.includes('Unsupported citation style'), 'Should throw error for invalid style');
        }

        return 'testFormatCitationWithInvalidInput passed';
    },

    async testValidatePageNumberWithValidFormats() {
        const manager = new MockCitationManager();

        // Test single page
        let result = manager.validatePageNumber('123');
        assert.ok(result.valid, 'Should validate single page number');
        assert.equal(result.normalized, '123', 'Should normalize single page');

        // Test page range
        result = manager.validatePageNumber('123-456');
        assert.ok(result.valid, 'Should validate page range');
        assert.equal(result.normalized, '123-456', 'Should normalize page range');

        // Test multiple ranges
        result = manager.validatePageNumber('123-456, 789-012');
        assert.ok(result.valid, 'Should validate multiple page ranges');
        assert.equal(result.normalized, '123-456, 789-012', 'Should normalize multiple ranges');

        // Test mixed format
        result = manager.validatePageNumber('123, 456-789');
        assert.ok(result.valid, 'Should validate mixed page format');

        return 'testValidatePageNumberWithValidFormats passed';
    },

    async testValidatePageNumberWithInvalidFormats() {
        const manager = new MockCitationManager();

        // Test empty/null input
        let result = manager.validatePageNumber('');
        assert.ok(!result.valid, 'Should reject empty string');
        assert.ok(result.error.includes('required'), 'Should provide appropriate error message');

        result = manager.validatePageNumber(null);
        assert.ok(!result.valid, 'Should reject null input');

        // Test invalid formats
        result = manager.validatePageNumber('abc');
        assert.ok(!result.valid, 'Should reject non-numeric input');

        result = manager.validatePageNumber('123-');
        assert.ok(!result.valid, 'Should reject incomplete range');

        result = manager.validatePageNumber('123--456');
        assert.ok(!result.valid, 'Should reject double dashes');

        // Test logical errors
        result = manager.validatePageNumber('456-123');
        assert.ok(!result.valid, 'Should reject ranges where start > end');
        assert.ok(result.error.includes('Start page must be less'), 'Should provide logical error message');

        return 'testValidatePageNumberWithInvalidFormats passed';
    },

    async testCitationDatabaseIntegrity() {
        const manager = new MockCitationManager();

        // Test that all citations have required fields
        Object.values(mockCitationDatabase).forEach(citation => {
            assert.ok(citation.id, 'Citation should have ID');
            assert.ok(citation.title, 'Citation should have title');
            assert.ok(citation.authors, 'Citation should have authors');
            assert.ok(citation.year, 'Citation should have year');
            assert.ok(citation.type, 'Citation should have type');
        });

        // Test that all slide citations reference valid citations
        Object.entries(mockSlideCitations).forEach(([slideId, citationIds]) => {
            citationIds.forEach(citationId => {
                assert.ok(mockCitationDatabase[citationId],
                    `Citation ${citationId} referenced by ${slideId} should exist in database`);
            });
        });

        return 'testCitationDatabaseIntegrity passed';
    }
};

// Export for test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CitationManagerTests, MockCitationManager, mockCitationDatabase, mockSlideCitations };
} else {
    window.CitationManagerTests = CitationManagerTests;
    window.MockCitationManager = MockCitationManager;
    window.mockCitationDatabase = mockCitationDatabase;
    window.mockSlideCitations = mockSlideCitations;
}