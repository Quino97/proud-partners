<script lang="ts">
	import { supabase } from '$lib/supabase/client';
	import { siteContent } from '$lib/stores/site-content';
	let {
		label,
		value = $bindable(),
		hint = 'Paste an existing path or upload a new image.'
	}: { label: string; value: string; hint?: string } = $props();

	let uploading = $state(false);
	let message = $state('');
	let dialog: HTMLDialogElement;
	let libraryOpen = $state(false);
	let search = $state('');
	let visibleCount = $state(36);
	const matches = $derived($siteContent.mediaLibrary.filter(image => `${image.source} ${image.alt}`.toLowerCase().includes(search.toLowerCase())));
	function openLibrary() { libraryOpen=true; search=''; visibleCount=36; dialog.showModal(); }

	async function upload(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if(file.size > 12*1024*1024 || !['image/jpeg','image/png','image/webp','image/gif','image/avif'].includes(file.type)) { message='Choose a JPG, PNG, WebP, GIF or AVIF image smaller than 12 MB.';input.value='';return; }

		uploading = true;
		message = '';
		try {
			if (!supabase) throw new Error('Supabase has not been configured for this site.');
			const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
			const filename = `${crypto.randomUUID()}.${extension}`;
			const { error } = await supabase.storage.from('site-media').upload(filename, file, {
				cacheControl: '3600',
				upsert: false,
				contentType: file.type
			});
			if (error) throw error;
			const { data } = supabase.storage.from('site-media').getPublicUrl(filename);
			value = data.publicUrl;
			message = 'Uploaded to the shared media library. Save changes to use it on the site.';
		} catch (error) {
			message = error instanceof Error ? error.message : 'Upload failed.';
		} finally {
			uploading = false;
			input.value = '';
		}
	}
</script>

<div class="image-field">
	<div class="field-title">{label}</div>
	<details><summary>Image address (advanced)</summary><label>
		<span>{label}</span>
		<input bind:value type="text" />
	</label></details>
	<div class="image-row">
		<div class="preview">
			{#if value}<img src={value} alt="Preview for {label}" />{:else}<span>No image</span>{/if}
		</div>
		<label class="upload-button">
			{uploading ? 'Uploading…' : 'Upload image'}
			<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onchange={upload} disabled={uploading} />
		</label>
		<button type="button" class="choose-button" onclick={openLibrary}>Choose from photos</button>
	</div>
	<small>{message || hint}</small>
</div>
<dialog bind:this={dialog} onclose={()=>libraryOpen=false}>
	{#if libraryOpen}<div class="library-heading"><h2>Choose a photo</h2><button type="button" onclick={()=>dialog.close()} aria-label="Close photo library">×</button></div><label>Search by project or folder<input type="search" bind:value={search} oninput={()=>visibleCount=36} placeholder="e.g. Kinders, music, 2026…" /></label><div class="library-grid">{#each matches.slice(0,visibleCount) as image}<button type="button" class:selected={value===image.src} onclick={()=>{value=image.src;message='Photo selected. Publish your changes when ready.';dialog.close();}}><img src={image.src} alt={image.alt} loading="lazy" /><span>{image.source||image.alt}</span></button>{/each}</div>{#if matches.length>visibleCount}<button type="button" onclick={()=>visibleCount+=36}>Show more photos</button>{/if}{#if !matches.length}<p>No matching photos.</p>{/if}{/if}
</dialog>

<style>
	.image-field {
		display: grid;
		gap: 0.7rem;
	}
	.field-title { font-family:var(--font-rounded); font-size:.85rem; color:var(--navy); }
	details summary { font-family:var(--font-rounded); font-size:.72rem; cursor:pointer; color:var(--ink-soft); }
	.image-row { flex-wrap:wrap; }
	.choose-button { padding:.7rem .9rem; border:1px solid var(--line); border-radius:.6rem; background:var(--cream-deep); color:var(--blue); font-family:var(--font-rounded); font-size:.8rem; cursor:pointer; }
	dialog { width:min(92vw,66rem); max-height:88svh; padding:1.5rem; border:1px solid var(--line); border-radius:1rem; background:var(--cream); }
	dialog::backdrop { background:rgba(6,40,68,.65); }
	.library-heading { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }.library-heading h2 { margin:0; font-family:var(--font-rounded); font-size:1.4rem; }
	dialog button { padding:.6rem; border:1px solid var(--line); border-radius:.5rem; color:var(--navy); background:var(--cream-deep); cursor:pointer; }
	dialog input { display:block; width:100%; padding:.8rem; margin:.5rem 0 1rem; border:1px solid var(--line); border-radius:.5rem; background:var(--cream); }
	.library-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:.8rem; margin-bottom:1rem; }
	.library-grid button { min-width:0; text-align:left; }.library-grid button.selected { outline:3px solid var(--sky); }.library-grid img { width:100%; height:8rem; object-fit:contain; }.library-grid span { display:block; overflow-wrap:anywhere; font-family:var(--font-rounded); font-size:.65rem; line-height:1.5; }
	@media(max-width:680px) { .library-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }

	label > span {
		display: block;
		margin-bottom: 0.45rem;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #37566f;
	}

	input[type='text'] {
		width: 100%;
		padding: 0.85rem 1rem;
		border: 1px solid #ccdae3;
		border-radius: 0.7rem;
		background: white;
		color: #082f4d;
		font: inherit;
	}

	.image-row {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}

	.preview {
		display: grid;
		place-items: center;
		width: 7.5rem;
		height: 4.5rem;
		border: 1px solid #d8e4ea;
		border-radius: 0.7rem;
		background: #edf5f7;
		overflow: hidden;
		color: #688094;
		font-size: 0.75rem;
	}

	.preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.upload-button {
		position: relative;
		padding: 0.72rem 0.95rem;
		border: 1px solid #0d67ad;
		border-radius: 999px;
		color: #0d67ad;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		cursor: pointer;
		overflow: hidden;
	}

	.upload-button input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	small {
		color: #688094;
	}
</style>
