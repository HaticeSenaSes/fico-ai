$ErrorActionPreference = "Stop"

$runner = Join-Path $PSScriptRoot "..\scripts\python-runner.ps1"
if (-not (Test-Path $runner)) {
    throw "Runner bulunamadi: $runner"
}

& $runner -ArgsList @("-m", "pip", "install", "-r", (Join-Path $PSScriptRoot "requirements.txt"))
& $runner -ArgsList @("-m", "pytest", (Join-Path $PSScriptRoot "tests"))
