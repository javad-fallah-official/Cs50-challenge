import { USERID, postData, currentChatId } from "./chat.js?v=0.2";
// auto grow textarea
$("#input-chat").on("input", function () {
    $("#input-chat").css("height", "auto");

    $(this).css("height", `${$(this)["0"].scrollHeight}px`);
    if ($(this).val().length > 0) {
        $(".send-button").addClass("active");
        $(".clear-button").show();
    } else {
        $(".send-button").removeClass("active");
        $(".clear-button").hide();
    }
});
$("#input-chat, .chatbox-rename").on("focus", function () {
    $(this).addClass("focused");
});
$("#input-chat , .chatbox-rename").on("focusout", function () {
    $(this).removeClass("focused");
});

// rename button
$(".chatbox-container").on("click", ".rename-button", function (e) {
    e.stopPropagation();
    let idChatbox = $(this).closest(".chatbox-item").attr("id");
    let currentName = $(this).closest(`#${idChatbox}`).find(".chatbox-name").text();

    $(this).closest(".chatbox-item").addClass("rename-on");

    $(`#${idChatbox} .chatbox-rename`).val(currentName);
});
$(".chatbox-container").on("click", ".chatbox-rename", function (e) {
    e.stopPropagation();
});

// save name button
$(".chatbox-container").on("click", ".save-button", async function (e) {
    let idChatbox = $(this).closest(".chatbox-item").attr("id");

    await postData(url_api_update_chat_name, {
        chat_id: currentChatId,
        chat_name: $(`#${idChatbox} .chatbox-rename`).val(),
    });

    $(`#${idChatbox} .chatbox-name`).text($(`#${idChatbox} .chatbox-rename`).val());
    // mobile chat name
    $(".mobile-chat-name").text($(".chatbox-item.focused .chatbox-name").text());
});

// outside click delete card
$(document).click(function (event) {
    let target = event.target;

    if (target.closest(".delete-card") == null && $(".delete-card").is(":visible")) {
        $(".delete-card").hide();
    }
});
// delete button
$(".chatbox-container").on("click", ".delete-button", function (e) {
    e.stopPropagation();
    let idChatbox = $(this).closest(".chatbox-item").attr("id");
    $(`#${idChatbox} .delete-card`).toggle();
});
$(".chatbox-container").on("click", ".cancel", function (e) {
    let idChatbox = $(this).closest(".chatbox-item").attr("id");
    $(`#${idChatbox} .delete-card`).hide();
});

// change placeholder
if ($(window).width() < 576) {
    // mobile chat name
    $(".mobile-chat-name").text($(".chatbox-item.focused .chatbox-name").text());
    $("#input-chat").attr("placeholder", "Ask me something...");
}

// clear text
$(".clear-button").on("click", function () {
    $("#input-chat").val("");
    $("#input-chat").focus();
    $("#input-chat").addClass("focused");
    $("#input-chat").css("height", "auto");

    $("#input-chat").css("height", `${$("#input-chat")["0"].scrollHeight}px`);
    $(this).hide();
});
// sample question
$(".dialog").on("click", ".question", function () {
    $("#input-chat").val($(this).text().replace(/\"/g, "").trim());
    $(".send-button").addClass("active");
    $("#input-chat").focus();
    $(".clear-button").show();
    $("#input-chat").css("height", "auto");
    $("#input-chat").css("height", `${$("#input-chat")["0"].scrollHeight}px`);
});

// darkmode cookie
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
    return "";
}
// dark mode
$(".sun, .moon").on("click", function () {
    if ($(this).hasClass("sun")) {
        $(this).addClass("hide");
        $(".moon").removeClass("hide");
        $(".dark-mode-toggle-js").css("background", "#18181c");
        $("body").addClass("light-mode");
        setCookie("theme", "light-mode");
        return;
    }
    $(this).addClass("hide");
    $(".sun").removeClass("hide");
    $(".dark-mode-toggle-js").css("background", "white");
    setCookie("theme", "", new Date("2015-03-12"));
    $("body").removeClass("light-mode");
});

$(".hide-ads-button").on("click", function () {
    $(".ads-container-main").hide();
    $(this).hide();
    $(".footer-input").css("display", "flex");
});

$(document).ready(function () {
    let theme = getCookie("theme");
    if (theme) {
        $("body").addClass(theme);
        $(".moon").removeClass("hide");
        $(".sun").addClass("hide");
        $(".dark-mode-toggle-js").css("background", "#18181c");
        return;
    }
    $(".sun").removeClass("hide");
    $(".moon").addClass("hide");
    $(".dark-mode-toggle-js").css("background", "white");
});
