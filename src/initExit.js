import { session } from "./util.js";
const signoutButton = document.querySelector('[data-action="signout"]');

main();
async function main() {
    const user = await session();// вызываем сессию
    console.log(user);
    if (user) {//если сессия существует
        signoutButton.classList.remove('d-none');
        signoutButton.addEventListener('click', signout);
    } else {
        signoutButton.classList.add('d-none');
    }
}

async function signout() {
    try {
        const response = await fetch("/api/signout", { method: "POST" });
    } catch (error) {
        console.error(error);
    } finally {// перезагрузка страницы в любом сценарии
        location.reload();
    }
}