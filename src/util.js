const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function isEmail(str) {
    return emailRegex.test(str);
}

//get/api/session
export async function session(unauthenticatedCallback = () => { }) { // отправить запрос
    // промис должен возвращать резолв реджект, в нашем случае всегда резолв, подумать о том как сделать правильно,в соостветствии с парадигмой 
    try {
        const response = await fetch('/api/session'); // получаем ответ есть ли сессия
        if (response) {
            const data = await response.json();
            return data;
        }
        unauthenticatedCallback();
    } catch (error) {
        console.error(error);
    }
}

//GET/api/user/:userId
export async function getProfile(userId) { // отправить запрос
    try {
        const response = await fetch(`/api/user/${userId}`, { method: "GET" }); // получаем ответ есть ли сессия
        if (response) {
            const user = await response.json();
            return user;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function getDivMessage(content) {
    const lines = content.replace(/\n{1,}/g, "\n")
        .split('\n').map((line) => line
            .replace(/\s{1,}/g, '').trim()).filter((line) => line);

    // content = content.replace(/\n{1,}/g, "\n"); // все переносы новых строк сделаем в единственном экземпляре
    // content = content.split('\n');//разобьем контент по переносам строк
    // content = content.map((line) => line.replace(/\s{1,}/g, ''));//в каждой строке избавимся от подряд идущих пробельных символах
    // content = content.map((line) => line.trim());//очищаем каждую строчку
    // content = content.filter((line) => line);//отфильтруем на пустые строки(не нужны)

    const div = document.createElement('div');
    div.append(...lines.map(line => {
        const p = document.createElement('p');
        p.textContent = line;
        return p;
    }))

    return div;
}
