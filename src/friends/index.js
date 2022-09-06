import { session } from "../util.js";
import "../initExit.js";
import "../initMenu.js";


const friendCardTamplate = document.querySelector('[data-template="friendCard"]');

const requestsH = document.querySelector('[data-sigment="requests"][data-type="header"]');
const requestsDiv = document.querySelector('[data-sigment="requests"][data-type="list"]');
const friendsH = document.querySelector('[data-sigment="friends"][data-type="header"]');
const friendsDiv = document.querySelector('[data-sigment="friends"][data-type="list"]');
console.log(requestsH)
console.log(requestsDiv)
console.log(friendsH)
console.log(friendsDiv)

let friends = [];
let requests = [];

main();
// data-field="link"
// data-field="avatar"
// data-field="name"
async function main() {
    await session(function () { location.href = '/'; });//проверяем если пользователь авторизован остаемся на этой странице , или же перекидываем его на главную
    await init();

    initRequests();
    initFriends();//самодокументированный
    // console.log({ friends, requests });
}
// const friendCard = creatFriendCard({ id: 1, name: 'Ольга', surname: 'Иванова', img: '/src/avatar.png' });
function creatFriendCard(user) {
    //template хранит документ фрагмент, а документ-фрагмент уже первый элемент нужный  нам
    const friendCard = document.importNode(friendCardTamplate.content, true).firstElementChild; //клонируем


    const avatarImg = friendCard.querySelector('[data-field="avatar"]');
    const nameSpan = friendCard.querySelector('[data-field="name"]');

    friendCard.href = `/profile.html?userId=${user.id}`;
    avatarImg.src = user.img;
    nameSpan.textContent = `${user.name} ${user.surname}`;
    console.log(friendCard);
    return friendCard;
}
//GET/api/friends
async function init() {

    try {
        const response = await fetch('/api/friends', { method: "GET" });
        if (response.ok) {
            const data = await response.json();
            // console.log(user);
            friends = data.friends;//почему дата?????
            requests = data.requests;//почему дата?????
            return;
        }

        const text = await response.text();
        throw Error(text);

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function initRequests() {
    if (!requests.length) {
        requestsH.classList.add('d-none');
        requestsDiv.classList.add('d-none');
        return;
    }
    requestsH.classList.remove('d-none');
    requestsDiv.classList.remove('d-none');
    requestsDiv.append(...requests.map(creatFriendCard));
}

function initFriends() {
    if (friends.length) {
        friendsH.classList.remove('d-none');
        friendsDiv.classList.remove('d-none');
        friendsDiv.append(...friends.map(creatFriendCard));
    }
}
//сделала обе функции через иннертекст, н оможно было сделать через навешивание классов.но сли по умолчанию класс висит, то тогда только через классы