<script>
    import { API } from "../../lib/helpers";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let settings = null;
    let countDownTo = null;

    const getHelp = () => {
        Swal.fire({
            icon: "info",
            title: "Info",
            html: `
            <p>Here you can view and change site-wide settings.</p>
            <div class="text-left">
                <h3 class="text-xl mt-3 font-bold">Settings</h3>
                <p>Settings can be changed by clicking on the value.</p>
            </div>
            `,
        });
    };

    const getSettings = async () => {
        const [status, data] = await API("getSettings");

        if (!status) {
            // Toast
            Swal.fire({
                icon: "error",
                text: "Error; " + data.message,
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }

        settings = data.settings;
        const UTCDate = new Date(settings.countDownTo);
        countDownTo = new Date(UTCDate.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19);
    };

    onMount(getSettings);

    const saveSettings = async () => {
        const [status, data] = await API("saveSettings", {
            body: settings,
        });

        if (!status) {
            // Toast
            Swal.fire({
                icon: "error",
                text: "Error; " + data.message,
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        } else {
            // Toast
            Swal.fire({
                icon: "success",
                text: "Settings saved",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            settings = data.settings;
        }
    };

    $: {
        if (settings) settings.countDownTo = new Date(countDownTo).getTime();
    }
</script>

<div class="flex flex-row space-x-3 justify-between items-center">
    <h1 class="text-xl">Site settings</h1>
    <!-- question mark -->
    <button class="drop-shadow-xl" on:click={getHelp}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 16 16"
        >
            <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"
            />
        </svg>
    </button>
</div>
{#if settings}
    <div class="select-none">
        <input
            type="checkbox"
            bind:checked={settings.requireApproval}
            on:change={saveSettings}
            id="requireApproval"
            class="border border-gray-300 rounded-md px-2 py-1"
        />
        <label for="requireApproval">
            Require moderator approval for all comments
        </label>
    </div>
    <div class="select-none">
        <label for="countDownTo">Count down to</label>
        <input
            type="datetime-local"
            bind:value={countDownTo}
            id="countDownTo"
            class="border border-gray-300 rounded-md px-2 py-1"
        />
    </div>
    <button
        class="p-2 rounded-xl text-white bg-green-500"
        on:click={saveSettings}
    >
        Save
    </button>
{/if}
