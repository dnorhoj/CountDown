<script>
    import { API } from "../lib/helpers";
    import Swal from "sweetalert2";

    const randomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    };

    let name, content, color = randomColor();

    const sendComment = async () => {
        const lastComment = localStorage.getItem("lastComment");

        if (lastComment) {
            const lastCommentTime = parseInt(lastComment);

            if (Date.now() - lastCommentTime < 1000 * 60 * 15) {
                Swal.fire({
                    title: "Error",
                    text: "Du kan kun skrive en kommentar hvert 15. minut",
                    icon: "error",
                });

                return;
            }
        }

        const [status, data] = await API("submissions", {
            body: {
                name,
                content,
                color,
            },
        });

        if (status) {
            name = "";
            content = "";
            color = randomColor();
            Swal.fire({
                title: "Success!",
                text: "Kommentar sendt",
                icon: "success",
            });
            localStorage.setItem("lastComment", Date.now().toString());
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

    const showHelp = () => {
        Swal.fire({
            title: "Hjælp",
            html: `
            <div class="text-left">
                <p>
                    <b>Velkommen til GameJam 2022!</b>
                </p>
                <p>
                    Her kan du sende en kommentar til GameJam 2022.
                    Din kommentar vil blive vist på nedtællingsskærmen!
                </p>
                <p class="mt-3">
                    <b>Regler:</b>
                    <ol class="list-decimal list-inside indent-5">
                        <li>Du må ikke skrive stødende eller krænkende kommentarer</li>
                        <li>Ingen reklame</li>
                        <li>Ingen spam</li>
                    </ol>
                </p>
            </div>
            `,
            icon: "info",
        });
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
        class="bg-neutral-800 p-10 rounded-2xl drop-shadow-2xl mx-auto w-fit mt-10 relative"
    >
        <button
            class="absolute text-white top-0 right-0 mt-2 mr-2"
            on:click={showHelp}
        >
            <!-- question mark -->
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
        <form on:submit|preventDefault={sendComment}>
            <div class="flex flex-col items-center justify-center">
                <div>
                    <label
                        for="name"
                        class="text-white text-xl font-bold block"
                    >
                        Navn
                    </label>
                    <input
                        bind:value={name}
                        class="p-2 rounded-lg w-96 mb-3"
                        type="text"
                        id="name"
                        placeholder="Jens Jensen"
                    />
                    {#if name?.length > 50}
                        <p class="text-red-500">
                            {name.length}/50
                        </p>
                    {/if}
                </div>

                <div>
                    <label
                        for="content"
                        class="text-white text-xl font-bold block"
                    >
                        Besked
                    </label>
                    <textarea
                        bind:value={content}
                        class="p-2 rounded-lg w-96 mb-6"
                        type="text"
                        id="content"
                        placeholder="Hej"
                    />
                    {#if content?.length > 140}
                        <p class="text-red-500">
                            {content.length}/140
                        </p>
                    {/if}
                </div>

                <div>
                    <label
                        for="pickColor"
                        class="text-white text-xl font-bold block"
                    >
                        Vælg farve
                    </label>
                    <input
                        id="pickColor"
                        type="color"
                        bind:value={color}
                        class="p-1 h-10 rounded-lg w-96 mb-3"
                    />
                </div>

                <button class="p-2 rounded-lg w-96 bg-white mt-3" type="submit">
                    Send
                </button>
            </div>
        </form>
    </div>
</main>
