
let searchBtn = document.querySelector('.searchBtn')
let dateFromInput = document.querySelector('.dateFrom')
let dateToInput = document.querySelector('.dateTo')
let innInput = document.querySelector('.innInput input')
let errorText = document.querySelector('.error')

let cleanTableBtn = document.querySelector('.caption')
let spinnerSearch = document.querySelector('.spinner-grow')
searchBtn.addEventListener('click', () => {
    searchBtn.textContent = 'Загрузка...'
    searchBtn.disabled = true
    errorText.textContent = ''

    searchBtn.insertAdjacentHTML('afterbegin', ' <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
    data = {
        inn: innInput.value,
        dateFrom: dateFromInput.value || 0,
        dateTo: dateToInput.value || 0

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
