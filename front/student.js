export default class Student {
    constructor (name, surname, lastname, birthday, studyStart, faculty) {
        this.name = name
        this.surname = surname
        this.lastname = lastname
        this.birthday = birthday
        this.studyStart = studyStart
        this.faculty = faculty

    }

    get fio() {
        return this.name + ' ' + this.lastname + ' ' + this.surname
    }


    // getLearnPeriod() {
    //     const currentTime = new Date();
    //     let cours = currentTime.getFullYear() - this.studyStart + 1;
    //     let yearEducation = this.studyStart + ' - ' + currentTime.getFullYear() + ' (' + cours + ' курс)';
    //     let endEducation = this.studyStart + ' - ' + (this.studyStart + 3) + ' (закончил обучение)'; // номер курса
    //     if (cours < 5) {
    //         return yearEducation;
    //     } else return endEducation;
    // }

    getAge() {
        const today = new Date();
        let age = today.getFullYear() - this.birthday.getFullYear();
        var m = today.getMonth() - this.birthday.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < globalThis.birthday.getDate())) {
            age--;
        }
        return age;
    }


}

