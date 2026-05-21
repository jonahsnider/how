# How

[![Build Status](https://github.com/jonahsnider/how/workflows/CI/badge.svg)](https://github.com/jonahsnider/how/actions)

Learn how to use CLI apps.

![A screenshot of `how` being used inside a terminal](./demo.png)

## Installation

Using [Fisher](https://github.com/jorgebucaran/fisher):

```fish
fisher install jonahsnider/how
```

## Usage

```sh
how <app>
```

### Example

Learn how to use `tar`:

```sh
how tar
```

### Configuration

The markdown renderer is auto-detected in this order: [glow](https://github.com/charmbracelet/glow) > [leaf](https://leaf.rivolink.mg/) > [bat](https://github.com/sharkdp/bat) > `cat`. To override:

```fish
set -Ux HOW_RENDERER glow
```

To change the cache directory (default `~/.cache/how`):

```fish
set -Ux HOW_CACHE_DIR ~/my/custom/path
```
