import EventEmitter from "../EventEmitter.js"
import Message from "./Message.js";
import { read } from "../initMenu.js";

const chatDiv = document.querySelector('[data-segment="chat"');

const messagesDiv = chatDiv.querySelector('[data-segment="message"]');

const messageTextarea = chatDiv.querySelector('[data-field="message"]');

// реализуем Singleton application чтобы не задваивать эземпляры класса
let chatInstance = null;

class Chat extends EventEmitter {//будет управлять поведением, ловить низкоуровневые события, отправлять через сентдаун, для этого унаследовать от Event Emiterd
    //то что чат должен изначально знать
    user = null;
    friend = null;
    messages = [];

    constructor(user) {
        super();
        if (chatInstance) { //если он определен
            return chatInstance; //возвращаем его
        }
        chatInstance = this;
        this.user = user;

        chatDiv.classList.remove('d-none');
        messageTextarea.addEventListener('keydown', event => {
            this.messageHandler(event);//делегируем событие в messageHandler
        });
    }
    //отображает и хранит сообщения
    addMessage(...datas) {
        for (const data of datas) {
            const author = data.senderId === this.user.id ? this.user : this.friend;
            const message = new Message(data, author);
            messagesDiv.append(message.div)
            this.messages.push(message); //запоминаем
            if (!data.readed) {
                console.log(data.id);
                read(data.id);
                data.readed = true;
            }
        }
        messagesDiv.scrollTo(
            0,
            Math.max(
                messagesDiv.scrollHeight,
                messagesDiv.offsetHeight,
                messagesDiv.clientHeight
            )
        );
    }
    messageHandler(event) {
        // console.log(event);
        if (event.code !== 'Enter' || event.ctrlKey || event.shiftKey) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();

        const content = messageTextarea.value.trim();
        if (content) {
            this.emit('message', content);
        }
        messageTextarea.value = '';
    }
}

export default Chat;