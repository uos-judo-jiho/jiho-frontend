# npm run sitemap
echo "npm run sitemap"
npm run sitemap

# npm run build
echo "npm run build"
npm run build

# generate sitemap
echo "generate sitemap"
cat <<EOF >"build/server.json"
{
  "rewrites": [
    { "source": "/", "destination": "/200.html" },
    { "source": "/index", "destination": "/index.html" }
  ]
}
EOF

# server json build
echo "server json build"
serve -c server.json build
