const markerHeight = 60; // высота вашей иконки (px)
const iconWidth = 60;

// Определите примерные максимальные границы для вашей карты.
// Эти координаты должны охватывать всю область ваших скачанных тайлов.

// Возможно, вам придется немного подкорректировать их для вашей конкретной территории.
var southWest = L.latLng(27.5, 45.0); // Пример: Юго-западная граница
var northEast = L.latLng(55.5, 87.9); // Пример: Северо-восточная граница
var bounds = L.latLngBounds(southWest, northEast);
const markersByCoords = {};

var map = L.map('map', {
    maxBounds: bounds, // Ограничиваем карту этими границами
    minZoom: 6,        // Соответствует minZoom ваших тайлов
    maxZoom: 11       // Соответствует maxZoom ваших тайлов
}).setView([41.2995, 69.2401], 7);

// var map = L.map('map').setView([41.2995, 69.2401], 8);

// 2. Добавление слоя тайлов (путь к вашей локальной папке Tiles)
var myLocalTiles = L.tileLayer('./Tiles/{z}/{x}/{y}.png', {
    attribution: 'Карта: © Мои тайлы из Maperitive',
    minZoom: 5, // Укажите минимальный зум, который вы сгенерировали
    maxZoom: 11  // Укажите максимальный зум, который вы сгенерировали
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
    // const markerHeight = 40; // высота вашей иконки (px)
    // const iconWidth = 40;

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
            let scale = obj.scale || 1;
            let flag = obj.flag;

            
            
            let icon = obj.iconPath ? L.icon({
                iconUrl: obj.iconPath,
                iconSize: [iconWidth*scale, markerHeight*scale], // Размер иконки
                iconAnchor: [iconWidth, (markerHeight + 0.5*count * markerHeight)*scale], // Точка привязки иконки
                popupAnchor: [-iconWidth/2, -(markerHeight + 0.5*count * markerHeight)*scale], // Точка, откуда будет открываться всплывающее окно
            }) : null;
            // Создаем маркер
            icon.isflag = flag
            let marker = L.marker([parseFloat(obj.x), parseFloat(obj.y)], icon ? { icon: icon } : {})
            marker.bindPopup(`<b>${obj.Title}</b><br>${obj.Description}`);
            map_object = marker;
           
            markerCounts[key] = count + 1; // Увеличиваем счетчик для этого маркера
            

            
            if (!markersByCoords[key]) markersByCoords[key] = [];
            markersByCoords[key].push(marker);
            if (icon && !marker._originalIconOptions) {
                marker._originalIconOptions = {
                    iconUrl: icon.options.iconUrl,
                    iconSize: icon.options.iconSize,
                    iconAnchor: [iconWidth / 2, markerHeight + 0.5*count * markerHeight], // фиксированная оригинальная anchor
                    popupAnchor: [0, -(markerHeight + 0.5*count * markerHeight)*scale],
                    scale: scale,
                    flag: flag
                };
            }
            
            
            
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
                            let html = `<h3>${items[0]}</h3><p>${items[1][0].Value || ''}</p>`;
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

    let hideButton = document.getElementById('hideAllLayers')
    let showButton = document.getElementById('showAllLayers')

    showButton.addEventListener('click', function(e) {
        Object.values(groups).forEach(group => {
            if (!map.hasLayer(group)) {
                map.addLayer(group);
            }
        })
        
        this.classList.toggle('disable');
        hideButton.classList.toggle('disable');
        
    });

    hideButton.addEventListener('click', function(e) {
        Object.values(groups).forEach(group => {
            if (map.hasLayer(group)) {
                map.removeLayer(group);
            }
        })
        
        this.classList.toggle('disable');
        showButton.classList.toggle('disable');
    });

});

var overlayMaps = {

};


var controlLayers = L.control.layers(baseMaps, overlayMaps).addTo(map);

function resetAllMarkersToOriginal() {

    Object.values(markersByCoords).forEach(markerArr => {
        markerArr.forEach(marker => {
            if (marker._originalIconOptions) {
                const orig = marker._originalIconOptions;
                const origIcon = L.icon({
                    iconUrl: orig.iconUrl,
                    iconSize: orig.iconSize,
                    iconAnchor: orig.iconAnchor,
                    popupAnchor: orig.popupAnchor
                });
                marker.setIcon(origIcon);
            }
        });
    });
}
map.on('overlayadd overlayremove', function() {
    
    resetAllMarkersToOriginal()
    Object.keys(markersByCoords).forEach(key => {
        // Получаем только видимые маркеры на этой точке
        const visibleMarkers = markersByCoords[key].filter(m => map.hasLayer(m));
        let count = 0;
        
            visibleMarkers.forEach((marker, idx) => {
                // Получаем текущую иконку
                const icon = marker.options.icon;
                // Создаём новую иконку с обновлённым anchor
                const newIcon = icon.options.iconUrl !== 'marker-icon.png'  ? L.icon({
                    iconUrl: icon.options.iconUrl,
                    iconSize: icon.options.iconSize,
                    iconAnchor: [icon.options.iconSize[0], icon.options.iconSize[1] + 0.5*count * icon.options.iconSize[1]],
                    popupAnchor: [0, -(icon.options.iconSize[1] + 0.5*count * icon.options.iconSize[1])]
                }): null;
                marker.setIcon(newIcon);
                count++;
            });
        
        
    });
});



