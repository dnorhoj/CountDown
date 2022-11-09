<!-- svelte-ignore a11y-distracting-elements -->
<script>
    import { onMount } from "svelte";

    export let comment, countDownRect;

    let el,
        coords = [0, 0];

    const contrastColor = (color) => {
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? "#000000" : "#ffffff";
    };

    const updatePosition = () => {
        const xSize = el.getBoundingClientRect().width;
        const ySize = el.getBoundingClientRect().height;
        if (xSize > window.innerWidth || ySize > window.innerHeight) {
            document.body.removeChild(el);
            return;
        }

        // Generate random coordinates
        // Don't let the comment go off the screen or collide with the countdown
        while (true) {
            coords = [
                Math.floor(Math.random() * (window.innerWidth - xSize)),
                Math.floor(Math.random() * (window.innerHeight - ySize - 20)) + 20,
            ];

            if (
                coords[0] < countDownRect.x + countDownRect.width &&
                coords[0] + xSize > countDownRect.x &&
                coords[1] < countDownRect.y + countDownRect.height + 20 &&
                coords[1] + ySize > countDownRect.y
            )
                continue;

            break;
        }
    };

    const complimentary = contrastColor(comment.color);

    onMount(() => {
        updatePosition();
    });
</script>

<div class="fixed" style="top:{coords[1]}px; left:{coords[0]}px;">
    <div class="inline-block card">
        <fieldset
            class="border shadow-xl border-solid bg-white border-gray-300 p-3 rounded-xl max-w-xs break-all"
            bind:this={el}
        >
            <legend
                class="px-2 py-1 rounded-xl shadow-lg text-xl"
                style={`background-color: ${comment.color}; color: ${complimentary};`}
            >
                {comment.name}
            </legend>
            {comment.content}
        </fieldset>
    </div>
</div>

<style>
    @keyframes idle {
        0% {
            transform: translate(0, 0);
        }
        50% {
            transform: translate(0, -20px);
        }
        100% {
            transform: translate(0, 0);
        }
    }

    .card {
        animation: idle infinite 2s ease-in-out;
    }
</style>
