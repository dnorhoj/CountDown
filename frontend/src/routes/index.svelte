<script>
    import { API } from "../lib/helpers";
    import Swal from "sweetalert2";

    let name, content;

    const sendComment = async () => {
        const [status, data] = await API("submissions", {
            body: {
                name,
                content,
            },
        });

        if (status) {
            name = "";
            content = "";
            Swal.fire({
                title: "Success!",
                text: "Kommentar sendt",
                icon: "success",
            });
        } else {
            Swal.fire({
                text: "Fejl; " + data.message,
                icon: "error",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }
    };
</script>

<main>
    <div
        class="container mx-auto mt-3 bg-neutral-800 rounded-xl shadow-xl text-white p-5 text-center"
    >
        <h1 class="text-3xl font-bold">Countdown Chat</h1>
        <h2 class="text-xl">Coding Pirates GameJam 2022</h2>
    </div>

    <div
        class="bg-neutral-800 p-16 rounded-2xl drop-shadow-2xl mx-auto w-fit mt-10"
    >
        <form on:submit|preventDefault={sendComment}>
            <div class="flex flex-col items-center justify-center">
                <input
                    bind:value={name}
                    class="p-2 rounded-lg w-96 mb-3"
                    type="text"
                    placeholder="Navn"
                />
                <textarea
                    bind:value={content}
                    class="p-2 rounded-lg w-96 mb-6"
                    type="text"
                    placeholder="Besked"
                />
                <button class="p-2 rounded-lg w-96 bg-white" type="submit">
                    Send
                </button>
            </div>
        </form>
    </div>
</main>
