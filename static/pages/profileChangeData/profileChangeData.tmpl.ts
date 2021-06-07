export const profileChangeDataTmpl = `<div class="profileChangeData profile">
<a href="/profile" class="profile__btnBack">
    <i class="icon-arrow-right profile__imgBtnBack"></i>
  </a>
  <div class="profile__container">
    <form id="formChangeData" name="dataUser" class="profile__content">
      <div class="profile__titleBlock">
        <div class="profile__photoContainer profile__btnDownload buttonPopup">
          <img class="profile__avatar" src="<%-avatar%>" alt="avatar">
          <div class="profile__photoChangeLayer">Поменять аватар</div>
        </div>
      </div>
      <ul class="profile__list">
        <% dataLongInputs.forEach(function(item) { %>
          <li class="profile__item" id=<%-item.idErrorElement%> >
            <span class="profile__itemTitle"><%-item.label%></span>
            <input class="profile__itemDescription" 
                    placeholder="<%-item.placeholder%>"
                    value="<%-item.placeholder%>"
                    <%-item.dataError%>
                    <%-item.dataset%>
                     id="<%-item.idInput%>"
                     name=<%-item.name%>
                     type=<%-item.type%>
            >
          </li>
        <% }); %>
      </ul>
      <div class="profile__buttons"><%=button%></div>
    </form>
  </div>
</div>`;
