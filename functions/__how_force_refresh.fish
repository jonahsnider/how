function __how_force_refresh
    set -l tldr_path "$HOW_CACHE_DIR/tldr"

    if test -d "$tldr_path"
        echo "Refreshing knowledge base..."
        git -C "$tldr_path" pull --quiet
        or begin
            echo "Failed to refresh knowledge base." >&2
            return 1
        end
    else
        echo "Downloading knowledge base..."
        mkdir -p "$HOW_CACHE_DIR"
        git clone --quiet https://github.com/tldr-pages/tldr.git "$tldr_path"
        or begin
            echo "Failed to download knowledge base." >&2
            return 1
        end
    end

    touch "$HOW_CACHE_DIR/.last_refresh"
    __how_build_completions_cache
end
