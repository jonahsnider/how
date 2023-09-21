package tldr

import (
	"runtime"
)

// TLDR categories to use
var Categories = []string{"common", "linux"}

// Check OS kind and update categories based off that
func initCategories() {
	switch runtime.GOOS {
	case "darwin":
		Categories = append(Categories, "osx")
	case "windows":
		Categories = append(Categories, "windows")
	}
}

func OnBoot() {
	initCategories()
}
