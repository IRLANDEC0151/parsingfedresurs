"use strict";

var searchBtn = document.querySelector('.searchBtn');
var dateFromInput = document.querySelector('.dateFrom');
var dateToInput = document.querySelector('.dateTo');
var innInput = document.querySelector('.innInput input');
var fileInput = document.querySelector('.fileInput');
var errorText = document.querySelector('.error');
var cleanTableBtn = document.querySelector('.caption');
var spinnerSearch = document.querySelector('.spinner-grow');
var currentInnSearch = document.querySelector('.currentInnSearch');
var allInnSearch = document.querySelector('.allInnSearch');
var innFileList = [];
searchBtn.addEventListener('click', function () {
  searchBtn.textContent = 'Загрузка...';
  searchBtn.disabled = true;
  errorText.textContent = '';
  searchBtn.insertAdjacentHTML('afterbegin', ' <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
  data = {
    inn: innInput.value,
    dateFrom: dateFromInput.value || 0,
    dateTo: dateToInput.value || 0,
    innFileList: innFileList || null
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
fileInput.addEventListener("change", handleFiles, false);

function handleFiles() {
  var eventSource;
  return regeneratorRuntime.async(function handleFiles$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          searchBtn.textContent = 'Обработка файла...';
          _context.next = 3;
          return regeneratorRuntime.awrap(readXlsxFile(this.files[0]).then(function (rows) {
            for (var index = 1; index < rows.length; index++) {
              var el = rows[index];
              innFileList.push(el[9]);
            }
          }));

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(fetch('/ssePost', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              innFileList: innFileList
            })
          }).then(function (data) {
            return data.json();
          }).then(function (data) {
            allInnSearch.textContent = data.message;
            currentInnSearch.textContent = '0';
            console.log(data);
          }));

        case 5:
          eventSource = new EventSource("http://localhost:3000/sse");

          eventSource.onmessage = function (e) {
            var data = JSON.parse(e.data);

            if (data.hasOwnProperty('allInn')) {
              allInnSearch.textContent = data.allInn;
              currentInnSearch.textContent = data.indexInn;
            } else if (data.hasOwnProperty('innData')) {
              document.querySelector('.table tbody').insertAdjacentHTML("beforeend", "\n            <tr>\n            <th scope=\"row\">".concat(document.querySelector('.table tbody').childElementCount + 1, "</th>\n            <td></td>\n            <td>").concat(data.innData, "</td>\n            <td>").concat(data.count, "</td> \n          </tr>\n              "));
            }
          };

          eventSource.addEventListener('end', function () {
            eventSource.close();
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
}

function cleanTable() {
  return regeneratorRuntime.async(function cleanTable$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fetch('/cleanData').then(function (data) {
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

function postForm(data) {
  return regeneratorRuntime.async(function postForm$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
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
          return _context3.abrupt("return", _context3.sent);

        case 3:
        case "end":
          return _context3.stop();
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