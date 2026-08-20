@test "version flag prints version" (how --version | string match -q "how v*") $status -eq 0

@test "help flag succeeds" (how --help >/dev/null) $status -eq 0

@test "help flag shows usage" (how --help | string collect) = (how -h | string collect)

@test "no args prints help and fails" (how >/dev/null 2>/dev/null) $status -eq 1

@test "self-documentation works" (how how | string match -q "*how*") $status -eq 0

set -g HOW_RENDERER cat

@test "how tar includes tar" (how tar | string match -q "*tar*") $status -eq 0

@test "how tar includes archive" (how tar | string match -qi "*archiv*") $status -eq 0

@test "nonexistent command fails" (how does_not_exist_xyz 2>/dev/null) $status -eq 1

set -l original_cache_dir $HOW_CACHE_DIR
set -l refresh_test_dir (mktemp -d)
set -g HOW_CACHE_DIR "$refresh_test_dir/cache"
mkdir -p "$HOW_CACHE_DIR/tldr"
touch -t 202001010000 "$HOW_CACHE_DIR/.last_refresh"

@test "background refresh starts successfully" (__how_refresh_or_download 2>"$refresh_test_dir/stderr") $status -eq 0
@test "background refresh does not print errors" (not test -s "$refresh_test_dir/stderr") $status -eq 0

sleep 1
set -g HOW_CACHE_DIR $original_cache_dir
rm -rf "$refresh_test_dir"
