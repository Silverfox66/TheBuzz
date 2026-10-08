(function () {
  "use strict";
  var KEY = "buzz-demo-v1";
  var STATUS = { "draft": "Draft", "needs-editing": "Needs Editing", "ready": "Ready", "published": "Published" };
  var ICON = { "draft": "\u25CB", "needs-editing": "\u270E", "ready": "\u2713", "published": "\u25CF" };
  var main = document.getElementById("main");

  function load() {
    try { var s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {}
    return JSON.parse(JSON.stringify(window.BUZZ_SEED));
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { alert("Could not save: browser storage is full. Try a smaller image."); } }

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(d) {
    var p = d.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  function issueOf(n) { return S.issues.filter(function (i) { return i.num === +n; })[0]; }
  function sortedIssues() { return S.issues.slice().sort(function (a, b) { return b.num - a.num; }); }
  function latestIssue() { return sortedIssues().filter(function (i) { return i.published; })[0]; }
  function isVisible(a) {
    var i = issueOf(a.issue);
    return !!i && i.published && (a.status === "ready" || a.status === "published");
  }
  function issueArticles(num, preview) {
    var iss = issueOf(num);
    var list = S.articles.filter(function (a) { return a.issue === +num && (preview || isVisible(a)); });
    return list.sort(function (a, b) { return (b.slug === iss.featured) - (a.slug === iss.featured); });
  }
  function allVisible() {
    return S.articles.filter(isVisible).sort(function (a, b) { return b.issue - a.issue; });
  }
  function q(preview) { return preview ? "?preview=1" : ""; }
  function aHref(a, preview) { return "#/article/" + encodeURIComponent(a.slug) + q(preview); }
  function iHref(n, preview) { return preview ? "#/preview/" + n : "#/issues/" + n; }

  function img(a, cls) {
    if (a.img) return '<img class="ph ' + (cls || "") + '" src="' + esc(a.img) + '" alt="' + esc(a.alt) + '">';
    var c = a.color || "#777";
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><pattern id="d" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="3" fill="#fff" fill-opacity=".25"/></pattern></defs><rect width="600" height="400" fill="' + c + '"/><rect width="600" height="400" fill="url(#d)"/><text x="300" y="215" font-family="Georgia,serif" font-size="34" font-weight="700" fill="#fff" text-anchor="middle">' + esc(a.section) + '</text><text x="300" y="250" font-family="Arial,sans-serif" font-size="16" fill="#fff" text-anchor="middle">PHOTO PLACEHOLDER</text></svg>';
    return '<img class="ph ' + (cls || "") + '" src="data:image/svg+xml,' + encodeURIComponent(svg) + '" alt="' + esc(a.alt) + '">';
  }
  function badge(s) { return '<span class="badge ' + s + '">' + ICON[s] + " " + STATUS[s] + "</span>"; }
  function byline(a) {
    return "By " + esc(a.author) + (a.year ? ", " + esc(a.year) : "");
  }

  /* ---------- public components ---------- */
  function storyCard(a, preview) {
    return '<article class="story">' + img(a) +
      '<p class="kicker">' + esc(a.section) + (preview ? " &middot; " + badge(a.status) : "") + "</p>" +
      '<h3><a class="t" href="' + aHref(a, preview) + '">' + esc(a.title) + "</a></h3>" +
      (a.subtitle ? "<p>" + esc(a.subtitle) + "</p>" : "") +
      '<p class="byline">' + byline(a) + "</p></article>";
  }
  function uqBlock(iss) {
    if (!iss.uq || !iss.uq.length) return "";
    return '<section class="uq" aria-labelledby="uq-h"><h2 id="uq-h">UQ News Room</h2><p class="sub">Short, sharp, and straight from students.</p><ul>' +
      iss.uq.map(function (u) { return "<li>" + esc(u.text) + "<cite>" + esc(u.who) + "</cite></li>"; }).join("") + "</ul></section>";
  }
  function introBlock(iss) {
    return '<section class="intro" aria-labelledby="intro-h"><h2 id="intro-h">From the editors</h2><p>' + esc(iss.intro) + "</p></section>";
  }
  function shoutBlock() {
    return '<section class="shout" aria-labelledby="sh-h"><h2 id="sh-h">Shoutouts</h2><ul>' +
      S.shoutouts.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + '</ul><p class="small"><a href="#/submit">Send a shoutout</a></p></section>';
  }
  function ctaBlock() {
    return '<section class="cta" aria-labelledby="cta-h"><h2 id="cta-h">Your Opinion Matters</h2><p>The Buzz is written by students, so it is only as good as what you send us.</p><ul>' +
      ["Send comments or feedback", "Share a story idea", "Submit your work", "Join The Buzz"].map(function (t) {
        return '<li><a class="btn alt" href="#/submit">' + t + "</a></li>";
      }).join("") + "</ul></section>";
  }
  function issueBody(iss, preview, introFirst) {
    var arts = issueArticles(iss.num, preview);
    var feat = arts[0], rest = arts.slice(1);
    var hero = feat ? '<article class="hero"><div><p class="kicker">Featured story &middot; ' + esc(feat.section) + (preview ? " &middot; " + badge(feat.status) : "") + "</p><h2><a class=\"t\" href=\"" + aHref(feat, preview) + '">' + esc(feat.title) + "</a></h2>" +
      (feat.subtitle ? '<p class="dek">' + esc(feat.subtitle) + "</p>" : "") + '<p class="byline">' + byline(feat) + '</p></div><figure><a href="' + aHref(feat, preview) + '" tabindex="-1" aria-hidden="true">' + img(feat) + "</a>" +
      (feat.credit ? "<figcaption>" + esc(feat.credit) + "</figcaption>" : "") + "</figure></article>" : "<p>No stories in this issue yet.</p>";
    var more = rest.length ? '<section aria-labelledby="more-h"><h2 id="more-h" class="sr">More stories in this issue</h2><div class="stories">' + rest.map(function (a) { return storyCard(a, preview); }).join("") + "</div></section>" : "";
    var special = '<div class="two"><div>' + introBlock(iss) + "<br>" + shoutBlock() + "</div>" + uqBlock(iss) + "</div>";
    return introFirst ? special + hero + more : hero + more + special;
  }
  function issueBar(iss, label) {
    return '<div class="issue-bar"><span>' + (label || "Latest issue") + ": Issue " + iss.num + " &mdash; " + fmtDate(iss.date) + '</span><a class="btn bee" href="' + iHref(iss.num) + '">Read Issue ' + iss.num + "</a></div>";
  }

  /* ---------- pages ---------- */
  function pHome() {
    var iss = latestIssue();
    if (!iss) return "<div class=wrap><h1>No issues published yet</h1></div>";
    return '<div class="wrap">' + issueBar(iss) + '<h1 class="sr">Latest stories from The Buzz</h1>' + issueBody(iss, false, false) + ctaBlock() + "</div>";
  }
  function pIssue(n, preview) {
    var iss = issueOf(n);
    if (!iss || (!iss.published && !preview)) return notFound();
    var nav = "";
    var older = sortedIssues().filter(function (i) { return i.published && i.num < iss.num; })[0];
    var newer = sortedIssues().reverse().filter(function (i) { return i.published && i.num > iss.num; })[0];
    nav = '<nav class="prevnext" aria-label="Issue navigation"><span>' + (older ? '<a href="' + iHref(older.num) + '">&larr; Issue ' + older.num + "</a>" : "") + "</span><span>" + (newer ? '<a href="' + iHref(newer.num) + '">Issue ' + newer.num + " &rarr;</a>" : "") + "</span></nav>";
    var banner = preview ? '<div class="preview-banner">PREVIEW. This issue is ' + (iss.published ? "published" : "not public yet") + '. Drafts are visible only here. <a href="#/admin" style="color:#f5c400">Back to dashboard</a></div>' : "";
    return banner + '<div class="wrap"><h1 class="sec-title" style="margin-top:1.5rem">Issue ' + iss.num + " &mdash; " + fmtDate(iss.date) + "</h1>" + issueBody(iss, preview, true) + nav + ctaBlock() + "</div>";
  }
  function pArticle(slug, preview) {
    var a = S.articles.filter(function (x) { return x.slug === slug; })[0];
    if (!a || (!preview && !isVisible(a))) return notFound();
    var iss = issueOf(a.issue);
    var list = issueArticles(a.issue, preview);
    var idx = list.indexOf(a);
    var prev = list[idx - 1], next = list[idx + 1];
    var rel = (preview ? S.articles : allVisible()).filter(function (x) { return x !== a && (x.section === a.section || x.author === a.author); }).slice(0, 3);
    var extra = (a.images || []).map(function (im) { return '<figure class="article-fig"><img class="ph" src="' + esc(im.src) + '" alt="' + esc(im.alt) + '">' + (im.caption ? "<figcaption>" + esc(im.caption) + "</figcaption>" : "") + "</figure>"; }).join("");
    return (preview ? '<div class="preview-banner">PREVIEW (status: ' + STATUS[a.status] + ')</div>' : "") +
      '<div class="wrap"><article class="article"><p class="kicker"><a href="#/section/' + encodeURIComponent(a.section) + '">' + esc(a.section) + "</a></p><h1>" + esc(a.title) + "</h1>" +
      (a.subtitle ? '<p class="sub">' + esc(a.subtitle) + "</p>" : "") +
      '<p class="meta">' + byline(a) + " &middot; " + fmtDate(iss.date) + ' &middot; <a href="' + iHref(iss.num, preview) + '">Issue ' + iss.num + "</a></p></article>" +
      '<figure class="article-fig">' + img(a) + (a.caption || a.credit ? "<figcaption>" + esc(a.caption) + (a.caption && a.credit ? " " : "") + (a.credit ? "(" + esc(a.credit) + ")" : "") + "</figcaption>" : "") + "</figure>" +
      '<div class="article"><div class="body">' + a.body.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>" + extra +
      (a.sources && a.sources.length ? '<section class="sources"><h2 style="font:700 14px var(--sans)">Sources</h2><ul>' + a.sources.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></section>" : "") +
      '<div class="part-of"><span><strong>Part of Issue ' + iss.num + "</strong><br>" + fmtDate(iss.date) + '</span><a class="btn bee" href="' + iHref(iss.num, preview) + '">Back to the complete issue</a></div>' +
      '<nav class="prevnext" aria-label="Story navigation"><span>' + (prev ? '<a href="' + aHref(prev, preview) + '">&larr; ' + esc(prev.title) + "</a>" : "") + "</span><span style=\"text-align:right\">" + (next ? '<a href="' + aHref(next, preview) + '">' + esc(next.title) + " &rarr;</a>" : "") + "</span></nav>" +
      (rel.length ? '<section><h2 class="sec-title">Related stories</h2><ul class="list">' + rel.map(function (r) { return '<li><a href="' + aHref(r, preview) + '">' + esc(r.title) + '</a><div class="small">' + esc(r.section) + " &middot; Issue " + r.issue + "</div></li>"; }).join("") + "</ul></section>" : "") +
      "</div></div>";
  }
  function listOf(arts, preview) {
    if (!arts.length) return "<p>No stories found.</p>";
    return '<ul class="list">' + arts.map(function (a) {
      return '<li><a href="' + aHref(a, preview) + '">' + esc(a.title) + '</a><div class="small">' + esc(a.section) + " &middot; " + esc(a.author) + " &middot; Issue " + a.issue + "</div></li>";
    }).join("") + "</ul>";
  }
  function pSection(name) {
    return '<div class="wrap"><h1 class="sec-title">' + esc(name) + "</h1>" + listOf(allVisible().filter(function (a) { return a.section === name; })) + "</div>";
  }
  function pLatest() {
    return '<div class="wrap"><h1 class="sec-title">Latest stories</h1>' + listOf(allVisible()) + "</div>";
  }
  function pArchives(params) {
    var sec = params.get("section");
    var groups = {};
    sortedIssues().filter(function (i) { return i.published; }).forEach(function (i) {
      var y = +i.date.slice(0, 4), m = +i.date.slice(5, 7);
      var s = m >= 8 ? y : y - 1;
      var label = s + "\u2013" + (s + 1);
      (groups[label] = groups[label] || []).push(i);
    });
    var html = '<div class="wrap"><h1 class="sec-title">Archives</h1>';
    Object.keys(groups).sort().reverse().forEach(function (g) {
      html += "<h2>" + g + '</h2><ul class="list">' + groups[g].map(function (i) {
        return '<li><a href="' + iHref(i.num) + '">Issue ' + i.num + " &mdash; " + fmtDate(i.date) + '</a><div class="small">' + issueArticles(i.num).length + " stories</div></li>";
      }).join("") + "</ul>";
    });
    html += '<h2 class="sec-title">Browse stories</h2><p>' +
      ['<a href="#/archives">All</a>'].concat(S.sections.map(function (s) { return '<a href="#/archives?section=' + encodeURIComponent(s) + '"' + (s === sec ? ' aria-current="true"' : "") + ">" + esc(s) + "</a>"; })).join(" &middot; ") + "</p>";
    html += listOf(allVisible().filter(function (a) { return !sec || a.section === sec; })) + "</div>";
    return html;
  }
  function pAbout() {
    return '<div class="wrap"><div class="article" style="max-width:46rem"><h1 class="sec-title">About The Buzz</h1><p>The Buzz is Shady Hill School\'s student newspaper. It comes out weekly with school news, current events, sports, interviews, opinion, a corner for student quotes, and shoutouts.</p></div>' +
      '<h2 class="sec-title" id="people">People</h2><ul class="staff">' + S.staff.map(function (p) { return "<li><strong>" + esc(p.name) + "</strong><span>" + esc(p.role) + "<br>" + esc(p.year) + "</span></li>"; }).join("") + "</ul>" +
      '<p class="small">Placeholder staff list for the demo. Update it in the data file.</p>' + ctaBlock() + "</div>";
  }
  function pSubmit() {
    return '<div class="wrap"><div class="article"><h1>Your Opinion Matters</h1><p>Send us feedback, pitch a story, submit your writing or art, or tell us you want to join.</p>' +
      '<div class="warn">Prototype: this form does not send anything yet. A real inbox or form backend must be connected (see README).</div>' +
      '<form class="stack" id="submit-form"><label for="s-type">What is this?</label><select id="s-type"><option>Comment or feedback</option><option>Story idea</option><option>Submission (writing or art)</option><option>Shoutout</option><option>I want to join The Buzz</option></select>' +
      '<label for="s-name">Your name (optional)</label><input id="s-name" autocomplete="name"><label for="s-msg">Message</label><textarea id="s-msg" rows="6" required></textarea><p><button type="submit">Send</button></p></form><p id="submit-msg" role="status"></p></div></div>';
  }
  function pSearch(params) {
    var term = (params.get("q") || "").trim().toLowerCase();
    var words = term.split(/\s+/).filter(Boolean);
    var res = !words.length ? [] : allVisible().filter(function (a) {
      var h = [a.title, a.subtitle, a.author, a.section, "issue " + a.issue, a.body.join(" ")].join(" ").toLowerCase();
      return words.every(function (w) { return h.indexOf(w) > -1; });
    });
    return '<div class="wrap"><h1 class="sec-title">Search</h1><p role="status">' + (words.length ? res.length + ' result(s) for "' + esc(term) + '"' : "Type a headline, name, section, or issue number.") + "</p>" + (words.length ? listOf(res) : "") + "</div>";
  }
  function notFound() { return '<div class="wrap"><h1 class="sec-title">Page not found</h1><p><a href="#/">Back to the latest issue</a></p></div>'; }

  /* ---------- admin ---------- */
  var adminIssue = null, editSlug = null, pendingImg = undefined, adminMsg = "";
  function slugify(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "story"; }
  function upcoming() {
    var u = sortedIssues().filter(function (i) { return !i.published; }).pop();
    return u || sortedIssues()[0];
  }
  function pAdmin() {
    if (adminIssue == null || !issueOf(adminIssue)) adminIssue = upcoming().num;
    var iss = issueOf(adminIssue);
    var arts = S.articles.filter(function (a) { return a.issue === iss.num; });
    var cnt = function (s) { return arts.filter(function (a) { return a.status === s; }).length; };
    var h = '<div class="wrap admin"><h1>Editors dashboard</h1><div class="warn"><strong>Prototype, no login.</strong> Anyone can open this page and changes live only in this browser. A real deployment needs Google sign-in limited to editor accounts and a database (see README).</div>';
    if (adminMsg) { h += '<div class="panel" role="status">' + esc(adminMsg) + "</div>"; adminMsg = ""; }
    h += '<form class="stack" id="issue-pick"><label for="ip">Issue</label><select id="ip">' + sortedIssues().map(function (i) { return '<option value="' + i.num + '"' + (i.num === iss.num ? " selected" : "") + ">Issue " + i.num + " (" + (i.published ? "published" : "unpublished") + ")</option>"; }).join("") + "</select></form>";
    h += "<h2>" + (iss.published ? "Issue " : "Upcoming Issue ") + iss.num + "</h2><p>Planned publication: <strong>" + fmtDate(iss.date) + "</strong> &middot; Status: " + (iss.published ? "Published" : "Not public") + "</p>";
    h += '<div class="stats"><div class="stat"><b>' + arts.length + "</b>Articles</div><div class=stat><b>" + cnt("draft") + "</b>Draft</div><div class=stat><b>" + cnt("needs-editing") + "</b>Needs Editing</div><div class=stat><b>" + cnt("ready") + "</b>Ready</div><div class=stat><b>" + cnt("published") + "</b>Published</div></div>";
    h += '<div class="actions"><button data-act="add">Add article</button><a class="btn alt" href="#/preview/' + iss.num + '">Preview entire issue</a>' +
      (iss.published ? '<button class="alt" data-act="unpublish">Unpublish issue</button>' : '<button class="bee" data-act="publish">Publish issue</button>') + "</div>";
    h += '<table><thead><tr><th>Story</th><th>Section</th><th>Author</th><th>Status</th><th>Featured</th><th></th></tr></thead><tbody>' + (arts.map(function (a) {
      return "<tr><td><strong>" + esc(a.title) + "</strong></td><td>" + esc(a.section) + "</td><td>" + esc(a.author || "Unassigned") + "</td><td>" + badge(a.status) +
        '<br><label class="sr" for="st-' + esc(a.slug) + '">Status for ' + esc(a.title) + '</label><select id="st-' + esc(a.slug) + '" data-status="' + esc(a.slug) + '">' + Object.keys(STATUS).map(function (k) { return '<option value="' + k + '"' + (k === a.status ? " selected" : "") + ">" + STATUS[k] + "</option>"; }).join("") + "</select></td>" +
        '<td><label><input type="radio" name="feat" data-feat="' + esc(a.slug) + '"' + (iss.featured === a.slug ? " checked" : "") + '> <span class="sr">Feature </span>' + (iss.featured === a.slug ? "Featured" : "Feature") + '</label></td><td><button class="alt" data-edit="' + esc(a.slug) + '">Edit</button></td></tr>';
    }).join("") || '<tr><td colspan="6">No articles yet.</td></tr>') + "</tbody></table>";
    h += '<div class="panel"><h2>Import from Google Docs</h2><form class="stack" id="import-form"><label for="gd">Google Doc link</label><input id="gd" type="url" placeholder="https://docs.google.com/document/d/..." required><p><button type="submit">Add as draft</button></p></form><p class="small">Saves the link and creates a draft. Automatic text import is NOT connected yet; it needs the Apps Script/Google API setup in the README. Paste article text into the editor for now.</p></div>';
    h += '<div class="panel"><h2>Issue introduction and UQ News Room</h2><form class="stack" id="issue-form"><label for="in-intro">Introduction from the editors</label><textarea id="in-intro" rows="4">' + esc(iss.intro) + '</textarea><label for="in-date">Planned publication date</label><input id="in-date" type="date" value="' + esc(iss.date) + '"><label for="in-uq">UQ News Room (one per line, format: comment | who)</label><textarea id="in-uq" rows="6">' + esc((iss.uq || []).map(function (u) { return u.text + " | " + u.who; }).join("\n")) + '</textarea><p><button type="submit">Save issue details</button></p></form></div>';
    h += '<div class="panel"><h2>Create an issue</h2><form class="stack grid2" id="new-issue"><div><label for="ni-n">Issue number</label><input id="ni-n" type="number" min="1" required></div><div><label for="ni-d">Publication date</label><input id="ni-d" type="date" required></div><div><button type="submit">Create issue</button></div></form></div>';
    if (editSlug) h += editor(editSlug === "__new" ? null : S.articles.filter(function (a) { return a.slug === editSlug; })[0], iss);
    h += '<p><button class="alt" data-act="reset">Reset demo data</button></p></div>';
    return h;
  }
  function editor(a, iss) {
    var isNew = !a;
    a = a || { title: "", subtitle: "", section: "School", author: "", year: "", status: "draft", credit: "", alt: "", caption: "", docUrl: "", body: [], sources: [] };
    function f(id, label, val) { return '<div><label for="' + id + '">' + label + '</label><input id="' + id + '" value="' + esc(val) + '"></div>'; }
    return '<div class="panel" id="editor"><h2>' + (isNew ? "Add article" : "Edit article") + '</h2><form class="stack" id="article-form"><div class="grid2">' +
      f("e-title", "Headline", a.title) + f("e-sub", "Subtitle", a.subtitle) + f("e-author", "Author", a.author) + f("e-year", "Author class year (e.g. 8th grade)", a.year) +
      '<div><label for="e-sec">Section</label><select id="e-sec">' + S.sections.map(function (s) { return '<option' + (s === a.section ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + '</select></div>' +
      '<div><label for="e-status">Status</label><select id="e-status">' + Object.keys(STATUS).map(function (k) { return '<option value="' + k + '"' + (k === a.status ? " selected" : "") + ">" + STATUS[k] + "</option>"; }).join("") + "</select></div>" +
      f("e-doc", "Google Doc link", a.docUrl) + f("e-credit", "Image credit", a.credit) + f("e-alt", "Image alt text (describe the picture)", a.alt) + f("e-cap", "Image caption", a.caption) +
      '</div><label for="e-img">Upload image</label><input id="e-img" type="file" accept="image/*">' + (a.img ? '<p class="small">An image is attached. Upload another to replace it.</p>' : "") +
      '<label for="e-body">Article text (blank line between paragraphs)</label><textarea id="e-body" rows="10">' + esc(a.body.join("\n\n")) + '</textarea><label for="e-src">Sources (one per line)</label><textarea id="e-src" rows="3">' + esc((a.sources || []).join("\n")) + '</textarea>' +
      '<div class="actions"><button type="submit">Save</button><button type="button" class="alt" data-act="ready-save">Save as Ready</button><button type="button" class="alt" data-act="cancel">Cancel</button></div></form></div>';
  }
  function resize(file, cb) {
    var r = new FileReader();
    r.onload = function () {
      var im = new Image();
      im.onload = function () {
        var s = Math.min(1, 1000 / im.width), c = document.createElement("canvas");
        c.width = im.width * s; c.height = im.height * s;
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        cb(c.toDataURL("image/jpeg", 0.8));
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  }
  function saveArticle(forceStatus) {
    var v = function (id) { return document.getElementById(id).value; };
    if (!v("e-title").trim()) { adminMsg = "A headline is required."; return render(); }
    var a = S.articles.filter(function (x) { return x.slug === editSlug; })[0];
    if (!a) {
      var base = slugify(v("e-title")), s = base, n = 2;
      while (S.articles.some(function (x) { return x.slug === s; })) s = base + "-" + n++;
      a = { slug: s, issue: adminIssue, color: "#555" };
      S.articles.push(a);
    }
    a.title = v("e-title").trim(); a.subtitle = v("e-sub").trim(); a.author = v("e-author").trim(); a.year = v("e-year").trim();
    a.section = v("e-sec"); a.status = forceStatus || v("e-status"); a.docUrl = v("e-doc").trim();
    a.credit = v("e-credit").trim(); a.alt = v("e-alt").trim(); a.caption = v("e-cap").trim();
    a.body = v("e-body").split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
    a.sources = v("e-src").split("\n").map(function (p) { return p.trim(); }).filter(Boolean);
    if (pendingImg) a.img = pendingImg;
    pendingImg = undefined; editSlug = null; save();
    adminMsg = "Article saved as " + STATUS[a.status] + ".";
    render();
  }
  function bindAdmin() {
    var iss = issueOf(adminIssue);
    var on = function (id, ev, fn) { var e = document.getElementById(id); if (e) e.addEventListener(ev, fn); };
    on("ip", "change", function (e) { adminIssue = +e.target.value; editSlug = null; render(); });
    on("import-form", "submit", function (e) {
      e.preventDefault();
      var url = document.getElementById("gd").value, m = url.match(/^https:\/\/docs\.google\.com\/document\/d\/([\w-]+)/);
      if (!m) { adminMsg = "That is not a Google Docs document link."; return render(); }
      var slug = "imported-" + m[1].slice(0, 8).toLowerCase();
      if (!S.articles.some(function (a) { return a.slug === slug; })) {
        S.articles.push({ slug: slug, issue: iss.num, status: "draft", section: "School", title: "Imported Google Doc (add headline)", subtitle: "", author: "", year: "", credit: "", alt: "", caption: "", color: "#555", docUrl: url, body: ["Text not imported yet. Paste the article text here or connect the Google Docs import."], sources: [] });
        save();
      }
      editSlug = slug; adminMsg = "Link saved as a draft. Text was not imported (not configured)."; render();
    });
    on("issue-form", "submit", function (e) {
      e.preventDefault();
      iss.intro = document.getElementById("in-intro").value.trim();
      iss.date = document.getElementById("in-date").value || iss.date;
      iss.uq = document.getElementById("in-uq").value.split("\n").map(function (l) { return l.trim(); }).filter(Boolean).map(function (l) {
        var p = l.split("|"); return { text: p[0].trim(), who: (p[1] || "Anonymous").trim() };
      });
      save(); adminMsg = "Issue details saved."; render();
    });
    on("new-issue", "submit", function (e) {
      e.preventDefault();
      var n = +document.getElementById("ni-n").value;
      if (issueOf(n)) { adminMsg = "Issue " + n + " already exists."; return render(); }
      S.issues.push({ num: n, date: document.getElementById("ni-d").value, published: false, featured: "", intro: "", uq: [] });
      save(); adminIssue = n; adminMsg = "Issue " + n + " created."; render();
    });
    on("article-form", "submit", function (e) { e.preventDefault(); saveArticle(); });
    on("e-img", "change", function (e) { if (e.target.files[0]) resize(e.target.files[0], function (d) { pendingImg = d; }); });
    var ed = document.getElementById("editor"); if (ed) ed.scrollIntoView();
  }
  function onClick(e) {
    var t = e.target.closest("[data-act],[data-edit]"); if (!t) return;
    var iss = adminIssue != null && issueOf(adminIssue), act = t.getAttribute("data-act");
    if (t.hasAttribute("data-edit")) { editSlug = t.getAttribute("data-edit"); pendingImg = undefined; return render(); }
    if (act === "add") { editSlug = "__new"; pendingImg = undefined; render(); }
    else if (act === "cancel") { editSlug = null; render(); }
    else if (act === "ready-save") saveArticle("ready");
    else if (act === "publish") {
      var n = S.articles.filter(function (a) { return a.issue === iss.num && (a.status === "ready" || a.status === "published"); }).length;
      var held = S.articles.filter(function (a) { return a.issue === iss.num; }).length - n;
      if (!confirm("Publish Issue " + iss.num + "? " + n + " ready article(s) become public." + (held ? " " + held + " article(s) not marked Ready stay hidden." : ""))) return;
      S.articles.forEach(function (a) { if (a.issue === iss.num && a.status === "ready") a.status = "published"; });
      iss.published = true; save(); adminMsg = "Issue " + iss.num + " is live at #/issues/" + iss.num + "."; render();
    } else if (act === "unpublish") { iss.published = false; save(); adminMsg = "Issue unpublished."; render(); }
    else if (act === "reset") { if (confirm("Reset all demo data?")) { localStorage.removeItem(KEY); S = load(); adminIssue = null; editSlug = null; render(); } }
  }
  function onChange(e) {
    var t = e.target, iss = issueOf(adminIssue);
    if (t.hasAttribute && t.hasAttribute("data-status")) {
      var a = S.articles.filter(function (x) { return x.slug === t.getAttribute("data-status"); })[0];
      a.status = t.value; save(); render();
    } else if (t.hasAttribute && t.hasAttribute("data-feat")) { iss.featured = t.getAttribute("data-feat"); save(); adminMsg = "Featured story updated."; render(); }
  }

  /* ---------- router ---------- */
  function render() {
    var raw = location.hash.slice(1) || "/", qi = raw.indexOf("?");
    var path = qi > -1 ? raw.slice(0, qi) : raw, params = new URLSearchParams(qi > -1 ? raw.slice(qi + 1) : "");
    var seg = path.split("/").filter(Boolean).map(decodeURIComponent), preview = params.get("preview") === "1";
    var html, title = "The Buzz | Shady Hill's Student Newspaper";
    if (!seg.length) html = pHome();
    else if (seg[0] === "latest") { html = pLatest(); title = "Latest | The Buzz"; }
    else if (seg[0] === "section") { html = pSection(seg[1] || ""); title = seg[1] + " | The Buzz"; }
    else if (seg[0] === "issues" && seg[1]) { html = pIssue(seg[1], false); title = "Issue " + seg[1] + " | The Buzz"; }
    else if (seg[0] === "preview" && seg[1]) { html = pIssue(seg[1], true); title = "Preview Issue " + seg[1]; }
    else if (seg[0] === "article") { html = pArticle(seg[1], preview); title = "Article | The Buzz"; }
    else if (seg[0] === "archives" || seg[0] === "issues") { html = pArchives(params); title = "Archives | The Buzz"; }
    else if (seg[0] === "about" || seg[0] === "people") { html = pAbout(); title = "About and People | The Buzz"; }
    else if (seg[0] === "submit") { html = pSubmit(); title = "Your Opinion Matters | The Buzz"; }
    else if (seg[0] === "search") { html = pSearch(params); title = "Search | The Buzz"; }
    else if (seg[0] === "admin") { html = pAdmin(); title = "Editors | The Buzz"; }
    else html = notFound();
    var a0 = seg[0] === "article" && S.articles.filter(function (x) { return x.slug === seg[1]; })[0];
    if (a0) title = a0.title + " | The Buzz";
    main.innerHTML = html;
    document.title = title;
    if (seg[0] === "admin") bindAdmin();
    if (seg[0] === "submit") document.getElementById("submit-form").addEventListener("submit", function (e) {
      e.preventDefault(); document.getElementById("submit-msg").textContent = "Not sent: submissions are not connected yet in this prototype."; });
    document.querySelectorAll("nav a").forEach(function (l) {
      if (l.getAttribute("href") === "#" + (path === "/" ? "/" : path)) l.setAttribute("aria-current", "page"); else l.removeAttribute("aria-current");
    });
    nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false");
  }
  var nav = document.getElementById("nav"), btn = document.getElementById("menu-btn");
  btn.addEventListener("click", function () { var o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
  document.getElementById("search-form").addEventListener("submit", function (e) {
    e.preventDefault(); location.hash = "#/search?q=" + encodeURIComponent(document.getElementById("q").value);
  });
  main.addEventListener("click", onClick);
  main.addEventListener("change", onChange);
  var last = "";
  window.addEventListener("hashchange", function () {
    var changedPage = location.hash.split("?")[0] !== last;
    render();
    if (changedPage) { window.scrollTo(0, 0); main.focus({ preventScroll: true }); }
    last = location.hash.split("?")[0];
  });
  last = location.hash.split("?")[0];
  render();
})();
