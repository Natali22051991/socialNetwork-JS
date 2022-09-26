import EventEmitter from "../EventEmitter.js";

const chatItemTemplate = document.querySelector('[data-template="chatitem"]');

class Chatlist extends EventEmitter {
    user = null;
    constructor(user) {
        super();
        const ul = document.createElement('ul');
        ul.className = 'list-group';
        this.ul = ul;
        this.user = user;
    }

    init(data) {
        for (const item of data) {
            const person = item.sender.id === this.user.id ? item.receiver : item.sender; //благодаря этому мы будем брать того,с кем переписываеимся, а не того,кому принадлежит сообщение
            const chatItemDiv = document.importNode(
                chatItemTemplate.content, true).firstElementChild;
            this.ul.append(chatItemDiv);

            const avatarImg = chatItemDiv.querySelector('[data-field="avatar"]');
            avatarImg.src = person.img;

            const nameSpan = chatItemDiv.querySelector('[data-field="name"]');
            nameSpan.textContent = `${person.name} ${person.surname}`;

            const linkA = chatItemDiv.querySelector('[data-field="link"]');
            // linkA.href = `/chat.html?userId=${person.id}`;
            linkA.addEventListener('click', (e) => {
                e.preventDefault();
                this.emit('select', person.id)
            });
        }
    }
}
export default Chatlist;