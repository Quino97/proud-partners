<script lang="ts">
	import { onMount } from 'svelte';
	import { defaultContent, type ConsularYear, type Partner, type Project, type ProjectGalleryImage } from '$lib/content/site';
	import ImageField from '$lib/components/admin/ImageField.svelte';
	import { supabase, supabaseConfigurationMessage } from '$lib/supabase/client';
	import { addSiteBase } from '$lib/utils/site-path';
	import { siteContent } from '$lib/stores/site-content';

	let draft = $state(structuredClone(addSiteBase(defaultContent)));
	let activeTab = $state<'site' | 'home' | 'about' | 'projects' | 'consular' | 'partners' | 'support'>('site');
	let saving = $state(false);
	let saveMessage = $state('');
	let saveError = $state(false);
	let authenticated = $state(false);
	let loading = $state(true);
	let email = $state('');
	let password = $state('');
	let loginMessage = $state('');
	let loginError = $state(false);

	onMount(async () => {
		draft = structuredClone($siteContent);
		if (!supabase) {
			loading = false;
			return;
		}

		const { data: sessionData } = await supabase.auth.getSession();
		authenticated = Boolean(sessionData.session);
		if (authenticated) await loadSupabaseContent();
		loading = false;
	});

	async function loadSupabaseContent() {
		if (!supabase) return;
		const { data, error } = await supabase.from('site_content').select('content').eq('id', 'primary').maybeSingle();
		if (error) {
			saveError = true;
			saveMessage = error.message;
			return;
		}
		if (data?.content) draft = addSiteBase(data.content);
	}

	async function signIn(event: SubmitEvent) {
		event.preventDefault();
		if (!supabase) return;
		loginMessage = '';
		loginError = false;
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			loginError = true;
			loginMessage = error.message;
			return;
		}
		authenticated = true;
		password = '';
		await loadSupabaseContent();
	}

	async function signOut() {
		await supabase?.auth.signOut();
		authenticated = false;
		saveMessage = '';
	}

	const tabs = [
		{ id: 'site', label: 'Site setup' },
		{ id: 'home', label: 'Home' },
		{ id: 'about', label: 'About' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'consular', label: 'Consular Ball' },
		{ id: 'partners', label: 'Partners' },
		{ id: 'support', label: 'Support' }
	] as const;

	async function saveContent() {
		if (!supabase) return;
		saving = true;
		saveMessage = '';
		saveError = false;
		try {
			const { error } = await supabase.from('site_content').upsert(
				{ id: 'primary', content: draft, updated_at: new Date().toISOString() },
				{ onConflict: 'id' }
			);
			if (error) throw error;
			siteContent.set(draft);
			saveMessage = `Published at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
		} catch (error) {
			saveError = true;
			saveMessage = error instanceof Error ? error.message : 'Could not save changes.';
		} finally {
			saving = false;
		}
	}

	function resetDraft() {
		draft = structuredClone($siteContent);
		saveError = false;
		saveMessage = 'Unsaved changes reset.';
	}

	function addProject() {
		const number = String(draft.projects.length + 1).padStart(2, '0');
		const project: Project = {
			slug: `new-project-${draft.projects.length + 1}`,
			number,
			title: 'New project',
			shortTitle: 'New project',
			summary: 'Add a short project summary.',
			image: draft.media.homeQuote,
			imageAlt: 'Project image',
			banner: draft.media.projectsHero,
			footerBanner: draft.media.projectsFooter,
			body: ['Add the project story here.'],
			initiatives: [{ title: 'Project initiative', copy: 'Describe this part of the project.' }],
			galleryTitle: 'Project gallery',
			galleryCopy: 'Add a short introduction to these images.',
			gallery: []
		};
		draft.projects.push(project);
	}

	function addGalleryImage(project: Project) {
		const image: ProjectGalleryImage = {
			id: `${project.slug}-${Date.now()}`,
			image: project.image,
			alt: 'Project photograph',
			caption: 'Add a caption'
		};
		project.gallery.push(image);
	}

	function removeProject(index: number) {
		if (confirm('Remove this project from the website? This only takes effect when you save.')) {
			draft.projects.splice(index, 1);
			draft.projects.forEach((project, projectIndex) => {
				project.number = String(projectIndex + 1).padStart(2, '0');
			});
		}
	}

	function addConsularYear() {
		const entry: ConsularYear = {
			year: String(new Date().getFullYear()),
			amount: 'Add amount',
			title: 'New Consular Ball year',
			summary: 'Add the story of this year.',
			image: draft.consularBall.banner,
			imageAlt: 'Consular Ball event photograph',
			highlights: ['Add a highlight']
		};
		draft.consularBall.years.push(entry);
	}

	function addPartner() {
		const partner: Partner = {
			name: 'New partner',
			category: 'Project partner',
			description: 'Describe how this partner contributes.',
			image: draft.media.homeQuote,
			imageAlt: 'Proud Partners partner',
			href: '',
			linkLabel: ''
		};
		draft.partnersPage.items.push(partner);
	}
</script>

<svelte:head><title>Admin — Proud Partners</title><meta name="robots" content="noindex,nofollow" /></svelte:head>

{#if loading}
	<section class="login-page"><div class="login-card"><p class="admin-kicker">Proud Partners</p><h1>Opening editor…</h1></div></section>
{:else if !authenticated}
	<section class="login-page">
		<div class="login-card">
			<img src={draft.media.wordmark} alt="Proud Partners" />
			<p class="admin-kicker">Content manager</p>
			<h1>Welcome back</h1>
			<p class="login-copy">Sign in with the Supabase editor account to update the live website.</p>
			{#if supabaseConfigurationMessage}<p class="form-error" role="alert">{supabaseConfigurationMessage}</p>{:else if loginMessage}<p class:error={loginError} class="form-error" role="alert">{loginMessage}</p>{/if}
			<form onsubmit={signIn}>
				<label><span>Email</span><input bind:value={email} type="email" autocomplete="email" required /></label>
				<label><span>Password</span><input bind:value={password} type="password" autocomplete="current-password" required /></label>
				<button type="submit">Sign in</button>
			</form>
			<a href="/">← Return to the website</a>
		</div>
	</section>
{:else}
	<div class="admin-layout">
		<header class="admin-header">
			<a class="admin-brand" href="/admin"><img src={draft.media.mark} alt="" /><span>Proud Partners <small>Content manager</small></span></a>
			<div class="header-actions">
				{#if saveMessage}<span class:error={saveError} class="save-message" role="status">{saveMessage}</span>{/if}
				<a class="preview-link" href="/" target="_blank">View website ↗</a>
				<button class="save-button" type="button" onclick={saveContent} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
				<button class="logout-button" type="button" onclick={signOut}>Log out</button>
			</div>
		</header>

		<aside class="admin-sidebar">
			<p>Website content</p>
			<nav aria-label="Admin sections">
				{#each tabs as tab}
					<button class:active={activeTab === tab.id} type="button" onclick={() => (activeTab = tab.id)}>{tab.label}</button>
				{/each}
			</nav>
			<div class="local-note"><strong>Published mode</strong><span>Changes save securely to Supabase and appear on the public site.</span></div>
		</aside>

		<main class="admin-content">
			{#if activeTab === 'site'}
				<section class="editor-section">
					<div class="section-heading"><p>Site setup</p><h1>Identity and navigation</h1><span>Organisation details, global description and main menu.</span></div>
					<div class="panel">
						<h2>Organisation</h2>
						<div class="field-grid">
							<label><span>Name</span><input bind:value={draft.site.name} /></label>
							<label><span>Location</span><input bind:value={draft.site.location} /></label>
							<label class="wide"><span>Site description</span><textarea bind:value={draft.site.description} rows="3"></textarea></label>
						</div>
					</div>
					<div class="panel">
						<h2>Navigation</h2>
						<div class="repeat-list">
							{#each draft.site.navigation as item, index}
								<div class="repeat-row"><span>0{index + 1}</span><label><span>Label</span><input bind:value={item.label} /></label><label><span>Link</span><input bind:value={item.href} /></label></div>
							{/each}
						</div>
					</div>
					<div class="panel">
						<h2>Brand images</h2>
						<div class="field-grid"><ImageField label="Wordmark" bind:value={draft.media.wordmark} /><ImageField label="Round mark" bind:value={draft.media.mark} /></div>
					</div>
				</section>
			{:else if activeTab === 'home'}
				<section class="editor-section">
					<div class="section-heading"><p>Home page</p><h1>First impressions</h1><span>Edit the main message, feature areas, images and video.</span></div>
					<div class="panel">
						<h2>Hero</h2>
						<div class="field-grid">
							<label><span>Eyebrow</span><input bind:value={draft.site.home.eyebrow} /></label>
							<label><span>Headline</span><input bind:value={draft.site.home.title} /></label>
							<label class="wide"><span>Introduction</span><textarea bind:value={draft.site.home.intro} rows="4"></textarea></label>
							<label><span>Primary button</span><input bind:value={draft.pages.home.primaryAction} /></label>
							<label><span>Secondary button</span><input bind:value={draft.pages.home.secondaryAction} /></label>
							<label><span>Banner label</span><input bind:value={draft.pages.home.mastheadLabel} /></label>
							<label><span>Banner caption</span><input bind:value={draft.pages.home.mastheadCaption} /></label>
							<ImageField label="Hero background" bind:value={draft.media.homeBackground} />
							<ImageField label="Photo-strip banner" bind:value={draft.media.homeMasthead} />
						</div>
					</div>
					<div class="panel">
						<h2>Welcome feature</h2>
						<div class="field-grid">
							<label><span>Section label</span><input bind:value={draft.pages.home.welcomeEyebrow} /></label>
							<label><span>Heading</span><input bind:value={draft.site.home.featureTitle} /></label>
							<label class="wide"><span>Copy</span><textarea bind:value={draft.site.home.featureCopy} rows="4"></textarea></label>
							<label class="wide"><span>Image note</span><input bind:value={draft.pages.home.portraitNote} /></label>
							<ImageField label="Feature portrait" bind:value={draft.media.homePortrait} />
						</div>
						<div class="mini-grid">
							{#each draft.pages.home.principles as principle, index}
								<label><span>Principle {index + 1}</span><input bind:value={draft.pages.home.principles[index]} /></label>
							{/each}
						</div>
					</div>
					<div class="panel">
						<h2>Impact and featured projects</h2>
						<div class="stat-editor">
							{#each draft.pages.home.stats as stat, index}
								<div><label><span>Value {index + 1}</span><input bind:value={stat.value} /></label><label><span>Caption</span><input bind:value={stat.label} /></label></div>
							{/each}
						</div>
						<div class="field-grid top-gap">
							<label><span>Projects label</span><input bind:value={draft.pages.home.projectsEyebrow} /></label>
							<label><span>Projects heading</span><input bind:value={draft.pages.home.projectsTitle} /></label>
							<label class="wide"><span>Projects copy</span><textarea bind:value={draft.pages.home.projectsCopy} rows="3"></textarea></label>
						</div>
					</div>
					<div class="panel">
						<h2>Quote and video</h2>
						<div class="field-grid">
							<label class="wide"><span>Quote</span><textarea bind:value={draft.site.home.missionQuote} rows="3"></textarea></label>
							<label><span>Attribution</span><input bind:value={draft.pages.home.quoteAttribution} /></label>
							<ImageField label="Quote background" bind:value={draft.media.homeQuote} />
							<label><span>Video label</span><input bind:value={draft.pages.home.videoEyebrow} /></label>
							<label><span>Video heading</span><input bind:value={draft.site.home.videoTitle} /></label>
							<label class="wide"><span>Video description</span><textarea bind:value={draft.site.home.videoCopy} rows="3"></textarea></label>
							<label class="wide"><span>YouTube or Vimeo embed URL</span><input bind:value={draft.site.home.videoUrl} placeholder="https://www.youtube.com/embed/..." /></label>
							<ImageField label="Video poster" bind:value={draft.media.videoPoster} />
						</div>
					</div>
				</section>
			{:else if activeTab === 'about'}
				<section class="editor-section">
					<div class="section-heading"><p>About page</p><h1>Story and mission</h1><span>The founder story, photograph and guiding principles.</span></div>
					<div class="panel">
						<h2>Introduction</h2>
						<div class="field-grid">
							<label><span>Eyebrow</span><input bind:value={draft.site.about.eyebrow} /></label>
							<label><span>Page title</span><input bind:value={draft.site.about.title} /></label>
							<label class="wide"><span>Opening paragraph</span><textarea bind:value={draft.site.about.lead} rows="5"></textarea></label>
							<label class="wide"><span>Photo caption</span><input bind:value={draft.site.about.photoCaption} /></label>
							<ImageField label="Isabel and Prieur photo" bind:value={draft.media.aboutPhoto} />
						</div>
					</div>
					<div class="panel">
						<h2>Origin story</h2>
						<div class="field-grid">
							<label><span>Section label</span><input bind:value={draft.pages.about.originEyebrow} /></label>
							<label><span>Heading</span><input bind:value={draft.site.about.originTitle} /></label>
							{#each draft.site.about.origin as paragraph, index}
								<label class="wide"><span>Paragraph {index + 1}</span><textarea bind:value={draft.site.about.origin[index]} rows="4"></textarea></label>
							{/each}
						</div>
					</div>
					<div class="panel">
						<h2>Guiding principles</h2>
						<div class="field-grid"><label><span>Section label</span><input bind:value={draft.pages.about.principlesEyebrow} /></label><label><span>Heading</span><input bind:value={draft.pages.about.principlesTitle} /></label></div>
						<div class="principle-editor">
							{#each draft.site.about.principles as principle, index}
								<div><span>0{index + 1}</span><label><span>Title</span><input bind:value={principle.title} /></label><label><span>Copy</span><textarea bind:value={principle.copy} rows="4"></textarea></label><ImageField label="Card image" bind:value={principle.image} /></div>
							{/each}
						</div>
					</div>
					<div class="panel">
						<h2>Closing statement</h2>
						<div class="field-grid"><label><span>Label</span><input bind:value={draft.pages.about.methodEyebrow} /></label><label><span>Button</span><input bind:value={draft.pages.about.methodAction} /></label><label class="wide"><span>Statement</span><textarea bind:value={draft.pages.about.methodStatement} rows="3"></textarea></label></div>
					</div>
				</section>
			{:else if activeTab === 'projects'}
				<section class="editor-section">
					<div class="section-heading"><p>Projects</p><h1>Programmes and partners</h1><span>Edit the listing page and every individual project.</span></div>
					<div class="panel">
						<h2>Projects page</h2>
						<div class="field-grid">
							<label><span>Eyebrow</span><input bind:value={draft.pages.projects.eyebrow} /></label><label><span>Headline</span><input bind:value={draft.pages.projects.title} /></label>
							<label class="wide"><span>Introduction</span><textarea bind:value={draft.pages.projects.intro} rows="4"></textarea></label>
							<label><span>Listing label</span><input bind:value={draft.pages.projects.listEyebrow} /></label><label><span>Listing heading</span><input bind:value={draft.pages.projects.listTitle} /></label>
							<label class="wide"><span>Listing copy</span><textarea bind:value={draft.pages.projects.listCopy} rows="3"></textarea></label>
							<ImageField label="Opening lightbulb banner" bind:value={draft.media.projectsHero} /><ImageField label="Closing lightbulb banner" bind:value={draft.media.projectsFooter} />
						</div>
					</div>
					<div class="project-toolbar"><h2>Project library <span>{draft.projects.length}</span></h2><button type="button" onclick={addProject}>+ Add project</button></div>
					<div class="project-editor">
						{#each draft.projects as project, projectIndex}
							<details open={projectIndex === 0}>
								<summary><span>{project.number}</span><strong>{project.title}</strong><small>{project.shortTitle}</small></summary>
								<div class="project-body">
									<div class="field-grid">
										<label><span>Project number</span><input bind:value={project.number} /></label><label><span>URL slug</span><input bind:value={project.slug} /></label>
										<label><span>Full title</span><input bind:value={project.title} /></label><label><span>Short title</span><input bind:value={project.shortTitle} /></label>
										<label class="wide"><span>Summary</span><textarea bind:value={project.summary} rows="3"></textarea></label>
										<label class="wide"><span>Image description for accessibility</span><input bind:value={project.imageAlt} /></label>
										<ImageField label="Card/story image" bind:value={project.image} /><ImageField label="Opening banner" bind:value={project.banner} /><ImageField label="Closing banner" bind:value={project.footerBanner} />
									</div>
									<div class="sub-editor"><div class="sub-heading"><h3>Story paragraphs</h3><button type="button" onclick={() => project.body.push('New paragraph')}>+ Paragraph</button></div>
										{#each project.body as paragraph, paragraphIndex}<div class="array-row"><textarea bind:value={project.body[paragraphIndex]} rows="3"></textarea><button class="remove-small" type="button" onclick={() => project.body.splice(paragraphIndex, 1)}>Remove</button></div>{/each}
									</div>
									<div class="sub-editor"><div class="sub-heading"><h3>Initiatives and links</h3><button type="button" onclick={() => project.initiatives.push({ title: 'New initiative', copy: 'Add details here.' })}>+ Initiative</button></div>
										{#each project.initiatives as initiative, initiativeIndex}
											<div class="initiative-card"><label><span>Title</span><input bind:value={initiative.title} /></label><label><span>Copy</span><textarea bind:value={initiative.copy} rows="3"></textarea></label>
												{#if initiative.links}{#each initiative.links as link, linkIndex}<div class="link-editor"><input bind:value={link.label} aria-label="Link label" placeholder="Link label" /><input bind:value={link.href} aria-label="Link URL" placeholder="https://" /><button type="button" onclick={() => initiative.links?.splice(linkIndex, 1)}>×</button></div>{/each}{/if}
												<div class="initiative-actions"><button type="button" onclick={() => (initiative.links ??= []).push({ label: 'Visit website', href: 'https://' })}>+ Link</button><button class="danger-text" type="button" onclick={() => project.initiatives.splice(initiativeIndex, 1)}>Remove initiative</button></div>
											</div>
										{/each}
									</div>
									<div class="sub-editor">
										<div class="sub-heading"><h3>Photo gallery <span>{project.gallery.length}</span></h3><button type="button" onclick={() => addGalleryImage(project)}>+ Photo</button></div>
										<div class="field-grid gallery-heading-fields">
											<label><span>Gallery heading</span><input bind:value={project.galleryTitle} /></label>
											<label><span>Gallery introduction</span><textarea bind:value={project.galleryCopy} rows="2"></textarea></label>
										</div>
										{#each project.gallery as galleryImage, galleryIndex}
											<div class="initiative-card gallery-editor-card">
												<ImageField label={`Gallery photo ${galleryIndex + 1}`} bind:value={galleryImage.image} />
												<label><span>Accessible image description</span><input bind:value={galleryImage.alt} /></label>
												<label><span>Caption</span><input bind:value={galleryImage.caption} /></label>
												<div class="initiative-actions"><button class="danger-text" type="button" onclick={() => project.gallery.splice(galleryIndex, 1)}>Remove photo</button></div>
											</div>
										{/each}
									</div>
									<button class="danger-button" type="button" onclick={() => removeProject(projectIndex)}>Remove this project</button>
								</div>
							</details>
						{/each}
					</div>
				</section>
			{:else if activeTab === 'consular'}
				<section class="editor-section">
					<div class="section-heading"><p>Consular Ball</p><h1>History by year</h1><span>Edit the page introduction, fundraising milestones and each year in the timeline.</span></div>
					<div class="panel">
						<h2>Page introduction</h2>
						<div class="field-grid">
							<label><span>Eyebrow</span><input bind:value={draft.consularBall.eyebrow} /></label><label><span>Page title</span><input bind:value={draft.consularBall.title} /></label>
							<label class="wide"><span>Introduction</span><textarea bind:value={draft.consularBall.intro} rows="4"></textarea></label>
							<label class="wide"><span>SEO description</span><textarea bind:value={draft.consularBall.seoDescription} rows="3"></textarea></label>
							<ImageField label="Opening banner" bind:value={draft.consularBall.banner} /><ImageField label="Closing banner" bind:value={draft.consularBall.footerBanner} />
						</div>
					</div>
					<div class="panel">
						<h2>Origin and impact</h2>
						<div class="field-grid">
							<label class="wide"><span>Origin heading</span><input bind:value={draft.consularBall.originTitle} /></label>
							{#each draft.consularBall.origin as paragraph, index}<label class="wide"><span>Origin paragraph {index + 1}</span><textarea bind:value={draft.consularBall.origin[index]} rows="4"></textarea></label>{/each}
						</div>
						<div class="stat-editor">
							{#each draft.consularBall.stats as stat, index}<div><label><span>Milestone {index + 1}</span><input bind:value={stat.value} /></label><label><span>Caption</span><input bind:value={stat.label} /></label></div>{/each}
						</div>
					</div>
					<div class="panel">
						<h2>Timeline and auction</h2>
						<div class="field-grid">
							<label><span>Timeline heading</span><input bind:value={draft.consularBall.yearsTitle} /></label><label><span>Auction heading</span><input bind:value={draft.consularBall.auctionTitle} /></label>
							<label class="wide"><span>Timeline introduction</span><textarea bind:value={draft.consularBall.yearsCopy} rows="3"></textarea></label>
							<label class="wide"><span>Auction story</span><textarea bind:value={draft.consularBall.auctionCopy} rows="4"></textarea></label>
							<label class="wide"><span>Closing quote</span><textarea bind:value={draft.consularBall.closingQuote} rows="3"></textarea></label>
							<label><span>External link label</span><input bind:value={draft.consularBall.externalLink.label} /></label><label><span>External link URL</span><input bind:value={draft.consularBall.externalLink.href} /></label>
						</div>
					</div>
					<div class="project-toolbar"><h2>Year archive <span>{draft.consularBall.years.length}</span></h2><button type="button" onclick={addConsularYear}>+ Add year</button></div>
					<div class="project-editor">
						{#each draft.consularBall.years as entry, yearIndex}
							<details open={yearIndex === draft.consularBall.years.length - 1}>
								<summary><span>{entry.year}</span><strong>{entry.title}</strong><small>{entry.amount}</small></summary>
								<div class="project-body">
									<div class="field-grid">
										<label><span>Year</span><input bind:value={entry.year} /></label><label><span>Amount or milestone</span><input bind:value={entry.amount} /></label>
										<label class="wide"><span>Title</span><input bind:value={entry.title} /></label><label class="wide"><span>Summary</span><textarea bind:value={entry.summary} rows="4"></textarea></label>
										<label class="wide"><span>Image description</span><input bind:value={entry.imageAlt} /></label><ImageField label="Year photograph" bind:value={entry.image} />
									</div>
									<div class="sub-editor"><div class="sub-heading"><h3>Highlights</h3><button type="button" onclick={() => entry.highlights.push('New highlight')}>+ Highlight</button></div>
										{#each entry.highlights as highlight, highlightIndex}<div class="array-row"><input bind:value={entry.highlights[highlightIndex]} /><button class="remove-small" type="button" onclick={() => entry.highlights.splice(highlightIndex, 1)}>Remove</button></div>{/each}
									</div>
									<button class="danger-button" type="button" onclick={() => draft.consularBall.years.splice(yearIndex, 1)}>Remove this year</button>
								</div>
							</details>
						{/each}
					</div>
				</section>
			{:else if activeTab === 'partners'}
				<section class="editor-section">
					<div class="section-heading"><p>Partners</p><h1>Donors and collaborators</h1><span>Add or remove core donors, project organisations, artists and specialist partners.</span></div>
					<div class="panel">
						<h2>Partners page</h2>
						<div class="field-grid">
							<label><span>Eyebrow</span><input bind:value={draft.partnersPage.eyebrow} /></label><label><span>Page title</span><input bind:value={draft.partnersPage.title} /></label>
							<label class="wide"><span>Introduction</span><textarea bind:value={draft.partnersPage.intro} rows="4"></textarea></label>
							<label><span>Directory heading</span><input bind:value={draft.partnersPage.sectionTitle} /></label><label><span>Closing heading</span><input bind:value={draft.partnersPage.closingTitle} /></label>
							<label class="wide"><span>Directory copy</span><textarea bind:value={draft.partnersPage.sectionCopy} rows="3"></textarea></label><label class="wide"><span>Closing copy</span><textarea bind:value={draft.partnersPage.closingCopy} rows="3"></textarea></label>
							<label class="wide"><span>SEO description</span><textarea bind:value={draft.partnersPage.seoDescription} rows="3"></textarea></label><ImageField label="Hero image" bind:value={draft.partnersPage.heroImage} />
						</div>
					</div>
					<div class="project-toolbar"><h2>Partner directory <span>{draft.partnersPage.items.length}</span></h2><button type="button" onclick={addPartner}>+ Add partner</button></div>
					<div class="project-editor">
						{#each draft.partnersPage.items as partner, partnerIndex}
							<details open={partnerIndex === 0}>
								<summary><span>0{partnerIndex + 1}</span><strong>{partner.name}</strong><small>{partner.category}</small></summary>
								<div class="project-body">
									<div class="field-grid">
										<label><span>Partner name</span><input bind:value={partner.name} /></label><label><span>Category</span><input bind:value={partner.category} placeholder="Core donor" /></label>
										<label class="wide"><span>Description</span><textarea bind:value={partner.description} rows="4"></textarea></label><label class="wide"><span>Image description</span><input bind:value={partner.imageAlt} /></label>
										<ImageField label="Partner image or logo" bind:value={partner.image} /><label><span>Website link</span><input bind:value={partner.href} placeholder="https://" /></label><label><span>Link label</span><input bind:value={partner.linkLabel} placeholder="Visit partner" /></label>
									</div>
									<button class="danger-button" type="button" onclick={() => draft.partnersPage.items.splice(partnerIndex, 1)}>Remove this partner</button>
								</div>
							</details>
						{/each}
					</div>
				</section>
			{:else}
				<section class="editor-section">
					<div class="section-heading"><p>Support</p><h1>Partner pathways</h1><span>Direct visitors to organisations without adding a Proud Partners contact form.</span></div>
					<div class="panel">
						<h2>Support section</h2>
						<div class="field-grid"><label><span>Eyebrow</span><input bind:value={draft.site.support.eyebrow} /></label><label><span>Heading</span><input bind:value={draft.site.support.title} /></label><label class="wide"><span>Explanation</span><textarea bind:value={draft.site.support.copy} rows="4"></textarea></label></div>
						<div class="support-editor">
							{#each draft.site.support.links as link, index}<div><span>0{index + 1}</span><label><span>Button label</span><input bind:value={link.label} /></label><label><span>Destination URL</span><input bind:value={link.href} /></label><button type="button" onclick={() => draft.site.support.links.splice(index, 1)}>Remove</button></div>{/each}
						</div>
						<button class="add-row" type="button" onclick={() => draft.site.support.links.push({ label: 'Support a partner', href: 'https://' })}>+ Add support link</button>
					</div>
				</section>
			{/if}

			<footer class="editor-footer"><button type="button" onclick={resetDraft}>Reset unsaved changes</button><button class="save-button" type="button" onclick={saveContent} disabled={saving}>{saving ? 'Saving…' : 'Save all changes'}</button></footer>
		</main>
	</div>
{/if}

<style>
	:global(body:has(.admin-layout)), :global(body:has(.login-page)) { background: #eef4f6; }
	.login-page { display: grid; place-items: center; min-height: 100vh; padding: 2rem; background: radial-gradient(circle at 75% 20%, rgba(37,169,214,.18), transparent 26rem), #eef4f6; }
	.login-card { width: min(100%, 29rem); padding: clamp(2rem, 6vw, 3.5rem); background: #fffdf8; border: 1px solid #d8e4ea; border-radius: 1.5rem; box-shadow: 0 24px 70px rgba(8,47,77,.12); }
	.login-card img { width: 12rem; }
	.admin-kicker, .section-heading > p { margin: 2rem 0 .5rem; color: #168dc0; font-size: .7rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
	.login-card h1 { margin: 0; font-size: clamp(2.7rem, 8vw, 4.4rem); line-height: 1; letter-spacing: -.05em; }
	.login-copy { margin: 1rem 0 1.75rem; color: #688094; }
	.login-card form { display: grid; gap: 1rem; }
	.login-card form button, .save-button { padding: .9rem 1.2rem; border: 0; border-radius: 999px; background: #0b4f85; color: white; font: inherit; font-weight: 800; cursor: pointer; }
	.login-card > a { display: inline-block; margin-top: 1.5rem; color: #0d67ad; font-size: .78rem; font-weight: 800; }
	.form-error { padding: .8rem 1rem; border-radius: .65rem; background: #fff0ed; color: #a83928; }
	.admin-layout { min-height: 100vh; color: #082f4d; }
	.admin-header { position: fixed; inset: 0 0 auto; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; min-height: 5rem; padding: .75rem 1.5rem; border-bottom: 1px solid #d8e4ea; background: rgba(255,253,248,.96); backdrop-filter: blur(14px); }
	.admin-brand { display: flex; align-items: center; gap: .8rem; color: #082f4d; font-weight: 800; }
	.admin-brand img { width: 2.8rem; height: 2.8rem; border-radius: 50%; background: white; }
	.admin-brand small { display: block; margin-top: .1rem; color: #688094; font-size: .66rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }
	.header-actions { display: flex; align-items: center; gap: .7rem; }
	.save-message { font-size: .75rem; color: #23805a; }.save-message.error { color: #b44433; }
	.preview-link, .logout-button, .editor-footer > button:first-child { padding: .7rem .9rem; border: 1px solid #ccdae3; border-radius: 999px; background: white; color: #294b65; font: inherit; font-size: .72rem; font-weight: 800; cursor: pointer; }
	.logout-button { border: 0; background: transparent; }
	.admin-sidebar { position: fixed; inset: 5rem auto 0 0; width: 15.5rem; padding: 2rem 1.2rem; border-right: 1px solid #d8e4ea; background: #082f4d; color: white; }
	.admin-sidebar > p { margin: 0 0 1rem .7rem; color: #8fcfe4; font-size: .68rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
	.admin-sidebar nav { display: grid; gap: .25rem; }
	.admin-sidebar nav button { padding: .85rem .9rem; border: 0; border-radius: .65rem; background: transparent; color: rgba(255,255,255,.68); text-align: left; font: inherit; font-weight: 700; cursor: pointer; }
	.admin-sidebar nav button:hover, .admin-sidebar nav button.active { background: rgba(255,255,255,.11); color: white; }
	.local-note { position: absolute; inset: auto 1.2rem 1.5rem; padding: 1rem; border: 1px solid rgba(255,255,255,.12); border-radius: .8rem; background: rgba(255,255,255,.06); }
	.local-note strong, .local-note span { display: block; }.local-note strong { font-size: .76rem; }.local-note span { margin-top: .35rem; color: rgba(255,255,255,.58); font-size: .68rem; line-height: 1.45; }
	.admin-content { margin-left: 15.5rem; padding: 7.5rem clamp(1.25rem, 4vw, 4rem) 3rem; }
	.editor-section { width: min(100%, 72rem); margin: auto; }
	.section-heading { margin-bottom: 2rem; }.section-heading > p { margin-top: 0; }.section-heading h1 { margin: 0; font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1; letter-spacing: -.045em; }.section-heading > span { display: block; margin-top: .8rem; color: #688094; }
	.panel { margin-bottom: 1.25rem; padding: clamp(1.25rem, 3vw, 2rem); border: 1px solid #d8e4ea; border-radius: 1rem; background: #fff; box-shadow: 0 10px 30px rgba(8,47,77,.04); }
	.panel h2, .project-toolbar h2 { margin: 0 0 1.5rem; font-size: 1.25rem; }.project-toolbar h2 span { display: inline-grid; place-items: center; width: 1.7rem; height: 1.7rem; margin-left: .4rem; border-radius: 50%; background: #dff2f7; color: #0d67ad; font-size: .7rem; }
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 1.1rem; }.field-grid .wide { grid-column: 1 / -1; }
	label > span, .initiative-card > label > span { display: block; margin-bottom: .45rem; color: #37566f; font-size: .68rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
	input, textarea { width: 100%; padding: .85rem 1rem; border: 1px solid #ccdae3; border-radius: .7rem; outline: none; background: #fbfdfd; color: #082f4d; font: inherit; transition: border-color .15s, box-shadow .15s; }
	input:focus, textarea:focus { border-color: #25a9d6; box-shadow: 0 0 0 3px rgba(37,169,214,.12); } textarea { resize: vertical; line-height: 1.55; }
	.repeat-list, .support-editor { display: grid; gap: .75rem; }.repeat-row, .support-editor > div { display: grid; grid-template-columns: 2.2rem 1fr 1fr auto; gap: .8rem; align-items: end; padding: 1rem; border-radius: .8rem; background: #f4f8f9; }.repeat-row > span, .support-editor > div > span { align-self: center; color: #25a9d6; font-size: .72rem; font-weight: 800; }
	.mini-grid, .stat-editor { display: grid; grid-template-columns: repeat(3,1fr); gap: .8rem; margin-top: 1.3rem; }.stat-editor > div { display: grid; gap: .7rem; padding: 1rem; border-radius: .8rem; background: #f4f8f9; }.top-gap { margin-top: 1.5rem; }
	.principle-editor { display: grid; grid-template-columns: repeat(3,1fr); gap: .8rem; margin-top: 1.5rem; }.principle-editor > div { display: grid; gap: .75rem; padding: 1rem; border: 1px solid #e1eaee; border-radius: .8rem; }.principle-editor > div > span { color: #25a9d6; font-size: .72rem; font-weight: 800; }
	.project-toolbar { display: flex; align-items: center; justify-content: space-between; margin: 2.5rem 0 1rem; }.project-toolbar h2 { margin: 0; }.project-toolbar button, .sub-heading button, .initiative-actions button, .add-row { padding: .65rem .85rem; border: 1px solid #0d67ad; border-radius: 999px; background: white; color: #0d67ad; font: inherit; font-size: .7rem; font-weight: 800; cursor: pointer; }
	.project-editor { display: grid; gap: .8rem; }.project-editor details { border: 1px solid #d8e4ea; border-radius: 1rem; background: white; overflow: hidden; }.project-editor summary { display: grid; grid-template-columns: 3rem 1fr auto; gap: .7rem; align-items: center; padding: 1.25rem 1.5rem; cursor: pointer; }.project-editor summary > span { color: #25a9d6; font-size: .7rem; font-weight: 800; }.project-editor summary small { color: #688094; }.project-body { padding: 1.5rem; border-top: 1px solid #e1eaee; }
	.sub-editor { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e1eaee; }.sub-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }.sub-heading h3 { margin: 0; font-size: 1rem; }.array-row { display: grid; grid-template-columns: 1fr auto; gap: .7rem; margin-bottom: .7rem; }.remove-small, .support-editor button { border: 0; background: transparent; color: #a44a3d; font: inherit; font-size: .7rem; font-weight: 800; cursor: pointer; }
	.initiative-card { display: grid; gap: .75rem; margin-bottom: .8rem; padding: 1rem; border-radius: .8rem; background: #f4f8f9; }.link-editor { display: grid; grid-template-columns: .8fr 1.2fr auto; gap: .6rem; }.link-editor button { border: 0; background: transparent; color: #a44a3d; font-size: 1.2rem; cursor: pointer; }.initiative-actions { display: flex; justify-content: space-between; }.initiative-actions .danger-text { border-color: transparent; color: #a44a3d; background: transparent; }.danger-button { margin-top: 1.5rem; padding: .65rem .9rem; border: 1px solid #e8bcb5; border-radius: 999px; background: #fff7f5; color: #a44a3d; font: inherit; font-size: .7rem; font-weight: 800; cursor: pointer; }
	.add-row { margin-top: 1rem; }.editor-footer { display: flex; align-items: center; justify-content: flex-end; gap: .8rem; width: min(100%,72rem); margin: 2rem auto 0; padding-top: 1.5rem; border-top: 1px solid #ccdae3; }
	button:disabled { opacity: .55; cursor: wait; }
	@media (max-width: 900px) { .admin-header { position: sticky; flex-wrap: wrap; }.admin-sidebar { position: static; width: auto; padding: 1rem; }.admin-sidebar nav { grid-template-columns: repeat(7, minmax(max-content,1fr)); overflow-x: auto; }.local-note { display: none; }.admin-content { margin-left: 0; padding-top: 2.5rem; }.header-actions { flex-wrap: wrap; justify-content: flex-end; }.save-message { display: none; } }
	@media (max-width: 680px) { .admin-header { padding: .7rem 1rem; }.preview-link, .logout-button { display: none; }.admin-sidebar nav { grid-template-columns: repeat(7, max-content); }.field-grid, .mini-grid, .stat-editor, .principle-editor { grid-template-columns: 1fr; }.field-grid .wide { grid-column: auto; }.repeat-row, .support-editor > div { grid-template-columns: 2rem 1fr; }.repeat-row label:last-child, .support-editor label:last-of-type { grid-column: 2; }.project-editor summary { grid-template-columns: 2.5rem 1fr; }.project-editor summary small { display: none; }.link-editor { grid-template-columns: 1fr auto; }.link-editor input:nth-child(2) { grid-column: 1; }.link-editor button { grid-column: 2; grid-row: 1 / 3; }.editor-footer { flex-direction: column-reverse; align-items: stretch; }.editor-footer button { width: 100%; } }
</style>
