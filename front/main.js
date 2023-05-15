import Student from './student.js';

const SERVER_URL = 'http://localhost:3000'

async function serverAddStudent(obj) {
    let respons = await fetch(SERVER_URL + '/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
    })

    let data = await respons.json()

    return data
}

async function serverGetStudent() {
    let respons = await fetch(SERVER_URL + '/api/students', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })

    let data = await respons.json()

    return data
}

let serverData = await serverGetStudent()

async function serverDeliteStudent(id) {
    let respons = await fetch(SERVER_URL + '/api/students/' + id, {
        method: 'DELETE',
    })

    let data = await respons.json()

    return data
}

// массив студентов

let studentsList = []

if (serverData) {
    for (const item of serverData) {
        studentsList.push(new Student(item.name, item.surname, item.lastname, item.birthday, item.studyStart, item.faculty))
    }
    studentsList = serverData
}

const $studentsItem = document.getElementById('students-item'),
    $studentsItemTHAll = document.querySelectorAll('.workersTable th')


let column = 'fio',
    columnDir = true

function getBirthDateString(date) {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '.' + mm + '.' + yyyy;
}
function getLearnPeriod(student) {
    let currentYear = Number(new Date().getFullYear());
    let StartedYear = student.studyStart;
    let finishYear = Number(StartedYear) + 4;

    if (currentYear > finishYear) {
        return `(${StartedYear} - ${finishYear}) Закончил`
    } else {
        return `(${StartedYear} - ${finishYear}) ${currentYear - StartedYear} курс `
    }

}

// создаем таблицу студентов
function newStudentTR(student) {
    const $StudentTR = document.createElement('tr'),
        $fioTD = document.createElement('td'),
        $birthdayTD = document.createElement('td'),
        $studyStartTD = document.createElement('td'),
        $facultyTD = document.createElement('td'),
        $deliteTD = document.createElement('td'),
        $btnDelite = document.createElement('button')

    $btnDelite.classList.add('btn', 'btn-danger', 'w-100')
    $btnDelite.textContent = "Удалить"

    $fioTD.textContent = `${student.surname} ${student.name} ${student.lastname}`
    $birthdayTD.textContent = getBirthDateString(new Date(student.birthday))
    $studyStartTD.innerHTML = getLearnPeriod(student)
    $facultyTD.textContent = student.faculty

    $btnDelite.addEventListener('click', async function () {
        await serverDeliteStudent(student.id)
        $StudentTR.remove()
    })

    $deliteTD.append($btnDelite)
    $StudentTR.append($fioTD)
    $StudentTR.append($birthdayTD)
    $StudentTR.append($studyStartTD)
    $StudentTR.append($facultyTD)
    $StudentTR.append($deliteTD)

    return $StudentTR;
}

// функция сортировки студентов
function getSortStudens(prop, dir) {
    const studentsListCopy = [...studentsList]
    return studentsListCopy.sort(function (student1, student2) {
        if (dir) {
            return student1[prop] < student2[prop] ? -1 : 1;
        } else {
            return student1[prop] > student2[prop] ? -1 : 1;
        }

    })
}

// рендер на сортировку

function render() {
    let studentsListCopy = [...studentsList]
    studentsListCopy = getSortStudens(column, columnDir)
    $studentsItem.innerHTML = ''
    for (const student of studentsListCopy) {
        $studentsItem.append(newStudentTR(student))
    }
}

// Валидация 

function validation(form) {

    function removeError(input) {
        const parent = input.parentNode;

        if (parent.classList.contains('error')) {
            parent.querySelector('.error-lable').remove()
            parent.classList.remove('error')
        }
    }

    function createError(input, text) {
        const parent = input.parentNode;
        const errorLabel = document.createElement('lable')

        errorLabel.classList.add('error-lable')
        errorLabel.textContent = text

        parent.classList.add('error')
        parent.append(errorLabel)
    }
    let result = true;

    const allInputs = form.querySelectorAll('input');

    for (const input of allInputs) {

        removeError(input)

        if (input.dataset.minLength) {
            if (input.value.length < input.dataset.minLength) {
                removeError(input)
                createError(input, `Минимальное кол-во символов: ${input.dataset.minLength}`)
                result = false
            }
        }
        if (input.dataset.maxLength) {
            if (input.value.length > input.dataset.maxLength) {
                removeError(input)
                createError(input, `Максимальное кол-во символов: ${input.dataset.maxLength}`)
                result = false
            }
        }

        if (input.dataset.required == "true") {
            if (input.value == "") {
                removeError(input)
                createError(input, 'Поле нужно заполнить!')
                result = false
            }
        }
        // добавляем проверку на наличие цифр в тексте
        if (input.type === "text" && /\d/.test(input.value)) {
            removeError(input)
            createError(input, 'Поле не должно содержать цифры!')
            result = false
        }
    }

    return result
}


// фильтрация 

function filter(arr, prop, value) {
    let result = [],
        copy = [...arr]
    for (const item of copy) {
        if (String(item[prop]).includes(value.trim()) == true) result.push(item)
    }
    return result
}



function renderFilter() {

    $studentsItem.innerHTML = ''

    const $studentFilterFio = document.getElementById('filter-fio').value,
        $studentFilterfaculty = document.getElementById('filter-faculty').value,
        $studentFilterstudyStart = document.getElementById('filter-studyStart').value

    let newStudentsList = [...studentsList]

    if ($studentFilterFio !== '') newStudentsList = filter(newStudentsList, 'fio', $studentFilterFio)
    if ($studentFilterstudyStart !== '') newStudentsList = filter(newStudentsList, 'studyStart', $studentFilterstudyStart)
    if ($studentFilterfaculty !== '') newStudentsList = filter(newStudentsList, 'faculty', $studentFilterfaculty)


    for (const student of newStudentsList) {
        $studentsItem.append(newStudentTR(student))

    }
}

// событие сортировки по клику
$studentsItemTHAll.forEach(element => {
    element.addEventListener('click', function () {
        column = this.dataset.column;
        columnDir = !columnDir
        render()
    })
})


// добавление
document.getElementById('add-student').addEventListener('submit', async function (event) {
    event.preventDefault()

    if (validation(this)) {
        alert('Форма успешно проверена!')

        let newStudent = new Student(
            document.getElementById('input-name').value,
            document.getElementById('input-surname').value,
            document.getElementById('input-lastname').value,
            new Date(document.getElementById('input-birthday').value),
            Number(document.getElementById('input-studyStart').value),
            document.getElementById('input-faculty').value,
        )


        let serverDataObj = await serverAddStudent(newStudent);
        serverDataObj.birthday = new Date(serverDataObj.birthday);
        studentsList.push(new Student(serverDataObj.name, serverDataObj.surname, serverDataObj.lastname, serverDataObj.birthday, serverDataObj.studyStart, serverDataObj.faculty));

        render();

    }

});


//событие по клику кнопки фильтр 

document.getElementById('filter-student').addEventListener('submit', async function (event) {
    event.preventDefault()
    renderFilter()
})
render()