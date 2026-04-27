import http.server, os, sys

PORT = 5500
ROOT = os.path.join(os.path.dirname(__file__), "Essential")

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # silent

with http.server.HTTPServer(("localhost", PORT), NoCacheHandler) as httpd:
    print(f"  Serving at http://localhost:{PORT}/login.html")
    print("  Press Ctrl+C to stop.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
