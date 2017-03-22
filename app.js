"use strict";

var listElement = document.querySelector('.list');
var itemElementList = listElement.children;


var templateElement = document.getElementById('todoTemplate');
var templateContainer = 'content' in templateElement ? templateElement.content : templateElement;

// сформируем задачки
var todoList = [
    {
        name: 'Позвонить в сервис',
        status: 'todo'
    },
    {
        name: 'Купить хлеб',
        status: 'done'
    },
    {
        name: 'Захватить мир',
        status: 'todo'
    },
    {
        name: 'Добавить тудушку в список',
        status: 'todo'
    }
];

// функция по генерации элементов
function addTodoFromTemplate(todo) {
    var newElement = templateContainer.querySelector('.task').cloneNode(true);
    newElement.querySelector('.task__name').textContent = todo.name;
    setTodoStatusClassName(newElement, todo.status === 'todo');
    if(filteringNow === 'done') {
        newElement.style.display = 'none';
    }

    return newElement;
}

function setTodoStatusClassName(todo, flag) {
    todo.classList.toggle('task_todo', flag);
    todo.classList.toggle('task_done', !flag);
}

function onListClick(event) {
    var target = event.target;
    var element;

    if (isStatusBtn(target)) {
        element = target.parentNode;
        changeTodoStatus(element);
    }

    if (isDeleteBtn(target)) {
        element = target.parentNode;
        deleteTodo(element);
    }

    updateStat();
}

function isStatusBtn(target) {
    return target.classList.contains('task__status');
}

function isDeleteBtn(target) {
    return target.classList.contains('task__delete-button');
}

function changeTodoStatus(element) {
    var isTodo = element.classList.contains('task_todo');
    setTodoStatusClassName(element, !isTodo);
    if(filteringNow === 'todo') {
        element.style.display = 'none';
    }
}

function deleteTodo(element) {
    listElement.removeChild(element);
}

function onInputKeydown(event) {
    if (event.keyCode !== 13) {
        return;
    }

    var ENTER_KEYCODE = 13;
    if (event.keyCode !== ENTER_KEYCODE) {
        return;
    }

    var todoName = inputElement.value.trim();

    if (todoName.length === 0 || checkIfTodoAlreadyExists(todoName)) {
        return;
    }

    var todo = createNewTodo(todoName);
    insertTodoElement(addTodoFromTemplate(todo));
    inputElement.value = '';

    updateStat();
}

function checkIfTodoAlreadyExists(todoName) {
    var todoElements = listElement.querySelectorAll('.task__name');
    var namesList = Array.prototype.map.call(todoElements, function(element) {
        return element.textContent;
    });
    return namesList.indexOf(todoName) > -1;
}

function createNewTodo(name) {
    return {
        name: name,
        status: 'todo'
    }
}

todoList
    .map(addTodoFromTemplate)
    .forEach(insertTodoElement);
updateStat();

function updateStat() {
    var stat_total = document.querySelector('.statistic__total');
    var stat_done = document.querySelector('.statistic__done');
    var stat_todo = document.querySelector('.statistic__left');
    var count_done = 0;
    var count_todo = 0;
    stat_total.textContent = itemElementList.length;
    [].forEach.call(itemElementList, function(elem) {
        if(elem.classList.contains('task_done')) {
            count_done++;
        } else {
            count_todo++;
        }
    });
    stat_done.textContent = count_done;
    stat_todo.textContent = count_todo;

}

listElement.addEventListener('click', onListClick);

var inputElement = document.querySelector('.add-task__input');
inputElement.addEventListener('keydown', onInputKeydown);

var filteringNow = 'all';
var filtersElement = document.querySelector('.filters');
filtersElement.addEventListener('click', onFilterClick);

function onFilterClick(event) {
    var target = event.target;
    // var element;

    var dtFilter = target.getAttribute('data-filter');

    switch(dtFilter) {
        case 'done':
            filterDone();
            break;
        case 'todo':
            filterTodo();
            break;
        case 'all':
            filterAll();
            break;
    }

    [].forEach.call(target.parentNode.children, function(elem) {
        elem.classList.remove('filters__item_selected');
    });
    target.classList.toggle('filters__item_selected');
}

function filterDone() {
    filteringNow = 'done';
    [].forEach.call(itemElementList, function(elem) {
        if(elem.classList.contains('task_done')) {
            elem.style.display = 'list-item';;
        } else {
            elem.style.display = 'none';
        }
    });
}

function filterTodo() {
    filteringNow = 'todo';
    [].forEach.call(itemElementList, function(elem) {
        if(elem.classList.contains('task_done')) {
            elem.style.display = 'none';
        } else {
            elem.style.display = 'list-item';
        }
    });
}

function filterAll() {
    filteringNow = 'all';
    [].forEach.call(itemElementList, function(elem) {
        elem.style.display = 'list-item';;
        
    });
}
// Задача:
// исправьте багу с добавлением insertBefore в пустой массив
// создайте статистику
//
function insertTodoElement(elem) {
    if (listElement.children) {
        listElement.insertBefore(elem, listElement.firstElementChild);
    } else {
        listElement.appendChild(elem);
    }
}
