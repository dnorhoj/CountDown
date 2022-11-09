<script>
    import { API } from "../lib/helpers";
    import { onMount } from "svelte";
    import PostBoard from "../components/countdown/post-board.svelte";

    let hours, minutes, seconds, countDownTo = null, comments = [], countDownEl;

    const update = () => {
        if (countDownTo === null) return;

        const now = new Date().getTime();
        const diff = countDownTo - now;

        if (diff <= 0) {
            hours = minutes = seconds = "00";
            return;
        }

        hours = String(
            Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        ).padStart(2, "0");
        minutes = String(
            Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        ).padStart(2, "0");
        seconds = String(Math.floor((diff % (1000 * 60)) / 1000))
            .padStart(2, "0");
    };

    const getCountDownTo = async () => {
        const [success, data] = await API("countdown");

        if (!success) return;

        countDownTo = data.countdown;
        comments = data.comments;
    }

    onMount(async () => {
        await getCountDownTo();
        update();

        setInterval(getCountDownTo, 15000);
        setInterval(update, 500);
    });
</script>

<div class="fixed w-full h-full select-none">
    <div class="flex items-center justify-center h-full">
        <div class="flex flex-col items-center justify-center">
            <div class="bg-neutral-800 p-20 rounded-2xl drop-shadow-2xl" bind:this={countDownEl}>
                <span class="text-9xl text-white font-bold mono">
                    {#if !countDownTo}
                        --:--:--
                    {:else}
                        {hours}:{minutes}:{seconds}
                    {/if}
                </span>
            </div>
        </div>
    </div>
</div>

{#if countDownEl}
    <PostBoard countDownRect={countDownEl.getBoundingClientRect()} {comments} />
{/if}

<style>
    @font-face {
        font-family: "Roboto Mono";
        src: url("../assets/RobotoMono-Bold.ttf");
    }

    .mono {
        font-family: "Roboto Mono";
    }
</style>
