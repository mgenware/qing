package main

import (
	"fmt"

	"github.com/mgenware/j9/v2"
	"github.com/mgenware/qing/deploy/cmdlib"
)

var tunnel *j9.Tunnel

func init() {
	tunnel = j9.NewTunnel(j9.NewLocalNode(), j9.NewConsoleLogger())
}

func main() {
	rootDir := cmdlib.GetGitRootDir(tunnel)
	tunnel.CD(rootDir)

	fmt.Print("> Copying userland files...")
	tunnel.RunSync("cp -r ./userland/* ./build/qing_bundle/userland")

	fmt.Println("> Building server...")
	tunnel.CD(rootDir + "/server")
	tunnel.Run("sh", "./build.sh")

	fmt.Print("> Building web...")
	tunnel.CD(rootDir + "/web")
	tunnel.Run("dz", "b")
}
