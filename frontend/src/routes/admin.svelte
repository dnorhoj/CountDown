<script>
    import { user } from "../lib/stores.js";
    import { fade } from "svelte/transition";

    import LoginForm from "../components/admin/login-form.svelte";
    import AdminPage from "../components/admin/admin-page.svelte";
</script>

{#if $user === null}
    <div in:fade>
        <LoginForm />
    </div>
{:else}
    <div in:fade>
        <AdminPage />
    </div>
{/if}
