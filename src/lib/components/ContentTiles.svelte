<script lang="ts">
	import type { ContentPage, TileContent } from '$lib/content/site';
	import { sitePath } from '$lib/utils/site-path';
	import { reveal } from '$lib/actions/reveal';
	import RichText from './RichText.svelte';
	let { pages, overrides = [] }: { pages: ContentPage[]; overrides?: (TileContent & {id:string})[] } = $props();
</script>
<div class="tile-grid" class:two={pages.length === 4 || pages.length === 5}>
	{#each pages as item, index (item.id)}{@const tile = overrides.find(card => card.id === item.id) || item.card}
		{@const lastSpace = tile.title.lastIndexOf(' ')}
		<div class="tile-reveal" use:reveal={{ delay: (index % 3) * 75 }}><a class="content-tile" href={sitePath(item.path)}>
			{#if tile.image}<div class="tile-image"><img src={tile.image.src} alt={tile.image.alt} loading="lazy" style:object-position={tile.image.position} /></div>{/if}
			<div class="tile-copy"><h3>{#if lastSpace > 0}{tile.title.slice(0,lastSpace + 1)}<em>{tile.title.slice(lastSpace + 1)}</em>{:else}{tile.title}{/if}</h3>{#if tile.subtitle}<p class="tile-subtitle"><RichText text={tile.subtitle} /></p>{/if}{#if tile.copy}<p><RichText text={tile.copy} /></p>{/if}{#if tile.label}<span class="tile-action"><RichText text={tile.label} /></span>{/if}</div>
		</a></div>
	{/each}
</div>
<style>
	.tile-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1.5rem; } .tile-grid.two { grid-template-columns:repeat(2,minmax(0,1fr)); }
	.content-tile { display:flex; flex-direction:column; min-width:0; border:1px solid var(--line); border-radius:1.25rem; overflow:hidden; background:var(--cream); box-shadow:var(--shadow-sm); transition:transform 250ms,box-shadow 250ms; } .content-tile:hover { transform:translateY(-5px); box-shadow:var(--shadow-lg); }
	.tile-reveal { min-width:0; display:flex; } .tile-reveal > a { width:100%; }
	.tile-image { position:relative; aspect-ratio:16/10; flex-shrink:0; overflow:hidden; background:var(--cream-deep); } .tile-image img { position:absolute; inset:0; display:block; width:100%; height:100%; object-fit:cover; transition:transform 400ms; } .content-tile:hover img { transform:scale(1.04); }
	.tile-copy { display:flex; flex:1; flex-direction:column; padding:clamp(1.3rem,2.5vw,2rem); }
	h3 { margin:0; color:var(--navy); font-family:var(--font-editorial); font-weight:400; font-size:clamp(1.65rem,2.2vw,2.1rem); line-height:1.17; letter-spacing:-.035em; } h3 em { font-weight:inherit; color:var(--blue); }
	h3::after { content:''; display:block; width:2rem; height:2px; margin-top:1rem; border-radius:2px; background:rgba(13,103,173,.3); transition:width 250ms; } .content-tile:hover h3::after { width:3.5rem; }
	p { margin:.85rem 0 1.5rem; font-size:1.08rem; line-height:1.65; color:var(--ink-soft); } p.tile-subtitle { margin:.8rem 0 0; color:var(--navy); font-family:var(--font-rounded); font-size:1rem; line-height:1.45; }
	.tile-action { margin-top:auto; padding-top:1.25rem; font-family:var(--font-rounded); font-size:1rem; line-height:1.5; font-weight:700; color:var(--blue); }
	@media(max-width:1000px) { .tile-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } } @media(max-width:620px) { .tile-grid,.tile-grid.two { grid-template-columns:1fr; } .tile-copy { padding:1.5rem; } }
</style>
