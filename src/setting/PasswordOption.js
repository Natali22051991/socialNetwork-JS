import Option from "./Option.js";
import FormSegment from "../FormSegment.js";

class PasswordOption extends Option {
    constructor() {
        super('Пароль', 'password');
        const { form } = this;
        const passwordSegment = new FormSegment('password', form);//создаем сегменты
        const confirmdSegment = new FormSegment('confirm', form);//создаем сегменты
        Object.assign(this, { passwordSegment, confirmdSegment });
    }

    validate() {
        const { passwordSegment, confirmdSegment } = this;
        const password = passwordSegment.input.value;
        const confirmPassword = confirmdSegment.input.value;

        let flag = true;

        passwordSegment.ressetValid();
        confirmdSegment.ressetValid();

        if (password.lenght < 3) {
            flag = false;
            passwordSegment.setInvalid('Пароль должен быть не менее  3-х символов');
        } else {
            passwordSegment.setValid();
        }

        if (!confirmPassword) {
            flag = false;
            confirmdSegment.setInvalid('Укажите пароль дважды.');
        } else if (confirmPassword !== password) {
            flag = false;
            confirmdSegment.setInvalid('Пароль и подтверждение должны совпадать.');
        } else {
            confirmdSegment.setValid();
        }
        return flag;
    }
    //PATCH/api/user/password
    //{password}
    async save() {
        const { passwordSegment, confirmdSegment } = this;
        passwordSegment.ressetValid();
        confirmdSegment.ressetValid();
        const password = passwordSegment.input.value;
        passwordSegment.input.value = '';
        confirmdSegment.input.value = '';
        try {
            const response = await fetch('/api/user/password', {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            if (response.ok) {
                return passwordSegment.setValid('Пароль успешно обновлен.');
            }
            const text = await response.text();
            throw Error(text);
        } catch (error) {
            passwordSegment.setInvalid(error.message);
            console.error(error);
        }
    }
}
export default PasswordOption;