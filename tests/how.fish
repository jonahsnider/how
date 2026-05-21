@test "version flag prints version" (how --version | string match -q "how v*") $status -eq 0

@test "help flag succeeds" (how --help >/dev/null) $status -eq 0

@test "help flag shows usage" (how --help | string collect) = (how -h | string collect)

@test "no args prints help and fails" (how >/dev/null 2>/dev/null) $status -eq 1

@test "self-documentation works" (how how | string match -q "*how*") $status -eq 0

set -g HOW_RENDERER cat

@test "how tar includes tar" (how tar | string match -q "*tar*") $status -eq 0

@test "how tar includes archive" (how tar | string match -qi "*archiv*") $status -eq 0

@test "nonexistent command fails" (how does_not_exist_xyz 2>/dev/null) $status -eq 1
