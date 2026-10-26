<script lang="ts">
	import { siteContent } from '$lib/stores/site-content';
	import { supabase } from '$lib/supabase/client';
	import Seo from '$lib/components/Seo.svelte';
	import EditorialBackdrop from '$lib/components/EditorialBackdrop.svelte';
	const copy = $derived($siteContent.contact);
	const page = $derived($siteContent.pages.find(page => page.id === 'contact'));
	let name = $state(''); let email = $state(''); let phone = $state(''); let message = $state(''); let company = $state('');
	let sending = $state(false); let sent = $state(false); let error = $state('');
	let requestId = '';
	let lastSubmission = '';
	async function submit(event: SubmitEvent) {
		event.preventDefault(); if (sending) return;
		sending = true; error = '';
		try {
			if (!supabase) throw Error(copy.errorMessage);
			const payload=JSON.stringify({name,email,phone,message});
			if (payload !== lastSubmission) { requestId=crypto.randomUUID(); lastSubmission=payload; }
			const { data, error: sendError } = await supabase.functions.invoke(copy.functionName, { body:{name,email,phone,message,company,requestId} });
			if (sendError || !data?.ok) throw Error(data?.message || copy.errorMessage);
			sent = true; name = ''; email = ''; phone = ''; message = ''; requestId = ''; lastSubmission = '';
		} catch { error = copy.errorMessage; } finally { sending = false; }
	}
</script>
<Seo title="Contact" description={page?.description || 'Contact Proud Partners.'} />
<section class="contact-shell">
	<EditorialBackdrop />
	<div class="contact-page container">
	<header><h1>{page?.title || 'Contact Us'}</h1>{#if page?.subtitle}<p>{page.subtitle}</p>{/if}</header>
	<form onsubmit={submit} aria-label="Contact Proud Partners">
		{#if sent}<p class="success" role="status">{copy.successMessage}</p>{/if}
		<div class="fields"><label>{copy.fields.name}<input bind:value={name} autocomplete="name" required maxlength="120" /></label><label>{copy.fields.email}<input bind:value={email} type="email" autocomplete="email" required maxlength="254" /></label></div>
		<label>{copy.fields.phone}<input bind:value={phone} type="tel" autocomplete="tel" maxlength="50" /></label>
		<label>{copy.fields.message}<textarea bind:value={message} required minlength="10" maxlength="10000" rows="8"></textarea></label>
		<div class="honeypot" aria-hidden="true"><label>Company<input bind:value={company} tabindex="-1" autocomplete="off" /></label></div>
		{#if error}<p class="error" role="alert">{error}</p>{/if}
		<button class="button" type="submit" disabled={sending}>{sending ? 'Sending…' : copy.fields.submit}</button>
	</form>
	</div>
</section>
<style>
	.contact-shell { position:relative; isolation:isolate; }
	.contact-page { padding:clamp(9rem,12vw,11rem) 0 clamp(4rem,9vw,7rem); min-height:75svh; }
	header { width:100%; max-width:52rem; margin:0 auto 2.75rem; }
	h1 { margin:0; font-family:var(--font-heading); font-size:clamp(3.5rem,6vw,5.8rem); line-height:1.12; letter-spacing:-.015em; color:var(--navy); }
	header::after { content:''; display:block; width:80%; height:1px; margin-top:1.7rem; background:#c6d4dc; }
	header p { margin:1rem 0 0; font-size:clamp(1.25rem,2vw,1.6rem); color:var(--ink-soft); }
	form { width:100%; max-width:52rem; margin:auto; display:grid; gap:1.5rem; }
	.fields { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
	label { display:grid; gap:.5rem; font-family:var(--font-rounded); color:var(--navy); font-size:.9rem; }
	input,textarea { width:100%; min-width:0; padding:.9rem 1rem; border:1px solid rgba(9,61,115,.22); border-radius:.75rem; background:rgba(251,247,238,.8); color:var(--ink); font:1rem var(--font-rounded); line-height:1.6; }
	textarea { resize:vertical; } .button { justify-self:start; cursor:pointer; } .button:disabled { opacity:.65; cursor:wait; }
	.honeypot { position:absolute; left:-10000px; width:1px; height:1px; overflow:hidden; }
	.success,.error { font-family:var(--font-rounded); margin:0; padding:1rem; border:1px solid var(--line); border-radius:.75rem; } .success { color:#226147; } .error { color:#8d3434; }
	@media(max-width:600px) { .fields { grid-template-columns:1fr; } }
</style>
