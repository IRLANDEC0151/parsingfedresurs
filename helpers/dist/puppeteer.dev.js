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
    this.innCounter = 0;
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
                headless: false,
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
      var url, _page, _page2, count;

      return regeneratorRuntime.async(function getPageContent$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              url = '';
              this.innCounter++;
              _context2.prev = 2;

              if (!(this.innCounter % 10 == 0)) {
                _context2.next = 21;
                break;
              }

              console.log(this.innCounter);
              url = 'https://fedresurs.ru/';
              this.innCounter = 0;
              _context2.next = 9;
              return regeneratorRuntime.awrap(this.browser.newPage());

            case 9:
              _page = _context2.sent;
              _context2.next = 12;
              return regeneratorRuntime.awrap(_page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.0 Safari/537.36'));

            case 12:
              _context2.next = 14;
              return regeneratorRuntime.awrap(_page.setCookie.apply(_page, cookies));

            case 14:
              _context2.next = 16;
              return regeneratorRuntime.awrap(_page["goto"](url, {
                waitUntil: "domcontentloaded"
              }));

            case 16:
              _context2.next = 18;
              return regeneratorRuntime.awrap(_page.close());

            case 18:
              return _context2.abrupt("return", 0);

            case 21:
              url = 'https://fedresurs.ru/search/encumbrances';
              _context2.next = 24;
              return regeneratorRuntime.awrap(this.browser.newPage());

            case 24:
              _page2 = _context2.sent;
              _context2.next = 27;
              return regeneratorRuntime.awrap(_page2.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.0 Safari/537.36'));

            case 27:
              _context2.next = 29;
              return regeneratorRuntime.awrap(_page2.setCookie.apply(_page2, cookies));

            case 29:
              _context2.next = 31;
              return regeneratorRuntime.awrap(_page2["goto"](url, {
                waitUntil: "domcontentloaded"
              }));

            case 31:
              _context2.next = 33;
              return regeneratorRuntime.awrap(_page2.waitForSelector('.form-control'));

            case 33:
              _context2.next = 35;
              return regeneratorRuntime.awrap(_page2.click('.form-control'));

            case 35:
              _context2.next = 37;
              return regeneratorRuntime.awrap(_page2.type('.form-control', inn));

            case 37:
              _context2.next = 39;
              return regeneratorRuntime.awrap(_page2.click('body > fedresurs-app > div:nth-child(3) > search > div > div > div > encumbrances-search > div > div > div > form > button'));

            case 39:
              _context2.next = 41;
              return regeneratorRuntime.awrap(_page2.waitForFunction(' document.querySelector(".search-count-block").textContent!="" ', {
                timeout: 30000
              }));

            case 41:
              _context2.next = 43;
              return regeneratorRuntime.awrap(_page2.evaluate(function () {
                return parseInt(document.querySelector('.search-count-block').textContent);
              }));

            case 43:
              count = _context2.sent;
              _context2.next = 46;
              return regeneratorRuntime.awrap(_page2.close());

            case 46:
              return _context2.abrupt("return", {
                inn: inn,
                count: count
              });

            case 47:
              _context2.next = 55;
              break;

            case 49:
              _context2.prev = 49;
              _context2.t0 = _context2["catch"](2);
              console.log(_context2.t0);
              _context2.next = 54;
              return regeneratorRuntime.awrap(page.close());

            case 54:
              throw _context2.t0;

            case 55:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[2, 49]]);
    }
  }]);

  return PuppeteerHandler;
}();

module.exports = PuppeteerHandler;