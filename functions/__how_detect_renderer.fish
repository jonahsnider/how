function __how_detect_renderer
    if set -q HOW_RENDERER
        echo $HOW_RENDERER
        return
    end

    for renderer in glow leaf bat
        if command -q $renderer
            echo $renderer
            return
        end
    end

    echo cat
end
