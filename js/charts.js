// Charts Initialization Functions

function initTimelineInteraction() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineDetails = document.querySelectorAll('.timeline-detail');

    // Show first detail by default
    if (timelineItems.length > 0 && !timelineItems[0].classList.contains('active')) {
        timelineItems[0].classList.add('active');
        const firstPeriod = timelineItems[0].getAttribute('data-period');
        const firstDetail = document.getElementById(`timeline-detail-${firstPeriod}`);
        if (firstDetail) {
            firstDetail.classList.add('active');
        }
    }

    timelineItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();

            // Remove all active classes
            timelineItems.forEach(i => i.classList.remove('active'));
            timelineDetails.forEach(d => d.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Show corresponding detail
            const period = this.getAttribute('data-period');
            const detail = document.getElementById(`timeline-detail-${period}`);
            if (detail) {
                detail.classList.add('active');
            }
        });
    });
}

function initPopulationChart() {
    const ctx = document.getElementById('populationChart');
    if (!ctx || charts.population) return;

    charts.population = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1960', '2005', '2050'],
            datasets: [{
                label: '아시아',
                data: [1699, 3905, 5217],
                backgroundColor: '#3498db',
                borderColor: '#3498db',
                borderWidth: 1
            }, {
                label: '사하라 이남 아프리카',
                data: [226, 751, 1692],
                backgroundColor: '#e74c3c',
                borderColor: '#e74c3c',
                borderWidth: 1
            }, {
                label: '라틴 아메리카',
                data: [219, 561, 783],
                backgroundColor: '#27ae60',
                borderColor: '#27ae60',
                borderWidth: 1
            }, {
                label: '유럽',
                data: [604, 728, 653],
                backgroundColor: '#95a5a6',
                borderColor: '#95a5a6',
                borderWidth: 1
            }, {
                label: '북아메리카',
                data: [204, 331, 438],
                backgroundColor: '#f39c12',
                borderColor: '#f39c12',
                borderWidth: 1
            }, {
                label: '북아프리카',
                data: [67, 191, 312],
                backgroundColor: '#9b59b6',
                borderColor: '#9b59b6',
                borderWidth: 1
            }, {
                label: '오세아니아',
                data: [16, 33, 48],
                backgroundColor: '#e67e22',
                borderColor: '#e67e22',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '세계 인구 변화 추이 (백만 명)',
                    font: {
                        family: 'SeoulNamsanM',
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#2D5F5F'
                },
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: 'SeoulNamsanL',
                            size: 12
                        },
                        padding: 15,
                        boxWidth: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + '백만 명';
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'SeoulNamsanM',
                            size: 14
                        }
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 10000,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'SeoulNamsanL',
                            size: 12
                        },
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    },
                    title: {
                        display: true,
                        text: '인구 (백만 명)',
                        font: {
                            family: 'SeoulNamsanM',
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

function initEconomicChart() {
    const ctx = document.getElementById('economicChart');
    if (!ctx || charts.economic) return;

    charts.economic = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['한국', '태국', '중국', '인도네시아', '방글라데시'],
            datasets: [{
                label: '1960년 TFR',
                data: [6.0, 6.4, 5.9, 5.6, 6.3],
                backgroundColor: '#e74c3c'
            }, {
                label: '2005년 TFR',
                data: [1.2, 1.8, 1.7, 2.4, 3.0],
                backgroundColor: '#3498db'
            }, {
                label: 'GDP 성장 기여도 (%)',
                data: [2.5, 2.1, 2.8, 1.9, 1.5],
                backgroundColor: '#2ecc71'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'TFR 감소와 경제성장'
                }
            }
        }
    });
}

function initComparisonChart() {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx || charts.comparison) return;

    charts.comparison = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1971', '1980', '1990', '2000', '2005'],
            datasets: [{
                label: '방글라데시 CPR',
                data: [8, 19, 40, 54, 58],
                borderColor: '#27ae60',
                tension: 0.4
            }, {
                label: '파키스탄 CPR',
                data: [5, 9, 16, 24, 28],
                borderColor: '#e74c3c',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '피임실천율 변화 비교 (%)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 70
                }
            }
        }
    });
}

