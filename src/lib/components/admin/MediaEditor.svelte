<script lang="ts">
	import type { ImageItem } from '$lib/content/site';
	import { siteContent } from '$lib/stores/site-content';
	import ImageField from './ImageField.svelte';
	let { image=$bindable(),label='Image',removable=true,zoomable=false }: {image:ImageItem|null;label?:string;removable?:boolean;zoomable?:boolean}=$props();
	function add(){image=structuredClone($siteContent.mediaLibrary[0] || {id:crypto.randomUUID(),src:'',alt:'',caption:'',position:'center'});image.id=crypto.randomUUID();}
</script>
<div class="media-editor">
	{#if image}
		<ImageField {label} bind:value={image.src} />
		<div class="metadata"><label>Describe the photo<input bind:value={image.alt} /></label><label>Caption (optional)<input bind:value={image.caption} /></label><label>Crop focus<select bind:value={image.position}><option value="center">Centre</option><option value="center top">Top</option><option value="center bottom">Bottom</option><option value="left center">Left</option><option value="right center">Right</option><option value="50% 35%">Faces near the top</option><option value="40% 25%">Home portrait</option></select></label>{#if zoomable}<label>Portrait zoom ({image.zoom || 1}×)<input type="range" min="1" max="2.5" step="0.05" value={image.zoom || 1} oninput={(event)=>{if(image)image.zoom=Number(event.currentTarget.value);}} /></label>{/if}</div>
		{#if removable}<button type="button" class="remove-media" onclick={()=>image=null}>Remove image</button>{/if}
	{:else}<button type="button" class="add-media" onclick={add}>+ {label}</button>{/if}
</div>
<style>
	.media-editor { padding:1rem; border:1px solid var(--line); border-radius:.8rem; background:var(--cream); }
	.metadata { display:grid; grid-template-columns:1fr 1fr; gap:.8rem; margin-top:1rem; }
	label { display:grid; gap:.4rem; font-size:.8rem; color:var(--ink-soft); }
	input,select { width:100%; min-width:0; padding:.7rem; border:1px solid var(--line); border-radius:.5rem; background:var(--cream-deep); color:var(--ink); }
	button { padding:.6rem .8rem; border:1px solid var(--line); border-radius:.5rem; cursor:pointer; font-size:.8rem; background:var(--cream-deep); color:var(--blue); }
	.remove-media { margin-top:1rem; color:#934646; }
	@media(max-width:650px){.metadata{grid-template-columns:1fr;}}
</style>
