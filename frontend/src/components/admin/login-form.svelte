<script>
    import { API } from "../../lib/helpers";
    import { user } from "../../lib/stores";
    import Swal from "sweetalert2";

    let username = "",
        password = "",
        shake = false;

    const login = async () => {
        API("login", {
            body: {
                username,
                password,
            },
        }).then(([status, data]) => {
            if (status) {
                localStorage.setItem("token", data.token);
                $user = data.user;

                Swal.fire({
                    text: "Logged in",
                    icon: "success",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                });
            } else {
                data.message;

                // Fire toast swal
                Swal.fire({
                    text: "Error; " + data.message,
                    icon: "error",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });

                // Shake the login form
                shake = true;
                setTimeout(() => {
                    shake = false;
                }, 500);
            }
        });
    };
</script>

<div class="fixed w-full h-full select-none">
    <div class="flex items-center justify-center h-full">
        <div class="flex flex-col items-center justify-center">
            <div
                class="bg-neutral-800 p-16 rounded-2xl drop-shadow-2xl"
                class:shake
            >
                <h1 class="text-5xl text-white font-bold text-center mb-6">
                    Login
                </h1>

                <form on:submit|preventDefault={login}>
                    <div class="flex flex-col items-center justify-center">
                        <input
                            bind:value={username}
                            class="p-2 rounded-lg w-96 mb-3"
                            type="text"
                            placeholder="Username"
                        />
                        <input
                            bind:value={password}
                            class="p-2 rounded-lg w-96 mb-6"
                            type="password"
                            placeholder="Password"
                        />
                        <button
                            class="p-2 rounded-lg w-96 bg-white"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    .shake {
        animation: shake 0.5s linear;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        perspective: 1000px;
    }

    @keyframes shake {
        10%,
        90% {
            transform: translate3d(-1px, 0, 0);
        }

        20%,
        80% {
            transform: translate3d(2px, 0, 0);
        }

        30%,
        50%,
        70% {
            transform: translate3d(-4px, 0, 0);
        }

        40%,
        60% {
            transform: translate3d(4px, 0, 0);
        }
    }
</style>
