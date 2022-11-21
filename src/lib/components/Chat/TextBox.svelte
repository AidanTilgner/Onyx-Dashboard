<script>
  export let placeholder, buttontext, onSubmit;

  let text = "";

  const submit = () => {
    if (text) {
      onSubmit(text);
      text = "";
    }
  };
</script>

<div class="text-box">
  <input
    type="text"
    {placeholder}
    bind:value={text}
    on:keydown={(e) => {
      if (e.key === "Enter") submit();
    }}
  />
  <button on:click={submit}>{buttontext || "Submit"}</button>
</div>

<style lang="scss">
  @use "../../styles/partials/mixins" as *;
  @use "../../styles/partials/variables" as *;

  .text-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border: none;
    outline: none;
  }

  input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background-color: white;
    font-size: 16px;
    font-weight: 500;
    box-sizing: border-box;
    font-family: $primary-font;
    color: $cool-blue;
    padding: 0 24px;
  }

  button {
    width: 100px;
    height: 100%;
    border: none;
    outline: none;
    background-color: $cool-blue;
    color: white;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    font-family: $primary-font;
    transition: all 0.2s ease-in-out;

    @include tablet {
      width: 100px;
      height: 50px;
    }

    &:hover {
      background-color: rgba($color: $cool-blue, $alpha: 0.85);
    }

    &:active {
      transform: scale(0.97) translateY(1px);
    }
  }
</style>
