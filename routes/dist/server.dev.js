"use strict";

var _require = require("express"),
    Router = _require.Router;

var router = Router();

var puppeteer = require("puppeteer");

var parsingListInn = require('../helpers/index.js');

var cookies = [{
  name: 'fedresurscookie',
  value: '49a02e3f33f382a97e9f05e2a886a351',
  domain: '.fedresurs.ru',
  path: '/',
  expires: 1629059133.339114,
  size: 47,
  httpOnly: true,
  secure: true,
  session: false,
  sameSite: 'None',
  sameParty: false,
  sourceScheme: 'Secure',
  sourcePort: 443
}];
var companyData = [];
var innFileList;
router.get('/', function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            res.render("home", {
              title: "Парсинг fedresurs",
              style: '/home.css',
              script: '/home.js'
            });
          } catch (error) {
            console.log(error);
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get('/postForm', function _callee2(req, res) {
  var data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!(req.body.innFileList != null)) {
            _context2.next = 7;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(parsingListInn(req.body.innFileList, res));

        case 4:
          data = _context2.sent;
          _context2.next = 10;
          break;

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(parsing(req.body));

        case 9:
          data = _context2.sent;

        case 10:
          res.status(200).json({
            data: data
          });
          _context2.next = 16;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.get('/cleanData', function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          try {
            companyData = [];
            res.status(200).json({
              message: 'data is cleaning'
            });
          } catch (error) {
            console.log(error);
          }

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
});
router.post('/ssePost', function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          try {
            innFileList = req.body.innFileList;
            res.status(200).json({
              message: innFileList.length
            });
          } catch (error) {
            console.log(error);
          }

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
});
router.get('/sse', function (req, res) {
  try {
    parsingListInn(innFileList, res);
  } catch (error) {
    console.log(error);
  }
});

function parsing(param) {
  var link, browser, page, date, count, html;
  return regeneratorRuntime.async(function parsing$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          link = 'https://fedresurs.ru/search/encumbrances';
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
          }));

        case 4:
          browser = _context5.sent;
          _context5.next = 7;
          return regeneratorRuntime.awrap(browser.newPage());

        case 7:
          page = _context5.sent;
          _context5.next = 10;
          return regeneratorRuntime.awrap(page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.0 Safari/537.36'));

        case 10:
          _context5.next = 12;
          return regeneratorRuntime.awrap(page.setCookie.apply(page, cookies));

        case 12:
          _context5.next = 14;
          return regeneratorRuntime.awrap(page["goto"](link, {
            waitUntil: "domcontentloaded"
          }));

        case 14:
          _context5.next = 16;
          return regeneratorRuntime.awrap(page.waitForSelector('.form-control'));

        case 16:
          _context5.next = 18;
          return regeneratorRuntime.awrap(page.click('.form-control'));

        case 18:
          _context5.next = 20;
          return regeneratorRuntime.awrap(page.type('.form-control', "".concat(param.inn)));

        case 20:
          if (!(param.dateFrom != 0)) {
            _context5.next = 28;
            break;
          }

          date = param.dateFrom.split('-').reverse().join('') + param.dateTo.split('-').reverse().join(''); //набираю дату

          _context5.next = 24;
          return regeneratorRuntime.awrap(page.click('body > fedresurs-app > div:nth-child(3) > search > div > div > div > encumbrances-search > div > div > div > form > expand-panel > div.toggle > a'));

        case 24:
          _context5.next = 26;
          return regeneratorRuntime.awrap(page.waitForSelector('#id1 > div > div.form-group.hide_label.load_publ_date > date-range-picker > div > div > input.datepicker-range-wrap__input-field.datepicker-range-wrap__input-field_from.ng-untouched.ng-pristine.ng-valid', {
            visible: true
          }));

        case 26:
          _context5.next = 28;
          return regeneratorRuntime.awrap(page.type('#id1 > div > div.form-group.hide_label.load_publ_date > date-range-picker > div > div > input.datepicker-range-wrap__input-field.datepicker-range-wrap__input-field_from.ng-untouched.ng-pristine.ng-valid', date));

        case 28:
          _context5.next = 30;
          return regeneratorRuntime.awrap(page.click('body > fedresurs-app > div:nth-child(3) > search > div > div > div > encumbrances-search > div > div > div > form > button'));

        case 30:
          _context5.next = 32;
          return regeneratorRuntime.awrap(page.waitForFunction(' document.querySelector(".search-count-block").textContent!="" '));

        case 32:
          _context5.next = 34;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var i = parseInt(document.querySelector('.search-count-block').textContent);
            console.log(document.querySelector('.search-count-block').textContent);

            if (i == 0) {
              return null;
            } else if (i / 16 > 33) {
              return undefined;
            } else if (i <= 15) {
              return 0;
            } else if (i / 15 <= 1) {
              return 1;
            } else {
              return Math.ceil((i - 15) / 15);
            }
          }));

        case 34:
          count = _context5.sent;

          if (!(count === undefined)) {
            _context5.next = 41;
            break;
          }

          _context5.next = 38;
          return regeneratorRuntime.awrap(browser.close());

        case 38:
          return _context5.abrupt("return", 'error');

        case 41:
          if (!(count === null)) {
            _context5.next = 45;
            break;
          }

          _context5.next = 44;
          return regeneratorRuntime.awrap(browser.close());

        case 44:
          return _context5.abrupt("return", 'нет данных');

        case 45:
          _context5.next = 47;
          return regeneratorRuntime.awrap(page.waitForSelector('.all_biddings', {
            visible: true
          }));

        case 47:
          if (!(count > 0)) {
            _context5.next = 55;
            break;
          }

          _context5.next = 50;
          return regeneratorRuntime.awrap(page.waitForSelector('.btn_load_more'));

        case 50:
          _context5.next = 52;
          return regeneratorRuntime.awrap(page.click('.btn_load_more'));

        case 52:
          count--;
          _context5.next = 47;
          break;

        case 55:
          _context5.next = 57;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var container = document.querySelector('.all_biddings').children;
            var tr = Array.prototype.slice.call(container);
            var data = [];

            for (var index = 0; index < tr.length; index++) {
              var element = tr[index];
              var text = element.children[1].children[1].textContent;
              var parseString = text.split('Лизингополучатель: ')[text.split('Лизингополучатель: ').length - 1].split(',');
              var inn = parseString[parseString.length - 1].replace(/[^0-9]/g, "");
              var nameCompany = parseString[0];
              data.push({
                inn: inn,
                nameCompany: nameCompany,
                count: 1
              });
            }

            return data;
          }));

        case 57:
          html = _context5.sent;
          _context5.next = 60;
          return regeneratorRuntime.awrap(browser.close());

        case 60:
          companyData = companyData.concat(html);
          sortCompany();
          return _context5.abrupt("return", companyData);

        case 65:
          _context5.prev = 65;
          _context5.t0 = _context5["catch"](1);
          console.log(_context5.t0);

        case 68:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 65]]);
}

function sortCompany() {
  companyData = companyData.map(function (item, index, arr) {
    arr.forEach(function (element, indexFE) {
      if (item.inn == element.inn && index != indexFE) {
        item.count++;
      }
    });
    return item;
  });
  companyData = companyData.filter(function (item, index, array) {
    return array.findIndex(function (i) {
      return i.inn === item.inn;
    }) === index;
  });
}

module.exports = router;