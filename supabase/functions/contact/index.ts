// Deploy with JWT verification disabled: this is a public website form.
// Private mail and service-role credentials remain inside this Edge Function.
const env = (name: string) => Deno.env.get(name) || '';
const allowedOrigins = (env('CONTACT_ALLOWED_ORIGINS') || 'https://quino97.github.io,http://localhost:5173,http://127.0.0.1:5173').split(',').map(s => s.trim());

Deno.serve(async (request: Request) => {
	const origin = request.headers.get('origin') || '';
	const headers = { 'Content-Type':'application/json', 'Vary':'Origin', 'Access-Control-Allow-Origin':allowedOrigins.includes(origin) ? origin : '', 'Access-Control-Allow-Headers':'authorization,x-client-info,apikey,content-type', 'Access-Control-Allow-Methods':'POST,OPTIONS' };
	const respond = (status: number, body: object) => new Response(JSON.stringify(body),{status,headers});
	if (!allowedOrigins.includes(origin)) return respond(403,{message:'Origin not allowed.'});
	if (request.method === 'OPTIONS') return new Response(null,{status:204,headers});
	if (request.method !== 'POST') return respond(405,{message:'Method not allowed.'});
	if (Number(request.headers.get('content-length') || 0) > 18000) return respond(413,{message:'Message too large.'});
	let body: Record<string,unknown>;
	try { const raw=await request.text(); if(raw.length>18000) return respond(413,{message:'Message too large.'}); body=JSON.parse(raw); } catch { return respond(400,{message:'Invalid form.'}); }
	if (!body || typeof body !== 'object' || Array.isArray(body)) return respond(400,{message:'Invalid form.'});
	if (typeof body.company === 'string' && body.company.trim()) return respond(200,{ok:true});
	const field = (key: string) => typeof body[key] === 'string' ? (body[key] as string).trim() : '';
	const name=field('name'), email=field('email'), phone=field('phone'), message=field('message'), requestId=field('requestId');
	if (!name || name.length>120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254 || /[\r\n]/.test(name+email+phone) || phone.length>50 || message.length<10 || message.length>10000 || !/^[0-9a-f-]{36}$/i.test(requestId)) return respond(400,{message:'Please check the form fields.'});
	const resendKey=env('RESEND_API_KEY'), from=env('CONTACT_FROM'), serviceKey=env('SB_SECRET_KEY')||env('SUPABASE_SERVICE_ROLE_KEY'), supabaseUrl=env('SUPABASE_URL');
	if (!resendKey || !from || !serviceKey || !supabaseUrl) return respond(503,{message:'The contact service is not configured yet.'});
	try {
		const ip=(request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown').split(',')[0].trim();
		const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(serviceKey),{name:'HMAC',hash:'SHA-256'},false,['sign']);
		const signature=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(ip));
		const fingerprint=Array.from(new Uint8Array(signature)).map(b=>b.toString(16).padStart(2,'0')).join('');
		for(const limit of [{p_key:`ip:${fingerprint}`,p_max:5,p_seconds:3600},{p_key:'global',p_max:100,p_seconds:86400}]) {
			const authHeaders:Record<string,string>={apikey:serviceKey,'Content-Type':'application/json'};
			if (!serviceKey.startsWith('sb_secret_')) authHeaders.Authorization=`Bearer ${serviceKey}`;
			const response=await fetch(`${supabaseUrl}/rest/v1/rpc/claim_contact_request`,{method:'POST',headers:authHeaders,body:JSON.stringify(limit)});
			if(!response.ok) return respond(503,{message:'The contact service is temporarily unavailable.'});
			if(!(await response.json())) return respond(429,{message:'Please wait before sending another message.'});
		}
		const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${resendKey}`,'Content-Type':'application/json','Idempotency-Key':`contact-${requestId}`},body:JSON.stringify({from,to:[env('CONTACT_TO')||'amouton@plexus.co.za'],reply_to:email,subject:'Proud Partners website enquiry',text:`Name: ${name}\nEmail: ${email}\nPhone: ${phone||'Not supplied'}\n\n${message}`})});
		if(!response.ok) { console.error('Contact mail delivery failed:',response.status); return respond(502,{message:'The message could not be delivered.'}); }
		return respond(200,{ok:true});
	} catch { return respond(503,{message:'The contact service is temporarily unavailable.'}); }
});
