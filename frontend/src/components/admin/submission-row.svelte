<script>
    import { formatDistanceToNow } from "date-fns";
    import { API } from "../../lib/helpers";
    import { user } from "../../lib/stores";
    import Swal from "sweetalert2";

    export let submission;

    const setStatus = (status) => {
        API("setSubmissionStatus", {
            body: {
                id: submission.id,
                status,
            },
        }).then(([status, data]) => {
            if (status) {
                submission.status = data.newStatus;
                submission.moderator = $user
            } else {
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
        });
    };
</script>

<tr>
    <!-- Break text -->
    <td class="border px-4 py-1 break-words whitespace-pre-wrap">
        {submission.name}
    </td>
    <td class="border px-4 py-1 break-words whitespace-pre-wrap">
        {submission.content}
    </td>
    <td class="border px-4 py-1"
        >{formatDistanceToNow(new Date(submission.createdAt), {
            addSuffix: true,
        })}</td
    >
    <td class="border px-4 py-1 text-center">
        <span
            class="text-white p-1 rounded-lg capitalize text-sm font-bold"
            class:bg-yellow-500={submission.status === "CREATED"}
            class:bg-green-500={submission.status === "ACCEPTED"}
            class:bg-red-500={submission.status === "DENIED"}
        >
            {submission.status}
        </span>
    </td>
    <td class="border px-4 py-1 text-center">
        {#if submission.moderator}
            {submission.moderator.username}
        {:else}
            <i class="text-gray-400">No moderator</i>
        {/if}
    </td>

    <td class="border text-center">
        <!-- Approve -->
        <button
            class="bg-green-800 text-white p-3 inline-block rounded-xl hover:shadow-lg"
            on:click={() => {
                setStatus(true);
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-check-lg"
                viewBox="0 0 16 16"
            >
                <path
                    d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"
                />
            </svg>
        </button>
        <!-- Deny -->
        <button
            class="bg-red-800 text-white p-3 inline-block rounded-xl hover:shadow-lg"
            on:click={() => {
                setStatus(false);
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x-lg"
                viewBox="0 0 16 16"
            >
                <path
                    d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
                />
            </svg>
        </button>
    </td>
</tr>
