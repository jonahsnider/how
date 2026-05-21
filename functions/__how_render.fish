function __how_render
    set -l renderer (__how_detect_renderer)

    switch $renderer
        case glow
            glow -
        case leaf
            leaf -
        case bat
            bat -l markdown --plain --paging never
        case '*'
            cat
    end
end
