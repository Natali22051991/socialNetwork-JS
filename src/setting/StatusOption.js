import Option from "./Option.js";
import FormSegment from "../FormSegment.js";

class StatusOption extends Option {
    constructor() {
        super('Статус', 'status');
        const { form } = this;
        const statusSegment = new FormSegment('status', form);//создаем сегменты
        const status = statusSegment.getValue().trim();
        statusSegment.input.value = status;
        statusSegment.ressetValid();
        Object.assign(this, { statusSegment });
    }

    //PATCH/api/user
    //{status}
    async save() {
        const { statusSegment } = this;
        const status = statusSegment.getValue().trim();
        const data = new FormData();
        data.set('status', status);
        try {
            const response = await fetch('/api/user', {
                method: "PATCH",
                // headers: { "Content-Type": "application/json" },
                body: data,// JSON.stringify({ status }),
            });
            if (response.ok) {
                statusSegment.setValid('Статус успешно обновлен.');
                return;
            }
            const text = await response.text();
            throw Error(text);
        } catch (error) {
            statusSegment.setInvalid(error.message);
            console.error(error);
        }
    }
}

export default StatusOption;