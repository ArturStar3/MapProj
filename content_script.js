let contentBlock = document.querySelector('#content-block');
let contentDiv = document.querySelector('#content');
let closeButton = contentBlock.querySelector('.close-button');

async function loadDataFromXLSX(filepath, callback) {
    try {
        const response = await fetch(filepath);
        const arrayBuffer = await response.arrayBuffer(); // Получаем данные как ArrayBuffer
        const workbook = XLSX.read(arrayBuffer); // Читаем файл XLSX

        function getExcelData(sheetName) {
            const worksheet = workbook.Sheets[sheetName];
            if (!worksheet) {
                throw new Error(`Лист с именем "${sheetName}" не найден в файле.`);
            }
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 2 }); // Получаем данные в виде массива массивов
            return jsonData;
        }
 
        xlsxObjects = getExcelData("Объекты")


        data = getExcelData("Описание");

        function groupSmart(data) {
            const result = new Map();
            const countMap = new Map();

            data.forEach(row => {
                const key = `${row.id}::${row.Title}`;
                countMap.set(key, (countMap.get(key) || 0) + 1);
            });

            data.forEach(row => {
                const id = row.id;
                const title = row.Title;
                const category = row.Category;
                const value = row.Value;

                if (!result.has(id)) {
                    result.set(id, new Map());
                }
                const titleMap = result.get(id);
               
                if (!titleMap.has(title)) {
                    titleMap.set(title, []);
                }
                titleMap.get(title).push({Category: category, Value: value});
            
            });

            return result;
        }
        const detailMap = groupSmart(data);

        if (typeof callback === 'function') callback(xlsxObjects, detailMap); // Если есть коллбэк, вызываем его с данными
    } catch (error) {
        console.error('Ошибка загрузки или обработки XLSX файла:', error);
        contentDiv.innerHTML = `<p style="color: red;">Ошибка загрузки данных: ${error.message}</p>`;
    }
}

function loadMapData(xlsxFilePath, callback) {
    loadDataFromXLSX(xlsxFilePath, callback)
};

window.loadMapData = loadMapData; // Экспортируем функцию для использования в других скриптах



