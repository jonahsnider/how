package kb

import (
	"errors"
	"fmt"
	"how/internal"
	"how/internal/docs"
	"how/internal/tldr"
	"io"
	"os"
	"path/filepath"

	"regexp"

	"github.com/charmbracelet/glamour"
	"golang.org/x/term"
)

// Returns an empty string if the command doesn't exist
func readCmdDocs(cmd string) string {
	if cmd == "how" {
		return docs.HowCmdDocs
	}

	for _, category := range tldr.Categories {
		p := filepath.Join(internal.TldrPath, "pages", category, cmd+".md")

		f, err := os.Open(p)

		if err != nil {
			if errors.Is(err, os.ErrNotExist) {
				continue
			}

			fmt.Println("Failed to read command doc file.")
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}

		//nolint:errcheck
		defer f.Close()

		b, err := io.ReadAll(f)

		if err != nil {
			fmt.Println("Failed to read command doc file.")
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}

		return string(b)
	}

	return ""
}

func fmtCmdDocs(cmdDocs string) string {
	termWidth, _, _ := term.GetSize(0)

	r, _ := glamour.NewTermRenderer(
		glamour.WithAutoStyle(),
		glamour.WithWordWrap(termWidth),
	)

	s, err := r.Render(cmdDocs)

	if err != nil {
		fmt.Println("Failed to format command doc.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	return s
}

var examplesRe = regexp.MustCompile("(?m)^`(.*)`")
var exampleHeadingsRe = regexp.MustCompile(`(?m)^- (.*)`)
var doubleBracketsRe = regexp.MustCompile(`(?m){{|}}`)

func cleanCmdDocs(cmdDocs string) string {
	cleaned := examplesRe.ReplaceAllString(cmdDocs, "```\n$1\n```")
	cleaned = exampleHeadingsRe.ReplaceAllString(cleaned, "## $1")
	cleaned = doubleBracketsRe.ReplaceAllString(cleaned, "")
	return cleaned
}

// Returns an empty string if the command doesn't exist
func ReadCmdDocs(cmd string) string {
	cmdDocs := readCmdDocs(cmd)

	if cmdDocs == "" {
		return ""
	}

	cleaned := cleanCmdDocs(cmdDocs)

	return fmtCmdDocs(cleaned)
}
