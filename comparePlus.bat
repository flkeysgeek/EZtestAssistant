set old=%1
set new=%2
set dl=%3
set dr=%4
@echo off

start "" /d "C:\Program Files (x86)\WinMerge\" WinMergeU.exe /dl %dl% /dr %dr% %old% %new%
rem start "" /d "C:\Program Files (x86)\WinMerge\" WinMergeU.exe %old% %new%


