<script>
    import { API } from "../../lib/helpers";
    import { user } from "../../lib/stores";
    import { writable } from "svelte/store";
    import Swal from 'sweetalert2';
    import { onMount } from "svelte";
    
    let submissions = null;
    const filters = writable({
        status: []
    });

    const getPage = async page => {
        const [status, data] = await API("getSubmissions", {
            body: {
                page,
                status: $filters.status
            }
        });

        if (!status) {
            // Toast
            Swal.fire({
                icon: 'error',
                text: "Error; " + data.message,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }

        submissions = data.submissions;
    };

    onMount(() => {
        getPage(1);
    });
</script>

<table class="table-auto w-full">
    <thead>
        <tr>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Content</th>
            <th class="px-4 py-2">Submitted at</th>
            <th class="px-4 py-2">Actions</th>
        </tr>
    </thead>
    <tbody>
        {#if submissions}
            {#each submissions as submission}
                <tr>
                    <td class="border px-4 py-2">{submission.name}</td>
                    <td class="border px-4 py-2">{submission.content}</td>
                    <td class="border px-4 py-2">{submission.createdAt}</td>

                    <td class="border px-4 py-2">
                        <button class="bg-green-800 text-white p-2 rounded-xl shadow-xl inline-block hover:shadow-lg">Approve</button>
                        <button class="bg-red-800 text-white p-2 rounded-xl shadow-xl inline-block hover:shadow-lg">Deny</button>
                    </td>
                </tr>
            {/each}
        {:else if submissions === null}
            <tr>
                <td colspan="4" class="border px-4 py-2">Loading...</td>
            </tr>
        {:else}
            <tr>
                <td colspan="4" class="border px-4 py-2">No submissions found.</td>
            </tr>
        {/if}
    </tbody>
</table>