function __how_build_completions_cache
    set -l files
    for category in (__how_categories)
        set -l dir $HOW_CACHE_DIR/tldr/pages/$category
        test -d $dir; and set -a files $dir/*.md
    end

    awk 'FNR==3 { sub(/^> /, ""); desc=$0; name=FILENAME; sub(/.*\//, "", name); sub(/\.md$/, "", name); print name "\t" desc; nextfile }' $files >"$HOW_CACHE_DIR/.completions"
end
