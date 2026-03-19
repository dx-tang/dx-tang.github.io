# CV Maintenance

The CV PDF is generated from markdown files in [`content/`](./content).

## Workflow

1. Edit the relevant markdown file in `CV/content/`.
2. Run `./build.sh`.

`./build.sh` now regenerates [`cv_tang.tex`](./cv_tang.tex) from markdown and then compiles [`cv_tang.pdf`](./cv_tang.pdf).

## Section Files

- `research-areas.md`
- `employment.md`
- `education.md`
- `publications.md`
- `services.md`
- `teaching.md`
- `industry.md`

## Markdown Formats

Tabbed sections such as employment and education use bullets with pipe-delimited fields:

```md
- 2024-present | Assistant Professor - University of Texas, Austin
  Advisor: ...
```

Publications use one bullet per publication. The first line is `title | authors`, and the next indented line is the venue:

```md
- Paper Title | Author 1, **Author 2**
  **Conference 2025**
```

Publication numbers are generated automatically in descending order from the total count down to `1`.
