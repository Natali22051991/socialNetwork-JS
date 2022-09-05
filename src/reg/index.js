import { isEmail, session } from "../util.js";

const igroupEmail = document.querySelector('[data-igroup="email"]');
const igroupFirstName = document.querySelector('[data-igroup="firstName"]');
const igroupLastName = document.querySelector('[data-igroup="lastName"]');
const igroupPassword = document.querySelector('[data-igroup="password"]');
const igroupConfirm = document.querySelector('[data-igroup="confirm"]');
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
    const nameFormFloating = igroupFirstName.querySelector('.form-floating');
    const nameInput = igroupFirstName.querySelector('input');
    const name = nameInput.value.trim();

    nameFormFloating.classList.remove("is-valid", "is-invalid");
    nameInput.classList.remove("is-valid", "is-invalid");

    if (!name) {
        flag = false;
        nameFormFloating.classList.add("is-invalid");

        nameInput.classList.add('is-invalid');
    } else {
        nameFormFloating.classList.add("is-valid");

        nameInput.classList.add('is-valid');
    }
    // фамилия
    const lastNameFormFloating = igroupLastName.querySelector('.form-floating');
    const lastNameInput = igroupLastName.querySelector('input');
    const surname = lastNameInput.value.trim();

    lastNameFormFloating.classList.remove("is-valid", "is-invalid");
    lastNameInput.classList.remove("is-valid", "is-invalid");

    if (!surname) {
        flag = false;
        lastNameFormFloating.classList.add("is-invalid");

        lastNameInput.classList.add('is-invalid');
    } else {
        lastNameFormFloating.classList.add("is-valid");

        lastNameInput.classList.add('is-valid');
    }

    // почта
    const emailFormFloating = igroupEmail.querySelector('.form-floating');
    const emailInput = igroupEmail.querySelector('input');
    const email = emailInput.value.trim();

    emailFormFloating.classList.remove("is-valid", "is-invalid");
    emailInput.classList.remove("is-valid", "is-invalid");

    if (!isEmail(email)) {

        flag = false;
        emailFormFloating.classList.add("is-invalid");

        emailInput.classList.add('is-invalid');

    } else {
        emailFormFloating.classList.add("is-valid");

        emailInput.classList.add('is-valid');
    }
    // пароль
    const passwordFormFloating = igroupPassword.querySelector('.form-floating');
    const passwordInput = igroupPassword.querySelector('input');
    const password = passwordInput.value;

    passwordFormFloating.classList.remove("is-valid", "is-invalid");
    passwordInput.classList.remove("is-valid", "is-invalid");

    if (password.length < 3) {
        flag = false;
        passwordFormFloating.classList.add("is-invalid");

        passwordInput.classList.add('is-invalid');
    } else {
        passwordFormFloating.classList.add("is-valid");

        passwordInput.classList.add('is-valid');
    }

    // повтор пароля
    const сonfirmFormFloating = igroupConfirm.querySelector('.form-floating');
    const сonfirmInput = igroupConfirm.querySelector('input');
    const сonfirmPassword = сonfirmInput.value;

    сonfirmFormFloating.classList.remove("is-valid", "is-invalid");
    сonfirmInput.classList.remove("is-valid", "is-invalid");

    if (!сonfirmPassword || сonfirmPassword != password) {
        flag = false;
        сonfirmFormFloating.classList.add("is-invalid");

        сonfirmInput.classList.add('is-invalid');
    } else {
        if (сonfirmPassword === password) {
            сonfirmFormFloating.classList.add("is-valid");

            сonfirmInput.classList.add('is-valid');
        } else {
            сonfirmFormFloating.classList.add("is-invalid");

            сonfirmInput.classList.add('is-invalid');
        }

    }

    if (flag) {
        registration();
    }

}

//POST/api/reg -адрес
async function registration() {
    //сброс классов,тк все валидно
    // имя
    const nameFormFloating = igroupFirstName.querySelector('.form-floating');
    const nameInput = igroupFirstName.querySelector('input');
    const name = nameInput.value.trim();
    nameFormFloating.classList.remove("is-valid", "is-invalid");
    nameInput.classList.remove("is-valid", "is-invalid");

    // фамилия
    const lastNameFormFloating = igroupLastName.querySelector('.form-floating');
    const lastNameInput = igroupLastName.querySelector('input');
    const surname = lastNameInput.value.trim();

    lastNameFormFloating.classList.remove("is-valid", "is-invalid");
    lastNameInput.classList.remove("is-valid", "is-invalid");


    // почта
    const emailFormFloating = igroupEmail.querySelector('.form-floating');
    const emailInput = igroupEmail.querySelector('input');
    const email = emailInput.value.trim();

    emailFormFloating.classList.remove("is-valid", "is-invalid");
    emailInput.classList.remove("is-valid", "is-invalid");

    // пароль
    const passwordFormFloating = igroupPassword.querySelector('.form-floating');
    const passwordInput = igroupPassword.querySelector('input');
    const password = passwordInput.value;

    passwordFormFloating.classList.remove("is-valid", "is-invalid");
    passwordInput.classList.remove("is-valid", "is-invalid");

    // повтор пароля
    const сonfirmFormFloating = igroupConfirm.querySelector('.form-floating');
    const сonfirmInput = igroupConfirm.querySelector('input');



    сonfirmFormFloating.classList.remove("is-valid", "is-invalid");
    сonfirmInput.classList.remove("is-valid", "is-invalid");
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