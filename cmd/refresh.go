package cmd

import (
	"how/internal/tldr/kb"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(refreshCmd)
}

var refreshCmd = &cobra.Command{
	Use:   "refresh",
	Short: "Refresh the downloaded knowledge base",
	Run: func(cmd *cobra.Command, args []string) {
		kb.ForceRefreshOrDownload()
	},
}
