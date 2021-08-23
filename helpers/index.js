const PuppeteerHandler = require('./puppeteer.js')
const async = require("async");
const concurrency = 2;
let innListInfo = []

const p = new PuppeteerHandler();
const taskQueue = async.queue(async (task, done) => {
    try {
        await task();
        // done();
    } catch (err) {
        throw err;
    }
}, concurrency);

taskQueue.drain(function () {
    console.log(`🎉  All items completed`);
    p.closeBrowser();
    process.exit();
});

async function parsingListInn(innList, res) {
    res.setHeader('Content-Type', 'text/event-stream') 
        res.setHeader('Cache-Control', 'no-cache')
    await p.initBrowser()
    innList.forEach((inn, index, arr) => {
        taskQueue.push(
            () => innPageHandle(inn, index, arr.length, res),
            (err) => {
                if (err) {
                    console.log(err);
                    throw new Error('🚫 Error getting data from inn#' + inn);
                }
            }
        );
    });
    return innListInfo
};

async function innPageHandle(inn, index, length, res) {
    try {
        const innInfo = await p.getPageContent(inn);
        if (innInfo.count != 0) {
            innListInfo.push(innInfo);
            console.log(innInfo);
            res.write(`data: {"innData":"${innInfo.inn}","count":"${innInfo.count}"}\n`)
            res.write(`id: ${innInfo.inn} \n`);
            res.write("\n");
        }
        res.write(`data: {"allInn":"${length}","indexInn":"${index}"}\n`)
        res.write(`id: ${index} \n`);
        res.write("\n"); 
        console.log(`${index}/${length}`);
    } catch (err) {
        console.log('An error has occured');
        console.log(err);
    }
}
module.exports = parsingListInn