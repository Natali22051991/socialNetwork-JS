import FormSegment from "../FormSegment.js";
import Option from "./Option.js";


class NameOption extends Option {
    constructor(name, surname) {
        super('Имя / Фамилия', 'name');

        const { form } = this;
        const nameSegment = new FormSegment('name', form);//создаем сегменты
        const surnameSegment = new FormSegment('surname', form);

        Object.assign(this, { nameSegment, surnameSegment });
        nameSegment.input.value = name;
        surnameSegment.input.value = surname;
    }
    validate() {
        const { nameSegment, surnameSegment } = this;
        nameSegment.ressetValid();
        surnameSegment.ressetValid();
        const name = nameSegment.input.value.trim();
        const surname = surnameSegment.input.value.trim();

        let flag = true;

        if (!name) {
            flag = false;
            nameSegment.setInvalid('Нужно указать имя');
        } else {
            nameSegment.setValid();
        }

        if (!surname) {
            flag = false;
            surnameSegment.setInvalid('Нужно указать имя');
        } else {
            surnameSegment.setValid();
        }

        return flag;
    }

    //     PATCH/api/user
    // { name, surname }
    async save() {
        const { nameSegment, surnameSegment } = this;

        nameSegment.ressetValid();
        surnameSegment.ressetValid();
        const name = nameSegment.input.value.trim();
        const surname = surnameSegment.input.value.trim();

        try {
            const response = await fetch('/api/user', {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, surname }),
            });
            if (response.ok) {
                nameSegment.setValid('Имя сохранено.');
                surnameSegment.setValid('Фамилия сохранена.');
                return;
            }
            const text = await response.text();
            throw Error(text);
        } catch (error) {
            surnameSegment.setInvalid(error.message);
            console.error(error);
        }
    }
}
export default NameOption;