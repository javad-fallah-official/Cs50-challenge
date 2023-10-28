import { isRunning } from "./main.js?v=0.3";
import { callbackInitShareAfterRenderChat } from "./share.js?v=0.1";

export const USERID = $("#USERID").text().trim();
export let currentChatId, firstChatAutoCreateName, getValueOneTime;
export let oddReference = undefined;
export const postData = async (url = "", data = {}) => {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    });
    return response.json();
};
const adscontainer = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2586248939932785"
crossorigin="anonymous"></script>
<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-2586248939932785"
data-ad-slot="2037123595"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>`;
function setCookie(name, value, expires, path, domain, secure) {
    document.cookie =
        name +
        "=" +
        escape(value) +
        (expires ? "; expires=" + expires.toUTCString() : "") +
        "; path=/" +
        (domain ? "; domain=" + domain : "") +
        (secure ? "; secure" : "");
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
}
const getChatById = async function (chat_id) {
    const result = await postData(url_api_get_chat, {
        chat_id: chat_id,
    });

    return result;
};
const renderChatItem = function (item) {
    let chatItem = `<div class="chatbox-item" id="${item._id}">
  <svg width="16" height="16" fill="#fff">
    <use xlink:href="#icon-chat"></use>
  </svg>
  <div class="chatbox-name">${item.chat_name}</div>
  <input
    type="text"
    name="rename"
    class="chatbox-rename"
    placeholder="Enter a name"
  />

  <div class="function-group">
    <svg class="save-button" width="16" height="16" fill="#24272e">
      <use xlink:href="#icon-save"></use>
    </svg>
    <svg
      class="rename-button"
      width="16"
      height="16"
      fill="#4b9e5f"
    >
      <use xlink:href="#icon-rename"></use>
    </svg>
    <div class="delete-container">
      <svg
        class="delete-button"
        width="16"
        height="16"
        fill="#4b9e5f"
      >
        <use xlink:href="#icon-delete"></use>
      </svg>
      <div class="delete-card">
        <div class="warning-message">
          <svg class="warning" width="18" height="18">
            <use xlink:href="#icon-warning"></use>
          </svg>
          Confirm deleting this chat?
          <div class="button-group gap-10 mt-3">
            <div class="button cancel">Cancel</div>
            <div class="button accept">Confirm</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

    $(".chatbox-container").prepend(chatItem);
};
const checkOverFlow = () => {
    // check overflow to change css scrollbar
    if ($(".chatbox-container")[0].offsetHeight < $(".chatbox-container")[0].scrollHeight) {
        $(".chatbox-container").addClass("overflow");
    } else {
        $(".chatbox-container").removeClass("overflow");
    }
};

// rename onEnter
const renameOnEnter = () => {
    $(".chatbox-rename").onEnter(function () {
        let idChatbox = $(this).closest(".chatbox-item").attr("id");
        postData(url_api_update_chat_name, {
            chat_id: currentChatId,
            chat_name: $(`#${idChatbox} .chatbox-rename`).val(),
        });
        $(`#${idChatbox} .chatbox-name`).text($(`#${idChatbox} .chatbox-rename`).val());
        $(".chatbox-item.rename-on").removeClass("rename-on");
        // mobile chat name
        $(".mobile-chat-name").text($(".chatbox-item.focused .chatbox-name").text());
    });
};
// update odd number to determine whether current dialog have block code
const updateOdd = async () => {
    getValueOneTime = true;
    if ($("pre pre").length > 0) {
        oddReference = $("pre pre").length * 2 + 1;
    } else {
        oddReference = 1;
    }
};
export const setValueOneTime = function () {
    getValueOneTime = false;
};
export const setFirstChatAutoCreateName = function () {
    firstChatAutoCreateName = false;
};
//format date time
export function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedDate = `${month}/${day}/${year}, ${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;

    return formattedDate;
}

// add chat content of specific chat item
const renderContentChat = async function () {
    //check item focused only load content of this item
    let chatId = $(".chatbox-item.focused").attr("id");

    let chatResult = await getChatById(chatId);
    // console.log(chatResult);
    let listContent = chatResult.messages;
    let stringContent = "";

    if (listContent.length > 0) {
        $(".ads-container-main, .hide-ads-button").show();
        $(".footer-input").css("display", "none");
        firstChatAutoCreateName = false;
        listContent.forEach((message) => {
            if (message.bot !== undefined) {
                stringContent += ` <div pair-id="${message.user_time}">
                <div class="position-relative share-container js-share">
                <div class="share-checkbox js-share-checkbox" jsresult="${message.user_time}">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
