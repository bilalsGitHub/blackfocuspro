#!/bin/bash

# Find and modify all HTML files in dist folder
find dist -name "*.html" -type f -exec sed -i 's/<head>/<head>\n    <meta name="google-adsense-account" content="ca-pub-3388307743726055">\n    <script async src="https:\/\/pagead2.googlesyndication.com\/pagead\/js\/adsbygoogle.js?client=ca-pub-3388307743726055" crossorigin="anonymous"><\/script>/g' {} \;

echo "✅ Google AdSense tags injected into HTML files"
