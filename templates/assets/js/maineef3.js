import SSE from "./sse.js?v=0.2";
import {
  currentChatId,
  oddReference,
  formatTimestamp,
  firstChatAutoCreateName,
  getValueOneTime,
  setValueOneTime,
  createChatItem,
  setFirstChatAutoCreateName,
} from "./chat.js?v=0.2";
export let isRunning = false;

async function postBotResponse(url = "", data = {}) {
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
}

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

const renderQuestion = (value, chatId) => {
  $(".dialog").append(
    `
        
        <div pair-id="${chatId}">
          <div class="position-relative share-container js-share">
        <div class="share-checkbox js-share-checkbox" jsresult="${chatId}">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                    class="bg-checkbox"
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="white"
                />
                <path
                    d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                    fill="#fff"
                />
            </svg>
        </div>
        <div class="chat-request gap-10">
            <div class="chat-infor">
                <div class="date-time">${formatTimestamp(chatId)}</div>
                <div class="chat-container justify-content-end">
                    <div class="chat-function">
                        <svg width="16" height="16">
                            <use xlink:href="#icon-three-dots"></use>
                        </svg>
                    </div>
                    <div class="chat-content">${value}</div>
                </div>
            </div>
            <div class="avatar">
                <img width="200" height="200" src="${url_ai_avatar}" alt="Main Avatar" />
            </div>
        </div>
    </div>
    <div class="position-relative share-container js-share">
        <div class="share-checkbox js-share-checkbox js-time-checkbox" jsresult="">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                    class="bg-checkbox"
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="white"
                />
                <path
                    d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                    fill="#fff"
                />
            </svg>
        </div>
        <div class="chat-request flex-row-reverse gap-10">
            <div class="chat-infor align-flex-start">
                <div class="date-time date-time-response">3/27/2023, 4:18:09 PM</div>
                <div class="chat-container flex-row-reverse">
                    <div class="chat-function">
                        <svg width="16" height="16">
                            <use xlink:href="#icon-three-dots"></use>
                        </svg>
                    </div>
                    <pre id="${chatId}" class="chat-content chat-response"></pre>
                </div>
            </div>
            <div class="avatar">
                <img width="200" height="200" src="${url_chatgpt_avatar}" alt="Main Avatar" />
            </div>
        </div>
    </div>
     </div>
    `
  );
  // auto go bottom of dialog chat
  $(".dialog").animate(
    { scrollTop: $(".dialog").offset().top + $(".dialog")["0"].scrollHeight },
    1
  );
};

let odd = 1,
  insidePreTag = false,
  isDoctype = false,
  textInsidePre = "",
  temporaryReNameNewChat;

const formatResponseText = function (text) {
  var result = "";
  for (var i = 0; i < text.length; i++) {
    if (text[i] == "`" && text[i + 1] == "`" && text[i + 2] == "`") {
      if (odd % 2 != 0) {
        result += `<pre  class="${odd}"><code class="${odd}"></code></pre>`;
        insidePreTag = true;
        odd++;
        i += 2;
      } else {
        result += "";
        insidePreTag = false;
        textInsidePre = "";
        odd++;
        i += 2;
      }
    } else if (text[i] == "<" && text[i + 1] == "!" && !insidePreTag) {
      result += `<pre  class="${odd}"><code class="${odd}"></code></pre>`;
      insidePreTag = true;
      isDoctype = true;
      odd += 2;
      i += 2;
    } else {
      result += text[i];
    }
  }

  return result;
};

