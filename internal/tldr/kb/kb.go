package kb

import (
	"errors"
	"fmt"
	"how/internal"
	"os"
	"os/exec"
	"time"
)

func Download() {
	err := os.Mkdir(internal.TldrPath, os.ModePerm)

	if err != nil {
		if os.IsExist(err) {
			return
		}

		fmt.Println("Failed to create knowledge base directory.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	cmd := exec.Command("git", "clone", "https://github.com/tldr-pages/tldr.git", internal.TldrPath)

	err = cmd.Run()

	if err != nil {
		fmt.Println("Failed to download knowledge base.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	o := internal.Load()
	o.LastRefresh = time.Now()
	err = o.Flush()
	if err != nil {
		fmt.Println("Failed to save knowledge base.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func Refresh() {
	cmd := exec.Command("git", "pull")

	cmd.Dir = internal.TldrPath

	err := cmd.Run()

	if err != nil {
		fmt.Println("Failed to refresh knowledge base.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	o := internal.Load()
	o.LastRefresh = time.Now()
	err = o.Flush()
	if err != nil {
		fmt.Println("Failed to save knowledge base.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

var maxAgeBeforeRefresh = time.Duration(7 * 24 * time.Hour)

func exists() bool {
	_, err := os.Stat(internal.TldrPath)

	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return false
		}

		fmt.Println("Failed to check if knowledge base exists.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	return true
}

func RefreshOrDownload() {
	o := internal.Load()

	if time.Since(o.LastRefresh) > maxAgeBeforeRefresh {

		ForceRefreshOrDownload()
	}
}

func ForceRefreshOrDownload() {
	if exists() {
		Refresh()
	} else {
		Download()
	}
}
