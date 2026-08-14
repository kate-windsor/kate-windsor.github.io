// Open external links in a new tab/window and add safe rel values (handles dynamically added links)
(function () {
  'use strict';

  function shouldSkip(href) {
    if (!href) return true;
    return href.startsWith('#') ||
           href.startsWith('mailto:') ||
           href.startsWith('tel:') ||
           href.startsWith('javascript:');
  }

  function processAnchor(a) {
    var href = a.getAttribute('href');
    if (shouldSkip(href)) return;
    try {
      var linkUrl = new URL(href, document.baseURI);
      // Use origin comparison to handle host/port differences
      if (linkUrl.origin !== location.origin) {
        a.setAttribute('target', '_blank');
        var rel = a.getAttribute('rel') || '';
        if (!/\bnoopener\b/.test(rel)) rel = (rel + ' noopener').trim();
        if (!/\bnoreferrer\b/.test(rel)) rel = (rel + ' noreferrer').trim();
        a.setAttribute('rel', rel);
      }
    } catch (e) {
      // ignore malformed URLs
    }
  }

  function processAllAnchors(root) {
    root = root || document;
    var anchors = root.querySelectorAll('a[href]');
    anchors.forEach(processAnchor);
  }

  // Run now if DOM is already ready, otherwise on DOMContentLoaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    processAllAnchors();
  } else {
    document.addEventListener('DOMContentLoaded', function () { processAllAnchors(); });
  }

  // Watch for anchors added later
  var mo = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes && m.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        if (node.matches && node.matches('a[href]')) {
          processAnchor(node);
        } else {
          var nested = node.querySelectorAll && node.querySelectorAll('a[href]');
          nested && nested.forEach(processAnchor);
        }
      });
    });
  });

  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
})();
