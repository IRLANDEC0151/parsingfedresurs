const e = require("express");
const { Router } = require("express");
const router = Router();
const puppeteer = require("puppeteer")


router.get('/', async (req, res) => {
    res.render("home", {
        title: "Парсинг fedresurs",
        style: '/home.css',
        script: '/home.js'
    })
})

router.post('/postForm', async (req, res) => {
    let data = await parsing(req.body)
    res.status(200).json({ data })
})


async function parsing(param) {
    const link = 'https://fedresurs.ru/search/encumbrances'
    let browser;
    let date = param.dateFrom.split('-').reverse().join('') + param.dateTo.split('-').reverse().join('')

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox'

            ]
        })
        const page = await browser.newPage();
        await page.goto(link, { waitUntil: "domcontentloaded" })
        //набираю Инн  
        console.log(await page.content());
        await page.waitForSelector('.form-control');
        await page.click('.form-control');
        await page.type('.form-control', `${param.inn}`);
        console.log('a тут');
        //набираю дату
        await page.click('body > fedresurs-app > div:nth-child(3) > search > div > div > div > encumbrances-search > div > div > div > form > expand-panel > div.toggle > a')
        await page.waitForSelector('#id1 > div > div.form-group.hide_label.load_publ_date > date-range-picker > div > div > input.datepicker-range-wrap__input-field.datepicker-range-wrap__input-field_from.ng-untouched.ng-pristine.ng-valid', { visible: true })
        //с-по
        //await page.click('#id1 > div > div.form-group.hide_label.load_publ_date > date-range-picker > div > div > input.datepicker-range-wrap__input-field.datepicker-range-wrap__input-field_from.ng-untouched.ng-pristine.ng-valid')
        await page.type('#id1 > div > div.form-group.hide_label.load_publ_date > date-range-picker > div > div > input.datepicker-range-wrap__input-field.datepicker-range-wrap__input-field_from.ng-untouched.ng-pristine.ng-valid', date);
        //поиск
        await page.click('body > fedresurs-app > div:nth-child(3) > search > div > div > div > encumbrances-search > div > div > div > form > button')
        await page.waitForSelector('.all_biddings', { visible: true })
        let count = await page.evaluate(() => {
            return Math.ceil(parseInt(document.querySelector('.search-count-block').textContent) / 15 - 1)
        })
        while (count != 1) {
            await page.click('.btn_load_more')
            await page.waitForSelector('.btn_load_more');
            count--
        }

        let html = await page.evaluate(() => {
            let data = []
            let container = document.querySelector('.all_biddings').children
            let tr = Array.prototype.slice.call(container);
            for (let index = 0; index < tr.length; index++) {
                const element = tr[index];
                let text = element.children[1].children[1].textContent
                let parseString = text.split('Лизингополучатель: ')[text.split('Лизингополучатель: ').length - 1].split(',')
                let inn = parseString[parseString.length - 1].replace(/[^0-9]/g, "")
                let nameCompany = parseString[0]
                data.push({
                    inn,
                    nameCompany
                })
            }
            return data
        })
        html = html.filter((item, index, array) => array.findIndex(i => (i.inn === item.inn)) === index)

        return html
    } catch (error) {
        console.log(error);
    }
}
module.exports = router;