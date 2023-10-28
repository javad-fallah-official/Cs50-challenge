import { postData } from "./chat.js?v=0.2";

// await getChat finish will call this function
export const callbackInitShareAfterRenderChat = () => {
    $(".js-share-button").on("click", function () {
        $(".ads-container-main").hide();
        $(".dialog, .copy-container, .close-share").addClass("active");
        $(".input-chat-container, .send-button,.share-button").addClass("hide");
        $(".share-checkbox").removeClass("active");

        let lastTwoElements = $(".share-container:last .share-checkbox, .share-container:eq(-2) .share-checkbox");
        lastTwoElements.addClass("active");
        $(".js-messages-count").text($(".share-checkbox:visible.active").length);
        if ($(".share-checkbox:visible.active").length >= 2) {
            currentCount = 2;
        } else {
            currentCount = $(".share-checkbox:visible.active").length;
        }
    });
    $(".js-close-share").on("click", function () {
        $(".dialog, .copy-container, .close-share").removeClass("active");
        $(".input-chat-container, .send-button,.share-button").removeClass("hide");
    });
};

// deligate all elements that match the "js-share-checkbox", now or in the future, based on ".dialog"
$(".dialog").on("click", ".js-share-checkbox", function () {
    if ($(this).hasClass("active")) {
        updateTotalMessages(false);
        $(this).removeClass("active");
        return;
    }
    updateTotalMessages(true);
    $(this).addClass("active");
});

// count messages function
let currentCount = 0;
const updateTotalMessages = (isPlus) => {
    if (isPlus) {
        currentCount++;
        $(".js-messages-count").text(currentCount);
        return;
    }
    currentCount--;
    $(".js-messages-count").text(currentCount);
};

const originalData = [];
// extract data function
const extractData = () => {
    // clear array data
    originalData.splice(0, originalData.length);

    $(".js-share-checkbox.active").each(function (index, element) {
        let botResponse = "",
            userRequest = "",
            pairId = "";

        if ($(element).siblings(".chat-request").find(".chat-response").length) {
            botResponse = $(element).siblings(".chat-request").find(".chat-response").html();

            pairId = $(element).closest("[pair-id]").attr("pair-id");
            originalData.push({
                pairId: pairId,
                bot_time: `${$(element).attr("jsresult")}`,
                bot: botResponse,
            });
        } else {
            userRequest = $(element).siblings(".chat-request").find(".chat-content").html();
            pairId = $(element).closest("[pair-id]").attr("pair-id");
            originalData.push({
                pairId: pairId,
                user_time: `${$(element).attr("jsresult")}`,
                user: userRequest,
            });
        }
    });
};

// format and merge data pair to pair
const formatData = (arrayData) => {
    const data = {
        messages: [],
    };

    // sort ascending time
    arrayData.sort(function (a, b) {
        return a.pairId - b.pairId;
    });

    //merge pair to pair
    let i = 0;
    while (arrayData.length > 0) {
        if (arrayData.length == 1) {
            if (arrayData[i].user_time) {
                let mergeOjb = { ...arrayData[i], bot_time: "", bot: "" };
                delete mergeOjb.pairId;
                data.messages.push(mergeOjb);
            } else {
                let mergeOjb = { ...arrayData[i], user_time: "", user: "" };
                delete mergeOjb.pairId;
                data.messages.push(mergeOjb);
            }
            arrayData.splice(0, 1);
        } else {
            if (arrayData[i].pairId === arrayData[i + 1].pairId) {
                let mergeOjb = { ...arrayData[i], ...arrayData[i + 1] };
                delete mergeOjb.pairId;
                data.messages.push(mergeOjb);

                arrayData.splice(0, 2);
            } else {
                if (arrayData[i].user_time) {
                    let mergeOjb = { ...arrayData[i], bot_time: "", bot: "" };
                    delete mergeOjb.pairId;
                    data.messages.push(mergeOjb);
                } else {
                    let mergeOjb = { ...arrayData[i], user_time: "", user: "" };
                    delete mergeOjb.pairId;
                    data.messages.push(mergeOjb);
                }
                arrayData.splice(0, 1);
            }
        }
    }

    return data;
};

function copyFunction(copyContent) {
    navigator.clipboard.writeText(copyContent).then(
        function () {
            const toastLiveExample = document.getElementById("js-copy-success");

            const toast = new bootstrap.Toast(toastLiveExample);

            toast.show();
        },
        function () {
            const toastLiveExample = document.getElementById("js-copy-failed");
            const toast = new bootstrap.Toast(toastLiveExample);

            toast.show();
        }
    );
}

//onClick event copy link share button
$(".js-copy-button").on("click", async function () {
    extractData();
    const data = formatData(originalData);
    if (data.messages.length <= 0) {
        window.alert("Nothing to share. Please select a desired information you want to share!");
        return;
    }
    const urlShare = await postData(url_api_update_share_chat, data);

    copyFunction(urlShare.url);
});
