<script lang="ts">
	let {
		label,
		value = $bindable(),
		hint = 'Paste an existing path or upload a new image.'
	}: { label: string; value: string; hint?: string } = $props();

	let uploading = $state(false);
	let message = $state('');

	async function upload(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = true;
		message = '';
		const body = new FormData();
		body.set('image', file);
		try {
			const response = await fetch('/api/admin/upload', { method: 'POST', body });
			const result = await response.json();
			if (!response.ok) throw new Error(result.message || 'Upload failed.');
			value = result.path;
			message = 'Uploaded. Save changes to publish this choice.';
		} catch (error) {
			message = error instanceof Error ? error.message : 'Upload failed.';
		} finally {
			uploading = false;
			input.value = '';
		}
	}
</script>

<div class="image-field">
	<label>
		<span>{label}</span>
		<input bind:value type="text" />
	</label>
	<div class="image-row">
		<div class="preview">
			{#if value}<img src={value} alt="Preview for {label}" />{:else}<span>No image</span>{/if}
		</div>
		<label class="upload-button">
			{uploading ? 'Uploading…' : 'Upload image'}
			<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onchange={upload} disabled={uploading} />
		</label>
	</div>
	<small>{message || hint}</small>
</div>

<style>
	.image-field {
		display: grid;
		gap: 0.7rem;
	}

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
