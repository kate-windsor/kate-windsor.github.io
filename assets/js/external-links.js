// Open external links in a new tab/window and add safe rel values
document.addEventListener('DOMContentLoaded', function () {
  var anchors = document.querySelectorAll('a[href]');
  anchors.forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;

    // Skip anchors and common non-HTTP schemes
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      return;
    }

    try {
      // Resolve relative and protocol-relative URLs against the document base
      var linkUrl = new URL(href, document.baseURI);

      // If hostnames differ, treat as external
      if (linkUrl.hostname !== location.hostname) {
        a.setAttribute('target', '_blank');

        // Preserve existing rel values but ensure noopener and noreferrer are present
        var rel = a.getAttribute('rel') || '';
        if (!/\bnoopener\b/.test(rel)) rel = (rel + ' noopener').trim();
        if (!/\bnoreferrer\b/.test(rel)) rel = (rel + ' noreferrer').trim();
        a.setAttribute('rel', rel);
      }
    } catch (e) {
      // If URL parsing fails, skip the link (safe fallback)
      return;
    }
  });
});
