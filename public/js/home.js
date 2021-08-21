
let searchBtn = document.querySelector('.searchBtn')
let dateFromInput = document.querySelector('.dateFrom')
let dateToInput = document.querySelector('.dateTo')
let innInput = document.querySelector('.innInput input')
let fileInput = document.querySelector('.fileInput')
let errorText = document.querySelector('.error')

let cleanTableBtn = document.querySelector('.caption')
let spinnerSearch = document.querySelector('.spinner-grow')

let currentInnSearch = document.querySelector('.currentInnSearch')
let allInnSearch = document.querySelector('.allInnSearch')

let innFileList = []
searchBtn.addEventListener('click', () => {
    searchBtn.textContent = 'Загрузка...'
    searchBtn.disabled = true
    errorText.textContent = ''
    searchBtn.insertAdjacentHTML('afterbegin', ' <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
    data = {
        inn: innInput.value,
        dateFrom: dateFromInput.value || 0,
        dateTo: dateToInput.value || 0,
        innFileList: innFileList || null

    }
    postForm(data)
        .then((data) => {
            console.log(data.data);
            if (data.data == 'error') {
                errorText.textContent = 'Ошибка! Выберите Период публикации поменьше'
                searchBtn.textContent = 'Поиск'
                searchBtn.disabled = false
            } else if (data.data == 'нет данных') {
                searchBtn.textContent = 'Поиск'
                searchBtn.disabled = false
                errorText.textContent = 'Нет данных'
            } else {
                searchBtn.textContent = 'Поиск'
                searchBtn.disabled = false
                createTable(data.data)
            }
        })

})

innInput.addEventListener('input', (e) => {
    if (e.target.value) {
        searchBtn.disabled = false
    } else {
        searchBtn.disabled = true
    }
})

cleanTableBtn.addEventListener('click', () => {
    document.querySelector('.table tbody').innerHTML = ''
    cleanTable().
        then(data => {

        })

})
fileInput.addEventListener("change", handleFiles, false);


async function handleFiles() {
    searchBtn.textContent = 'Обработка файла...'

    await readXlsxFile(this.files[0]).then(function (rows) {
        for (let index = 1; index < rows.length; index++) {
            const el = rows[index];
            innFileList.push(el[9])
        }
    })
    await fetch('/ssePost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ innFileList })
    }).then((data) => {
        return data.json()
    }).then(data => {
        allInnSearch.textContent = data.message
        currentInnSearch.textContent = '0'
        console.log(data);

    })
    let eventSource = new EventSource("http://localhost:3000/sse");
    eventSource.onmessage = function (e) {
        var data = JSON.parse(e.data);
        if (data.hasOwnProperty('allInn')) {
            allInnSearch.textContent = data.allInn
            currentInnSearch.textContent = data.indexInn
        } else if (data.hasOwnProperty('innData')) {

            document.querySelector('.table tbody').insertAdjacentHTML("beforeend", `
            <tr>
            <th scope="row">${document.querySelector('.table tbody').childElementCount + 1}</th>
            <td></td>
            <td>${data.innData}</td>
            <td>${data.count}</td> 
          </tr>
              `)
        }
    };
    eventSource.addEventListener('end', () => {
        eventSource.close()
    })
}

async function cleanTable() {
    return await fetch('/cleanData').then((data) => {
        return data.json()
    })

}

async function postForm(data) {
    return await fetch('/postForm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((data) => {
        return data.json()
    })

}

function createTable(data) {
    document.querySelector('.table tbody').innerHTML = ''
    data.forEach((i) => {
        document.querySelector('.table tbody').insertAdjacentHTML("beforeend", `
      <tr>
      <th scope="row">${document.querySelector('.table tbody').childElementCount + 1}</th>
      <td>${i.nameCompany}</td>
      <td>${i.inn}</td>
      <td>${i.count}</td> 
    </tr>
        `)
    });
}
