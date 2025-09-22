// Global Variables
let currentSlide = 1;
const totalSlides = 16;
let charts = {};

// Slide Navigation
function showSlide(n) {
    const slides = document.getElementsByClassName('slide');

    if (n > totalSlides) currentSlide = 1;
    if (n < 1) currentSlide = totalSlides;

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }

    if (slides[currentSlide - 1]) {
        slides[currentSlide - 1].classList.add('active');
    }

    document.getElementById('currentSlide').textContent = currentSlide;
    document.getElementById('prevBtn').disabled = currentSlide === 1;
    document.getElementById('nextBtn').disabled = currentSlide === totalSlides;

    // Initialize charts and maps when slides are shown
    setTimeout(() => {
        initializeVisualizations();
    }, 100);
}

function changeSlide(n) {
    currentSlide += n;
    showSlide(currentSlide);
}

function goToSlide(slideId) {
    const slides = document.getElementsByClassName('slide');
    for (let i = 0; i < slides.length; i++) {
        if (slides[i].id === slideId) {
            currentSlide = i + 1;
            showSlide(currentSlide);
            break;
        }
    }
}

// Initialize Visualizations
function initializeVisualizations() {
    // Initialize charts based on current slide
    const slideElement = document.getElementsByClassName('slide')[currentSlide - 1];
    if (!slideElement) return;

    const slideId = slideElement.id;

    switch(slideId) {
        case 'slide-timeline':
            initTimelineInteraction();
            break;
        case 'slide-population':
            initPopulationChart();
            break;
        case 'slide-world-map':
            initWorldMap();
            break;
        case 'slide-economic':
            initEconomicChart();
            break;
        case 'slide-niger':
            if (typeof initNigerChart === 'function') initNigerChart();
            break;
        case 'slide-kenya':
            if (typeof initKenyaChart === 'function') initKenyaChart();
            break;
        case 'slide-comparison':
            initComparisonChart();
            initComparisonMap();
            break;
        case 'slide-cases':
            initCaseMap();
            break;
        case 'slide-methods':
            initMethodChart();
            break;
        case 'slide-funding':
            initFundingChart();
            break;
        case 'slide-scenarios':
            initScenarioChart();
            break;
    }
}

// Keyboard Navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') changeSlide(-1);
    else if (event.key === 'ArrowRight') changeSlide(1);
    else if (event.key === 'f' || event.key === 'F') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    showSlide(1);
});