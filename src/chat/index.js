import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import "../initExit.js";
import { session } from "../util.js";
import "../initMenu.js";
import Chat from "./Chat.js";
import Chatlist from "./Chatlist.js";

const chatListDiv = document.querySelector('[data-segment="chatlist"]');

main();

async function main() {
    const user = await session(() => location.href = '/');
    const socket = new io({ path: "/api/chat" });//объект в котором указать путь:
    const sp = new URLSearchParams(location.search)//соч параметр

    if (sp.has('userId')) {//если у нас есть соч параметр
        const friendId = parseInt(sp.get('userId'), 10);//забираем параметр
        const chat = new Chat(user);//чтобы реализовать сенарий

        socket.emit('getChat', friendId, ({ friend, messages }) => {// у сокет соединения есть возможность отправлять запросы, возвращать и когда он будет принимать сообщение
            //мы будем отправлять в экземпляр класса
            chat.friend = friend;
            chat.addMessage(...messages);
            // document.body.append(chat.messages[0].div)
            // document.body.append(chat.messages[1].div)
        });
        //а когда будет событие экземпляра класса мы будем передавать его в сокет
        chat.on('message', (content) => socket.emit('message', { content, friendId }));
        //когда к нам приходит от бэка сообщение мы его добавляем в чат
        socket.on('message', (message) => chat.addMessage(message));

        // window.socket = socket;//выкинет сокет соединение в window,чтобы управлять там и смотреть пример в консоли -socket.emit('message',{content:'Привет',friendId: 2})
        /**
         * ответ таков:{
              "id": "cl8cqtpxh0000dcur0d6bdy7v",
              "senderId": 1,
              "receiverId": 2,
              "content": "Привет",
              "createdAt": 1663832355481,
              "readed": false
           }
           записывает на бэк
         */
    } else {
        socket.on('init', (data) => chatList.init(data));
        const chatList = new Chatlist(user);
        chatListDiv.innerHTML = '';
        chatListDiv.append(chatList.ul)
        chatListDiv.classList.remove('d-none');
        chatList.on('select', (friendId) => location.href = `/chat.html?userId=${friendId}`);
    }
}