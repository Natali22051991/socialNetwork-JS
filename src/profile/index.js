import "../initExit.js";
import "../initMenu.js";
import { getProfile, session } from "../util.js";

const wallDiv = document.querySelector('[data-segment="wall"]');
const postTemplate = document.querySelector('[data-template="post"]');
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

const { format } = new Intl.DateTimeFormat('ru-RU', {
    hour: 'numeric',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

main();
async function main() { //инициализация user и profile
    user = await session();// вызываем сессию

    const sp = new URLSearchParams(location.search); //передаем параметр и смотрим
    if (sp.has('userId')) { //есть параметр имеет юзер айди
        const userId = parseInt(sp.get('userId', 10));//если есть мы его забираем, распасить делаем, тк все хранитсяв строчку
        profile = await getProfile(userId); // если есть юзер, так же получаем его профиль
    } else if (user) {//если нет юзера айди 
        console.log(user);
        profile = await getProfile(user.id);//получаем по сессии профайл
    } else {
        return (location.href = "/");
    }

    // profile.friend = false;
    // profile.request = false;

    // console.log({ user, profile });
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
        sendPostButton.addEventListener('click', sendPost);
    }

    console.log({ profile, user });
    initWall();
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
//запрос на получение данных по посту
async function sendPost() {
    const content = fieldPostTextarea.value.trim();
    console.log(content)
    if (!content) {
        return;
    }
    try {
        const response = await fetch('api/post', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content, userId: profile.user.id, }),
        });

        if (response.ok) {

            location.reload();
            return;
        }
        const text = await response.text();
        throw Error(text);

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

//выводим все данные в див
function creatPost(post) {
    const postDiv = document.importNode(postTemplate.content, true).firstElementChild; //cоздаем копию
    postDiv.dataset.postId = post.id;
    const avatarImg = postDiv.querySelector('[data-field="avatar"]')
    avatarImg.src = post.user.img;
    const avatarLinkA = postDiv.querySelector('[data-field="avatarlink"]')
    avatarLinkA.href = `/profile.html?userId=${post.userId}`;
    const nameA = postDiv.querySelector('[data-field="name"]')
    nameA.textContent = `${post.user.name} ${post.user.surname}`;
    nameA.href = `/profile.html?userId=${post.userId}`;
    const createdAtSpan = postDiv.querySelector('[data-field="createdAt"]')
    createdAtSpan.textContent = format(new Date(post.createdAt));
    const contentDiv = postDiv.querySelector('[data-field="content"]');
    contentDiv.textContent = post.content;
    const removeButton = postDiv.querySelector('[data-action="remove"]');
    const editButton = postDiv.querySelector('[data-action="edit"]');
    const likeButton = postDiv.querySelector('[data-field="like"]');
    likeButton.classList.remove('btn-outline-primary', 'btn-outline-secondary');
    // post.likes = 5;
    // post.liked = 5;
    if (post.liked) {
        likeButton.classList.add('btn-outline-primary');
    } else {
        likeButton.classList.add('btn-outline-secondary');
    }
    const likeCounterI = likeButton.querySelector('i');

    likeCounterI.classList.remove('bi-hand-thumbs-up-fill', 'bi-hand-thumbs-up');
    if (post.likes) {
        likeCounterI.textContent = `  ${post.likes}`;
        likeCounterI.classList.add('bi-hand-thumbs-up-fill');
    } else {
        likeCounterI.textContent = '';
        likeCounterI.classList.add('bi-hand-thumbs-up');
    }
    if (user && (user.id === profile.user.id || post.userId === user.id)) {
        removeButton.classList.remove('invisible');

    } else {
        removeButton.classList.add('invisible');
        editButton.classList.add('invisible');
    }

    if (user && user.id === post.userId) {

        editButton.classList.remove('invisible');
    } else {

        editButton.classList.add('invisible');
    }

    return postDiv;
}

function initWall() {
    const postDivs = profile.posts.map(creatPost);
    postDivs.forEach(initPostDiv);
    wallDiv.innerHTML = '';
    // wallDiv.append(...profile.posts.map(creatPost)); могли бы сделать так же, но последуем другому методу, для разнообразия
    wallDiv.append(...postDivs);
}

function initPostDiv(postDiv) {


    const removeButton = postDiv.querySelector('[data-action="remove"]');
    const editButton = postDiv.querySelector('[data-action="edit"]');
    const likeButton = postDiv.querySelector('[data-field="like"]');

    likeButton.addEventListener('click', toggleLike);
    removeButton.addEventListener('click', removePost);
    editButton.addEventListener('click', startEditorPost)
    return postDiv;
}

//POST/api/liketoggle/:postId
async function toggleLike() {
    const div = this.closest("div[data-post-id]");// находим родительский элемент . ссылается на ту кнопку где это событие произошло
    const postId = parseInt(div.dataset.postId, 10);//парсим
    // console.log(postId);
    try {
        const response = await fetch(`/api/liketoggle/${postId}`, {
            method: "POST",
        });
        if (response.ok) {
            const nextPost = await response.json();
            const postDiv = creatPost(nextPost);
            initPostDiv(postDiv);
            div.replaceWith(postDiv);//текущий заменяем на новый
            const post = profile.posts.find((post) => post.id === postId);//находим текущее значение
            Object.assign(post, nextPost);//сливаем данные которые в новом посту в старый
            return;
        }
        const text = await response.text();
        throw Error(error);
    } catch (error) {
        console.error(error);
    }

}
async function removePost() {
    const answer = confirm('Вы уверенны,что хотите удалить пост?');// вызывает доп окно,где может быть результат ДА/НЕТ
    if (!answer) {
        return;
    }
    const div = this.closest("div[data-post-id]");// находим родительский элемент . ссылается на ту кнопку где это событие произошло
    const postId = parseInt(div.dataset.postId, 10);//парсим
    // console.log(postId);
    try {
        const response = await fetch(`/api/post/${postId}`, {
            method: "DELETE",
        });
        if (response.ok) {
            // const post = await response.json();
            // const postDiv = creatPost(post);
            // initPostDiv(postDiv);
            profile.posts = profile.posts.filter((post) => post.id !== postId);//с помощью filter мы удалили те посты, которые не сохранили со стены
            div.remove();//удаление поста
            return;
        }
        const text = await response.text();
        throw Error(error);
    } catch (error) {
        console.error(error);
    }
}
function startEditorPost() {
    const div = this.closest("div[data-post-id]");// находим родительский элемент . ссылается на ту кнопку где это событие произошло
    const editorDiv = div.querySelector('[data-segment="editor"]');
    const actionsDiv = div.querySelector('[ data-segment="actions"]');
    const contentDiv = div.querySelector('[data-field="content"]');
    const editorTextarea = div.querySelector('[data-field="editor"]');
    const saveButton = div.querySelector('[data-action="save"]');

    const postId = parseInt(div.dataset.postId, 10);//парсим
    const post = profile.posts.find((post) => post.id === postId);

    editorDiv.classList.remove('d-none');
    actionsDiv.classList.add('d-none');
    contentDiv.classList.add('d-none');
    editorTextarea.value = post.content;
    editorTextarea.focus();
    saveButton.addEventListener('click', savePost);
}

//PATCH/api/post/:postId
async function savePost() {
    const div = this.closest("div[data-post-id]");
    const editorTextarea = div.querySelector('[data-field="editor"]');
    const saveButton = div.querySelector('[data-action="save"]');

    const postId = parseInt(div.dataset.postId, 10);//парсим
    const content = editorTextarea.value.trim();

    if (!content) {
        alert('not');
    } else {
        try {
            const response = await fetch(`/api/post/${postId}`, {
                method: "PATCH",//метод на перезаписывание данных
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ content }),
            });
            if (response.ok) {
                const nextPost = await response.json();
                const postDiv = creatPost(nextPost);
                initPostDiv(postDiv);
                div.replaceWith(postDiv);//текущий заменяем на новый
                const post = profile.posts.find((post) => post.id === postId);
                Object.assign(post, nextPost);//сливаем данные которые в новом посту в старый
                return;
            }
            const text = await response.text();
            throw Error(error);
        } catch (error) {
            console.error(error);
        }
    }
}

