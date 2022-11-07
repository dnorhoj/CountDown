<script>
    import Swal from "sweetalert2";
    import { API } from "../../lib/helpers";

    export let user, getUsers;

    const deleteUser = async () => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Delete User",
            text: "Are you sure you want to delete this user?",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;

        const [status, data] = await API("deleteUser", {
            body: {
                id: user.id,
            },
        });

        if (status) {
            // Toast
            Swal.fire({
                icon: "success",
                text: "User deleted",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            getUsers();
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
    }
</script>

<tr>
    <td class="border px-4 py-1">
        {user.username}
    </td>
    <td class="border px-4 py-1">
        {user.role}
    </td>
    <td class="border px-4 py-1">
        <button class="p-1 rounded-lg text-white bg-red-500" on:click={deleteUser}>
            Delete
        </button>
    </td>
</tr>
