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

window.loadMapData("data.xlsx", function(data, detail) {
    data.forEach(obj => {
        if (!groups[obj.Group]) {
            groups[obj.Group] = L.layerGroup().addTo(map);
        }
        let icon = obj.iconPath ? L.icon({
            iconUrl: obj.iconPath,
            iconSize: [40, 40], // Размер иконки
            iconAnchor: [40*0.2, 40], // Точка привязки иконки
            popupAnchor: [0, -40] // Точка, откуда будет открываться всплывающее окно
        }) : null;
        // Создаем маркер
        let marker = L.marker([parseFloat(obj.x), parseFloat(obj.y)], icon ? { icon: icon } : {})
        marker.bindPopup(`<b>${obj.Title}</b><br>${obj.Description}`);
        groups[obj.Group].addLayer(marker);
        marker.on('click', function(e) {
            const closeButton = document.querySelector('#content-block .close-button');
            const contenBlock = document.querySelector('#content-block');
            const contentDiv = document.querySelector('#content');
            const head = contenBlock.querySelector('.head h2');
            contenBlock.classList.add('show');
            head.innerHTML = obj.Title;
            const descriptions = detail.get(obj.id);
            contentDiv.innerHTML = '';
            
            for (item of descriptions) {
                const html = `<h3>${item.Title}</h3><p>${item.Description}</p>`;
                contentDiv.innerHTML += html;
            }
            // contentDiv.innerHTML = `<h2>${obj.Title}</h2><p>${obj.Description}</p>`;
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

