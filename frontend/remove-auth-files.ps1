# Remove auth-related files
$filesToRemove = @(
    "src/views/Login.vue",
    "src/views/LoginView.vue",
    "src/views/Register.vue",
    "src/views/RegisterView.vue",
    "src/views/Dashboard.vue",
    "src/views/DashboardView.vue",
    "src/utils/auth.js",
    "src/store/auth.js"
)

foreach ($file in $filesToRemove) {
    $fullPath = Join-Path -Path $PSScriptRoot -ChildPath $file
    if (Test-Path $fullPath) {
        Remove-Item -Path $fullPath -Force
        Write-Host "Removed: $file"
    } else {
        Write-Host "Not found: $file"
    }
}

Write-Host "Auth file cleanup complete!"
