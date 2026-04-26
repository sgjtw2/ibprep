(function () {
  var page = location.pathname.split('/').pop().replace('.html', '');

  var NAV = [
    {
      label: 'Technical',
      items: [
        { id: 'accounting',    name: 'Accounting' },
        { id: 'valuation',     name: 'Valuation' },
        { id: 'ma-accretion',  name: 'M&A / Accretion' },
        { id: 'lbo-practice',  name: 'LBO Practice' },
      ]
    },
    {
      label: 'Interview',
      items: [
        { id: 'behavioral', name: 'Behavioral' },
      ]
    },
    {
      label: 'Workspace',
      items: [
        { id: 'financial-model', name: 'Financial Model' },
        { id: 'news',            name: 'Market News' },
      ]
    },
  ];

  /* ── CSS ─────────────────────────────────────────────── */
  var css = [
    /* sidebar shell */
    '#ibp-sb{position:fixed;top:52px;left:0;width:168px;height:calc(100vh - 52px);',
    'background:var(--s1,#080C14);border-right:1px solid var(--b1,#162038);',
    'display:flex;flex-direction:column;z-index:90;overflow-y:auto;',
    'transition:transform .22s cubic-bezier(.4,0,.2,1);}',

    /* back link */
    '.ibp-back{display:flex;align-items:center;gap:7px;padding:13px 14px 11px;',
    'font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;',
    'letter-spacing:.1em;text-transform:uppercase;',
    'color:var(--t3,#4A5A78);text-decoration:none;',
    'border-bottom:1px solid var(--b1,#162038);margin-bottom:6px;',
    'transition:color .12s;}',
    '.ibp-back:hover{color:var(--t2,#8898B8);}',
    '.ibp-back-arrow{font-size:12px;}',

    /* section labels */
    '.ibp-cat{padding:10px 14px 4px;font-family:Arial,Helvetica,sans-serif;',
    'font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;',
    'color:var(--t4,#2A3850);}',

    /* nav links */
    '.ibp-a{display:block;padding:7px 14px 7px 16px;',
    'font-family:Arial,Helvetica,sans-serif;font-size:11px;',
    'color:var(--t3,#4A5A78);text-decoration:none;',
    'border-left:2px solid transparent;',
    'transition:color .12s,background .12s,border-color .12s;}',
    '.ibp-a:hover{color:var(--t2,#8898B8);background:var(--s2,#0C1220);}',
    '.ibp-a.ibp-cur{color:var(--t1,#EEF2FF);',
    'border-left-color:var(--accent,#1B4FD8);',
    'background:var(--accent-bg,rgba(27,79,216,.10));}',

    /* hide redundant back button already in pages */
    '.btn-back{display:none!important;}',

    /* push page content right on desktop */
    '@media(min-width:769px){',
    '.page{margin-left:168px!important;max-width:calc(1100px + 168px)!important;}',
    '}',

    /* hamburger — hidden on desktop */
    '#ibp-hbg{display:none;width:30px;height:30px;',
    'background:var(--s2,#0C1220);border:1px solid var(--b1,#162038);',
    'border-radius:4px;cursor:pointer;color:var(--t2,#8898B8);',
    'font-size:16px;align-items:center;justify-content:center;',
    'flex-shrink:0;line-height:1;}',

    /* mobile */
    '@media(max-width:768px){',
    '#ibp-sb{transform:translateX(-100%);',
    'box-shadow:4px 0 24px rgba(0,0,0,.5);}',
    '#ibp-sb.ibp-open{transform:translateX(0);}',
    '#ibp-hbg{display:flex;}',
    '.page{margin-left:0!important;}',
    '}',

    /* overlay */
    '#ibp-ov{display:none;position:fixed;inset:0;',
    'background:rgba(0,0,0,.45);z-index:89;}',
    '#ibp-ov.ibp-open{display:block;}',
  ].join('');

  /* ── Sidebar HTML ────────────────────────────────────── */
  var linksHtml = NAV.map(function (cat) {
    return '<div class="ibp-cat">' + cat.label + '</div>' +
      cat.items.map(function (item) {
        var active = item.id === page ? ' ibp-cur' : '';
        return '<a class="ibp-a' + active + '" href="./' + item.id + '.html">' + item.name + '</a>';
      }).join('');
  }).join('');

  var sidebarHtml =
    '<div id="ibp-sb">' +
      '<a class="ibp-back" href="./command-center.html">' +
        '<span class="ibp-back-arrow">&#8592;</span>Dashboard' +
      '</a>' +
      linksHtml +
    '</div>';

  /* ── Init ────────────────────────────────────────────── */
  function init() {
    // Inject CSS
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);

    // Overlay
    var ov = document.createElement('div');
    ov.id = 'ibp-ov';
    document.body.insertBefore(ov, document.body.firstChild);

    // Sidebar
    var tmp = document.createElement('div');
    tmp.innerHTML = sidebarHtml;
    document.body.insertBefore(tmp.firstChild, document.body.firstChild);

    // Hamburger button into header
    var hdr = document.querySelector('.hdr');
    if (hdr) {
      var btn = document.createElement('button');
      btn.id = 'ibp-hbg';
      btn.setAttribute('aria-label', 'Toggle navigation');
      btn.innerHTML = '&#9776;';
      btn.addEventListener('click', toggleSidebar);
      hdr.insertBefore(btn, hdr.firstChild);
    }

    ov.addEventListener('click', closeSidebar);
  }

  function toggleSidebar() {
    document.getElementById('ibp-sb').classList.toggle('ibp-open');
    document.getElementById('ibp-ov').classList.toggle('ibp-open');
  }

  function closeSidebar() {
    document.getElementById('ibp-sb').classList.remove('ibp-open');
    document.getElementById('ibp-ov').classList.remove('ibp-open');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
