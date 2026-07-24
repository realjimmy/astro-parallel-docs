---
title: Quick start
sourceUrl: https://docs.example.com/en/latest/guide/quickstart.html
---

This guide installs Foo and cleans a first file. It assumes a recent Node.js is
on your machine; nothing else is required.

## Install

Install the CLI globally with npm:

```bash
npm install -g foo-cli
```

## Clean a file

Run `foo` against any CSV. The cleaned table is written next to it with a
`.clean.csv` suffix, and a summary of every change is printed:

```bash
foo clean export.csv
```

## Next steps

The defaults suit most exports, but every rule can be turned off or tuned. See
[Configuration](../reference/configuration.html) for the full list.
