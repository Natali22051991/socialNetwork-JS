import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { session, getProfile } from "./util.js";


const menuDiv = document.querySelector('.col-3');

const notificationSpan = document.querySelector('[data-field="notification"]');

let socket = null;

main();
async function main() {
    if (!menuDiv) {
        return;
    }
    const user = await session();
    if (user) {
        menuDiv.classList.remove("invisible");
    } else {
        menuDiv.classList.add("invisible");
    }

    const { pathname } = location;
    let activeMenuItemTag = null;
    if (pathname === "/profile.html") {
        const sp = new URLSearchParams(location.search);

        if (sp.has("userId")) {
            const userId = parseInt(sp.get("userId"), 10);
            const profile = await getProfile(userId);

            if (profile.user.id === user.id) {
                activeMenuItemTag = "profile";
            }
        } else {
            activeMenuItemTag = "profile";
        }
    } else if (pathname === "/firends.html") {
        activeMenuItemTag = "friends";
    } else if (pathname === "/chat.html") {
        activeMenuItemTag = "chat";
    } else if (pathname === "/setting.html") {
        activeMenuItemTag = "setting";
    }

    const menuItems = document.querySelectorAll("[data-menuitem]");
    for (const menuItem of menuItems) {
        menuItem.classList.remove("active");
    }

    const menuItem = document.querySelector(
        `[data-menuitem="${activeMenuItemTag}"]`
    );

    if (menuItem) {
        menuItem.classList.add("active");
    }

    socket = new io({ path: "/api/notification" });
    socket.on("status", handler);
}

function handler(flag) {
    if (flag) {
        notificationSpan.classList.remove("d-none");
    } else {
        notificationSpan.classList.add("d-none");
    }
}

export function read(messageId) {
    socket.emit("status", messageId, handler);
}

