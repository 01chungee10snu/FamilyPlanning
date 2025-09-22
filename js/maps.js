// Map Initialization Functions

function initWorldMap() {
    const mapContainer = document.getElementById('world-map');
    if (!mapContainer || mapContainer._leaflet_map) return;

    const map = L.map('world-map').setView([20, 0], 2);
    mapContainer._leaflet_map = true; // Mark as initialized

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add country markers with more data
    const countries = [
        {name: '니제르', lat: 17.6, lng: 8.1, tfr: 8.0, cpr: 5, color: '#d73027'},
        {name: '차드', lat: 15.4, lng: 18.7, tfr: 6.8, cpr: 8, color: '#d73027'},
        {name: '소말리아', lat: 5.2, lng: 46.2, tfr: 7.1, cpr: 6, color: '#d73027'},
        {name: '말리', lat: 17.6, lng: -4.0, tfr: 7.1, cpr: 10, color: '#d73027'},
        {name: '부르키나파소', lat: 12.2, lng: -1.6, tfr: 6.2, cpr: 14, color: '#d73027'},
        {name: '나이지리아', lat: 9.1, lng: 8.7, tfr: 5.7, cpr: 15, color: '#d73027'},
        {name: '에티오피아', lat: 9.1, lng: 40.5, tfr: 5.4, cpr: 14, color: '#d73027'},
        {name: '케냐', lat: -1.3, lng: 36.8, tfr: 4.7, cpr: 39, color: '#fee08b'},
        {name: '파키스탄', lat: 30.4, lng: 69.3, tfr: 4.3, cpr: 28, color: '#fee08b'},
        {name: '인도', lat: 20.6, lng: 78.9, tfr: 2.7, cpr: 56, color: '#1a9850'},
        {name: '방글라데시', lat: 23.7, lng: 90.4, tfr: 3.0, cpr: 58, color: '#1a9850'},
        {name: '인도네시아', lat: -0.8, lng: 113.9, tfr: 2.6, cpr: 61, color: '#1a9850'},
        {name: '브라질', lat: -14.2, lng: -51.9, tfr: 2.3, cpr: 81, color: '#1a9850'},
        {name: '멕시코', lat: 23.6, lng: -102.5, tfr: 2.4, cpr: 73, color: '#1a9850'},
        {name: '중국', lat: 35.9, lng: 104.2, tfr: 1.7, cpr: 85, color: '#1a9850'},
        {name: '태국', lat: 15.9, lng: 100.9, tfr: 1.8, cpr: 79, color: '#1a9850'},
        {name: '한국', lat: 35.9, lng: 127.8, tfr: 1.2, cpr: 82, color: '#1a9850'}
    ];

    countries.forEach(country => {
        const circle = L.circleMarker([country.lat, country.lng], {
            radius: Math.sqrt(country.tfr) * 8,
            fillColor: country.color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(map);

        circle.bindPopup(`
            <div style="min-width: 150px;">
                <strong style="font-size: 16px;">${country.name}</strong><br>
                <hr style="margin: 5px 0;">
                <strong>합계출산율(TFR):</strong> ${country.tfr}<br>
                <strong>피임실천율(CPR):</strong> ${country.cpr}%<br>
                <div style="margin-top: 5px; padding: 5px; background: ${country.color}; color: white; text-align: center; border-radius: 3px;">
                    ${country.tfr >= 5 ? '높은 출산율' : country.tfr >= 3 ? '중간 출산율' : '낮은 출산율'}
                </div>
            </div>
        `);
    });
}

function initComparisonMap() {
    const mapContainer = document.getElementById('comparison-map');
    if (!mapContainer || mapContainer._leaflet_map) return;

    const map = L.map('comparison-map').setView([25, 80], 3);
    mapContainer._leaflet_map = true;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Bangladesh marker with flag colors
    const bdMarker = L.marker([23.7, 90.4], {
        icon: L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="position: relative;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: #16a085; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                        <div style="width: 25px; height: 25px; border-radius: 50%; background: #f42a41;"></div>
                    </div>
                    <div style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); background: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; font-weight: bold; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">방글라데시</div>
                </div>
            `,
            iconSize: [60, 80],
            iconAnchor: [30, 60]
        })
    }).addTo(map);

    // Pakistan marker with flag colors
    const pkMarker = L.marker([30.4, 69.3], {
        icon: L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="position: relative;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: #01411C; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                        <div style="position: relative;">
                            <div style="width: 20px; height: 20px; border: 3px solid white; border-radius: 50%;"></div>
                            <div style="position: absolute; top: -5px; right: -8px; color: white; font-size: 16px;">★</div>
                        </div>
                    </div>
                    <div style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); background: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; font-weight: bold; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">파키스탄</div>
                </div>
            `,
            iconSize: [60, 80],
            iconAnchor: [30, 60]
        })
    }).addTo(map);

    bdMarker.bindPopup(`
        <strong>방글라데시</strong><br>
        CPR: 58% (2005)<br>
        TFR: 3.0 (2005)<br>
        프로그램 성공
    `);

    pkMarker.bindPopup(`
        <strong>파키스탄</strong><br>
        CPR: 28% (2005)<br>
        TFR: 4.3 (2005)<br>
        프로그램 정체
    `);
}

function initCaseMap() {
    const mapContainer = document.getElementById('case-map');
    if (!mapContainer || mapContainer._leaflet_map) return;

    const map = L.map('case-map').setView([0, 0], 1.5);
    mapContainer._leaflet_map = true;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const cases = [
        {
            name: '이란',
            lat: 32.4,
            lng: 53.7,
            status: '성공',
            color: '#27ae60',
            details: 'TFR: 6.5 → 1.9<br>종교 지도자 지원<br>CPR: 79%'
        },
        {
            name: '르완다',
            lat: -1.9,
            lng: 29.9,
            status: '진행중',
            color: '#f39c12',
            details: 'TFR: 6.1 → 4.5<br>정부 주도<br>CPR: 52%'
        },
        {
            name: '필리핀',
            lat: 12.9,
            lng: 121.8,
            status: '도전',
            color: '#e74c3c',
            details: 'TFR: 3.3 (정체)<br>종교적 반대<br>CPR: 51%'
        },
        {
            name: '브라질',
            lat: -14.2,
            lng: -51.9,
            status: '성공',
            color: '#27ae60',
            details: 'TFR: 6.2 → 2.3<br>NGO 주도<br>CPR: 81%'
        }
    ];

    cases.forEach(c => {
        const marker = L.marker([c.lat, c.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<div style="background: ${c.color}; width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
                iconSize: [40, 40]
            })
        }).addTo(map);

        marker.bindPopup(`
            <div style="min-width: 180px;">
                <strong style="font-size: 16px;">${c.name}</strong><br>
                <div style="margin: 5px 0; padding: 5px; background: ${c.color}; color: white; text-align: center; border-radius: 3px;">
                    상태: ${c.status}
                </div>
                <div style="margin-top: 10px; line-height: 1.5;">
                    ${c.details}
                </div>
            </div>
        `);
    });
}