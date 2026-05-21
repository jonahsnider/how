function __how_refresh_or_download
    set -l marker "$HOW_CACHE_DIR/.last_refresh"
    set -l max_age 604800 # 7 days in seconds

    if not test -f "$marker"
        __how_force_refresh
        return
    end

    # Get mtime of marker file
    set -l mtime
    switch (uname -s)
        case Darwin
            set mtime (stat -f %m "$marker")
        case '*'
            set mtime (stat -c %Y "$marker")
    end

    set -l now (date +%s)
    set -l age (math "$now - $mtime")

    if test "$age" -gt "$max_age"
        __how_force_refresh
    end
end
