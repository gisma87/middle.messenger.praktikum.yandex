export const profileTmpl = `<div class="profile">
  <div class="profile__btnBack">
    <i class="icon-arrow-right profile__imgBtnBack"></i>
  </div>
  <div class="profile__container">
    <div class="profile__content">
      <div class="profile__titleBlock">
        <div class="profile__photoContainer profile__btnDownload buttonPopup">
          <img class="profile__avatar" src="<%-avatar%>" alt="avatar">
          <div class="profile__photoChangeLayer">Поменять аватар</div>
        </div>
        <h3 class="profile__name"><%-name%></h3>
      </div>
      <ul class="profile__list">   
        <% dataLongInputs.forEach(function(item) { %>
          <li class="profile__item">
            <span class="profile__itemTitle"><%-item.label%></span>
            <input type="text" class="profile__itemDescription" placeholder="<%-item.placeholder%>" readonly>
          </li>
        <% }); %>
      </ul>
      <div class="profile__buttons">
        <a href="./profileChangeData" class="profile__btnChangeData profile__btn">Изменить данные</a>
        <a href="./profileChangePassword" class="profile__btnChangePassword profile__btn">Изменить пароль</a>
        <button class="profile__logout profile__btn">Выйти</button>
      </div>
    </div>
  </div>
  <form name="addFileForPhoto" id="addFileForPhoto" class="popupFormDownload popupForm form popup" novalidate>
    <h3 class="form__title">Загрузите файл</h3>
    <div class="form__element">
      <input     <%-dataInputTypeFile.dataset%>
                 <%-dataInputTypeFile.dataError%>
                 id="<%-dataInputTypeFile.idInput%>"
                 name=<%-dataInputTypeFile.name%>
                 type=<%-dataInputTypeFile.type%>
                 class="form__inputFile" required="required">
      <label for="fileAdd" class="form__labelFile"><%-dataInputTypeFile.label%></label>

      <div class="form__fileContainer">
        <p class="form__fileTitle">название файла</p>
        <img class="form__imgDeleteBtn" src="./img/delete.png" alt="">
      </div>
    </div>
    <div class="form__buttons"><%=button%></div>
    <span id=<%-dataInputTypeFile.idErrorElement%> class="profile__errorMessagePopup errorMessage">Нужно выбрать файл</span>
  </form>
</div>`;
