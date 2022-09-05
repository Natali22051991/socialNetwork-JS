import "../initExit.js";
import "../initMenu.js";
import { getProfile, session } from "../util.js";

const fieldAvatarImg = document.querySelector('[data-field="avatar"]');
const fieldNameDiv = document.querySelector('[data-field="name"]');
const fieldStatusSmall = document.querySelector('[data-field="status"]');
const addFriendButton = document.querySelector('[data-action="addFriend"]');
const removeRequestButton = document.querySelector('[data-action="removeRequest"]');
const removeFriendButton = document.querySelector('[data-action="removeFriend"]');
const startChatButton = document.querySelector('[data-action="startChat"]');
const fieldPostTextarea = document.querySelector('[data-field="postEdition"]');
const sendPostButton = document.querySelector('[data-action="sendPost"]');
const title = document.querySelector('title');
let user = null;
let profile = null;
main();
async function main() { //инициализация user и profile
    user = await session();// вызываем сессию

    const sp = new URLSearchParams(location.search); //передаем параметр и смотрим
    if (sp.has('userId')) { //есть параметр имеет юзер айди
        const userId = parseInt(sp.get('userId', 10));//если есть мы его забираем, распасить делаем, тк все хранитсяв строчку
        profile = await getProfile(userId); // если есть юзер, так же получаем его профиль
    } else if (user) {//если нет юзера айди 
        profile = await getProfile(user.id);//получаем по сессии профайл
    } else {
        return (location.href = "/");
    }

    // profile.friend = false;
    // profile.request = false;

    console.log({ user, profile });
    //инициализация данных пользователя
    fieldAvatarImg.src = profile.user.img;
    fieldStatusSmall.textContent = profile.user.status;
    fieldNameDiv.textContent = `${profile.user.name} ${profile.user.surname}`;
    title.textContent = `${profile.user.name} ${profile.user.surname}`;
    //отображение кнопок
    addFriendButton.classList.add("d-none");
    removeRequestButton.classList.add("d-none");
    removeFriendButton.classList.add("d-none");
    startChatButton.classList.add("d-none");

    if (profile.friend) {
        removeFriendButton.classList.remove('d-none');
        startChatButton.classList.remove('d-none');
        removeFriendButton.addEventListener('click', removeFriend);
        startChatButton.addEventListener('click', function startChat() {
            location.href = `/chat.html?userId=${profile.user.id}`;
        });
    } else if (profile.request) {
        removeRequestButton.classList.remove('d-none');
        removeRequestButton.addEventListener('click', removeRequest);
    } else if (user && user.id !== profile.user.id) {
        addFriendButton.classList.remove('d-none');
        addFriendButton.addEventListener('click', addFriend);
    }
    // видимость текстериа некликабельна
    //инициализация поста
    fieldPostTextarea.disabled = true;
    sendPostButton.disabled = true
    fieldPostTextarea.value = 'На стене могут писать только друзья';
    if ((user && user.id === profile.user.id) || (profile.friend)) {
        fieldPostTextarea.disabled = false;
        sendPostButton.disabled = false;
        fieldPostTextarea.value = '';
    }


}
//POST/api/request/:userId
async function addFriend() {
    // console.log('11111')
    try {
        const response = await fetch(`/api/request/${profile.user.id}`, { method: "POST" });
        console.log(response)
        if (response.ok) {
            location.reload();
            console.log('ffff')
            return;
        }
        console.log('444')
        const text = await response.text();
        throw Error(error);


    } catch (error) {
        console.error(error);
        alert(error.message);
    }

}

////POST/api/revoke/:userId
async function removeRequest() {
    try {
        const response = await fetch(`/api/revoke/${profile.user.id}`, { method: "POST" });
        if (response.ok) {
            location.reload();
            console.log('ffff')
            return;
        }
        const text = await response.text();
        throw Error(error);


    } catch (error) {
        console.error(error);
        alert(error.message);
    }

}
////DELETE/api/friend/:userId
async function removeFriend() {
    try {
        const response = await fetch(`/api/friend/${profile.user.id}`, { method: "DELETE" });
        if (response.ok) {
            location.reload();
            console.log('ffff')
            return;
        }
        const text = await response.text();
        throw Error(error);


    } catch (error) {
        console.error(error);
        alert(error.message);
    }

}

