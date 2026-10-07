// Renders .grimorio/.cache/board-projection.json through .grimorio/scripts/board/renderer.html's own script, against a
// minimal DOM shim. Exit 0 = the board paints. Run it after touching either half of that pair.
// @keep-comment Red case to re-prove it can fail: break a section title in the renderer and re-run.
import { readFileSync } from 'fs';
const html = readFileSync('.grimorio/scripts/board/renderer.html','utf8');
// \r?\n tolerates a CRLF-checked-out renderer.html (this repo's Windows checkouts normalize line
// endings) without weakening the match on a plain-LF checkout.
const js = html.match(/<script>\r?\n([\s\S]*)\r?\n<\/script>/)[1];
// `.grimorio/.cache/board-projection.json` is GENERATED and gitignored (.gitignore:70), so a fresh checkout or a
// new worktree does not have it. Absent input is a SKIP, never a FAIL: a check that goes red for a missing
// generated artifact teaches its readers to ignore red, which costs more than the check is worth. Generate
// it with .grimorio/skills/grimorio.board/scripts/generate-projection.mjs (needs gh) and re-run.
import { existsSync } from 'fs';
const PROJ = '.grimorio/.cache/board-projection.json';
if (!existsSync(PROJ)) {
  console.log('SKIP — no ' + PROJ + ' in this checkout (generated + gitignored). Nothing to render.');
  process.exit(0);
}
const proj = JSON.parse(readFileSync(PROJ,'utf8'));

const mk = (t) => ({ tag:t, className:'', _text:'', children:[], hidden:false, open:false,
  set textContent(v){ this._text=String(v); this.children.length=0; },
  get textContent(){ return this._text + this.children.map(c=>c.textContent).join(''); },
  appendChild(c){ this.children.push(c); return c; } });
const root = { diag:mk('div'), board:mk('div'), meta:mk('div'), foot:mk('div') };
const txtNode = (v) => ({ tag:'#text', _text:String(v), children:[], get textContent(){return this._text;}, set textContent(x){this._text=String(x);} });
globalThis.document = { createElement:mk, createTextNode:txtNode, getElementById:(id)=>({diag:root.diag,board:root.board,meta:root.meta,foot:root.foot}[id]) };
globalThis.claude = { use: async (n) => n==='db' ? {
    doc:(p)=>({ get:async()=>({ exists:(p==='board/meta'||p==='board/evidence'), data:()=>(p==='board/meta'?proj.meta:proj.evidence) }) }),
    collection:(n)=>({ get:async()=>({ docs:(proj[n]||[]).map(d=>({data:()=>d})) }) })
  } : null };
eval(js);
await new Promise(r=>setTimeout(r,60));
const txt = root.board.textContent;
const fail = [];
if (root.diag.hidden === false) fail.push('DIAGNOSTIC PANE SHOWN: ' + root.diag.textContent);
// EXACT heading match, never a substring: "Queued".includes() also accepts "QueuedX", which is a check
// that can only ever be green. Compare the h2 set itself.
const heads = root.board.children.filter(c => c.tag === 'h2').map(c => c._text);
for (const h of ['Blocked — these need something from you','In progress','Queued','Closed','Decisions I took'])
  if (!heads.includes(h)) fail.push('missing/renamed section heading: "'+h+'" (saw: '+heads.join(' | ')+')');
// Derive the owed entries from the projection — never a literal title, same disease as the pinned count
// below. Only `Closed` is windowed (renderer.html: WINDOW = 10), so progress and blocked paint in full.
const owed = (proj.requests || []).filter((r) => r.state === 'progress' || r.state === 'blocked');
if (owed.length === 0) fail.push('projection has no progress/blocked entry to prove rendering with');
const unpainted = owed.filter((r) => !txt.includes(r.title)).map((r) => r.title);
if (unpainted.length) fail.push(`${unpainted.length} of ${owed.length} unwindowed entries not rendered: ${unpainted.join(' | ')}`);
if (!txt.includes('the earlier')) fail.push('rolling-window fold not rendered');
// The census and the evidence panel used to exist ONLY in the artifact db, hand-seeded outside this
// pipeline. Assert they are sourced and painted, or the "single source" claim silently rots again.
if (!heads.includes('The census')) fail.push('census section not rendered from the register');
if (!proj.census || proj.census.length === 0) fail.push('census not emitted by the generator');
if (!proj.evidence || !proj.evidence.body) fail.push('evidence not emitted by the generator');
if (!proj.registerOwns || !proj.registerOwns.census || !proj.registerOwns.evidence) fail.push('registerOwns says the register does not own census/evidence');
// Assert the RELATIONSHIP, never a literal count — pinning "10 of 22" made this fail the moment the
// archive legitimately grew, which is a check measuring the wrong thing.
// Read the note off the Closed heading's own <em>, never out of concatenated page text: scanning text
// let an adjacent date bleed into the number ("28" + "2026" -> "282026") and fail a correct board.
const closedH2 = root.board.children.find(c => c.tag === 'h2' && c._text === 'Closed');
const note = closedH2 && closedH2.children[0] ? closedH2.children[0]._text : '';
const win = /^most recent (\d+) of (\d+)$/.exec(note);
if (!win) fail.push('closed window label absent or malformed: "' + note + '"');
else {
  // The Closed section paints the archive PLUS every request whose own state is already `done`
  // (renderer.html: `var done = (d.closed || []).concat(of("done"))`). Comparing against the archive
  // alone measured a different number than the one the page prints.
  const painted = proj.closed.length + (proj.requests || []).filter((r) => r.state === 'done').length;
  if (Number(win[2]) !== painted) fail.push(`window says ${win[2]} closed, projection paints ${painted} (archive ${proj.closed.length} + done ${painted - proj.closed.length})`);
}
const esc = ['cargando','bloqueadas','En cola','Cerradas','ventana rodante','no disponible'].filter(w=>txt.includes(w));
if (esc.length) fail.push('untranslated chrome: '+esc.join(', '));
console.log('board chars painted:', txt.length);
console.log('closed archive     :', win ? `${win[1]} of ${win[2]} shown, rest folded` : 'NOT WINDOWED');
console.log(fail.length ? 'FAIL\n - ' + fail.join('\n - ') : 'PASS — board paints, all sections present, one language');
process.exit(fail.length?1:0);
