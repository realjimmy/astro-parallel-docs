---
title: Configuration
sourceUrl: https://docs.example.com/en/latest/reference/configuration.html
---

Foo reads an optional `foo.toml` from the current directory. Every key has a
safe default, so the file only needs the rules you want to change.

## The config file

A minimal configuration disables date inference and forces UTF-8 output:

```toml
[types]
infer_dates = false

[output]
encoding = "utf-8"
```

## Options

The full set of top-level options and their defaults:

| Key | Default | Meaning |
| --- | --- | --- |
| `types.infer_dates` | `true` | Detect and normalize date columns. |
| `types.money` | `true` | Parse currency-formatted numbers. |
| `output.encoding` | `"utf-8"` | Encoding of the written file. |

## Environment variables

Any option can be overridden without touching the file. The variable name is the
uppercased key path joined with underscores — `FOO_OUTPUT_ENCODING`, for example.
Environment variables win over `foo.toml`.
