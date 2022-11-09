<script>
    import { fade } from "svelte/transition";
    import Comment from "./comment.svelte";

    export let countDownRect, comments;
</script>

{#each comments as comment (comment.id)}
    <div transition:fade>
        <Comment {comment} {countDownRect} />
    </div>
{/each}
