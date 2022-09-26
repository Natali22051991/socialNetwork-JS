import { getDivMessage } from "../util.js";

const messageTemplate = document.querySelector('[data-template="message"');

const { format } = new Intl.DateTimeFormat('ru-RU', {
    hour: 'numeric',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

class Message {//будет хранить в себе информацию о сообщении и его елемнт который будет сохраняться на тсранице?сначала будеьт виртуальный потом будем монтировать
    constructor(data, author) {
        const div = document.importNode(messageTemplate.content, true).firstElementChild;

        const avatarImg = div.querySelector('[data-field="avatar"');
        avatarImg.src = author.img;

        const avatarLink = div.querySelector('[data-field="avatarlink"]');
        avatarLink.href = `/profile.html?userId=${author.id}`;

        const nameA = div.querySelector('[data-field="name"]');
        nameA.src = `/profile.html?userId=${author.id}`;
        nameA.textContent = `${author.name} ${author.surname}`

        const createdAtSpan = div.querySelector('[data-field="createdAt"]');
        createdAtSpan.textContent = format(new Date(data.createdAt));

        const contentDiv = div.querySelector('[data-field="content"]');
        const contentView = getDivMessage(data.content);
        contentDiv.replaceWith(contentView);//заменим див
        contentDiv.textContent = data.content;

        Object.assign(this, { data, author, div });
    }
}
export default Message;

/**
 *  {
      "id": "cl8cqtpxh0000dcur0d6bdy7v",
      "senderId": 1,
      "receiverId": 2,
      "content": "Привет",
      "createdAt": 1663832355481,
      "readed": false
   }
 */