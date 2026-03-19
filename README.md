# Homepage Maintenance

This site renders markdown files from [`content/`](./content) directly in the browser.

## Workflow

1. Edit the relevant markdown file in `content/`.
2. Refresh the page. The update is reflected immediately.
3. Deploy with `./sync.sh`.

For local preview, run:

```bash
./start-site.sh
```

This starts a local HTTP server and opens `http://127.0.0.1:8000/index.html`.
Do not open the html files directly via `file://`.

## Content Files

- `content/about.md`: homepage about section
- `content/news.md`: news entries
- `content/publications.md`: publication list
- `content/projects.md`: projects page
- `content/team.md`: students and team page
- `content/services.md`: service page
- `content/teaching.md`: teaching page
- `content/hiring.md`: PhD hiring page

## Supported Markdown

The runtime renderer supports a small markdown subset:

- Paragraphs
- `###` subheadings
- Bulleted lists with `-`
- Links like `[text](url)`
- Bold like `**text**`
- Italic like `*text*`
- Inline code like `` `text` ``
- Escaped punctuation like `\*`

For multi-line list items such as publications, indent continuation lines by two spaces.
