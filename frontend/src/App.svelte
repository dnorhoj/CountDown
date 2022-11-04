<script>
  import { Router, Route } from "svelte-routing";

  import Admin from "./routes/admin.svelte";
  import Countdown from "./routes/countdown.svelte";
  import Index from "./routes/index.svelte";
  import NotFound from "./routes/404.svelte";
</script>

<Router>
  <div>
    <Route path="/"><Index /></Route>
    <Route path="/countdown"><Countdown /></Route>
    <Route path="/admin"><Admin /></Route>
    <Route path="*"><NotFound /></Route>
  </div>
</Router>
