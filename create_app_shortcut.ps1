$shell = New-Object -ComObject WScript.Shell
$desktopPath = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'TRUTHMODE Planner App.lnk')
$exePath = 'C:\Users\dpetr\OneDrive\Desktop\CALENDAR-APP\dist\TRUTHMODE Planner-1.0.0.exe'

$shortcut = $shell.CreateShortcut($desktopPath)
$shortcut.TargetPath = $exePath
$shortcut.WorkingDirectory = 'C:\Users\dpetr\OneDrive\Desktop\CALENDAR-APP\dist'
$shortcut.Description = "TRUTHMODE Executive Planner 2026 - Desktop App"
$shortcut.IconLocation = 'C:\Users\dpetr\OneDrive\Desktop\CALENDAR-APP\assets\icon.png'
$shortcut.WindowStyle = 1
$shortcut.Save()

Write-Host "Shortcut created: $desktopPath" -ForegroundColor Green

