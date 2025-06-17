// Определите примерные максимальные границы для вашей карты.
// Эти координаты должны охватывать всю область ваших скачанных тайлов.

// Возможно, вам придется немного подкорректировать их для вашей конкретной территории.
var southWest = L.latLng(37.0, 52.0); // Пример: Юго-западная граница
var northEast = L.latLng(48.0, 83.0); // Пример: Северо-восточная граница
var bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
    maxBounds: bounds, // Ограничиваем карту этими границами
    minZoom: 7,        // Соответствует minZoom ваших тайлов
    maxZoom: 12        // Соответствует maxZoom ваших тайлов
}).setView([41.2995, 69.2401], 8);

// var map = L.map('map').setView([41.2995, 69.2401], 8);

// 2. Добавление слоя тайлов (путь к вашей локальной папке Tiles)
var myLocalTiles = L.tileLayer('./Tiles/{z}/{x}/{y}.png', {
    attribution: 'Карта: © Мои тайлы из Maperitive',
    minZoom: 5, // Укажите минимальный зум, который вы сгенерировали
    maxZoom: 12  // Укажите максимальный зум, который вы сгенерировали
}).addTo(map);

//  Создаем LayerGroup для разных категорий объектов
var firstMarkers = L.layerGroup();
var secondMarkers = L.layerGroup();
var thirdMarkers = L.layerGroup();



// 3. Нанесение данных на карту (маркеры, круги, полигоны, GeoJSON - как было ранее)
// ... (весь ваш код для маркеров, кругов, полигонов, GeoJSON) ...
var markerTashkent = L.marker([41.2995, 69.2401]);
markerTashkent.bindPopup("<b>Ташкент</b><br>Столица Узбекистана.").openPopup();

markerTashkent.on('click', function(e) {
    // e - это объект события, содержащий информацию о клике

    // Пример 1: Простое всплывающее окно (alert)
    // let content_block = document.querySelector('#content-block');
    // content_block.classList.add('show');
    window.showContentBlockWithData('data.xlsx')
    console.log("Маркер Ташкент был кликнут на координатах:", e.latlng);});
     // Вывод в консоль разработчика
// Пример 5: Добавление элемента управления слоями (для включения/выключения разных типов данных)

firstMarkers.addLayer(markerTashkent); // Добавляем маркер в первый слой




var baseMaps = {
    "Мои Локальные Тайлы": myLocalTiles};

///!!!!!!!!!!!!!!--------------------Блок кода для проверки загрузки данных из Excel--------------------!!!!!!!!!!!!!!

const groups = {};

