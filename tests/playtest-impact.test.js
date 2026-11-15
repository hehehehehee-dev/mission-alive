import test from 'node:test';
import assert from 'node:assert/strict';
import {aggregateImpact, parseCsv, selectedColumns, createImpactLoader, questions} from '../server/playtest-impact.mjs';
import {FEEDBACK_FORM_URL, feedbackLinkMarkup} from '../src/feedback.js';
import {readFile} from 'node:fs/promises';
const headers = Object.values(questions);
const response = values => headers.map(header => values[Object.keys(questions).find(key=>questions[key]===header)] || '');
test('CSV supports quoted headers, multiline cells and doubled quotes', () => {
  assert.deepEqual(parseCsv('"A,B","say ""hi"""\r\n"line\nbreak",3\r\n'), [['A,B','say "hi"'],['line\nbreak','3']]);
  assert.throws(()=>parseCsv('"unclosed'), /CSV/);
});
test('zero responses have no invented score, percent or change', () => {
  const value = aggregateImpact([headers]);
  assert.equal(value.totalResponses,0);
  assert.deepEqual(value.interest,{n:0,before:null,after:null,change:null,improved:0});
});
test('each metric uses its own valid denominator and paired scores', () => {
  const rows = [headers,
    response({timestamp:'today',interestBefore:'2',interestAfter:'4',belongingBefore:'1',belongingAfter:'3',learnMore:'5',recommend:'4',finished:'Yes'}),
    response({timestamp:'today',interestBefore:'4',interestAfter:'3',belongingBefore:'2',belongingAfter:'5',learnMore:'2',recommend:'',finished:'No'}),
    response({timestamp:'today',interestBefore:'',interestAfter:'5',learnMore:'6',finished:'maybe'}),
    response({timestamp:'',interestBefore:'1',interestAfter:'5',learnMore:'5'}),
  ];
  const value=aggregateImpact(rows);
  assert.equal(value.totalResponses,3);
  assert.deepEqual(value.interest,{n:2,before:3,after:3.5,change:.5,improved:1});
  assert.deepEqual(value.learnMore,{n:2,agree:1});
  assert.deepEqual(value.recommend,{n:1,agree:1});
  assert.deepEqual(value.completion,{n:2,yes:1});
});
test('duplicate After questions must agree; conflicting answers do not inflate impact', () => {
  const value=aggregateImpact([[questions.timestamp,questions.interestBefore,questions.interestAfter,questions.interestAfter],['x','1','5','2'],['x','2','4','4.0'],['x','2','','3']]);
  assert.equal(value.totalResponses,3);
  assert.equal(value.interest.n,2);
  assert.equal(value.interest.change,1.5);
});
test('server discovers headers without rows then requests only allowed closed questions', async () => {
  const queries=[]; let clock=0;
  const load=createImpactLoader({now:()=>clock, fetcher:async url=>{
    const query=url.searchParams.get('tq'); queries.push(query);
    return {ok:true,text:async()=>query.includes('limit 0') ? 'Timestamp,How old are you?,"I would tell a friend to try this.",Private short answer' : 'Timestamp,"I would tell a friend to try this."\nx,5'};
  }});
  const [first, simultaneous]=await Promise.all([load(),load()]);
  assert.equal(first,simultaneous);
  assert.deepEqual(queries,['select * limit 0','select A,C']);
  assert.deepEqual(selectedColumns(['Private name',questions.timestamp,'How old are you?',questions.finished]),['B','D']);
  assert.equal(first.recommend.agree,1);
  assert.doesNotMatch(JSON.stringify(first),/Private|Timestamp|today/);
  assert.equal(await load(),first);
  assert.equal(queries.length,2);
  clock=60001; await load(); assert.equal(queries.length,4);
  assert.throws(()=>aggregateImpact([[questions.timestamp,'Private short answer'],['x','secret']]),/Unexpected/);
});
test('unreadable or non-CSV sheets fail instead of inventing a zero-response result', async () => {
  const denied=createImpactLoader({fetcher:async()=>({ok:false})});
  await assert.rejects(denied(),/unavailable/);
  const loginPage=createImpactLoader({fetcher:async()=>({ok:true,text:async()=>'<html>Sign in</html>'})});
  await assert.rejects(loginPage(),/Invalid sheet/);
  const {default: endpoint}=await import('../netlify/functions/playtest-impact.mjs');
  const response=await endpoint(new Request('https://test.example/api/playtest-impact',{method:'POST'}));
  assert.equal(response.status,405);
});
test('feedback is offered at graduation and in the certificate without prefilled private data', async () => {
  const main=await readFile(new URL('../src/main.js',import.meta.url),'utf8');
  assert.doesNotMatch(main.slice(main.indexOf('function updateSoundButton()'),main.indexOf('function beep(')), /feedbackLinkMarkup|completion-panel/,'sound toggles must work before any mission completion exists');
  assert.match(main.slice(main.indexOf('function renderCompletion(')), /insertAdjacentHTML\('beforeend', feedbackLinkMarkup\(\)\)/);
  const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
  const final=html.slice(html.indexOf('class="certificate-maker"'),html.indexOf('class="homecoming-keepsake"'));
  assert.match(final,/data-feedback-link/);
  assert.match(final,/without answering/);
  const certificate=html.slice(html.indexOf('id="graduate-certificate"'));
  assert.match(certificate,/class="certificate-feedback" data-feedback-link/);
  assert.match(FEEDBACK_FORM_URL,/\/viewform$/);
  assert.doesNotMatch(feedbackLinkMarkup(),/entry\.|prefill|formResponse|onClick|onclick/);
});
test('impact cards show paired before-to-after averages without per-card explanations', async () => {
  const impact=await readFile(new URL('../src/impact.js',import.meta.url),'utf8');
  assert.match(impact,/impact-paired/);
  assert.match(impact,/t\('Before'\)/);
  assert.match(impact,/t\('After'\)/);
  assert.match(impact,/percent\(metric\[numerator\], metric\.n\)/);
  assert.doesNotMatch(impact,/Average before → after|Paired answers:|Average change:|Responses, not unique visitors|Ratings of 4 or 5 among valid answers/);
});