<path class="bg-checkbox"  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="white"/>
<path d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z" fill="#fff"/>
</svg>
                </div>
                <div class="chat-request gap-10">
    <div class="chat-infor">
      <div class="date-time">${formatTimestamp(message.user_time)}</div>
      <div class="chat-container justify-content-end">
        <div class="chat-function">
          <svg width="16" height="16">
            <use xlink:href="#icon-three-dots"></use>
          </svg>
        </div>
        <div class="chat-content">${message.user}</div>
      </div>
    </div>
    <div class="avatar">
      <img width="200" height="200" src="${url_ai_avatar}" alt="Main Avatar">
    </div>
  </div>
 </div>
 <div class="position-relative share-container js-share">
    <div class="share-checkbox js-share-checkbox" jsresult="${message.bot_time}">
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
<path class="bg-checkbox"  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="white"/>
<path d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z" fill="#fff"/>
</svg>
    </div>
      <div class="chat-request flex-row-reverse gap-10">  
        <div class="chat-infor align-flex-start">
          <div class="date-time">${formatTimestamp(message.bot_time)}</div>
          <div class="chat-container flex-row-reverse">
            <div class="chat-function">
              <svg width="16" height="16">
                <use xlink:href="#icon-three-dots"></use>
              </svg>
            </div>
            <pre id="null" class="chat-content chat-response">${message.bot}</pre>
          </div>
        </div>
        <div class="avatar">
          <img width="200" height="200" src="${url_chatgpt_avatar}" alt="Main Avatar">
        </div>
      </div>
      </div>
      </div>       `;
            }
        });

        $(".dialog").html(stringContent);
        $(".chat-content").each((index, item) => {
            if ($(item).text().length == 0) {
                $(item).parents(".share-container").hide();
            }
        });
        document.querySelectorAll("pre code").forEach((el) => {
            hljs.highlightElement(el);
        });
        // auto go bottom of dialog chat
        $(".dialog").animate(
            {
                scrollTop: $(".dialog").offset().top + $(".dialog")["0"].scrollHeight,
            },
            1
        );
    } else {
        firstChatAutoCreateName = true;
        $(".ads-container-main, .hide-ads-button").hide();
        $(".footer-input").css("display", "flex");

        stringContent += `
      
    <div class="example-question">
    <div class="ads-container ads-container-xl">
    `+adscontainer+`
    </div>
    <svg width="32" height="32">
      <use xlink:href="#icon-sun"></use>
    </svg>
    <div class="mb-3 question-title">Examples</div>
    <div class="question-list">
      <div class="question">
        "Explain quantum computing in simple terms"
      </div>
      <div class="question">
        "Got any creative ideas for a 10 year old’s birthday?"
      </div>
      <div class="question">
        "How do I make an HTTP request in Javascript?"
      </div>
      <div class="question">
        "What do you think the meaning of life is?"
      </div>
      <div class="question">
        "If money were no object, what would you do?"
      </div>
      <div class="question">"Hint some book health my life"</div>
      <div class="question">"The best way to learn new language"</div>
      <div class="question">"How to get rich from nothing!"</div>
      <div class="question">
        "Some of the popular food cultures around the world"
      </div>
    </div>
  </div>
    `;
        $(".dialog").html(stringContent);
    }

    updateOdd();
};
export const createChatItem = async () => {
    const response = await postData(url_api_new_chat, { user_id: USERID });
    currentChatId = response.id_;

    let chatItem = `  <div class="chatbox-item focused" id="${currentChatId}">
<svg width="16" height="16" fill="#fff">
  <use xlink:href="#icon-chat"></use>
</svg>
<div class="chatbox-name">New Chat</div>
<input
  type="text"
  name="rename"
  class="chatbox-rename"
  placeholder="Enter a name"
