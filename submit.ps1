param(
  [Parameter(Mandatory=$true, Position=0)]
  [string]$Name
)

$ErrorActionPreference = "Stop"

$endpoint = $env:WOPA_SUBMIT_URL
$password = $env:WORKSHOP_PASSWORD

if (-not $endpoint) { Write-Host "set `$env:WOPA_SUBMIT_URL (the Cloud Run URL we'll give you)"; exit 1 }
if (-not $password) { Write-Host "set `$env:WORKSHOP_PASSWORD (we'll tell you the value)"; exit 1 }

$slug = ($Name.ToLower() -replace "[^a-z0-9]+", "-").Trim("-")
$file = "pages/$slug.html"

if (-not (Test-Path $file)) {
  Write-Host "no page at $file"
  Write-Host "ask Claude to make one: 'Make me a bio page that fits this site's style. My name is $Name, my role is X, one thing about me is Y. Save it as $file.'"
  exit 1
}

$form = @{
  name     = $Name
  password = $password
  page     = Get-Item -Path $file
}

Invoke-RestMethod -Uri $endpoint -Method Post -Form $form
