package main

import (
	"fmt"
	"mime"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/mattermost/mattermost-server/plugin"
)

func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	switch {
	case r.URL.Path == "/hello":
		p.handleHello(w, r)
	case strings.HasPrefix(r.URL.Path, "/"):
		p.handleAssets(w, r)
	default:
		http.NotFound(w, r)
	}
}

func (p *Plugin) handleHello(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello World!"))
}

func (p *Plugin) handleAssets(w http.ResponseWriter, r *http.Request) {
	bundlePath, err := p.API.GetBundlePath()
	if err != nil {
		p.API.LogWarn("failed to get bundle path", "error", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Cache-Control", "public, max-age=604800")
	path := r.URL.Path[len("/"):]
	p.API.LogInfo(filepath.Join(bundlePath, "assets", path))

	t := mime.TypeByExtension(filepath.Ext(path))
	w.Header().Set("Content-Security-Policy", "script-src 'self' 'unsafe-eval'; object-src 'self'")
	w.Header().Set("Content-Type", t)
	http.ServeFile(w, r, filepath.Join(bundlePath, "assets", path))
	p.API.LogInfo(t, "header", fmt.Sprintf("%#v", w.Header()))
}
