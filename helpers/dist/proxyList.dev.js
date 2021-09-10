"use strict";

var puppeteer = require("puppeteer");

function getProxyList() {
  var browser, link, page, html;
  return regeneratorRuntime.async(function getProxyList$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          link = 'https://spys.one/proxies';
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(puppeteer.launch({
            headless: false,
            devtools: false
          }));

        case 4:
          browser = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(browser.newPage());

        case 7:
          page = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(page["goto"](link, {
            waitUntil: "domcontentloaded"
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(Promise.all([page.waitForSelector('body > table:nth-child(3) > tbody', {
            visible: true
          }), page.select('#xpp', '5'), page.waitForNavigation({
            waitUntil: 'networkidle0'
          })]));

        case 12:
          _context2.next = 14;
          return regeneratorRuntime.awrap(page.evaluate(function _callee() {
            var res, container, i, el, symbol, type;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    res = [];
                    container = document.querySelectorAll('.spy1xx, .spy1x');

                    for (i = 2; i < container.length; i++) {
                      el = container[i];
                      symbol = el.childNodes[0].innerText.indexOf(':');
                      type = el.childNodes[1].innerText.indexOf('(');
                      res.push({
                        ip: el.childNodes[0].innerText.slice(0, symbol),
                        port: el.childNodes[0].innerText.slice(symbol + 1),
                        type: type == -1 ? el.childNodes[1].innerText : el.childNodes[1].innerText.slice(0, type - 1)
                      });
                    }

                    return _context.abrupt("return", res);

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }));

        case 14:
          html = _context2.sent;
          _context2.next = 17;
          return regeneratorRuntime.awrap(browser.close());

        case 17:
          return _context2.abrupt("return", html);

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](1);
          console.log(_context2.t0);

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 20]]);
}

module.exports = getProxyList;