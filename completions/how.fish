complete -c how -f

complete -c how -n __fish_use_subcommand -a view -d "Learn how to use a CLI app"
complete -c how -n __fish_use_subcommand -a refresh -d "Refresh the downloaded knowledge base"

# Complete command names from the cached completions file (built on refresh)
complete -c how -n "not __fish_seen_subcommand_from refresh" -a "(
    set -l cache \$HOW_CACHE_DIR/.completions
    test -f \$cache; and cat \$cache
)" -d ""
