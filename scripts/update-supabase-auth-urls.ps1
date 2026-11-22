# Update Supabase Auth Site URL and redirect allow list.
# Needs SUPABASE_ACCESS_TOKEN from https://supabase.com/dashboard/account/tokens
# Optional: SITE_URL and EXTRA_REDIRECT_URLS (comma-separated).
param(
  [string]$ProjectRef = 'cewjpjzuuvyudbtwzhxy',
  [string]$SiteUrl = $(if ($env:SITE_URL) { $env:SITE_URL } else { 'http://localhost:3000' })
)

$ErrorActionPreference = 'Stop'

$token = $env:SUPABASE_ACCESS_TOKEN
if (-not $token) {
  throw 'Set SUPABASE_ACCESS_TOKEN (Supabase dashboard → Account → Access Tokens).'
}

$defaults = @(
  'http://localhost:3000/**'
  'http://localhost:3001/**'
  'https://*.pages.dev/**'
  'https://*.workers.dev/**'
)

$extra = @()
if ($env:EXTRA_REDIRECT_URLS) {
  $extra = $env:EXTRA_REDIRECT_URLS -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ }
}

$uris = ($defaults + $extra) | Select-Object -Unique

$body = @{
  site_url        = $SiteUrl
  uri_allow_list  = ($uris -join ',')
} | ConvertTo-Json -Compress

$headers = @{
  Authorization = "Bearer $token"
  'Content-Type'  = 'application/json'
}

$uri = "https://api.supabase.com/v1/projects/$ProjectRef/config/auth"
$response = Invoke-RestMethod -Method Patch -Uri $uri -Headers $headers -Body $body
Write-Output "Updated Auth URLs for project $ProjectRef"
Write-Output "site_url: $($response.site_url)"
if ($response.uri_allow_list) {
  Write-Output "uri_allow_list: $($response.uri_allow_list)"
}