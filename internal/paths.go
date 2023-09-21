package internal

import (
	"os"
	"path/filepath"
)

var homeDir, _ = os.UserHomeDir()

var CacheDir = filepath.Join(homeDir, ".cache", "how")
var OptionsPath = filepath.Join(CacheDir, "options.json")
var TldrPath = filepath.Join(CacheDir, "tldr")
