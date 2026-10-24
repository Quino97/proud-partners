<script lang="ts">
	import type { ContentPage, EditorialSection, VideoItem } from '$lib/content/site';
	import { siteContent } from '$lib/stores/site-content';
	import { sitePath } from '$lib/utils/site-path';
	import { reveal } from '$lib/actions/reveal';
	import Seo from './Seo.svelte';
	import RichText from './RichText.svelte';
	import PhotoGallery from './PhotoGallery.svelte';
	import ContentTiles from './ContentTiles.svelte';
	import EditorialBackdrop from './EditorialBackdrop.svelte';
	let { content }: { content: ContentPage } = $props();
	const parent = $derived($siteContent.pages.find(p => p.id === content.parentId));
	const opening = $derived(content.id === 'about' && content.sections[0]?.layout === 'split' && content.sections[0].images.length === 1 && !content.sections[0].heading && !content.sections[0].videos.length && !content.sections[0].links.length && !content.sections[0].tileIds.length && !content.sections[0].stats.length ? content.sections[0] : null);
	function embed(video: VideoItem) {
		try { const url = new URL(video.url); if (url.hostname === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`; if (['www.youtube.com','youtube.com','www.youtube-nocookie.com'].includes(url.hostname)) return `https://www.youtube-nocookie.com/embed/${url.searchParams.get('v') || url.pathname.split('/').at(-1)}`; if (url.hostname === 'vimeo.com') return `https://player.vimeo.com/video/${url.pathname.split('/').at(-1)}`; } catch { /* Native local video URL. */ } return '';
	}
</script>
{#snippet photos(section: EditorialSection)}<div class="section-photos"><PhotoGallery images={section.images} compact={section.images.length > 2} /></div>{/snippet}
<Seo title={content.id === 'home' ? undefined : content.card.title || content.title} description={content.description} image={content.heroImage?.src || content.card.image?.src} />
<article class:ball={content.kind === 'ball'} class:home={content.kind === 'home'} class:about={content.id === 'about'}>
	<EditorialBackdrop />
	<header class="editorial-header container" class:with-portrait={content.kind === 'home' && content.heroImage} class:with-story={Boolean(opening)}>
		<div>{#if parent && content.kind !== 'ball'}<a class="breadcrumb" href={sitePath(parent.path)}>← Back to {parent.id === 'projects' ? 'Projects' : parent.id === 'home' ? 'Home' : parent.card.title || parent.title}</a>{/if}<h1>{content.title}</h1>{#if content.subtitle}<p class="page-subtitle"><RichText text={content.subtitle} /></p>{/if}{#if content.kind === 'home'}{#each content.sections[0]?.paragraphs || [] as paragraph}<p class="home-intro"><RichText text={paragraph} /></p>{/each}{/if}{#if opening}<div class="opening-copy">{#each opening.paragraphs as paragraph}<p><RichText text={paragraph} /></p>{/each}</div>{/if}</div>
		{#if content.kind === 'home' && content.heroImage}<figure class="hero-portrait"><div class="portrait-frame"><img src={content.heroImage.src} alt={content.heroImage.alt} style:object-position={content.heroImage.position} style:transform-origin={content.heroImage.position} style:transform={`scale(${content.heroImage.zoom || 1})`} fetchpriority="high" /></div>{#if content.heroImage.caption}<figcaption>{content.heroImage.caption}</figcaption>{/if}</figure>{/if}
		{#if opening}<div class="opening-photo">{@render photos(opening)}</div>{/if}
	</header>
	{#each content.sections as section, index (section.id)}{#if !((content.kind === 'home' || opening) && index === 0)}
		{@const isSplit = section.layout === 'split' && section.images.length === 1}
		<section class="editorial-section" class:blue={section.tone === 'blue'} class:stat-section={section.layout === 'stats'} class:tile-section={section.layout === 'tiles'} class:has-heading={Boolean(section.heading)} id={`section-${section.id}`}>
			<div class="container" class:split={isSplit} class:flow={isSplit && section.paragraphs.join(' ').length > 650} class:reverse={index % 2 === 1}>
				{#if isSplit}{@render photos(section)}{/if}
				{#if section.heading || section.paragraphs.length || section.links.some(link=>link.href)}<div class="section-copy" class:wide={section.layout === 'tiles'}>
					{#if section.heading}<h2 use:reveal>{section.heading}</h2>{/if}{#each section.paragraphs as paragraph}<p><RichText text={paragraph} /></p>{/each}
					{#each section.links.filter(link => link.href) as link}<a class="editorial-link" href={sitePath(link.href)} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>{link.label}</a>{/each}
				</div>{/if}
				{#if section.stats.length}<div class="stat-grid">{#each section.stats as stat}<p>{stat}</p>{/each}</div>{/if}
				{#if section.images.length && !isSplit}{@render photos(section)}{/if}
				{#if section.tileIds.length}<ContentTiles pages={section.tileIds.map(id => $siteContent.pages.find(p => p.id === id && !p.hidden)).filter((p): p is ContentPage => Boolean(p))} overrides={section.cards || []} />{/if}
				{#each section.videos.filter(v => v.url) as video}<figure class="video">{#if embed(video)}<iframe src={embed(video)} title={video.caption || content.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>{:else}<video controls preload="metadata" poster={video.poster || undefined}><source src={video.url} /><track kind="captions" /></video>{/if}{#if video.caption}<figcaption>{video.caption}</figcaption>{/if}</figure>{/each}
			</div>
		</section>
	{/if}{/each}
</article>
<style>
	article { position:relative; isolation:isolate; padding-top:5.6rem; } .editorial-header { padding-block:clamp(2.8rem,5vw,4.5rem) clamp(1rem,2vw,1.6rem); }
	h1 { max-width:23ch; margin:0; font-size:clamp(2.7rem,4.8vw,4.7rem); line-height:1.13; letter-spacing:-.04em; color:var(--navy); overflow-wrap:break-word; }
	.page-subtitle { max-width:54rem; margin:1.25rem 0 0; color:var(--blue); font-family:var(--font-rounded); font-size:clamp(1.05rem,1.7vw,1.35rem); line-height:1.6; white-space:pre-line; }
	.breadcrumb { display:inline-flex; align-items:center; min-height:2.75rem; margin-bottom:1.2rem; padding:.25rem 0; font-family:var(--font-rounded); font-size:1rem; color:var(--blue); text-underline-offset:.35em; } .breadcrumb:hover { text-decoration:underline; }
	.with-story { display:grid; grid-template-columns:1.15fr .85fr; gap:clamp(2rem,5vw,5rem); align-items:center; padding-block:clamp(2.8rem,6vw,5rem); }
	.with-story h1 { max-width:15ch; } .opening-copy { margin-top:1.75rem; } .opening-copy p { margin:0 0 1rem; font-size:clamp(1.1rem,1.15vw,1.2rem); line-height:1.7; color:var(--ink-soft); }
	.opening-photo :global(.section-photos) { margin:0; } .opening-photo { position:relative; } .opening-photo::before { content:''; position:absolute; inset:1.2rem -.7rem -.7rem 1.2rem; z-index:-1; border:1px solid rgba(13,103,173,.2); border-radius:1rem; }
	.with-portrait { display:grid; grid-template-columns:1.15fr .85fr; gap:clamp(2.5rem,7vw,7rem); align-items:center; padding-block:clamp(2.8rem,6vw,5rem); } .home h1 { max-width:13ch; font-size:clamp(3rem,4.6vw,4.7rem); }
	.home-intro { max-width:34rem; font-size:clamp(1.15rem,1.7vw,1.4rem); line-height:1.7; color:var(--ink-soft); margin:1.75rem 0 0; }
	.hero-portrait { position:relative; isolation:isolate; margin:0; animation:portrait-drift 7s ease-in-out infinite; }
	.hero-portrait::before { content:''; position:absolute; inset:-.6rem .8rem .6rem -.8rem; border-radius:48% 48% 1.3rem 1.3rem; background:var(--blue-pale); transform:rotate(-3deg); z-index:-1; }
	.portrait-frame { overflow:hidden; border-radius:48% 48% 1.3rem 1.3rem; box-shadow:var(--shadow-lg); }
	.hero-portrait img { display:block; width:100%; aspect-ratio:4/4.5; object-fit:cover; }
	@keyframes portrait-drift { 0%,100% { translate:0 0; } 50% { translate:0 -.5rem; } }
	@media(prefers-reduced-motion:reduce) { .hero-portrait { animation:none; } }
	.editorial-section { position:relative; padding-block:clamp(2rem,4vw,3.4rem); } .editorial-header + .editorial-section { padding-top:1.5rem; }
	.editorial-section.tile-section { padding-top:clamp(3rem,5vw,4.5rem); }
	.editorial-section.has-heading:not(.blue):not(.tile-section) { padding-top:clamp(3rem,5vw,4.25rem); }
	.editorial-section.has-heading:not(.blue):not(.tile-section)::before { content:''; position:absolute; top:0; left:50%; translate:-50% 0; width:80%; height:1px; background:#c6d4dc; }
	.blue + .editorial-section.has-heading:not(.blue):not(.tile-section)::before { content:none; }
	.section-copy { max-width:68rem; margin:0 auto; } .section-copy.wide { max-width:58rem; margin:0 auto 2.8rem; text-align:center; }
	h2 { margin:0 0 1.3rem; font-size:clamp(2rem,3.3vw,3.2rem); line-height:1.2; letter-spacing:-.03em; color:var(--navy); text-wrap:balance; } .section-copy > p { margin:0 0 1rem; font-size:clamp(1.1rem,1.15vw,1.2rem); line-height:1.7; color:var(--ink-soft); }
	.editorial-link { display:inline-block; margin:1rem 1.5rem 1rem 0; border-bottom:1px solid currentColor; padding-bottom:.3rem; font-family:var(--font-rounded); font-size:.9rem; color:var(--blue); } .section-photos { margin-top:2.5rem; }
	.split { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,.9fr); gap:clamp(2rem,4vw,4rem); align-items:start; }
	.split .section-copy { margin:0; max-width:none; grid-column:1; grid-row:1; } .split .section-photos { margin:0; grid-column:2; grid-row:1; }
	.split.reverse .section-copy { grid-column:2; } .split.reverse .section-photos { grid-column:1; }
	.split.flow { display:flow-root; } .flow .section-photos { float:right; width:42%; margin:0 0 1.5rem clamp(2rem,4vw,4rem); }
	.flow.reverse .section-photos { float:left; margin:0 clamp(2rem,4vw,4rem) 1.5rem 0; }
	.blue { background:var(--navy); color:var(--cream); } .blue h2,.blue .section-copy > p { color:var(--cream); }
	.stat-section { padding:7rem 0 3rem; clip-path:polygon(0 1.6rem,74% 3.5rem,100% 0,100% 100%,0 100%); margin-block:1.5rem; } .stat-grid { display:flex; flex-wrap:wrap; justify-content:center; gap:1.5rem 0; } .stat-grid p { flex:1 1 13rem; margin:0; padding:.5rem 2rem; text-align:center; font-family:var(--font-rounded); font-size:clamp(1rem,1.4vw,1.3rem); border-right:1px solid rgba(251,247,238,.2); } .stat-grid p:last-child { border:0; }
	.stat-grid p::after { content:''; display:block; width:3.5rem; height:1px; margin:.9rem auto 0; background:rgba(251,247,238,.32); }
	.video { margin:2rem auto 0; max-width:60rem; } iframe,video { display:block; width:100%; aspect-ratio:16/9; border:0; background:var(--navy-deep); border-radius:1rem; } figcaption { margin-top:.75rem; font-family:var(--font-rounded); font-size:.8rem; color:var(--ink-soft); }
	.ball h1 { font-size:clamp(3rem,5.5vw,5.1rem); }
	@media(max-width:760px) {
		article { padding-top:5.4rem; } .with-portrait,.with-story { grid-template-columns:1fr; gap:2.25rem; }
		.split,.split.flow { display:flex; flex-direction:column; gap:1.75rem; }
		.split .section-copy { order:0; } .split .section-photos { order:1; }
		.flow .section-photos,.flow.reverse .section-photos { float:none; width:100%; margin:0; }
		.home .editorial-header { padding-top:2.6rem; } .hero-portrait { width:min(88%,25rem); margin:auto; }
		h1 { font-size:clamp(2.65rem,8.8vw,3.8rem); } .home h1 { font-size:3.2rem; } .editorial-header { padding-top:2.5rem; }
		.stat-grid p { flex-basis:100%; border-right:0; } .section-copy > p { line-height:1.7; }
	}
</style>
