function __how_view
    set -l cmd_name (string join "-" -- $argv)

    __how_read_doc $cmd_name >/dev/null
    if test $status -ne 0
        echo "That command doesn't exist in the knowledge base (try running 'how refresh')" >&2
        return 1
    end

    __how_read_doc $cmd_name | __how_clean_doc | __how_render
end
