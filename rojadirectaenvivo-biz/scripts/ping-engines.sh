#!/usr/bin/env bash
set -e
SITEMAP="https://rojadirectaenvivo.biz/sitemap.xml"
curl -s "https://www.google.com/ping?sitemap=${SITEMAP}" -o /dev/null -w "Google ping: %{http_code}\n"
curl -s "https://www.bing.com/ping?sitemap=${SITEMAP}" -o /dev/null -w "Bing ping: %{http_code}\n"
