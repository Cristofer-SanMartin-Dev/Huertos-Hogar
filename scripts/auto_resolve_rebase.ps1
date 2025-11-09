Set-Location 'c:\Users\crisa\OneDrive\Escritorio\Huertos-Hogar'
Write-Host 'Starting auto-resolve (accepting theirs) loop...'

while ($true) {
    $u = git diff --name-only --diff-filter=U 2>$null
    if (-not $u) {
        Write-Host 'No unmerged files remaining.'
        break
    }
    $files = $u -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
    Write-Host 'Conflicted files:'
    $files | ForEach-Object { Write-Host " - $_" }
    foreach ($f in $files) {
        git checkout --theirs -- "$f" 2>$null
        git add "$f"
    }
    git add -A
    if (Test-Path '.git/COMMIT_EDITMSG') {
        git commit -F .git/COMMIT_EDITMSG 2>$null | Out-Null
    }
    Write-Host 'Attempting git rebase --continue...'
    $res = git rebase --continue 2>&1
    Write-Host $res
    Start-Sleep -Milliseconds 200
}

Write-Host 'Final status:'
git status --porcelain --branch
cd 'c:\Users\crisa\OneDrive\Escritorio\Huertos-Hogar\huerto-hogar-react'
npm install
npm run build