function __how_read_doc
    set -l cmd $argv[1]

    if test "$cmd" = how
        # Embedded self-documentation
        echo '# how

> Learn how to use CLI apps.
> More information: <https://github.com/jonahsnider/how>.

- Get typical usages of a command:

`how {{command}}`

- Refresh knowledge base:

`how refresh`'
        return 0
    end

    for category in (__how_categories)
        set -l p "$HOW_CACHE_DIR/tldr/pages/$category/$cmd.md"
        if test -f "$p"
            cat "$p"
            return 0
        end
    end

    return 1
end