window.loadMapData("data.xlsx", function(data, detail, circles) {
    const markerCounts = {}; // ключ: "lat,lng", значение: сколько маркеров уже есть на этой точке
    const markerHeight = 40; // высота вашей иконки (px)
    const iconWidth = 40;

    data.forEach(obj => {
        const lat = parseFloat(obj.x);
        const lng = parseFloat(obj.y);
        if (isNaN(lat) || isNaN(lng)) return;

        const key = `${lat},${lng}`;
        const count = markerCounts[key] || 0;
        if (!groups[obj.Group]) {
            groups[obj.Group] = L.layerGroup().addTo(map);
        }
        let map_object = Object();
        if (obj.radius) {
            let circle = L.circle([parseFloat(obj.x), parseFloat(obj.y)], obj.radius, {
                color: obj.bColor || 'blue', // Цвет круга
                fillColor: obj.fColor || 'blue', // Цвет заливки круга
                fillOpacity: 0.5, // Прозрачность заливки
                weight: 2 // Толщина границы круга
            });
            circle.bindPopup(`<b>${obj.Title}</b><br>${obj.Description}`);
            map_object = circle;
        } else if (obj.x1 && obj.y1) {
            const rectnagleBounds = [
                [parseFloat(obj.x), parseFloat(obj.y)],
                [parseFloat(obj.x1), parseFloat(obj.y1)]
            ]
            let rectangle = L.rectangle(rectnagleBounds, {
                color: obj.bColor || 'blue', // Цвет границы
                fillColor: obj.fColor || 'blue', // Цвет заливки
                fillOpacity: 0.5, // Прозрачность заливки
                weight: 2 // Толщина границы
            });
            rectangle.bindPopup(`<b>${obj.Title}</b><br>${obj.Description}`);
            map_object = rectangle;
        } else {
            
            let icon = obj.iconPath ? L.icon({
                iconUrl: obj.iconPath,
                iconSize: [iconWidth, markerHeight], // Размер иконки
                iconAnchor: [iconWidth / 2, markerHeight + 0.5*count * markerHeight], // Точка привязки иконки
                popupAnchor: [0, -markerHeight] // Точка, откуда будет открываться всплывающее окно
            }) : null;
            // Создаем маркер
            let marker = L.marker([parseFloat(obj.x), parseFloat(obj.y)], icon ? { icon: icon } : {})
            marker.bindPopup(`<b>${obj.Title}</b><br>${obj.Description}`);
            map_object = marker;
            markerCounts[key] = count + 1; // Увеличиваем счетчик для этого маркера
            
        }
        groups[obj.Group].addLayer(map_object);
        map_object.on('click', function(e) {
            const closeButton = document.querySelector('#content-block .close-button');
            const contenBlock = document.querySelector('#content-block');
            const contentDiv = document.querySelector('#content');
            const head = contenBlock.querySelector('.head h2');
            contenBlock.classList.add('show');
            head.innerHTML = obj.Title;

            try {
                const descriptions = detail.get(obj.id);
            
            contentDiv.innerHTML = '';
            
            for (items of descriptions) {
                if (items[1][0].Category === 'img'){
                    let img_html = '';
                    for (item of items[1]) {
                        img_html += `<img src="${item.Value}" alt="${obj.Title}">`;
                    }
                    const html = `<div class="img-container">${img_html}</div>`;
                    contentDiv.innerHTML += `<h3>${items[0]}</h3>${html}`;
                } else if (items[1].length > 1) {
                        let html = `<h3>${items[0]}</h3><ul>`;
                        console.log(items[1]);
                        items[1].forEach(item => {
                            html += `<li><b>${item.Category}</b>: ${item.Value}</li>`;
                        })
                        html += `</ul>`;
                        contentDiv.innerHTML += html;
                        
                    }  else if (items[1][0].Category) {
                        let html = `<h3>${items[0]}</h3><p><b>${items[1][0].Category}</b>: ${items[1][0].Value}</p>`;
                        contentDiv.innerHTML += html;
                    } else {
                        let html = `<h3>${items[0]}</h3><p>${items[1][0].Value}</p>`;
                        contentDiv.innerHTML += html;
                }
                document.querySelectorAll('.img-container img').forEach(img => {
                    img.addEventListener('click', () => {
                        if (img.requestFullscreen) {
                            img.requestFullscreen();
                        } else if (img.webkitRequestFullscreen) { // для Safari
                            img.webkitRequestFullscreen();
                        } else if (img.msRequestFullscreen) { // для IE11
                            img.msRequestFullscreen();
                        }
                    });
});
            }
            } catch {
                html = `<p>Нет подробной информации для этого объекта.</p>`;
                contentDiv.innerHTML = html;
            }

            closeButton.addEventListener('click', function() {
                document.querySelector('#content-block').classList.remove('show');
            });
        });
    });

    Object.keys(groups).forEach(groupName => {
        // Добавляем группу в overlayMaps
        overlayMaps[groupName] = groups[groupName];
        if (groups[groupName]) {
            controlLayers.addOverlay(groups[groupName], groupName);
        }
    });

});

var overlayMaps = {

};


var controlLayers = L.control.layers(baseMaps, overlayMaps).addTo(map);

