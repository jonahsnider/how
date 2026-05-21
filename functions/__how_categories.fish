function __how_categories
    echo common
    echo linux

    switch (uname -s)
        case Darwin
            echo osx
        case 'MINGW*' 'MSYS*' 'CYGWIN*'
            echo windows
    end
end
