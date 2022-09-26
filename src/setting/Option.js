import EventEmitter from "../EventEmitter.js";

class Option extends EventEmitter {//так как он будет имитировать собственное событие мы будет его наследовать от EventEmitter
    // title = null;
    // code = null; тк мы нигде их(нет сценариев) не используем кроме контсруктора можем их не объявлять!!!!!
    constructor(title, code) {//происходит кастомизация, поэтому передаем title- то что будет внутри кнопки,code- внутри самого раздела
        super();//чтобы вызвать контсруктор родительского класса
        //сгенерируем список
        const li = document.createElement('li');
        li.className = 'nav-item';

        const form = document.querySelector(`[data-tab="${code}"]`); //найдем все формы
        const button = document.createElement('button');
        button.classList.add('nav-link');
        button.textContent = title;
        button.addEventListener('click', () => this.emit('select', code));//генерируем для кнопки событие более высокого уровня, 
        //и мы можем имитировать событие тк Option является наследником от EventEmitter
        li.append(button);
        Object.assign(this, { li, button, title, code, form })

        const saveButton = form.querySelector('[data-action="save"]');
        saveButton.addEventListener('click', (event) => {
            event.preventDefault();//чтобы браузер видел кнопку
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (this.validate()) {//придумали сценарий и описали его методами, далее описываем эти методы
                this.save();
            }
        })
    }
    activate() { //добавит класс
        const { button, form } = this;//вытащим кнопку,форму
        button.classList.add('active');
        form.classList.remove('d-none');
    }
    deactivate() {//удалит класс
        const { button, form } = this;//вытащим кнопку
        button.classList.remove('active');
        form.classList.add('d-none');
    }
    validate() {
        return true;
    }
    save() {
        // console.log(111, this.code);
    }
}

export default Option;