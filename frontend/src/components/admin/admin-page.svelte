<script>
    import { user } from "../../lib/stores";
    import SubmissionTable from "./submission-table.svelte";
    import Swal from "sweetalert2";
    import SiteSettings from "./site-settings.svelte";
    import UsersTable from "./users-table.svelte";
    import { API } from "../../lib/helpers";

    const logOut = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Log me out!",
            confirmButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                user.set(null);
                localStorage.removeItem("token");
            }
        });
    };

    const changePassword = () => {
        Swal.fire({
            title: "Change Password",
            html: `
                <input id="swal-input1" class="swal2-input" type="password" placeholder="New Password">
                <input id="swal-input2" class="swal2-input" type="password" placeholder="Confirm Password">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Change Password",
            preConfirm: () => {
                const password = 
                    // @ts-ignore
                    Swal.getPopup().querySelector("#swal-input1").value;
                const confirmPassword =
                    // @ts-ignore
                    Swal.getPopup().querySelector("#swal-input2").value;                    

                if (!password || !confirmPassword) {
                    Swal.showValidationMessage(
                        "Please enter a password and confirm it"
                    );
                } else if (password !== confirmPassword) {
                    Swal.showValidationMessage(
                        "Passwords do not match"
                    );
                } else if (password.length < 8) {
                    Swal.showValidationMessage(
                        "Password must be at least 8 characters"
                    );
                }

                return { password, confirmPassword };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value[0] !== result.value[1]) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Passwords don't match!",
                    });
                } else {
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You will be logged out.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Change Password",
                        confirmButtonColor: "#d33",
                    }).then((result_confirm) => {
                        if (result_confirm.isConfirmed) {
                            API("changePassword", {
                                body: {
                                    password: result.value.password
                                },
                            }).then(([status, data]) => {
                                if (status) {
                                    Swal.fire({
                                        icon: "success",
                                        title: "Success!",
                                        text: "Password changed!",
                                    });
                                    user.set(null);
                                    localStorage.removeItem("token");
                                } else {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: "Something went wrong!",
                                    });
                                }
                            });

                            user.set(null);
                            localStorage.removeItem("token");
                        }
                    });
                }
            }
        });
    };
</script>

<div class="container mx-auto mt-3">
    <div class="flex flex-row justify-between mb-3">
        <div class="bg-neutral-800 text-white p-3 shadow-xl rounded-xl text-xl">
            <h1>Admin Panel</h1>
        </div>
        <div class="flex flex-row w-fit space-x-3">
            <button
                class="bg-blue-700 text-white p-3 shadow-xl rounded-xl text-lg"
                on:click={changePassword}
            >
                Change password
            </button>
            <div
                class="bg-neutral-700 text-white p-3 shadow-xl rounded-xl text-lg"
            >
                Welcome, <strong>{$user.username}</strong>!
            </div>
            <button
                class="bg-red-800 text-white text-xl p-3 rounded-xl shadow-xl inline-block hover:shadow-lg"
                on:click={logOut}
            >
                Logout
            </button>
        </div>
    </div>
    <main>
        <div class="card">
            <SiteSettings />
        </div>
        <div class="card">
            <SubmissionTable />
        </div>
        {#if $user.role === "OWNER"}
            <div class="card">
                <UsersTable />
            </div>
        {/if}
    </main>
</div>

<style>
    .card {
        @apply p-3 shadow-xl rounded-xl border-neutral-800 border mt-4;
    }
</style>
