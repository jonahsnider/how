function __how_clean_doc
    # 1. `example` -> ```\nexample\n```
    # 2. - Heading -> ## Heading
    # 3. {{ and }} -> (removed)
    cat \
        | string replace -ra '^`(.*)`$' '```\n$1\n```' \
        | string replace -ra '^- (.*)' '## $1' \
        | string replace -ra '\{\{|\}\}' ''
end
