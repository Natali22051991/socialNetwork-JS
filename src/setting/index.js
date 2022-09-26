import "../initExit.js";
import { session } from "../util.js";
<<<<<<< HEAD
=======

>>>>>>> 35ccd92ea5d086273440020ca56b036a2565bdae
import "../initMenu.js";
import Select from './Select.js';
import Emailoption from "./EmailOption.js";
import NameOption from "./NameOption.js";
import StatusOption from "./StatusOption.js";
import PasswordOption from "./PasswordOption.js";
import AvatarOption from "./AvatarOption.js";

const selectDiv = document.querySelector('[data-segment="select"]');
main();

async function main() {
    const user = await session(() => (location.href = "/"));// вызываем сессию, если ее нет отправляем на главную страницу
    const select = new Select();//создадим экземпляр с классом Select
    select.add(new Emailoption(user.email));//передаем пользователя почту
    select.add(new NameOption(user.name, user.surname));//select.add(new Option('Имя/Фамилия', 'name'));
    select.add(new PasswordOption(user.password));//select.add(new Option('Пароль', 'password'));
    select.add(new AvatarOption(user.avatar));//    select.add(new Option('Аватар', 'avatar'));
    select.add(new StatusOption(user.status));//  select.add(new Option('Статус', 'status'));
    select.start('avatar');

    selectDiv.innerHTML = '';//очистим контейнер
    selectDiv.append(select.ul);//вставим сюда наш список
}