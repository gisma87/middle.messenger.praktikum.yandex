class Popup {
  private statePopup: {
    button: HTMLElement | null;
    popup: HTMLElement | null;
    backDropDark?: boolean;
  }[];
  private _statePopup:
    | { button: HTMLElement; popup: HTMLElement; backDropDark?: boolean }[]
    | [];
  private stateActiveButton: HTMLElement | null;
  private readonly _backdrop: HTMLElement | null;

  constructor(
    statePopup: {
      button: HTMLElement | null;
      popup: HTMLElement | null;
      backDropDark?: boolean;
    }[],
    backdrop: HTMLElement | null,
  ) {
    this._statePopup = [];
    this.statePopup = statePopup;
    this._backdrop = backdrop;
    this.showPopupSetting = this.showPopupSetting.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.setEventListeners = this.setEventListeners.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
    this.stateActiveButton = null;
    this.setStatePopup();
    this.setEventListeners();
  }

  setStatePopup() {
    if (this.statePopup.length) {
      this.statePopup.forEach(item => {
        if (
          item.button instanceof HTMLElement &&
          item.popup instanceof HTMLElement
        ) {
          // @ts-ignore
          this._statePopup.push(item);
        }
      });
    }
  }

  setEventListeners() {
    this._statePopup.forEach(item => {
      item.button.addEventListener('click', this.showPopupSetting);
    });
  }

  showPopupSetting(e: MouseEvent) {
    e.stopPropagation();
    this._statePopup.forEach(item => {
      if (item.popup.matches('.popup_visible')) {
        this.stateActiveButton = item.button;
        this.removeClassActivePopup();
      }
    });
    if (e.target instanceof HTMLElement) {
      this.stateActiveButton = e.target.closest('.buttonPopup');
      if (this.stateActiveButton?.closest('.active')) {
        this.removeClassActivePopup();
      } else {
        this.addClassActivePopup();
      }
    }
  }

  removeClassActivePopup() {
    const popupElement = this.findActivePopup(this.stateActiveButton);
    if (this.stateActiveButton) {
      this.stateActiveButton.classList.remove('active');
    }
    if (this._backdrop) this._backdrop.classList.remove('backdrop_visible');
    if (popupElement?.backDropDark) {
      if (this._backdrop) this._backdrop.classList.remove('backdrop_dark');
    }

    popupElement?.popup.classList.remove('popup_visible');
    document.removeEventListener('click', this.closePopup);
  }

  addClassActivePopup() {
    const popupElement = this.findActivePopup(this.stateActiveButton);
    document.addEventListener('click', this.closePopup);
    if (this.stateActiveButton) this.stateActiveButton.classList.add('active');
    if (this._backdrop) this._backdrop.classList.add('backdrop_visible');
    if (popupElement?.backDropDark) {
      if (this._backdrop) this._backdrop.classList.add('backdrop_dark');
    }
    popupElement?.popup.classList.add('popup_visible');
  }

  findActivePopup(activeButton: HTMLElement | null) {
    return this._statePopup.find(item => item.button === activeButton);
  }

  closePopup(e: MouseEvent) {
    if (e.target === this._backdrop) this.removeClassActivePopup();
  }

  removeEventListeners() {
    this._statePopup.forEach(item => {
      item.button.removeEventListener('click', this.showPopupSetting);
    });
  }
}

export { Popup };
