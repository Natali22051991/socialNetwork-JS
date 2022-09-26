import FormSegment from "../FormSegment.js";
import { isEmail } from "../util.js";
import Option from "./Option.js";

class Emailoption extends Option {//наследует все из Option

    constructor(email) {//чтобы взять почту,передаем ее сюда
        super('Почта', 'email');//берем из родительского
        const { form } = this; //берем форму для почты
        const emailSegment = new FormSegment('email', form);
        emailSegment.input.value = email;
        this.emailSegment = emailSegment;
        //переделали логику ниже убираем
        // const emailInput = form.querySelector('[data-field="email"]');//получаем инпут формы
        // emailInput.value = email;
    }
    validate() {
        const { emailSegment } = this;
        const email = emailSegment.input.value;
        const flag = isEmail(email);
        emailSegment.ressetValid();

        if (flag) {
            return true;
        }
        emailSegment.setInvalid();
        return false;
    }

    async save() {
        const { emailSegment } = this;// берем форму из контекста из экземпляра класса
        const email = emailSegment.input.value;
        emailSegment.ressetValid();

        try {
            const response = await fetch('/api/user', {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                return emailSegment.setValid('Почта успешно обновлена');

            }
            const text = await response.text();
            throw Error(text);
        } catch (error) {
            emailSegment.setInvalid(error.message);
            console.error(error);
        }
    }
    // validate() {
    //     const { form } = this;// берем форму из контекста из экземпляра класса

    //     const emailInput = form.querySelector('[data-field="email"]');
    //     const floatingDiv = form.querySelector('.form-floating');

    //     const email = emailInput.value;
    //     const flag = isEmail(email);

    //     emailInput.classList.remove("is-invalid", "is-valid");
    //     floatingDiv.classList.remove("is-invalid", "is-valid");


    //     if (flag) {
    //         return true;
    //     }

    //     emailInput.classList.add("is-invalid");
    //     floatingDiv.classList.add("is-invalid");

    //     return false;
    // }
    // async save() {
    //     const { form } = this;// берем форму из контекста из экземпляра класса
    //     const emailInput = form.querySelector('[data-field="email"]');
    //     const floatingDiv = form.querySelector('.form-floating');
    //     const validDiv = form.querySelector('.valid-feedback');
    //     const invalidDiv = form.querySelector('.invalid-feedback');
    //     const email = emailInput.value;

    //     emailInput.classList.remove("is-invalid", "is-valid");
    //     floatingDiv.classList.remove("is-invalid", "is-valid");

    //     try {
    //         const response = await fetch('/api/user', {
    //             method: "PATCH",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ email }),
    //         });
    //         if (response.ok) {
    //             emailInput.classList.add('is-valid');
    //             floatingDiv.classList.add('is-valid');
    //             validDiv.textContent = 'Почта успешно обновлена';
    //             return;
    //         }
    //         const text = await response.text();
    //         throw Error(text);
    //     } catch (error) {
    //         emailInput.classList.add('is-invalid');
    //         floatingDiv.classList.add('is-invalid');
    //         invalidDiv.textContent = error.message;
    //         console.error(error);
    //     }
    // }
}

export default Emailoption;