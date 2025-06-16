let content_close_button = document.querySelector('#content-block .close-button');
content_close_button.addEventListener('click', function() {
    document.querySelector('#content-block').classList.remove('show');
});

document.addEventListener('DOMContentLoaded', () => {
    const contentBlock = document.getElementById('content-block');
    const contentDiv = document.getElementById('content'); // Это ваш div внутри #content-block
    const closeButton = contentBlock.querySelector('.close-button');

    // Предполагаем, что вам нужно загрузить данные при открытии страницы или по событию
    // Если файл XLSX загружается пользователем, то логика будет другой (через <input type="file">)
    // Сейчас мы просто загружаем предопределенный файл.

    async function loadDataFromXLSX(filePath) {
        try {
            const response = await fetch(filePath);
            const arrayBuffer = await response.arrayBuffer(); // Получаем данные как ArrayBuffer

            // Читаем файл XLSX
            const workbook = XLSX.read(arrayBuffer);

            // Получаем первый лист
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Пример: Получаем значение ячейки A1
            // Если вам нужны другие данные, например, таблица, используйте XLSX.utils.sheet_to_json(worksheet)
            const cellA1 = worksheet['A1'] ? worksheet['A1'].v : 'Данные в A1 не найдены.';
            
            // Если у вас более сложная структура, например, таблица:
            // const jsonData = XLSX.utils.sheet_to_json(worksheet);
            // console.log(jsonData); // Выведет массив объектов, где каждый объект - это строка

            // Отображаем полученные данные в div#content
            contentDiv.innerHTML = `<p>${cellA1}</p>`;
            // ЕслиjsonData, то можно итерировать и создавать HTML:
            // contentDiv.innerHTML = '';
            // jsonData.forEach(row => {
            //     contentDiv.innerHTML += `<p>Имя: ${row.Имя}, Возраст: ${row.Возраст}</p>`; // Пример
            // });

            console.log('Данные из XLSX загружены и отображены.');

        } catch (error) {
            console.error('Ошибка загрузки или обработки XLSX файла:', error);
            contentDiv.innerHTML = `<p style="color: red;">Ошибка загрузки данных: ${error.message}</p>`;
        }
    }

    // Пример вызова функции загрузки данных при открытии #content-block
    // Или при клике на какой-то маркер на карте, который должен открыть блок и загрузить данные.
    function showContentBlockWithData(xlsxFilePath) {
        contentBlock.classList.add('show');
        loadDataFromXLSX(xlsxFilePath);
    }

    // Пример использования:
    // Допустим, вы хотите загружать данные для Ташкента из 'data_tashkent.xlsx'
    // при клике на маркер Ташкента.
    // Если ваш current_script.js уже содержит логику для маркеров,
    // вы можете вызвать showContentBlockWithData там.

    // Для демонстрации, давайте загрузим данные при инициализации,
    // если #content-block уже имеет класс 'show'
    if (contentBlock.classList.contains('show')) {
        showContentBlockWithData('./data.xlsx'); // Укажите путь к вашему XLSX файлу
    }

    // Логика для кнопки закрытия (если еще не реализована)
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            contentBlock.classList.remove('show');
            contentDiv.innerHTML = ''; // Очищаем содержимое при закрытии
        });
    }
    window.showContentBlockWithData = showContentBlockWithData; // Делаем функцию доступной глобально
});