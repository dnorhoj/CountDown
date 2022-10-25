<script>
    import { user } from "../lib/stores";

    import LoginForm from "../components/admin/login-form.svelte";
</script>

{#if $user === null}
    <LoginForm />
{:else}
    <h1>Logged in as {$user.name}</h1>
{/if}
