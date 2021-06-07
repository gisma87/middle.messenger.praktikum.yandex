export const loginBlock: string = `<main class="main">
<div class="login-container">
  <form id="loginForm" class="form" name=<%-formName%> novalidate>
      <div class="form__content">
        <p class="form__title"><%-title%></p>
          <% dataInputs.forEach(function(item) { %>
            <label class="form__element">
              <input
                 <%-item.dataset%>
                 id="<%-item.idInput%>"
                 name=<%-item.name%>
                 type=<%-item.type%>
                 class="form__input" required>
              <p class="form__label"><%-item.label%></p>
              <span class="form__errorMessage" id=<%=item.idErrorElement%>>поле не верно заполнено</span>
            </label>
          <% }); %>
      </div>
      <div class="form__response-block">При запросе произошла ошибка, повторите позже.</div>
      <div class="form__buttons">
        <%=button%>
        <a href="./signin" class="form__link form__link_signin">Нет аккаунта?</a>
      </div>
    </form>
</div>
</main>`;
