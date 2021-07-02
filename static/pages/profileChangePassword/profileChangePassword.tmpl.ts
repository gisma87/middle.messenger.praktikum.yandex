export const profileChangePasswordTmpl = `<div class="profileChangePassword profile">
<a href="/chat" class="profile__btnBack">
    <i class="icon-arrow-right profile__imgBtnBack"></i>
  </a>
  <form name="form-password" id="formChangePassword" class="profile__container">
    <div class="profile__content">
      <div class="profile__titleBlock">
        <div class="profile__photoContainer">
          <i class="profile__photo icon-photo-video"></i>
          <span class="profile__photoChangeLayer">Поменять аватар</span>
        </div>
      </div>
      <ul class="profile__list">
        <% dataLongInputs.forEach(function(item) { %>
          <li class="profile__item" id=<%-item.idErrorElement%>>
            <span class="profile__itemTitle"><%-item.label%></span>
            <input <%-item.dataError%>
                   <%-item.dataset%>
                   id="<%-item.idInput%>"
                   name=<%-item.name%>
                   type=<%-item.type%>
                  class="profile__itemDescription" 
                  placeholder="<%-item.placeholder%>"
            >
          </li>
        <% }); %>
      </ul>
      <div class="profile__buttons">
        <button class="buttonPrimary">Сохранить</button>
      </div>
    </div>
  </form></div>`;
