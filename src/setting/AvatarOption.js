import Option from "./Option.js";
import FormSegment from "../FormSegment.js";

class AvatarOption extends Option {
    constructor() {
        super('Аватар', 'avatar');
        const { form } = this; //берем форму 
        const avatarSegment = new FormSegment('avatar', form);
        this.avatarSegment = avatarSegment;
    }
    validate() {
        const { avatarSegment } = this;
        avatarSegment.ressetValid();

        if (avatarSegment.input.files.length !== 1) {
            avatarSegment.setInvalid('Нужно загрузить 1 картинку.');
            return false;
        }

        avatarSegment.setValid();

        return true;
    }

    //PATCH/api/user/avatar
    //FormData avatar
    async save() {
        const { avatarSegment } = this;
        avatarSegment.ressetValid();

        const file = avatarSegment.input.files[0];
        const data = new FormData();
        data.append('avatar', file);
        try {
            const response = await fetch('/api/user/avatar', {
                method: "PATCH",
                body: data,
            });
            if (response.ok) {
                avatarSegment.setValid('Аватар успешно изменен.');
                return;
            }
            const text = await response.text();
            throw Error(text);//генерируем исключения с этим текстом
        } catch (error) {
            avatarSegment.setInvalid(error.message);
            console.error(error);
        }
    }
}
export default AvatarOption;