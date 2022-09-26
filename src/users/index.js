import "../initExit.js";

const usersListDiv = document.querySelector('[data-sigment="userslist"]');

main();
async function main() {
    try {
        const response = await fetch('/api/users', { method: "GET" });
        if (response.ok) {
            const users = await response.json();
            initUsersList(users);
            return;
        }
        const text = await response.text();//если есть ошибка забираем текст ошибки и выводит в алерт
        throw Error(text);//генерируем ошибку
    } catch (error) {
        console.error(error);
    }
    createUserItem(users);
}

function initUsersList(users) {
    usersListDiv.innerHTML = '';
    usersListDiv.append(...users.map(createUserItem)) // оператор спред ... узнать что это?!?!?!?!?!?
}

function createUserItem(user) {
    const a = document.createElement('a');
    a.className = "list-group-item list-group-item-action text-primary";
    a.textContent = `${user.name} ${user.surname}`;
    a.href = `/profile.html?userId=${user.id}`;
    return a;
}
