# Build (Linux/WSL or Cloudflare CI) and deploy Victoria Boiker to Cloudflare Pages.
# Local Windows: next-on-pages needs bash — use Cloudflare Git builds or WSL for pages:build.
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

$map = @{}
Get-Content -LiteralPath '.env.local' | ForEach-Object {
  $line = $_.Trim()
  if ($line -eq '' -or $line.StartsWith('#')) { return }
  $idx = $line.IndexOf('=')
  if ($idx -lt 1) { return }
  $map[$line.Substring(0, $idx).Trim()] = $line.Substring($idx + 1).Trim()
}

foreach ($name in @('NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
  if (-not $map.ContainsKey($name) -or [string]::IsNullOrWhiteSpace($map[$name])) {
    throw "Missing $name in .env.local"
  }
  Set-Item -Path "env:$name" -Value $map[$name]
}

foreach ($optional in @('XAI_API_KEY', 'OPENAI_API_KEY')) {
  if ($map.ContainsKey($optional) -and -not [string]::IsNullOrWhiteSpace($map[$optional])) {
    Set-Item -Path "env:$optional" -Value $map[$optional]
  }
}

Write-Output 'Building for Cloudflare Pages (next build + @cloudflare/next-on-pages)...'
npm run build:cf
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output 'Deploying .vercel/output/static to Cloudflare Pages...'
& npx wrangler pages deploy .vercel/output/static --project-name=victoria-boiker
exit $LASTEXITCODE