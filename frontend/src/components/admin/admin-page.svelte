<script>
    import { user } from "../../lib/stores";
    import SubmissionTable from "./submission-table.svelte";
    import Swal from "sweetalert2";

    const logOut = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Log me out!",
            confirmButtonColor: "#d33"
        }).then((result) => {
            if (result.isConfirmed) {
                user.set(null);
                localStorage.removeItem("token");
            }
        });
    };

    const account = () => {
        Swal.fire("Account", "This feature is not yet implemented.", "info");
    };
</script>

<div class="container mx-auto mt-3">
    <div class="flex flex-row justify-between mb-3">
        <div class="bg-neutral-800 text-white p-3 shadow-xl rounded-xl text-xl">
            <h1>Admin Panel</h1>
        </div>
        <div class="flex flex-row w-fit space-x-3">
            <button
                class="bg-neutral-700 text-white p-3 shadow-xl rounded-xl text-lg"
                on:click={account}
            >
                Welcome, <strong>{$user.username}</strong>!
            </button>
            <button
                class="bg-red-800 text-white text-xl p-3 rounded-xl shadow-xl inline-block hover:shadow-lg"
                on:click={logOut}
            >
                Logout
            </button>
        </div>
    </div>
    <main>
        <h1 class="text-xl">Pending submissions</h1>
        <SubmissionTable />
    </main>
</div>
