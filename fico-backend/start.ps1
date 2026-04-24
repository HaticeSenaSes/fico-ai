$ErrorActionPreference = "Stop"

$python = "$env:LocalAppData\Programs\Python\Python312\python.exe"
if (-not (Test-Path $python)) {
    $python = "python"
}

& $python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
