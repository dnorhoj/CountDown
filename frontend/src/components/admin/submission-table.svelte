<script>
    import { API } from "../../lib/helpers";
    import { user } from "../../lib/stores";
    import Swal from 'sweetalert2';
    
    let submissions = null;

    const getPage = async page => {
        const [status, data] = await API("submissions?page=" + encodeURIComponent(page));

        if (!status) {
            // Toast
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }

        submissions = data.submissions;
    };
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