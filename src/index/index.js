import FormSegment from "../FormSegment.js";
import { isEmail, session } from "../util.js";

const enterButton = document.querySelector('[data-action="enter"]');

const emailSegment = new FormSegment('email');
const passwordSegment = new FormSegment('password');

main();

async function main() {
    const user = await session();// вызываем сессию
    if (user) {//если сессия существует
        return location.href = '/profile.html';
    }
    enterButton.addEventListener('click', validate);

    emailSegment.input.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            passwordInput.focus();
        }
    });

    passwordSegment.input.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            validate();
        }
    });
}

function validate() {
    let flag = true;
    //почта
    const email = emailSegment.input.value;
    emailSegment.ressetValid();

    if (!isEmail(email)) {
        flag = false;
        emailSegment.setInvalid('Нужно указать почту.');

    } else {
        emailSegment.setValid();
    }
    //пароль
    passwordSegment.ressetValid();
    const password = passwordSegment.input.value;

    if (password.length < 3) {
        flag = false;
        passwordSegment.setInvalid('Пароль должен состоять минимум из 3-х символов.')
    } else {
        passwordSegment.ressetValid();
    }
    if (flag) {
        enter();
    }
}
async function enter() {
    //сброс классов почта
    const email = emailSegment.input.value.trim();
    emailSegment.ressetValid();
    //пароль

    const password = passwordSegment.input.value;
    passwordSegment.input.value = '';
    passwordSegment.ressetValid();

    const data = new FormData();
    data.append('email', email);
    data.append('password', password);

    try {
        const response = await fetch("/api/signin", {
            method: "POST",
            body: data,
            // headers: {
            //     "Content-Type": "application/json",
            // },
            // body: JSON.stringify({ email, password }),// отправляем на бэк данные
        })
        console.log(response);
        if (response.ok) {
            alert('Вы успешно авторизировались');
            location.href = '/profile.html';
            return;
        }
        const text = await response.text();//забираем текст ошибки и выводит в алерт
        throw Error(text);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

