let contentBlock = document.querySelector('#content-block');
let contentDiv = document.querySelector('#content');
let closeButton = contentBlock.querySelector('.close-button');

async function loadDataFromXLSX(filepath, callback) {
    try {
        const response = await fetch(filepath);
        const arrayBuffer = await response.arrayBuffer(); // Получаем данные как ArrayBuffer
        const workbook = XLSX.read(arrayBuffer); // Читаем файл XLSX

        const sheetName = "Объекты";
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            throw new Error(`Лист с именем "${sheetName}" не найден в файле.`);
        }
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 2 }); // Получаем данные в виде массива массивов

        if (typeof callback === 'function') callback(jsonData); // Если есть коллбэк, вызываем его с данными
        console.log(jsonData);
        
    } catch (error) {
        console.error('Ошибка загрузки или обработки XLSX файла:', error);
        contentDiv.innerHTML = `<p style="color: red;">Ошибка загрузки данных: ${error.message}</p>`;
    }
}

function loadMapData(xlsxFilePath, callback) {
    loadDataFromXLSX(xlsxFilePath, callback)
};

window.loadMapData = loadMapData; // Экспортируем функцию для использования в других скриптах



