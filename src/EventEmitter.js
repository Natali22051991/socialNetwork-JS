class EventEmitter {//класс будет имитировать событийно-ориентированную парадигму те он будет в себе констерировать обработчики каких то событий и эти события трикеить
    handlers = new Map();//коллекция мап
    addEventLestener(name, handler) {// function принимает в себе имя события
        if (!this.handlers.has(name)) {// если он еще не умеет обрабатывать такие события(не знает это событие),то
            this.handlers.set(name, new Set());//тогда мы его добавляем
        }
        const handlers = this.handlers.get(name);//получаем set коллекцию
        handlers.add(handler); //и в нее добавим наш handler
    }

    on(...args) {//псевдоним для addEventLestener просто on
        return this.addEventLestener(...args);
    }

    emit(name, arg) { // иммитируем событие, arg -какой-то параметр
        if (this.handlers.has(name)) {//если у нас есть такой обработчик собития по name
            const handlers = this.handlers.get(name);// мы берем эти обработчики и

            for (const handler of handlers) {// пробегаемся по ним
                handler(arg);// вызываем их с нашим аргуметом arg
            }
        }
    }
}

export default EventEmitter;
// еще мы могли добавить removeEventLestener, oneEventLestener, of как псевдоним для removeEventLestener, но пока функционала хватит