function initMethodChart() {
    const ctx = document.getElementById('methodChart');
    if (!ctx || charts.method) return;

    charts.method = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['임플란트', 'IUD\n(호르몬)', 'IUD\n(구리)', '불임수술', '주사제', '경구피임약', '패치/링', '콘돔', '다이어프램', '자연피임법', '살정제'],
            datasets: [{
                label: '이상적 사용',
                data: [0.05, 0.2, 0.6, 0.5, 0.3, 0.3, 0.3, 2, 6, 4, 18],
                backgroundColor: 'rgba(39, 174, 96, 0.8)',
                borderColor: '#27ae60',
                borderWidth: 1
            }, {
                label: '일반적 사용',
                data: [0.05, 0.2, 0.8, 0.5, 6, 9, 9, 18, 12, 24, 28],
                backgroundColor: 'rgba(231, 76, 60, 0.8)',
                borderColor: '#e74c3c',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '피임 방법별 연간 실패율 (%)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#2D5F5F'
                },
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '% 실패율';
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 10
                        },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 30,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        borderDash: [2, 2]
                    }
                }
            }
        }
    });
}

function initFundingChart() {
    const ctx = document.getElementById('fundingChart');
    if (!ctx || charts.funding) return;

    charts.funding = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1971', '1985', '1995', '2003', '필요액'],
            datasets: [{
                label: '가족계획 자금 (Million USD)',
                data: [168, 512, 560, 460, 7100],
                backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#95a5a6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '국제 자금 지원 추이'
                }
            }
        }
    });
}

function initScenarioChart() {
    const ctx = document.getElementById('scenarioChart');
    if (!ctx || charts.scenario) return;

    charts.scenario = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2005', '2010', '2020', '2030', '2040', '2050'],
            datasets: [{
                label: '낙관적 (TFR -0.5)',
                data: [6465, 6800, 7200, 7400, 7600, 7700],
                borderColor: '#27ae60',
                borderDash: [5, 5],
                tension: 0.4
            }, {
                label: '중간 예측',
                data: [6465, 6900, 7500, 8100, 8600, 9076],
                borderColor: '#f39c12',
                borderWidth: 3,
                tension: 0.4
            }, {
                label: '비관적 (TFR +0.5)',
                data: [6465, 7000, 7800, 8800, 9700, 10600],
                borderColor: '#e74c3c',
                borderDash: [5, 5],
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '시나리오별 세계 인구 예측 (백만 명)'
                }
            }
        }
    });
}

// Niger Chart
function initNigerChart() {
    const ctx = document.getElementById('nigerTrendChart');
    if (!ctx || charts.niger) return;

    charts.niger = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1990', '1995', '2000', '2005', '2010', '2015'],
            datasets: [{
                label: 'TFR (합계출산율)',
                data: [7.8, 7.9, 8.0, 8.0, 7.6, 7.3],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                yAxisID: 'y',
                tension: 0.4
            }, {
                label: 'CPR (피임실천율 %)',
                data: [4, 5, 8, 11, 13, 12],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                yAxisID: 'y1',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '니제르 출산율 및 피임실천율 추이',
                    font: { family: 'SeoulNamsanM' }
                },
                legend: {
                    labels: { font: { family: 'SeoulNamsanL' } }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'TFR',
                        font: { family: 'SeoulNamsanM' }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'CPR (%)',
                        font: { family: 'SeoulNamsanM' }
                    },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

// Kenya Chart
function initKenyaChart() {
    const ctx = document.getElementById('kenyaTrendChart');
    if (!ctx || charts.kenya) return;

    charts.kenya = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1980', '1985', '1990', '1995', '2000', '2005', '2010'],
            datasets: [{
                label: 'TFR (합계출산율)',
                data: [7.8, 6.8, 5.4, 4.9, 5.0, 4.8, 4.6],
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                yAxisID: 'y',
                tension: 0.4
            }, {
                label: 'CPR (피임실천율 %)',
                data: [10, 17, 27, 33, 39, 39, 46],
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                yAxisID: 'y1',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '케냐 출산율 및 피임실천율 추이'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'TFR'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'CPR (%)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}