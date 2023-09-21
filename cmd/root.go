package cmd

import (
	"how/internal/tldr"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:     "how command",
	Example: "how tar",
	Short:   "Learn how to use a CLI app",
	Args:    cobra.ArbitraryArgs,
	Aliases: []string{"how view"},
	Version: "v3.1.0",
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) == 0 {
			_ = cmd.Help()
			os.Exit(1)
			return
		}

		tldr.OnBoot()

		viewCmd.Run(cmd, args)
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}