const sendQuestion = (value) => {
  isRunning = true;
  // reset input to empty string
  $("#input-chat").val("");
  $(".send-button").removeClass("active");
  $(".response-loading").removeClass("hide");
  $(".resend").text("An unknown error occurred. Try again!");

  // check input token length
  let inputTokenLength = (value.length / 4 / 750) * 1000;
  if (inputTokenLength > 3000) {
    insidePreTag = false;
    isDoctype = false;
    textInsidePre = "";
    isRunning = false;
    window.alert(
      "Limit words error! Please enter a question less than 3000 words"
    );
    return;
  }
  let chatId = Date.now();
  renderQuestion(value, chatId);
  $(".dialog").animate(
    {
      scrollTop: $(".dialog").offset().top + $(".dialog")["0"].scrollHeight,
    },
    1
  );
  ////////
  //  POST method implementation:
  async function* parseJsonStream(readableStream) {
    for await (const line of readLines(readableStream.getReader())) {
      const trimmedLine = line.trim().replace(/,$/, "");

      if (trimmedLine !== "[" && trimmedLine !== "]") {
        yield JSON.parse(trimmedLine);
      }
    }
  }
  async function* readLines(reader) {
    const textDecoder = new TextDecoder();
    let partOfLine = "";
    for await (const chunk of readChunks(reader)) {
      const chunkText = textDecoder.decode(chunk);
      const chunkLines = chunkText.split("\n");
      if (chunkLines.length === 1) {
        partOfLine += chunkLines[0];
      } else if (chunkLines.length > 1) {
        yield partOfLine + chunkLines[0];
        for (let i = 1; i < chunkLines.length - 1; i++) {
          yield chunkLines[i];
        }
        partOfLine = chunkLines[chunkLines.length - 1];
      }
    }
  }

  function readChunks(reader) {
    return {
      async *[Symbol.asyncIterator]() {
        let readResult = await reader.read();
        while (!readResult.done) {
          yield readResult.value;
          readResult = await reader.read();
        }
      },
    };
  }
  async function postData(url = "", data = {}) {
    try {
      var source = new SSE(url, {
        headers: {
          "Content-Type": "application/json",
        },
        payload: JSON.stringify(data),
      });
      let textResponse = "";
      source.addEventListener("message", (message) => {
        for (let i = 0; i < message.data.length; i++) {
          // if (message.data.length > 1){
          //     console.log(message.data[i]);
          // }
          let message_data = message.data[i];
          let responseObj;

          try {
            responseObj = JSON.parse(message_data);
          } catch (error) {
            console.log(error.message);
            if (odd % 2 == 0) {
              odd++;
            }
            if (textResponse.split(" ").length > 1000) {
              $(".resend").text(
                "The text response length has reached the limit tokens. Please try again!"
              );
            }
            insidePreTag = false;
            isDoctype = false;
            textInsidePre = "";
            isRunning = false;
            source.close();
            $(".response").addClass("hide");
            $(".resend").removeClass("hide");
            return;
          }

          if (isRunning) {
            $(".stop-response, .response-loading").removeClass("hide");
          } else {
            $(".stop-response, .response-loading").addClass("hide");
          }
          if (responseObj.choices[0].finish_reason !== null) {
            if (isDoctype) {
              insidePreTag = false;
              isDoctype = false;
              textInsidePre = "";
            }
            $(".js-time-checkbox").attr("jsresult", `${Date.now()}`);
            postBotResponse(url_api_update_messages, {
              chat_id: currentChatId,
              bot_response: textResponse,
              timestamp: Date.now(),
            });
            document.querySelectorAll("pre code").forEach((el) => {
              hljs.highlightElement(el);
            });

            isRunning = false;
            $(".stop-response, .response-loading").addClass("hide");
            return;
          }

          if (responseObj.choices[0].delta.content !== undefined) {
            if (insidePreTag && !isDoctype) {
              textInsidePre += responseObj.choices[0].delta.content.replace(
                /`\n\n/g,
                "`"
              );
              let oldText = "" + $(`pre.${odd - 1}`).html();
              $(`code.${odd - 1}`).text(textInsidePre);

              let newText = "" + $(`pre.${odd - 1}`).html();

              textResponse = textResponse.replace(oldText, newText);
            } else if (insidePreTag && isDoctype) {
              textInsidePre += responseObj.choices[0].delta.content.replace(
                /`\n\n/g,
                "`"
              );
              let oldText = "" + $(`pre.${odd - 2}`).html();
              $(`code.${odd - 2}`).text(textInsidePre);

              let newText = "" + $(`pre.${odd - 2}`).html();

              textResponse = textResponse.replace(oldText, newText);
            } else {
              textResponse += responseObj.choices[0].delta.content.replace(
                /`\n\n/g,
                "`"
              );
            }
          }

          $(".stop-response, .response-loading").on("click", function () {
            $(this).addClass("hide");
            if (odd % 2 == 0) {
              odd++;
            }
            insidePreTag = false;
            isDoctype = false;
            textInsidePre = "";
            isRunning = false;
            source.close();
          });

          textResponse = formatResponseText(textResponse);

          $(`#${chatId}`).text(`${textResponse}`);
          $(`#${chatId}`).html($(`#${chatId}`).text());
          $(".date-time-response").text(formatTimestamp(Date.now()));
          $(".dialog").animate(
            {
              scrollTop:
                $(".dialog").offset().top + $(".dialog")["0"].scrollHeight,
            },
            1
          );
        }
      });

      source.stream();
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  postData(url_api_chat_api_stream, {
    question: value,
    chat_id: currentChatId,
    timestamp: chatId,
  });
};

let lastQuestion = "";
// handle text input change and send question
$("#input-chat").onEnter(async function () {
  if ($(this).val().length > 0 && !isRunning) {
    if (currentChatId === undefined) {
      await createChatItem();
      if (firstChatAutoCreateName) {
        postBotResponse(url_api_update_chat_name, {
          chat_id: currentChatId,
          chat_name: $(this).val(),
        });
        $(`#${currentChatId} .chatbox-name`).text($(this).val());
        $(".mobile-chat-name").text($(this).val());
        setFirstChatAutoCreateName();
      }
    } else {
      if (firstChatAutoCreateName) {
        postBotResponse(url_api_update_chat_name, {
          chat_id: currentChatId,
          chat_name: $(this).val(),
        });
        $(`#${currentChatId} .chatbox-name`).text($(this).val());
        $(".mobile-chat-name").text($(this).val());
        setFirstChatAutoCreateName();
      }
    }
    if (getValueOneTime) {
      if (oddReference !== undefined) {
        odd = oddReference;
      }
      setValueOneTime();
    }
    lastQuestion = $(this).val();
    $(".example-question").hide();
    $(".ads-container-xl").hide();
    $(".clear-button").hide();
    $(".ads-container-main").hide();
    sendQuestion($(this).val());
    $("#input-chat").css("height", "auto");

    $("#input-chat").css("height", `${$("#input-chat")["0"].scrollHeight}px`);
  }
});
$(".send-button").on("click", async function () {
  if ($("#input-chat").val().length > 0 && !isRunning) {
    if (currentChatId === undefined) {
      await createChatItem();
      if (firstChatAutoCreateName) {
        postBotResponse(url_api_update_chat_name, {
          chat_id: currentChatId,
          chat_name: $("#input-chat").val(),
        });
        $(`#${currentChatId} .chatbox-name`).text($("#input-chat").val());
        $(".mobile-chat-name").text($("#input-chat").val());
        setFirstChatAutoCreateName();
      }
    } else {
      if (firstChatAutoCreateName) {
        postBotResponse(url_api_update_chat_name, {
          chat_id: currentChatId,
          chat_name: $("#input-chat").val(),
        });
        $(`#${currentChatId} .chatbox-name`).text($("#input-chat").val());
        $(".mobile-chat-name").text($("#input-chat").val());
        setFirstChatAutoCreateName();
      }
    }
    if (getValueOneTime) {
      if (oddReference !== undefined) {
        odd = oddReference;
      }

      setValueOneTime();
    }

    lastQuestion = $("#input-chat").val();
    $(".example-question").hide();
    $(".ads-container-xl").hide();
    $(".clear-button").hide();
    sendQuestion($("#input-chat").val());
    $("#input-chat").css("height", "auto");

    $("#input-chat").css("height", `${$("#input-chat")["0"].scrollHeight}px`);
  }
});

// resend button event
$(".resend").on("click", function () {
  $(this).addClass("hide");
  sendQuestion(lastQuestion);
});

// refresh remove alert
window.onload = function () {
  if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
  }
};
