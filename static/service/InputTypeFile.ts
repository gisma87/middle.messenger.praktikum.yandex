type Props = {
  formTitle: HTMLElement | null;
  fileContainer: HTMLElement | null;
  fileTitle: HTMLElement | null;
  labelFile: HTMLElement | null;
  imgDeleteBtn: HTMLElement | null;
  inputFile: HTMLInputElement | null;
  errorMessage: HTMLElement | null;
};

class InputTypeFile {
  private props: Props;

  constructor(props: Props) {
    this.props = props;
    this.pasteFileName = this.pasteFileName.bind(this);
    this.delFile = this.delFile.bind(this);
    if (this.props.inputFile) {
      this.props.inputFile.addEventListener('change', this.pasteFileName);
    }
    if (this.props.imgDeleteBtn) {
      this.props.imgDeleteBtn.addEventListener('click', this.delFile);
    }
  }

  // вставляет название загружаемого файла в нужный блок, и делает этот блок видимым.
  pasteFileName() {
    if (
      this.props.errorMessage &&
      this.props.errorMessage.matches('.form__errorMessage_visible')
    ) {
      this.props.errorMessage.classList.remove('form__errorMessage_visible');
    }
    const fileName =
      this.props.inputFile && this.props.inputFile.value.replace(/.*\\/, '');
    if (this.props.fileContainer) {
      this.props.fileContainer.style.display = 'flex';
    }
    if (this.props.labelFile) this.props.labelFile.style.display = 'none';
    if (this.props.formTitle) {
      this.props.formTitle.textContent = 'Файл загружен';
    }
    return (
      this.props.fileTitle && (this.props.fileTitle.textContent = fileName)
    );
  }

  // удаляет файл и скрывает блок с названием
  delFile() {
    if (this.props.inputFile) this.props.inputFile.value = '';
    if (this.props.fileContainer) {
      this.props.fileContainer.style.display = 'none';
    }
    if (this.props.labelFile) this.props.labelFile.style.display = 'flex';
    if (this.props.formTitle) {
      this.props.formTitle.textContent = 'Загрузите файл';
    }
  }
}

export { InputTypeFile };