/>

<div class="function-group">
  <svg class="save-button" width="16" height="16" fill="#24272e">
    <use xlink:href="#icon-save"></use>
  </svg>
  <svg
    class="rename-button"
    width="16"
    height="16"
    fill="#4b9e5f"
  >
    <use xlink:href="#icon-rename"></use>
  </svg>
  <div class="delete-container">
    <svg
      class="delete-button"
      width="16"
      height="16"
      fill="#4b9e5f"
    >
      <use xlink:href="#icon-delete"></use>
    </svg>
    <div class="delete-card">
      <div class="warning-message">
        <svg class="warning" width="18" height="18">
          <use xlink:href="#icon-warning"></use>
        </svg>
        Confirm deleting this chat?
        <div class="button-group gap-10 mt-3">
          <div class="button cancel">Cancel</div>
          <div class="button accept">Confirm</div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>`;
    $(".chatbox-item").removeClass("focused");
    $(".chatbox-container").prepend(chatItem);
    // mobile chat name
    $(".mobile-chat-name").text($(".chatbox-item.focused .chatbox-name").text());
    renameOnEnter();
    checkOverFlow();
    firstChatAutoCreateName = true;
};
async function checkRedirect() {
    if (getCookie("redirectNewChat")) {
        await createChatItem();
        firstChatAutoCreateName = true;
        $(".ads-container-main").hide();
        $(".dialog").html(`
<div class="example-question">
<div class="ads-container ads-container-xl">
`+adscontainer+`
</div>
<svg width="32" height="32">
<use xlink:href="#icon-sun"></use>
</svg>
<div class="mb-3 question-title">Examples</div>
<div class="question-list">
<div class="question">
  "Explain quantum computing in simple terms"
</div>
<div class="question">
  "Got any creative ideas for a 10 year old’s birthday?"
</div>
<div class="question">
  "How do I make an HTTP request in Javascript?"
</div>
<div class="question">
  "What do you think the meaning of life is?"
</div>
<div class="question">
  "If money were no object, what would you do?"
</div>
<div class="question">"Hint some book health my life"</div>
<div class="question">"The best way to learn new language"</div>
<div class="question">"How to get rich from nothing!"</div>
<div class="question">
  "Some of the popular food cultures around the world"
</div>
</div>
</div>`);

        // call again
        $(".accept").on("click", async function (e) {
            e.stopPropagation();
            await postData(url_api_delete_chat, { chat_id: currentChatId });
            let idChatbox = $(this).closest(".chatbox-item").attr("id");
            $(`#${idChatbox} `).remove();
            checkOverFlow();

            if ($(".chatbox-container").children().length > 0) {
                currentChatId = $(".chatbox-item:first-child").attr("id");
                $(".chatbox-container").children().first().addClass("focused");
                // mobile chat name
                $(".mobile-chat-name").text($(".chatbox-item.focused .chatbox-name").text());
                renderContentChat();
            } else {
                currentChatId = undefined;
                $(".dialog").text("");
            }
        });
        updateOdd();
        setCookie("redirectNewChat", "");
    }
}

