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

// ... (ваш код инициализации карты и слоя тайлов) ...

// Пример 1: Добавление Полигона (условный район в Ташкенте)
// Координаты должны быть массивом массивов [lat, lng]
var tashkentPolygonCoords = [
    [41.290, 69.190],  // Юго-западная точка
    [41.330, 69.190],  // Северо-западная точка
    [41.330, 69.260],  // Северо-восточная точка
    [41.290, 69.260],  // Юго-восточная точка
    [41.290, 69.190]   // Замыкаем полигон
];



var tashkentPolygon = L.polygon(tashkentPolygonCoords, {
    color: 'blue',       // Цвет границы полигона
    fillColor: '#8888FF', // Цвет заливки полигона
    fillOpacity: 0.5,    // Прозрачность заливки (от 0 до 1)
    weight: 3            // Толщина границы
});



// Добавление всплывающего окна по клику на полигон
tashkentPolygon.bindPopup("<b>Полигон:</b><br>Условный район в Ташкенте.");

// Вывод в консоль при клике на полигон
tashkentPolygon.on('click', function(e) {
    console.log("Полигон 'Район Ташкента' был кликнут на координатах:", e.latlng);
});

firstMarkers.addLayer(tashkentPolygon); // Добавляем полигон в первый слой

// ... (ваш код выше) ...

// Пример 2: Добавление Круга (зона вокруг Регистана, Самарканд)
var registanCenter = [39.6547, 69.6698]; // Координаты площади Регистан
var registanRadius = 100000;             // Радиус в метрах (например, 1 км)

var registanCircle = L.circle(registanCenter, registanRadius, {
    color: 'red',        // Цвет границы круга
    fillColor: '#FF6666', // Цвет заливки круга
    fillOpacity: 0.4,     // Прозрачность заливки
    weight: 2             // Толщина границы
}).addTo(map);

// Добавление всплывающего окна по клику на круг
registanCircle.bindPopup("<b>Круг:</b><br>Зона радиусом 1 км вокруг площади Регистан (Самарканд).").openPopup();

registanCircle.on('click', function(e) {
    console.log("Круг 'Регистан' был кликнут на координатах:", e.latlng);
});


// ... (ваш код выше) ...

// Пример 3: Добавление Прямоугольника (условный участок вблизи Бухары)
var bukharaRectangleBounds = [
    [39.75, 64.38], // Юго-западный угол
    [39.76, 64.42]  // Северо-восточный угол
];

var bukharaRectangle = L.rectangle(bukharaRectangleBounds, {
    color: 'green',       // Цвет границы
    fillColor: '#99FF99', // Цвет заливки
    fillOpacity: 0.6,     // Прозрачность
    weight: 4             // Толщина границы
});

// Добавление всплывающего окна по клику на прямоугольник
bukharaRectangle.bindPopup("<b>Прямоугольник:</b><br>Условный участок вблизи Бухары.");

bukharaRectangle.on('click', function(e) {
    console.log("Прямоугольник 'Бухара' был кликнут на координатах:", e.latlng);
});

secondMarkers.addLayer(bukharaRectangle); // Добавляем прямоугольник во второй слой


// ... (ваш существующий код для инициализации карты, слоя MBTiles и т.д.) ...

// --- Пользовательская иконка для Самарканда ---
var samarkandFlagIcon = L.icon({
    iconUrl: './src/svg/flag-svgrepo-com.svg', // Путь к вашему SVG-файлу
    iconSize: [40, 40],   // Размер иконки [ширина, высота] в пикселях. Отрегулируйте по мере необходимости.
    iconAnchor: [20, 40], // Точка привязки иконки, соответствующая географическому положению маркера.
                          // Для флага это обычно нижняя середина, то есть половина ширины, полная высота.
    popupAnchor: [0, -40] // Точка, откуда будут "открываться" всплывающие окна относительно iconAnchor.
                          // Обычно [0, -iconSize[1]] для всплывающего окна, появляющегося над иконкой.
});

// --- Маркер Самарканда ---
// Координаты для Самарканда (например, рядом с площадью Регистан)
var markerSamarkand = L.marker([39.6542, 66.9597], { icon: samarkandFlagIcon });

// Добавьте всплывающее окно для маркера Самарканда
markerSamarkand.bindPopup("<b>Самарканд</b><br>Город с богатой историей.").openPopup();

// Необязательно: Добавьте действие по клику для маркера Самарканда
markerSamarkand.on('click', function(e) {
    console.log("Маркер Самарканда был кликнут на координатах:", e.latlng);
    // При желании здесь можно добавить alert или другое действие.
});

thirdMarkers.addLayer(markerSamarkand); // Добавляем маркер Самарканда в третий слой
// ... (ваш существующий код для полигона Ташкента, круга Регистана, прямоугольника Бухары и т.д.) ...

// --- Обновите элемент управления слоями ---
// Убедитесь, что вы добавили новый маркер Самарканда в overlayMaps


// L.control.layers(baseMaps, overlayMaps).addTo(map);


var baseMaps = {
    "Мои Локальные Тайлы": myLocalTiles};

var overlayMaps = {
    // "Маркер Ташкент": markerTashkent,
    // "Маркер Самарканд (Флаг)": markerSamarkand, // Добавьте новый маркер Самарканда сюда
    // "Район Ташкента (Полигон)": tashkentPolygon,
    // "Зона Регистана (Круг)": registanCircle,
    // "Участок Бухары (Прямоугольник)": bukharaRectangle
    // ... любые другие слои ...
    "Первый слой (Ташкент и Самарканд)": firstMarkers,
    "Второй слой (Бухара)": secondMarkers,
    "Третий слой (Самарканд)": thirdMarkers
};


L.control.layers(baseMaps, overlayMaps).addTo(map);

