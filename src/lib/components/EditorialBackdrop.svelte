<div class="editorial-backdrop" aria-hidden="true"></div>

<style>
	.editorial-backdrop {
		position:absolute; inset:0; z-index:-1; pointer-events:none; overflow:hidden;
		background:linear-gradient(to bottom,var(--cream) 0,var(--cream) 6rem,#f5f6f0 32rem,#f5f6f0 max(42rem,65%),var(--cream) 100%);
	}
	.editorial-backdrop::before {
		content:''; position:absolute; width:30rem; height:30rem; top:9rem; right:-17rem;
		border:1px solid rgba(13,103,173,.13); border-radius:50%;
		box-shadow:0 0 0 3rem rgba(169,226,239,.08),0 0 0 6rem rgba(169,226,239,.06);
	}
	.editorial-backdrop::after {
		content:''; position:absolute; left:-4rem; top:50rem; width:15rem; height:6rem;
		transform:rotate(-28deg); opacity:.32;
		background:repeating-linear-gradient(0deg,transparent 0 17px,rgba(13,103,173,.24) 17px 18px);
		mask-image:linear-gradient(90deg,#000,transparent);
	}
	@media(max-width:760px) { .editorial-backdrop::before { width:22rem; height:22rem; right:-17rem; } .editorial-backdrop::after { width:9rem; opacity:.2; } }
</style>
