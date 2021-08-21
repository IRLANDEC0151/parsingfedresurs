"use strict";

var PuppeteerHandler = require('./puppeteer.js');

var async = require("async");

var concurrency = 2;
var innListInfo = [];
var p = new PuppeteerHandler();
var taskQueue = async.queue(function _callee(task, done) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(task());

        case 3:
          _context.next = 8;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](0);
          throw _context.t0;

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 5]]);
}, concurrency);
taskQueue.drain(function () {
  console.log("\uD83C\uDF89  All items completed");
  p.closeBrowser();
  process.exit();
});

function parsingListInn(innList, res) {
  return regeneratorRuntime.async(function parsingListInn$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          _context2.next = 4;
          return regeneratorRuntime.awrap(p.initBrowser());

        case 4:
          innList.forEach(function (inn, index, arr) {
            taskQueue.push(function () {
              return innPageHandle(inn, index, arr.length, res);
            }, function (err) {
              if (err) {
                console.log(err);
                throw new Error('🚫 Error getting data from inn#' + inn);
              }
            });
          });
          return _context2.abrupt("return", innListInfo);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}

;

function innPageHandle(inn, index, length, res) {
  var innInfo;
  return regeneratorRuntime.async(function innPageHandle$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(p.getPageContent(inn));

        case 3:
          innInfo = _context3.sent;

          if (innInfo.count != 0) {
            innListInfo.push(innInfo);
            console.log(innInfo);
            res.write("data: {\"innData\":\"".concat(innInfo.inn, "\",\"count\":\"").concat(innInfo.count, "\"}\n"));
            res.write("id: ".concat(innInfo.inn, " \n"));
            res.write("\n");
          }

          res.write("data: {\"allInn\":\"".concat(length, "\",\"indexInn\":\"").concat(index, "\"}\n"));
          res.write("id: ".concat(index, " \n"));
          res.write("\n");
          console.log("".concat(index, "/").concat(length));
          _context3.next = 15;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          console.log('An error has occured');
          console.log(_context3.t0);

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
}

module.exports = parsingListInn;