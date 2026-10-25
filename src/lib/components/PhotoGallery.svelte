<script lang="ts">
	import type { ImageItem } from '$lib/content/site';
	import RichText from './RichText.svelte';
	let { images, compact = false, natural = false }: { images: ImageItem[]; compact?: boolean; natural?: boolean } = $props();
	let selected = $state<ImageItem | null>(null);
	let visible = $state(8);
	let dialog: HTMLDialogElement;
	function open(image: ImageItem) { selected = image; dialog.showModal(); }
</script>
<div class="photo-gallery" class:compact class:natural class:single={images.length === 1}>
	{#each images.slice(0,visible) as image (image.id)}<figure><button type="button" onclick={() => open(image)} aria-label={`Enlarge photograph: ${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy" style:object-position={image.position} /></button>{#if image.caption}<figcaption><RichText text={image.caption} /></figcaption>{/if}</figure>{/each}
</div>
{#if images.length>visible}<button type="button" class="more" onclick={()=>visible+=12}>View more photographs ({images.length-visible})</button>{/if}
<dialog bind:this={dialog} onclick={(event) => { if (event.target === dialog) dialog.close(); }} onclose={() => selected = null}>
	<button class="close" type="button" onclick={() => dialog.close()} aria-label="Close enlarged photograph">×</button>
	{#if selected}<img src={selected.src} alt={selected.alt} />{#if selected.caption}<p><RichText text={selected.caption} /></p>{/if}{/if}
</dialog>
<style>
	.photo-gallery { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1.35rem; align-items:start; }
	.photo-gallery.single { grid-template-columns:1fr; } figure { margin:0; min-width:0; }
	.photo-gallery.natural { display:block; columns:3 16rem; column-gap:1.35rem; }
	.natural figure { break-inside:avoid; margin-bottom:1.35rem; }
	.natural img { aspect-ratio:auto; height:auto; }
	.natural figure button:hover img { transform:none; }
	figure button { display:grid; place-items:center; width:100%; padding:0; border:0; border-radius:1rem; background:var(--cream-deep); overflow:hidden; cursor:zoom-in; }
	figure img { display:block; width:100%; aspect-ratio:4/3; object-fit:cover; transition:transform 400ms; } figure button:hover img { transform:scale(1.025); } .single img { aspect-ratio:auto; height:auto; }
	figcaption { padding-top:.75rem; font-family:var(--font-rounded); font-size:.8rem; color:var(--ink-soft); }
	dialog { max-width:min(94vw,90rem); max-height:94svh; padding:2.5rem 1rem 1rem; border:0; border-radius:1rem; background:var(--cream); color:var(--ink); } dialog::backdrop { background:rgba(6,40,68,.88); }
	dialog > img { display:block; max-width:100%; max-height:80svh; object-fit:contain; margin:auto; }
	.close { position:absolute; top:.15rem; right:.5rem; border:0; background:transparent; font:2rem var(--font-rounded); cursor:pointer; color:var(--navy); }
	.more { display:block; margin:1.5rem auto 0; padding:.8rem 1.3rem; border:1px solid var(--line); border-radius:999px; background:var(--cream-deep); color:var(--navy); font-family:var(--font-rounded); font-size:.85rem; cursor:pointer; }
	@media(max-width:600px) { .photo-gallery { grid-template-columns:1fr; gap:1.1rem; } }
</style>
