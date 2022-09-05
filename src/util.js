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
            // console.log(user);
            return user;
        }
        return null;


    } catch (error) {
        console.error(error);
        return null;
    }

}