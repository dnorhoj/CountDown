<script>
    import { API } from "../../lib/helpers";
    import Swal from "sweetalert2";
    import { onMount } from "svelte";
    import UserRow from "./user-row.svelte";

    let users = null;

    const getUsers = async () => {
        const [status, data] = await API("getUsers");

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
            users = data.users;
        }
    };

    const addUser = () => {
        Swal.fire({
            title: "Add User",
            html: `
            <div class="flex flex-col">
                <label for="username">Username</label>
                <input type="text" id="username" class="swal2-input" />
                <label for="password" class="mt-2">Password</label>
                <input type="password" id="password" class="swal2-input" />
                <label for="role" class="mt-2">Role</label>
                <select id="role" class="swal2-input">
                    <option value="ADMIN">Admin</option>
                    <option value="OWNER">Owner</option>
                </select>
            </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Add",
            preConfirm: () => {
                const username =
                    // @ts-ignore
                    Swal.getPopup().querySelector("#username").value;
                const password =
                    // @ts-ignore
                    Swal.getPopup().querySelector("#password").value;
                const role =
                    // @ts-ignore
                    Swal.getPopup().querySelector("#role").value;

                if (!username || !password) {
                    Swal.showValidationMessage(
                        "Please enter a username and password"
                    );
                }
                if (username.length < 3) {
                    Swal.showValidationMessage(
                        "Username must be at least 3 characters"
                    );
                }
                if (password.length < 8) {
                    Swal.showValidationMessage(
                        "Password must be at least 8 characters"
                    );
                }

                return { username, password, role };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const [status, data] = await API("createUser", {
                    body: {
                        username: result.value.username,
                        password: result.value.password,
                        role: result.value.role,
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
                } else {
                    // Toast
                    Swal.fire({
                        icon: "success",
                        text: "User added",
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    });

                    getUsers();
                }
            }
        });
    };

    onMount(() => {
        getUsers();
    });
</script>

<div class="flex flex-row space-x-3 justify-between items-center">
    <h1 class="text-xl">Users</h1>
    <button class="p-2 rounded-xl text-white bg-green-500" on:click={addUser}
        >Add user</button
    >
</div>

<table class="table-fixed w-full">
    <thead>
        <tr>
            <th class="px-4 py-1">Username</th>
            <th class="px-4 py-1">Role</th>
            <th class="px-4 py-1">Actions</th>
        </tr>
    </thead>
    <tbody>
        {#if users === null}
            <tr>
                <td colspan="6" class="border px-4 py-2">Loading...</td>
            </tr>
        {:else}
            {#each users as user}
                <UserRow {user} {getUsers} />
            {/each}
        {/if}
    </tbody>
</table>
