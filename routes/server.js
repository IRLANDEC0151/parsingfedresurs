
const { Router } = require("express");
const router = Router();
const puppeteer = require("puppeteer")
const parsingListInn = require('../helpers/index.js')
let cookies = [
    {
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
    }
]
let companyData = []
let innFileList
router.get('/', async (req, res) => {
    try {
        res.render("home", {
            title: "Парсинг fedresurs",
            style: '/home.css',
            script: '/home.js'
        })
    } catch (error) {
        console.log(error);
    }

})

router.post('/postForm', async (req, res) => {
    try {

        let = data = await parsing(req.body)
        res.status(200).json({ data })

    } catch (error) {
        console.log(error);
    }

})


router.get('/cleanData', async (req, res) => {
    try {
        companyData = []
        res.status(200).json({ message: 'data is cleaning' })
    } catch (error) {
        console.log(error);
    }

})

router.post('/ssePost', async (req, res) => {
    try {
        innFileList = req.body.innFileList
        res.status(200).json({ message: innFileList.length })
    } catch (error) {
        console.log(error);
    }

})

router.get('/sse', (req, res) => {
    try {
        parsingListInn(innFileList, res)
    } catch (error) {
        console.log(error);
    }

})


async function parsing(param) {
    const link = 'https://fedresurs.ru/search/encumbrances'
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox'
            ]
        })
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.0 Safari/537.36')
        await page.setCookie(...cookies);
        await page.goto(link, { waitUntil: "domcontentloaded" })
        //набираю Инн  
        await page.waitForSelector('.form-control');

        await page.click('.form-control');
        await page.type('.form-control', `${param.inn}`);
        if (param.dateFrom != 0) {
            let date = param.dateFrom.split('-').reverse().join('') + param.dateTo.split('-').reverse().join('')
            //набираю дату
            await page.click('body > fedresurs-app > div:nth-child(3) > search > div > div > div > encumbrances-search > div > div > div > form > expand-panel > div.toggle > a')
            await page.waitForSelector('#id1 > div > div.form-group.hide_label.load_publ_date > date-range-picker > div > div > input.datepicker-range-wrap__input-field.datepicker-range-wrap__input-field_from.ng-untouched.ng-pristine.ng-valid', { visible: true })
            //с-по
            //await page.click('#id1 > div > div.form-group.hide_label.load_publ_date > date-range-picker > div > div > input.datepicker-range-wrap__input-field.datepicker-range-wrap__input-field_from.ng-untouched.ng-pristine.ng-valid')
            await page.type('#id1 > div > div.form-group.hide_label.load_publ_date > date-range-picker > div > div > input.datepicker-range-wrap__input-field.datepicker-range-wrap__input-field_from.ng-untouched.ng-pristine.ng-valid', date);
        }

        //поиск
        await page.click('body > fedresurs-app > div:nth-child(3) > search > div > div > div > encumbrances-search > div > div > div > form > button')
        await page.waitForFunction(' document.querySelector(".search-count-block").textContent!="" ')
        let count = await page.evaluate(() => {
            let i = parseInt(document.querySelector('.search-count-block').textContent)
            console.log(document.querySelector('.search-count-block').textContent);
            if (i == 0) {
                return null
            } else if (i / 16 > 33) {
                return undefined
            } else if (i <= 15) {
                return 0;
            } else if (i / 15 <= 1) {
                return 1;
            } else {
                return Math.ceil((i - 15) / 15)
            }
        })
        if (count === undefined) {
            await browser.close()
            return 'error'
        } else if (count === null) {
            await browser.close()
            return 'нет данных'
        }
        await page.waitForSelector('.all_biddings', { visible: true })

        while (count > 0) {
            await page.waitForSelector('.btn_load_more');
            await page.click('.btn_load_more')
            count--
        }

        let html = await page.evaluate(() => {
            let container = document.querySelector('.all_biddings').children
            let tr = Array.prototype.slice.call(container);
            let data = []
            for (let index = 0; index < tr.length; index++) {
                const element = tr[index];
                let text = element.children[1].children[1].textContent
                let parseString = text.split('Лизингополучатель: ')[text.split('Лизингополучатель: ').length - 1].split(',')
                let inn = parseString[parseString.length - 1].replace(/[^0-9]/g, "")
                let nameCompany = parseString[0]
                data.push({
                    inn,
                    nameCompany,
                    count: 1

                })
            }
            return data
        })
        await browser.close()
        companyData = companyData.concat(html);
        sortCompany()
        return companyData

    } catch (error) {
        console.log(error);
    }
}
function sortCompany() {
    companyData = companyData.map((item, index, arr) => {
        arr.forEach((element, indexFE) => {
            if (item.inn == element.inn && index != indexFE) {
                item.count++;
            }
        });
        return item
    })
    companyData = companyData.filter((item, index, array) => array.findIndex(i => (i.inn === item.inn)) === index)
}
module.exports = router;