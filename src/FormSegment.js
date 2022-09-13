class FormSegment {//для обработки формы общая программа
    constructor(name, root = document) {//от какой точки мы будет искать сегменты,будет запоминать
        // this.root = root;
        // this.name = name;

        const segment = root.querySelector(`[data-segment="${name}"]`)//будем его искать
        if (!segment) {//если его нет, это повод кинуть ошибку
            throw Error(`Segment not found. [data-segment="${name}"]`);

        }
        //если мы нашли то у него есть элементы
        const floating = segment.querySelector(".form-floating");
        const input = segment.querySelector("input");
        const invalidDiv = segment.querySelector(".invalid-feedback");
        const validDiv = segment.querySelector(".valid-feedback");
        Object.assign(this, { segment, floating, input, invalidDiv, validDiv });//нужно это все запомнить

        this.ressetValid();//сбрасывает всю валидацию
    }
    getValue() {
        return this.input.value;
    }
    ressetValid() {
        const { floating, input } = this;
        floating.classList.remove('is-valid', 'is-invalid');
        input.classList.remove('is-valid', 'is-invalid');
    }
    setValid(text = "") {//необязательный текст
        const { floating, input, validDiv } = this;
        floating.classList.add('is-valid');
        input.classList.add('is-valid');
        if (validDiv) {
            validDiv.textContent = text;
        }
    }
    setInvalid(text = "") {//необязательный текст
        const { floating, input, invalidDiv } = this;
        floating.classList.add('is-invalid');
        input.classList.add('is-invalid');
        if (invalidDiv) {
            invalidDiv.textContent = text;
        }
    }

}
export default FormSegment;