package cmd

import (
	"fmt"
	"how/internal/tldr/kb"
	"os"
	"strings"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(viewCmd)
}

var viewCmd = &cobra.Command{
	Use:     "view command",
	Example: "how view tar",
	Short:   "Learn how to use a CLI app",
	Args:    cobra.ArbitraryArgs,
	Run: func(cmd *cobra.Command, args []string) {
		cmdName := strings.Join(args, "-")

		kb.RefreshOrDownload()
		docs := kb.ReadCmdDocs(cmdName)

		if docs == "" {
			fmt.Fprintln(os.Stderr, "That command doesn't exist in the knowledge base (try running `how refresh`)")
			os.Exit(1)
		}

		fmt.Print(docs)
	},
}
