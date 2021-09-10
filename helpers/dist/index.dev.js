"use strict";

var puppeteer = require("puppeteer");

var getProxy = require('./proxyList');

var innListInfo = [];
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

function parsingListInn(innList, res) {
  var proxyList, url, proxyIndex, proxy, browser, page, index, inn, count;
  return regeneratorRuntime.async(function parsingListInn$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getProxy());

        case 2:
          proxyList = _context.sent;
          url = 'https://fedresurs.ru/search/encumbrances';
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          proxyIndex = 0;

        case 7:
          if (!(proxyIndex < proxyList.length)) {
            _context.next = 56;
            break;
          }

          proxy = "".concat(proxyList[proxyIndex]['ip'], ":").concat(proxyList[proxyIndex]['port']);
          browser = void 0;
          _context.prev = 10;
          _context.next = 13;
          return regeneratorRuntime.awrap(puppeteer.launch({
            headless: false,
            args: ["--proxy-server=".concat(proxy)]
          }));

        case 13:
          browser = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(browser.newPage());

        case 16:
          page = _context.sent;
          index = 0;

        case 18:
          if (!(index < innList.length)) {
            _context.next = 45;
            break;
          }

          inn = innList[index];
          _context.next = 22;
          return regeneratorRuntime.awrap(page["goto"](url, {
            waitUntil: "domcontentloaded"
          }));

        case 22:
          _context.next = 24;
          return regeneratorRuntime.awrap(page.waitForSelector('.form-control'));

        case 24:
          _context.next = 26;
          return regeneratorRuntime.awrap(page.click('.form-control'));

        case 26:
          _context.next = 28;
          return regeneratorRuntime.awrap(page.type('.form-control', inn));

        case 28:
          _context.next = 30;
          return regeneratorRuntime.awrap(page.click('body > fedresurs-app > div:nth-child(3) > search > div > div > div > encumbrances-search > div > div > div > form > button'));

        case 30:
          _context.next = 32;
          return regeneratorRuntime.awrap(page.waitForFunction(' document.querySelector(".search-count-block").textContent!="" ', {
            timeout: 30000
          }));

        case 32:
          _context.next = 34;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            return parseInt(document.querySelector('.search-count-block').textContent);
          }));

        case 34:
          count = _context.sent;
          _context.next = 37;
          return regeneratorRuntime.awrap(page.close());

        case 37:
          if (count != 0) {
            res.write("data: {\"innData\":\"".concat(inn, "\",\"count\":\"").concat(count, "\"}\n"));
            res.write("id: ".concat(inn, " \n"));
            res.write("\n");
          }

          res.write("data: {\"allInn\":\"".concat(innList.length, "\",\"indexInn\":\"").concat(index + 1, "\"}\n"));
          res.write("id: ".concat(index + 1, " \n"));
          res.write("\n");
          console.log("".concat(index + 1, "/").concat(innList.length));

        case 42:
          index++;
          _context.next = 18;
          break;

        case 45:
          _context.next = 53;
          break;

        case 47:
          _context.prev = 47;
          _context.t0 = _context["catch"](10);
          _context.next = 51;
          return regeneratorRuntime.awrap(browser.close());

        case 51:
          console.log('браузер закрыт');
          console.log(_context.t0);

        case 53:
          proxyIndex++;
          _context.next = 7;
          break;

        case 56:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[10, 47]]);
}

module.exports = parsingListInn;