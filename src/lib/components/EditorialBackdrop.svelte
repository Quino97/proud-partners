<div class="editorial-backdrop" aria-hidden="true">
	<span class="edge-orbit orbit-left"></span>
	<span class="edge-orbit orbit-right"></span>
	<span class="edge-bubble"></span>
	<span class="edge-orbit orbit-bottom"></span>
</div>

<style>
	.editorial-backdrop {
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		overflow: hidden;
		background: linear-gradient(to bottom, var(--cream) 0%, var(--cream) 12%, #f1f5f5 48%, var(--cream) 85%);
	}
	.editorial-backdrop::before {
		content:''; position:absolute; width:30rem; height:30rem; top:9rem; right:-17rem;
		border:1px solid rgba(13,103,173,.13); border-radius:50%;
		box-shadow:0 0 0 3rem rgba(169,226,239,.08),0 0 0 6rem rgba(169,226,239,.06);
	}
	.edge-orbit { position:absolute; width:25rem; height:25rem; border:1px solid rgba(13,103,173,.13); border-radius:50%; background:radial-gradient(circle at 65% 35%,rgba(169,226,239,.09),transparent 75%); }
	.edge-orbit::after { content:''; position:absolute; inset:1.6rem; border:1px solid rgba(13,103,173,.07); border-radius:50%; }
	.orbit-left { top:max(52rem,27%); left:-19rem; animation:edge-drift 24s ease-in-out infinite; }
	.orbit-right { top:max(85rem,51%); right:-18rem; width:23rem; height:23rem; animation:edge-drift 28s ease-in-out -9s infinite; }
	.edge-bubble { position:absolute; top:max(112rem,70%); left:-6rem; width:10rem; height:10rem; border:1px solid rgba(37,169,214,.1); border-radius:50%; background:radial-gradient(circle at 70% 30%,rgba(169,226,239,.16),rgba(169,226,239,.025) 70%); box-shadow:0 0 0 1.4rem rgba(169,226,239,.035); }
	.orbit-bottom { top:87%; right:-12rem; width:17rem; height:17rem; }
	@keyframes edge-drift { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
	@media(prefers-reduced-motion:reduce) { .edge-orbit { animation:none; } }
	@media(max-width:760px) {
		.editorial-backdrop::before { width:22rem; height:22rem; right:-17rem; }
		.edge-orbit,.edge-bubble { opacity:.55; }
		.orbit-left { left:-22rem; } .orbit-right { right:-21rem; } .edge-bubble { left:-8rem; } .orbit-bottom { right:-15rem; }
	}
</style>
