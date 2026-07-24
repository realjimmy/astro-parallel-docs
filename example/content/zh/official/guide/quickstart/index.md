---
title: 快速上手
sourceUrl: https://docs.example.com/en/latest/guide/quickstart.html
---

本指南会安装 Foo 并清洗第一个文件。它假设你的机器上装有较新的 Node.js,除此之外别无要求。

## 安装

用 npm 全局安装 CLI:

```bash
npm install -g foo-cli
```

## 清洗文件

对任意 CSV 运行 `foo`。清洗后的表格会以 `.clean.csv` 后缀写在原文件旁边,并打印出每一处改动的摘要:

```bash
foo clean export.csv
```

## 下一步

默认设置适用于大多数导出文件,但每条规则都可以关闭或调整。完整列表见[配置](../reference/configuration.html)。
