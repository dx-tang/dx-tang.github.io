(function () {
  "use strict";

  var NAV_ITEMS = [
    { href: "index.html", label: "Overview" },
    { href: "pubs.html", label: "Publications" },
    { href: "projects.html", label: "Projects" },
    { href: "team.html", label: "Team" },
    { href: "service.html", label: "Services" },
    { href: "teaching.html", label: "Teaching" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initPage().catch(function (error) {
      renderFatalError(error);
    });
  });

  async function initPage() {
    var config = window.PAGE_CONFIG || {};

    if (window.location.protocol === "file:") {
      throw new Error(
        "This page was opened with file://. Markdown content loading requires http(s). " +
        "Run `python3 -m http.server 8000` in the project root and open " +
        "http://127.0.0.1:8000/index.html."
      );
    }

    if (config.title) {
      document.title = config.title;
    }

    await loadHeader();
    renderNav(config.activeNav || "index.html");
    await renderSections(config.sections || []);
  }

  async function loadHeader() {
    var target = document.getElementById("site-header");
    if (!target) {
      return;
    }

    var headerHtml = await fetchText("header.html");
    target.innerHTML = headerHtml;
  }

  function renderNav(activeHref) {
    var target = document.getElementById("site-nav");
    if (!target) {
      return;
    }

    var links = NAV_ITEMS.map(function (item) {
      var label = item.href === activeHref ? "<b>" + escapeHtml(item.label) + "</b>" : escapeHtml(item.label);
      return '<a href="' + item.href + '">' + label + "</a>";
    });

    target.innerHTML = links.join("&nbsp;&nbsp;&nbsp;");
  }

  async function renderSections(sectionDefs) {
    var target = document.getElementById("page-content");
    if (!target) {
      return;
    }

    var htmlParts = [];

    for (var i = 0; i < sectionDefs.length; i += 1) {
      var section = sectionDefs[i];
      var markdown = await fetchText("content/" + section.markdown);
      var blocks = parseMarkdown(markdown);

      if (typeof section.listLimit === "number") {
        blocks = limitFirstList(blocks, section.listLimit);
      }

      var innerHtml = renderBlocks(blocks);
      if (section.appendHtml) {
        innerHtml += section.appendHtml;
      }

      htmlParts.push(renderSection(section.title, innerHtml));
    }

    target.innerHTML = htmlParts.join("\n");
  }

  function renderSection(title, innerHtml) {
    return (
      '<div class="row" style="margin-top: 10px">' +
      '<div class="col-md-12">' +
      '<p class="header-font">' + escapeHtml(title) + "</p>" +
      innerHtml +
      "</div>" +
      "</div>"
    );
  }

  function renderBlocks(blocks) {
    return blocks.map(function (block) {
      if (block.type === "paragraph") {
        return '<p class="text-justify">' + parseInline(block.text) + "</p>";
      }

      if (block.type === "heading") {
        if (block.level === 3) {
          return "<h3>" + parseInline(block.text) + "</h3>";
        }

        return '<p class="header-font">' + parseInline(block.text) + "</p>";
      }

      if (block.type === "list") {
        var items = block.items.map(function (item) {
          return "<li>" + renderListItem(item) + "</li>";
        }).join("\n");

        return '<ul style="padding-left:15px;margin:0px;margin-bottom:15px;list-style-type: disc;">' +
          items +
          "</ul>";
      }

      return "";
    }).join("\n");
  }

  function renderListItem(lines) {
    return lines
      .filter(function (line) { return line.trim() !== ""; })
      .map(function (line) { return parseInline(line); })
      .join("<br>\n");
  }

  function parseMarkdown(markdown) {
    var lines = markdown.replace(/\r\n/g, "\n").split("\n");
    var blocks = [];
    var index = 0;

    while (index < lines.length) {
      var line = lines[index];
      var trimmed = line.trim();

      if (trimmed === "") {
        index += 1;
        continue;
      }

      var headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
      if (headingMatch) {
        blocks.push({
          type: "heading",
          level: headingMatch[1].length,
          text: headingMatch[2].trim()
        });
        index += 1;
        continue;
      }

      if (/^[-*]\s+/.test(trimmed)) {
        var items = [];

        while (index < lines.length) {
          var current = lines[index].trim();
          if (!/^[-*]\s+/.test(current)) {
            break;
          }

          var itemLines = [current.replace(/^[-*]\s+/, "")];
          index += 1;

          while (index < lines.length) {
            var continuation = lines[index];
            var continuationTrimmed = continuation.trim();

            if (continuationTrimmed === "") {
              var nextLine = lines[index + 1] || "";
              if (/^\s{2,}\S/.test(nextLine)) {
                index += 1;
                continue;
              }
              break;
            }

            if (/^\s{2,}\S/.test(continuation)) {
              itemLines.push(continuationTrimmed);
              index += 1;
              continue;
            }

            break;
          }

          items.push(itemLines);

          while (index < lines.length && lines[index].trim() === "") {
            var upcoming = lines[index + 1] || "";
            if (/^[-*]\s+/.test(upcoming.trim())) {
              index += 1;
              break;
            }
            index += 1;
          }
        }

        blocks.push({ type: "list", items: items });
        continue;
      }

      var paragraphLines = [trimmed];
      index += 1;

      while (index < lines.length) {
        var next = lines[index].trim();
        if (next === "" || /^(#{1,3})\s+/.test(next) || /^[-*]\s+/.test(next)) {
          break;
        }

        paragraphLines.push(next);
        index += 1;
      }

      blocks.push({
        type: "paragraph",
        text: paragraphLines.join(" ")
      });
    }

    return blocks;
  }

  function limitFirstList(blocks, limit) {
    var listLimited = false;
    return blocks.map(function (block) {
      if (!listLimited && block.type === "list") {
        listLimited = true;
        return {
          type: "list",
          items: block.items.slice(0, limit)
        };
      }
      return block;
    });
  }

  function parseInline(text) {
    var escapedTokens = [];
    var html = escapeHtml(text).replace(/\\([\\`*[\]()])/g, function (_, character) {
      var token = "__ESCAPED_" + escapedTokens.length + "__";
      escapedTokens.push({ token: token, character: character });
      return token;
    });

    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
    html = html.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    html = html.replace(/\*([^*]+)\*/g, "<i>$1</i>");

    escapedTokens.forEach(function (item) {
      html = html.split(item.token).join(item.character);
    });

    return html;
  }

  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  async function fetchText(url) {
    var response;
    try {
      response = await fetch(url, { cache: "no-cache" });
    } catch (error) {
      throw new Error(
        "Network error while loading " + url + ". " +
        "Open this site via http(s), not file://."
      );
    }

    if (!response.ok) {
      throw new Error("Failed to load " + url + " (" + response.status + ")");
    }
    return response.text();
  }

  function renderFatalError(error) {
    var target = document.getElementById("page-content");
    if (!target) {
      return;
    }

    target.innerHTML =
      '<div class="row" style="margin-top: 10px">' +
      '<div class="col-md-12">' +
      '<p class="header-font">Content Error</p>' +
      '<p class="text-justify">Unable to load markdown content. ' +
      escapeHtml(String(error && error.message ? error.message : error)) +
      "</p>" +
      "</div></div>";
  }
}());
