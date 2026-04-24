Param(
    [Parameter(Mandatory = $false)]
    [string[]]$ArgsList = @("--version")
)

$ErrorActionPreference = "Stop"

function Resolve-PythonExe {
    $candidates = @(
        "$env:LocalAppData\Programs\Python\Python312\python.exe",
        "$env:LocalAppData\Programs\Python\Python311\python.exe",
        "$env:ProgramFiles\Python312\python.exe"
    )

    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) {
            return $candidate
        }
    }

    $cmd = Get-Command python -ErrorAction SilentlyContinue
    if ($null -ne $cmd) {
        return $cmd.Source
    }

    throw "Python executable bulunamadi. Once Python kurulumunu tamamla."
}

$pythonExe = Resolve-PythonExe
& $pythonExe @ArgsList
