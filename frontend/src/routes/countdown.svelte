<script>
    import { API } from "../lib/helpers";
    import { onMount } from "svelte";

    let hours, minutes, seconds, countDownTo = null;

    const update = () => {
        if (countDownTo === null) return;

        const now = new Date().getTime();
        const diff = countDownTo - now;

        hours = String(
            Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        ).padStart(2, "0");
        minutes = String(
            Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        ).padStart(2, "0");
        seconds = String(Math.floor((diff % (1000 * 60)) / 1000))
            .padStart(2, "0");
    };

    onMount(async () => {
        const [success, data] = await API("countdown");
        if (success) {
            countDownTo = data.countdown;
    
            update();
            setInterval(update, 500);
        }
    });
</script>

<div class="fixed w-full h-full select-none">
    <div class="flex items-center justify-center h-full">
        <div class="flex flex-col items-center justify-center">
            <div class="bg-neutral-800 p-20 rounded-2xl drop-shadow-2xl">
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

<style>
    @font-face {
        font-family: "Roboto Mono";
        src: url("../assets/RobotoMono-Bold.ttf");
    }

    .mono {
        font-family: "Roboto Mono";
    }
</style>
