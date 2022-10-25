<script>
  import { Router, Route, Link } from "svelte-routing";
    import Admin from "./routes/admin.svelte";
  import Countdown from "./routes/countdown.svelte";

  // Pretty janky way to not show navbar on countdown page
  let inCountdown = false;
</script>

<Router>
  <!-- Janky -->
  {#if location.pathname !== "/countdown" && !inCountdown}
    <nav>
      <Link to="/">Home</Link>
      <!-- Janky -->
      <Link
        to="/countdown"
        on:click={() => {
          inCountdown = true;
        }}
      >
        Countdown
      </Link>
      <Link to="/about">About</Link>
    </nav>
  {/if}
  <div>
    <Route path="/countdown"><Countdown /></Route>
    <Route path="/admin"><Admin /></Route>
  </div>
</Router>
