(function () {
  function rewriteUrl(url, basePath) {
    if (!url || typeof url !== 'string') return url;
    if (!(url.indexOf('/images/') === 0 || url.indexOf('/media/') === 0)) return url;
    if (basePath === '/') return url;
    return basePath + url.slice(1);
  }

  function applyBasePathFix() {
    var basePath = window.__siteBasePath || '/';
    if (!basePath.endsWith('/')) basePath += '/';

    var selectors = [
      ['img[src]', 'src'],
      ['source[srcset]', 'srcset'],
      ['a[href]', 'href']
    ];

    selectors.forEach(function (pair) {
      var selector = pair[0];
      var attr = pair[1];
      var nodes = document.querySelectorAll(selector);
      nodes.forEach(function (node) {
        var value = node.getAttribute(attr);
        if (!value) return;

        if (attr === 'srcset') {
          var updated = value
            .split(',')
            .map(function (entry) {
              var parts = entry.trim().split(/\s+/);
              if (!parts.length) return entry;
              parts[0] = rewriteUrl(parts[0], basePath);
              return parts.join(' ');
            })
            .join(', ');
          if (updated !== value) node.setAttribute(attr, updated);
          return;
        }

        var rewritten = rewriteUrl(value, basePath);
        if (rewritten !== value) node.setAttribute(attr, rewritten);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBasePathFix);
  } else {
    applyBasePathFix();
  }
})();
