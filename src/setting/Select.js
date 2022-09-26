// будет имитировать и контролировать поведение
class Select {
    options = [];
    constructor() {
        const ul = document.createElement('ul');
        ul.className = 'nav nav-tabs mb-3';
        this.ul = ul;
    }
    add(option) { //метод добавления
        this.options.push(option);
        this.ul.append(option.li);
        option.on('select', code => this.start(code));//начинаем слушать,переключаться между вкладками(select именно ловит событие)
    }
    start(code) {//метод старт, будем пробегаться по options
        for (const option of this.options) {
            if (option.code === code) {//если код option совпадает с кодом который мы хотим активизировать
                option.activate();
            } else {
                option.deactivate();
            }
        }
    }
}

export default Select; //экспортируем поумолчанию