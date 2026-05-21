function how -d "Learn how to use a CLI app"
    argparse -n how v/version h/help -- $argv
    or return

    if set -q _flag_version
        echo "how v4.0.0"
        return 0
    end

    if set -q _flag_help
        __how_help
        return 0
    end

    if test (count $argv) -eq 0
        __how_help
        return 1
    end

    switch $argv[1]
        case refresh
            __how_force_refresh
        case view
            if test (count $argv) -lt 2
                echo "Usage: how view <command>" >&2
                return 1
            end
            __how_refresh_or_download
            __how_view $argv[2..]
        case '*'
            __how_refresh_or_download
            __how_view $argv
    end
end
