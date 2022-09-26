import FormSegment from "../FormSegment.js";
import { isEmail, session } from "../util.js";

const emailSegment = new FormSegment('email');
const namelSegment = new FormSegment('name');
const surnameSegment = new FormSegment('surname');
const passwordSegment = new FormSegment('password');
const confirmSegment = new FormSegment('confirm');

const regButton = document.querySelector('[data-action="reg"]');

main();

async function main() {//функция которая будет точкой входа в приложение,создаем ее сначала
    const user = await session();// вызываем сессию
    if (user) {//если сессия существует
        return location.href = '/profile.html';
    }
    regButton.addEventListener('click', validate);

}

function validate() {
    let flag = true;
    // имя

    const name = namelSegment.input.value.trim();
    namelSegment.ressetValid();

    if (!name) {
        flag = false;
        namelSegment.setInvalid('Нужно указать имя.');
    } else {
        namelSegment.setValid();
    }
    // фамилия

    const surname = surnameSegment.input.value.trim();
    surnameSegment.ressetValid();

    if (!surname) {
        flag = false;
        surnameSegment.setInvalid('Нужно указать фамилию.')
    } else {
        surnameSegment.setValid();
    }

    // почта

    const email = emailSegment.input.value.trim();
    emailSegment.ressetValid();

    if (!isEmail(email)) {
        flag = false;
        emailSegment.setInvalid('Нужно указать почту.');

    } else {
        emailSegment.setValid();
    }
    // пароль

    const password = passwordSegment.input.value;
    passwordSegment.ressetValid();

    if (password.length < 3) {
        flag = false;
        passwordSegment.setInvalid('Пароль должен быть длиной не менее 3-х символов.');
    } else {
        passwordSegment.setValid();
    }

    // повтор пароля
    const сonfirmPassword = confirmSegment.input.value;
    confirmSegment.ressetValid();

    if (!сonfirmPassword || сonfirmPassword !== password) {
        flag = false;
        confirmSegment.setInvalid('Пароль и подтверждения должны совпадать.');
    } else {
        confirmSegment.setValid();
    }

    if (flag) {
        registration();
    }
}

//POST/api/reg -адрес
async function registration() {
    //сброс классов,тк все валидно
    // имя
    namelSegment.ressetValid();
    const name = namelSegment.input.value.trim();

    // фамилия
    surnameSegment.ressetValid();
    const surname = surnameSegment.input.value.trim();

    // почта
    emailSegment.ressetValid();
    const email = emailSegment.input.value.trim();

    // пароль
    passwordSegment.ressetValid();
    const password = passwordSegment.input.value;
    passwordSegment.input.value = '';

    // повтор пароля
    confirmSegment.ressetValid();
    confirmSegment.input.value = '';

    try {
        const response = await fetch("/api/reg", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, name, surname }),
        });

        if (response.ok) {
            alert('Регистрация прошла успешно');
            location.href = '/index.html';
            return;
        }
        const text = await response.text();
        throw Error(text);

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}