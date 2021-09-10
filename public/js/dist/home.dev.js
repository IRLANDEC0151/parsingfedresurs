"use strict";

var searchBtn = document.querySelector('.searchBtn');
var dateFromInput = document.querySelector('.dateFrom');
var dateToInput = document.querySelector('.dateTo');
var innInput = document.querySelector('.innInput input');
var errorText = document.querySelector('.error');
var cleanTableBtn = document.querySelector('.caption');
var spinnerSearch = document.querySelector('.spinner-grow');
searchBtn.addEventListener('click', function () {
  searchBtn.textContent = 'Загрузка...';
  searchBtn.disabled = true;
  errorText.textContent = '';
  searchBtn.insertAdjacentHTML('afterbegin', ' <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
  data = {
    inn: innInput.value,
    dateFrom: dateFromInput.value || 0,
    dateTo: dateToInput.value || 0
  };
  postForm(data).then(function (data) {
    console.log(data.data);

    if (data.data == 'error') {
      errorText.textContent = 'Ошибка! Выберите Период публикации поменьше';
      searchBtn.textContent = 'Поиск';
      searchBtn.disabled = false;
    } else if (data.data == 'нет данных') {
      searchBtn.textContent = 'Поиск';
      searchBtn.disabled = false;
      errorText.textContent = 'Нет данных';
    } else {
      searchBtn.textContent = 'Поиск';
      searchBtn.disabled = false;
      createTable(data.data);
    }
  });
});
innInput.addEventListener('input', function (e) {
  if (e.target.value) {
    searchBtn.disabled = false;
  } else {
    searchBtn.disabled = true;
  }
});
cleanTableBtn.addEventListener('click', function () {
  document.querySelector('.table tbody').innerHTML = '';
  cleanTable().then(function (data) {});
});

function cleanTable() {
  return regeneratorRuntime.async(function cleanTable$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch('/cleanData').then(function (data) {
            return data.json();
          }));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}

function postForm(data) {
  return regeneratorRuntime.async(function postForm$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fetch('/postForm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(function (data) {
            return data.json();
          }));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function createTable(data) {
  document.querySelector('.table tbody').innerHTML = '';
  data.forEach(function (i) {
    document.querySelector('.table tbody').insertAdjacentHTML("beforeend", "\n      <tr>\n      <th scope=\"row\">".concat(document.querySelector('.table tbody').childElementCount + 1, "</th>\n      <td>").concat(i.nameCompany, "</td>\n      <td>").concat(i.inn, "</td>\n      <td>").concat(i.count, "</td> \n    </tr>\n        "));
  });
}