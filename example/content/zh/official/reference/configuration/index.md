---
title: 配置
sourceUrl: https://docs.example.com/en/latest/reference/configuration.html
---

Foo 会从当前目录读取一个可选的 `foo.toml`。每个键都有安全的默认值,所以文件里只需写下你想改动的规则。

## 配置文件

下面这份最小配置关闭了日期推断,并强制以 UTF-8 输出:

```toml
[types]
infer_dates = false

[output]
encoding = "utf-8"
```

## 选项

全部顶层选项及其默认值:

| 键 | 默认值 | 含义 |
| --- | --- | --- |
| `types.infer_dates` | `true` | 识别并规范化日期列。 |
| `types.money` | `true` | 解析带货币格式的数字。 |
| `output.encoding` | `"utf-8"` | 写出文件的编码。 |

## 环境变量

任何选项都可以在不改文件的情况下覆盖。变量名是把键路径大写、用下划线连接 —— 例如 `FOO_OUTPUT_ENCODING`。环境变量的优先级高于 `foo.toml`。
