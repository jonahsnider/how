function __how_refresh_or_download
    set -l marker "$HOW_CACHE_DIR/.last_refresh"
    set -l max_age 604800 # 7 days in seconds

    if not test -f "$marker"
        __how_force_refresh
        return
    end

    set -l mtime (command stat -c %Y "$marker" 2>/dev/null)
    or set mtime (command stat -f %m "$marker")

    set -l now (date +%s)
    set -l age (math "$now - $mtime")

    if test "$age" -gt "$max_age"
        __how_force_refresh &>/dev/null &
        disown
    end
end
