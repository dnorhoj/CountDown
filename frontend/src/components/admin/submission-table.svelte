<script>
    import { API } from "../../lib/helpers";
    import { writable } from "svelte/store";
    import Swal from "sweetalert2";
    import { onDestroy, onMount } from "svelte";
    import SubmissionRow from "./submission-row.svelte";

    let submissions = null,
        interval;
    const filters = writable({
        status: ["CREATED"],
    });

    const getSubmissions = async () => {
        const [status, data] = await API("getSubmissions", {
            body: {
                ...$filters
            },
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
        }

        submissions = data.submissions;
    };

    onMount(() => {
        getSubmissions();
        interval = setInterval(getSubmissions, 10000);
    });

    onDestroy(() => {
        clearInterval(interval);
    });

    const getHelp = () => {
        Swal.fire({
            icon: "info",
            title: "Info",
            html: `
            <p>Here you can view and moderate submissions.</p>
            <div class="text-left">
                <h3 class="text-xl mt-3 font-bold">Submission Status</h3>
                <p>Submissions can have one of the following statuses;</p>
                <ul class="list-disc list-inside">
                    <li><b>CREATED</b> - The comment is waiting for moderation</li>
                    <li><b>ACCEPTED</b> - The comment has been accepted</li>
                    <li><b>DENIED</b> - The comment has been denied</li>
                </ul>

                <h3 class="text-xl mt-3 font-bold">Submission Actions</h3>
                <p>Submissions can be approved or denied. When a submission is approved, the comment will be shown on the countdown screen.</p>
            </div>`,
        });
    };
</script>

<div class="flex flex-row space-x-3 justify-between items-center">
    <h1 class="text-xl">Comments</h1>
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

<ul
    class="flex flex-row justify-start space-x-3 select-none border border-gray-300 p-3 my-2"
>
    <span class="font-bold">Show comments with status:</span>
    {#each ["Created", "Accepted", "Denied"] as type}
        <li>
            <input
                id={`${type}Check`}
                type="checkbox"
                bind:group={$filters.status}
                on:change={getSubmissions}
                value={type.toUpperCase()}
                class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
            />
            <label for={`${type}Check`}>{type}</label>
        </li>
    {/each}
</ul>

<table class="table-fixed w-full">
    <thead>
        <tr>
            <th class="px-4 py-1">Name</th>
            <th class="px-4 py-1">Comment</th>
            <th class="px-4 py-1">Created at</th>
            <th class="px-4 py-1">Status</th>
            <th class="px-4 py-1">Moderated by</th>
            <th class="px-4 py-1">Actions</th>
        </tr>
    </thead>
    <tbody>
        {#if submissions === null}
            <tr>
                <td colspan="6" class="border px-4 py-2">Loading...</td>
            </tr>
        {:else if submissions.length === 0}
            <tr>
                <td colspan="6" class="border px-4 py-2">No comments found!</td>
            </tr>
        {:else}
            {#each submissions as submission}
                <SubmissionRow {submission} />
            {/each}
        {/if}
    </tbody>
</table>
