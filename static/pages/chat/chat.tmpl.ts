export const chatTmpl = `<main class="ChatPage">
    <aside class="chatBlock">
      <div class="chatBlock__mainContent">
        <div class="chatBlock__history">
          <div class="chatBlock__historyTitle">
            <span>Профиль</span>
            <i class="icon-angle-right"></i>
          </div>
        </div>
    
        <form name="search" class="chatBlock__searchPanel">
          <input <%-searchPanel.dataset%>
                     id="<%-searchPanel.idInput%>"
                     name=<%-searchPanel.name%>
                     type=<%-searchPanel.type%>
                     class="chatBlock__searchInput" 
          required>
          <div class="chatBlock__searchPlaceholder chatBlock__searchPlaceholder_visible">
            <i class="icon-search"></i>
            <span class="chatBlock__searchPlaceholderText"><%-searchPanel.label%></span>
          </div>
        </form>

        <form name="form-active-chat" class="chatBlock__selectedChat">
           <p class="chatBlock__chatName">Выбранный чат:</p>
           <select name="active-chat" id="selectActiveChat">
            <% chatsList.forEach(function(item) { %>
              <option <% if(item.selected){ %> selected <% } %> value="<%-item.id%>"><%-item.title%></option>
            <% }); %>
           </select>
        </form>
    
        <ul class="chatBlock__list">
          <% users.forEach(function(user) { %>
            <li class="chatBlock__item">
              <div class="chatBlock__itemContent">
                <span class="chatBlock__itemTitle"><%-user.first_name%> <%-user.second_name%></span>
                <p class="chatBlock__itemLastMsg"><%-user.login%></p>
              </div>
            </li>
          <% }); %>
        </ul>
      </div>
        <button class="chatBlock__createChatBtn buttonPopup">Создать чат</button>
    </aside>
    <main class="messageBlock">
        <div class="messageBlock__header">
          <div class="messageBlock__titleBlock">
            <div class="messageBlock__titleImg">
              <img class="messageBlock__avatar" src="<%-avatar%>" alt="avatar">
            </div>
            <div class="messageBlock__title"><%-username%></div>
          </div>
          <div class="messageBlock__buttonSettingContainer buttonPopup">
            <div class="messageBlock__buttonSetting"></div>
          </div>
        </div>
    
        <div class="messageBlock__content">
    
          <ul class="popupAttach popup">
            <li class="popupAttach__item">
              <i class="icon-photo-video popupAttach__itemImg"></i>
              <span class="popupAttach__itemTitle">Фото или Видео</span>
            </li>
            <li class="popupAttach__item">
              <i class="icon-file popupAttach__itemImg"></i>
              <span class="popupAttach__itemTitle">Файл</span>
            </li>
            <li class="popupAttach__item">
              <i class="icon-location-circle popupAttach__itemImg"></i>
              <span class="popupAttach__itemTitle">Локация</span>
            </li>
          </ul>
    
          <ul class="popupSetting popup">
            <li class="popupSetting__item buttonPopup buttonAddUser">
              <i class="icon-plus-circle popupSetting__itemImg"></i>
              <span class="popupSetting__itemTitle">Добавить пользователя</span>
            </li>
            <li class="popupSetting__item buttonPopup buttonRemoveUser ">
              <i class="icon-plus-circle popupSetting__itemImg popupSetting__itemImg_rotate"></i>
              <span class="popupSetting__itemTitle">Удалить пользователя</span>
            </li>
          </ul>
    
    
          <div class="messageBlock__dateMessage">19 июля</div>
    
          <div class="messageBlock__messageLeft">
            <div class="messageBlock__textBlock">
              <p class="messageBlock__text">
                Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила
                Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью
                500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с
                собой забрали только кассеты с пленкой.
              </p>
              <p class="messageBlock__text">
                Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не
                попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.
              </p>
            </div>
            <span class="messageBlock__timeMessage">11:56</span>
          </div>
    
          <div class="messageBlock__messageRight">
            <div class="messageBlock__textBlock">
              <p class="messageBlock__text">Круто!</p>
            </div>
            <div class="messageBlock__timeMessage">
              <i class="messageBlock__checkMessage icon-check"></i>
              <span>12:00</span>
            </div>
          </div>
        </div>
    
        <form name="message" class="messageBlock__inputContainer" novalidate>
          <i class="icon-paper-clip messageBlock__attachButton buttonPopup"></i>
          <input <%-messegeInput.dataset%>
                     id="<%-messegeInput.idInput%>"
                     name=<%-messegeInput.name%>
                     type=<%-messegeInput.type%>
                     class="chatBlock__searchInput" 
          
          name="message" type="text" class="messageBlock__input" placeholder="Сообщение" required>
          <button class="messageBlock__submit"><i class="icon-arrow-right"></i></button>
        </form>
    </main>
    <% dataPopup.forEach(function(item) { %>
      <form name=<%-item.formName%> class="<%=item.className%>" novalidate>
        <h3 class="form__title"><%-item.title%></h3>
        <label class="form__element">
          <input     <%-item.dataset%>
                     id="<%-item.idInput%>"
                     name=<%-item.name%>
                     type=<%-item.type%>
                     class="form__input" required>
          <p class="form__label"><%-item.label%></p>
          <span class="form__errorMessage" id=<%=item.idErrorElement%>>Поле должно содержать больше 3 символов</span>
        </label>
        <div class="form__buttons">
          <%=item.button%>
        </div>
      </form>
    <% }); %>
    
    
    
</main>`;
