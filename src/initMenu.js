import { session, getProfile } from "./util.js";
const menuDiv = document.querySelector('[data-sigment="menu"]');

main();
async function main() {
    if (!menuDiv) {
        return;
    }
    const user = await session();// вызываем сессию
    if (user) {//если сессия существует
        // console.log(user);
        menuDiv.classList.remove('invisible');
    } else {
        menuDiv.classList.add('invisible');
    }

    const { pathname } = location;
    let activMenuItemTag = null;
    if (pathname === '/profile.html') {
        const sp = new URLSearchParams(location.search);
        if (sp.has("userId")) {// посмотреть что делает этот метод
            const userId = parseInt(sp.get("userId"), 10);
            const profile = await getProfile(userId);
            if (profile.user.id === user.id) {
                activMenuItemTag = 'profile';
            }
        } else {
            activMenuItemTag = 'profile';
        }

    } else if (pathname === '/friends.html') {
        activMenuItemTag = 'friends';
    } else if (pathname === '/chat.html') {
        activMenuItemTag = 'chat';
    } else if (pathname === '/setting.html') {
        activMenuItemTag = 'setting';
    }
    const menuItems = document.querySelectorAll('[data-menuitem]');
    for (const menuItem of menuItems) {
        menuItem.classList.remove('active');
    }

    const menuItem = document.querySelector(`[data-menuitem ="${activMenuItemTag}"]`); // посмотреть как встраивается 
    if (menuItem) {
        menuItem.classList.add('active');
    }
}