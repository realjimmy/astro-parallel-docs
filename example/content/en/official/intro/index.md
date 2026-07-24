---
title: Introduction
sourceUrl: https://docs.example.com/en/latest/intro/
---

Foo is a small command-line tool for turning messy CSV exports into clean,
typed tables. It reads a file, infers a schema, and writes back something your
database will actually accept — with no configuration for the common case.

## What Foo does

Point Foo at a file and it does three things, in order:

- **Infers types** — dates, integers, booleans, and money columns are detected
  from the data itself, not guessed from the header names.
- **Normalizes values** — trailing spaces, mixed line endings, and stray BOM
  markers are stripped so downstream tools stop complaining.
- **Reports what changed** — every coercion is logged, so a surprising result is
  always traceable to a rule you can see.

## Who it's for

Foo is for people who receive data they did not produce: analysts cleaning
vendor exports, engineers backfilling a table, anyone who has ever opened a
"UTF-8" file that was not. If that sounds familiar, the [quick start](../guide/quickstart.html) takes about a minute.
