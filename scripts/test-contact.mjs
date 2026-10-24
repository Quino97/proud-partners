import assert from 'node:assert/strict';
// All HTTP calls are mocked. This test cannot send email or change Supabase.
const environment={CONTACT_ALLOWED_ORIGINS:'http://localhost:5173',RESEND_API_KEY:'test-private-key',CONTACT_FROM:'Proud Partners <website@example.org>',SUPABASE_SERVICE_ROLE_KEY:'test-service-role',SUPABASE_URL:'https://example.supabase.co'};
let handler;globalThis.Deno={env:{get:key=>environment[key]},serve:fn=>handler=fn};
let sent=[],rateAllowed=true,resendStatus=200;
globalThis.fetch=async(url,options)=>{
 if(url.endsWith('/rpc/claim_contact_request'))return Response.json(rateAllowed);
 assert.equal(url,'https://api.resend.com/emails');sent.push(JSON.parse(options.body));return Response.json({id:'mock-email'},{status:resendStatus});
};
await import('../supabase/functions/contact/index.ts');
const valid={name:'Test Visitor',email:'visitor@example.org',phone:'+27 00 000 0000',message:'A fictional test message.',company:'',requestId:'12345678-1234-1234-1234-123456789abc'};
const request=(body=valid,origin='http://localhost:5173',method='POST')=>new Request('https://example.supabase.co/functions/v1/contact',{method,headers:{origin,'Content-Type':'application/json'},...(method==='POST'?{body:JSON.stringify(body)}:{})});
assert.equal((await handler(request(valid,'https://unapproved.example'))).status,403);
assert.equal((await handler(request(valid,undefined,'OPTIONS'))).status,204);
assert.equal((await handler(request(valid,undefined,'GET'))).status,405);
for(const body of [null,[],{...valid,email:'bad'},{...valid,name:'Injected\r\nheader'},{...valid,phone:'x'.repeat(51)},{...valid,message:'short'},{...valid,requestId:'bad'}])assert.equal((await handler(request(body))).status,400);
assert.equal((await handler(request({...valid,message:'x'.repeat(19000)}))).status,413);
assert.equal((await handler(request({...valid,company:'bot'}))).status,200);assert.equal(sent.length,0);
delete environment.RESEND_API_KEY;assert.equal((await handler(request())).status,503);environment.RESEND_API_KEY='test-private-key';
rateAllowed=false;assert.equal((await handler(request())).status,429);assert.equal(sent.length,0);rateAllowed=true;
assert.equal((await handler(request())).status,200);assert.equal(sent.length,1);assert.deepEqual(sent[0].to,['amouton@plexus.co.za']);assert.equal(sent[0].reply_to,valid.email);assert(sent[0].text.includes(valid.phone));
resendStatus=500;assert.equal((await handler(request())).status,502);
console.log('Contact validation, origin checks, bot trap, configuration errors, rate limits and delivery handling passed (mocked; no email sent).');
