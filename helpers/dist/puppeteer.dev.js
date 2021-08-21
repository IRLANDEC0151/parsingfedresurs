"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var puppeteer = require("puppeteer");

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

var PuppeteerHandler =
/*#__PURE__*/
function () {
  function PuppeteerHandler() {
    _classCallCheck(this, PuppeteerHandler);

    this.browser = null;
  }

  _createClass(PuppeteerHandler, [{
    key: "initBrowser",
    value: function initBrowser() {
      return regeneratorRuntime.async(function initBrowser$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
              }));

            case 2:
              this.browser = _context.sent;

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "closeBrowser",
    value: function closeBrowser() {
      this.browser.close();
    }
  }, {
    key: "getPageContent",
    value: function getPageContent(inn) {
      var url, page, pageArr, count;
      return regeneratorRuntime.async(function getPageContent$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              url = 'https://fedresurs.ru/search/encumbrances';
              _context2.next = 3;
              return regeneratorRuntime.awrap(this.browser.newPage());

            case 3:
              page = _context2.sent;
              _context2.prev = 4;
              _context2.next = 7;
              return regeneratorRuntime.awrap(page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.0 Safari/537.36'));

            case 7:
              _context2.next = 9;
              return regeneratorRuntime.awrap(page.setCookie.apply(page, cookies));

            case 9:
              _context2.next = 11;
              return regeneratorRuntime.awrap(page["goto"](url, {
                waitUntil: "domcontentloaded"
              }));

            case 11:
              _context2.next = 13;
              return regeneratorRuntime.awrap(this.browser.pages());

            case 13:
              pageArr = _context2.sent;
              _context2.next = 16;
              return regeneratorRuntime.awrap(page.waitForSelector('.form-control'));

            case 16:
              _context2.next = 18;
              return regeneratorRuntime.awrap(page.click('.form-control'));

            case 18:
              _context2.next = 20;
              return regeneratorRuntime.awrap(page.type('.form-control', inn));

            case 20:
              _context2.next = 22;
              return regeneratorRuntime.awrap(page.click('body > fedresurs-app > div:nth-child(3) > search > div > div > div > encumbrances-search > div > div > div > form > button'));

            case 22:
              _context2.next = 24;
              return regeneratorRuntime.awrap(pageArr[1].bringToFront());

            case 24:
              _context2.next = 26;
              return regeneratorRuntime.awrap(page.waitForFunction(' document.querySelector(".search-count-block").textContent!="" ', {
                timeout: 30000
              }));

            case 26:
              _context2.next = 28;
              return regeneratorRuntime.awrap(pageArr[2].bringToFront());

            case 28:
              _context2.next = 30;
              return regeneratorRuntime.awrap(page.evaluate(function () {
                return parseInt(document.querySelector('.search-count-block').textContent);
              }));

            case 30:
              count = _context2.sent;
              _context2.next = 33;
              return regeneratorRuntime.awrap(page.close());

            case 33:
              return _context2.abrupt("return", {
                inn: inn,
                count: count
              });

            case 36:
              _context2.prev = 36;
              _context2.t0 = _context2["catch"](4);
              _context2.next = 40;
              return regeneratorRuntime.awrap(page.close());

            case 40:
              throw _context2.t0;

            case 41:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[4, 36]]);
    }
  }]);

  return PuppeteerHandler;
}();

module.exports = PuppeteerHandler;