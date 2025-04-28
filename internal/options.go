package internal

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"time"
)

type baseOptions struct {
	VersionNumber int64 `json:"versionNumber"`
}

type optionsV1 struct {
	VersionNumber int64  `json:"versionNumber"`
	GlowVersion   string `json:"glowVersion"`
}

type optionsV2 struct {
	VersionNumber int64  `json:"versionNumber"`
	GlowVersion   string `json:"glowVersion"`
	LastRefresh   int64  `json:"lastRefresh"`
}

type optionsV3 struct {
	VersionNumber int64 `json:"versionNumber"`
	LastRefresh   int64 `json:"lastRefresh"`
}

type optionsLatest = optionsV3

type Options struct {
	VersionNumber uint8
	LastRefresh   time.Time
}

var defaultOptions = Options{
	VersionNumber: 3,
	LastRefresh:   time.Unix(0, 0),
}

func (o *Options) Flush() error {
	oSerializable := optionsLatest{
		VersionNumber: int64(o.VersionNumber),
		LastRefresh:   o.LastRefresh.Unix(),
	}

	// Serialize and write to disk
	s, err := json.Marshal(oSerializable)
	if err != nil {
		fmt.Println("Failed to serialize options.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	f, err := os.OpenFile(OptionsPath, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0755)

	if err != nil {
		fmt.Println("Failed to open options file for writing.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	//nolint:errcheck
	defer f.Close()

	_, err = f.Write(s)
	if err != nil {
		fmt.Println("Failed to write to options file.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	return nil
}

func (o *optionsV1) upgrade() *optionsLatest {
	ov2 := &optionsV2{
		VersionNumber: int64(defaultOptions.VersionNumber),
		GlowVersion:   o.GlowVersion,
		LastRefresh:   0,
	}
	return ov2.upgrade()
}

func (o *optionsV2) upgrade() *optionsLatest {
	return &optionsV3{
		VersionNumber: int64(defaultOptions.VersionNumber),
		LastRefresh:   o.LastRefresh,
	}
}

func Load() *Options {
	f, err := os.Open(OptionsPath)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			err = defaultOptions.Flush()
			if err != nil {
				fmt.Println("Failed to save default options.")
				fmt.Fprintln(os.Stderr, err)
				os.Exit(1)
			}
			return &defaultOptions
		}

		fmt.Println("Failed to open options file for reading.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	//nolint:errcheck
	defer f.Close()

	var o baseOptions
	decoder := json.NewDecoder(f)
	err = decoder.Decode(&o)
	if err != nil {
		fmt.Println("Failed to decode options file.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	// Reset file read position
	_, _ = f.Seek(0, 0)

	var oLatest *optionsLatest

	switch o.VersionNumber {
	case 1:
		var ov1 *optionsV1
		err = decoder.Decode(&ov1)
		if err != nil {
			fmt.Println("Failed to decode options file as v1 format.")
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		oLatest = ov1.upgrade()
	case 2:
		var ov2 *optionsV2
		err = decoder.Decode(&ov2)
		if err != nil {
			fmt.Println("Failed to decode options file as v2 format.")
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		oLatest = ov2.upgrade()
	case 3:
		var ov3 *optionsV3
		err = decoder.Decode(&ov3)
		if err != nil {
			fmt.Println("Failed to decode options file as v3 format.")
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		oLatest = ov3
	default:
		fmt.Println("Unknown options file version.")
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	return &Options{
		VersionNumber: uint8(oLatest.VersionNumber),
		LastRefresh:   time.UnixMilli(oLatest.LastRefresh),
	}
}
