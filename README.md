# data-table-test-task
Задание:
Исходя из приложенных данных постройте таблицу с возможностью раскрытия строк, имеющих дочерние элементы, а также фильтрацией по свойству "isActive"

Рабочий результат доступен по адресу: http://trade-api.rehkzy1v.beget.tech/data-table/dist
Помимо подключенной минифицированной версии приложен исходный .js файл.
Получаемый файл данных сортируется по уровню вложенности во избежание ситуации, когда дочерний элемент может быть упомянут ранее своего родителя. 
При фильтрации по свойству "isActive" неактивные строки скрываются вместе со своими дочерними.
