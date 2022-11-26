<script>
  import TextBox from "../lib/components/Chat/TextBox.svelte";
  import Bubble from "../lib/components/Chat/Bubble.svelte";
  import { onDestroy, onMount } from "svelte";
  let messages = [];

  const addMessage = (text) => {
    if (!text) return;
    messages = [
      ...messages,
      {
        type: "from",
        message: text,
      },
    ];
  };

  const addResponse = (text) => {
    if (!text) return;
    messages = [
      ...messages,
      {
        type: "to",
        message: text,
      },
    ];
    addChatHistoryToSession();
  };

  const addChatHistoryToSession = () => {
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
  };

  const getChatHistoryFromSession = () => {
    const chatHistory = sessionStorage.getItem("chatHistory");
    if (chatHistory) {
      messages = JSON.parse(chatHistory);
    }
  };

  const submitMessage = async (message) => {
    addMessage(message);
    const session_id = sessionStorage.getItem("session_id");
    const response = await fetch("/api/proxy/nlu/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "x-access-token": localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        message,
        session_id,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        console.error(err);
        return {
          response:
            "Sorry, I'm having trouble understanding you. Please try again later.",
        };
      });

    const { response: nlu_answer } = response;

    if (!nlu_answer) {
      addResponse("Sorry, I'm having trouble understanding you.");
      return;
    }

    addResponse(nlu_answer);
  };

  const generateRandomSessionID = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const clearMessages = () => {
    messages = [];
    sessionStorage.removeItem("chatHistory");
  };

  onMount(() => {
    document.body.style.overflow = "hidden";
    getChatHistoryFromSession();
    if (!sessionStorage.getItem("session_id")) {
      const session_ID = generateRandomSessionID();
      sessionStorage.setItem("session_id", session_ID);
    }
  });

  onDestroy(() => {
    document.body.style.overflow = "auto";
    addChatHistoryToSession();
  });
</script>

<main>
  <div class="textbox">
    <TextBox
      placeholder="Say anything"
      buttontext="Say it"
      onSubmit={(text) => {
        submitMessage(text);
      }}
    />
    <p
      on:click={(e) => {
        e.preventDefault();
        clearMessages();
      }}
    >
      clear messages
    </p>
  </div>
  <div class="output">
    {#each messages as { message, type }}
      <Bubble {message} {type} />
    {/each}
  </div>
</main>

<style lang="scss">
  @use "../lib//styles/partials/mixins" as *;
  @use "../lib//styles/partials/variables" as *;

  main {
    @include default-padding;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    position: relative;
    overflow-y: scroll;

    @include tablet {
      text-align: left;
    }

    .textbox {
      //   display: none;
      position: fixed;
      left: 224px;
      right: 0;
      top: 0;
      z-index: 5;
      padding: 24px 56px;

      p {
        text-align: right;
        margin-top: 16px;
        cursor: pointer;
        text-decoration: underline;
        color: $dark-blue;
      }
    }

    .output {
      position: fixed;
      left: 248px;
      top: 124px;
      right: 24px;
      bottom: 24px;
      box-sizing: border-box;
      overflow-y: scroll;
      box-shadow: inset 0.2px 0.2px 10px rgba(0, 0, 0, 0.1);
      border: 1px solid #eaeaea;
      padding: 24px;
    }
  }
</style>