const renderChatList = async function (user_id) {
    const TID = $("#TID").text().trim();
    const TCHAT = $("#TCHAT").text().trim();
    const listIdChat = await postData(url_api_get_user_chat, {
        user_id: user_id,
    });

    if (TID !== "") {
        for (let index = 0; index < listIdChat.length; index++) {
            renderChatItem(listIdChat[index]);
        }

        const elementById = document.getElementById(TID);
        elementById.classList.add("focused");

        const input_chat = document.getElementById("input-chat");
        input_chat.value = TCHAT;

        currentChatId = TID;
        await renderContentChat();
        checkRedirect();
        callbackInitShareAfterRenderChat();
        renameOnEnter();
        checkOverFlow();
        // mobile chat name
        $(".mobile-chat-name").text($(".chatbox-item.focused .chatbox-name").text());
    } else if (listIdChat.length > 0) {
        for (let index = 0; index < listIdChat.length; index++) {
            renderChatItem(listIdChat[index]);
        }
        $(".chatbox-item:first-child").addClass("focused");
        currentChatId = $(".chatbox-item:first-child").attr("id");

        await renderContentChat();
        checkRedirect();
        callbackInitShareAfterRenderChat();
        renameOnEnter();
        checkOverFlow();
        // mobile chat name
        $(".mobile-chat-name").text($(".chatbox-item.focused .chatbox-name").text());
    } else {
        // if the user do not have any chat then create a new one

        await createChatItem();
        renderContentChat();
        checkRedirect();
        callbackInitShareAfterRenderChat();
    }
};
renderChatList(USERID);
// chat item active event
$(".chatbox-container").on("click", ".chatbox-item", function (e) {
    if (isRunning) {
        return;
    }
    $(".chatbox-item").removeClass("focused");
    $(".chatbox-item").removeClass("rename-on");
    $(this).addClass("focused");
    // reset share box
    $(".dialog, .copy-container, .close-share").removeClass("active");
    $(".input-chat-container, .send-button,.share-button").removeClass("hide");
    // mobile chat name
    $(".mobile-chat-name").text($(".chatbox-item.focused .chatbox-name").text());
    currentChatId = $(this).closest(".chatbox-item").attr("id");
    renderContentChat();
});

$(".chatbox-container").on("click", ".accept", async function (e) {
    e.stopPropagation();
    await postData(url_api_delete_chat, { chat_id: currentChatId });
    let idChatbox = $(this).closest(".chatbox-item").attr("id");
    $(`#${idChatbox} `).remove();
    checkOverFlow();

    if ($(".chatbox-container").children().length > 0) {
        currentChatId = $(".chatbox-item:first-child").attr("id");
        $(".chatbox-container").children().first().addClass("focused");
        // mobile chat name
        $(".mobile-chat-name").text($(".chatbox-item.focused .chatbox-name").text());
        renderContentChat();
    } else {
        currentChatId = undefined;
        $(".dialog").text("");
    }
});

// add button
$(".add-button").on("click", async function (e) {
    if (isRunning) {
        return;
    }
    createChatItem();
    firstChatAutoCreateName = true;
    $(".ads-container-main, .hide-ads-button").hide();
    $(".footer-input").css("display", "flex");
    $(".dialog").html(`
  
    <div class="example-question">
    <div class="ads-container ads-container-xl">
    `+adscontainer+`
    </div>
  <svg width="32" height="32">
    <use xlink:href="#icon-sun"></use>
  </svg>
  <div class="mb-3 question-title">Examples</div>
  <div class="question-list">
    <div class="question">
      "Explain quantum computing in simple terms"
    </div>
    <div class="question">
      "Got any creative ideas for a 10 year old’s birthday?"
    </div>
    <div class="question">
      "How do I make an HTTP request in Javascript?"
    </div>
    <div class="question">
      "What do you think the meaning of life is?"
    </div>
    <div class="question">
      "If money were no object, what would you do?"
    </div>
    <div class="question">"Hint some book health my life"</div>
    <div class="question">"The best way to learn new language"</div>
    <div class="question">"How to get rich from nothing!"</div>
    <div class="question">
      "Some of the popular food cultures around the world"
    </div>
  </div>
</div>`);

    // call again
    $(".accept").on("click", async function (e) {
        e.stopPropagation();
        await postData(url_api_delete_chat, { chat_id: currentChatId });
        let idChatbox = $(this).closest(".chatbox-item").attr("id");
        $(`#${idChatbox} `).remove();
        checkOverFlow();

        if ($(".chatbox-container").children().length > 0) {
            currentChatId = $(".chatbox-item:first-child").attr("id");
            $(".chatbox-container").children().first().addClass("focused");
            // mobile chat name
            $(".mobile-chat-name").text($(".chatbox-item.focused .chatbox-name").text());
            renderContentChat();
        } else {
            currentChatId = undefined;
            $(".dialog").text("");
        }
    });
    updateOdd();
});

// onEnter function
(function ($) {
    $.fn.onEnter = function (func) {
        this.bind("keypress", function (e) {
            if (e.keyCode == 13 && !e.shiftKey) {
                e.preventDefault();
                func.apply(this, [e]);
            }
        });
        return this;
    };
})(jQuery);
