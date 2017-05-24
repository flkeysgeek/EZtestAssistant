@echo off
set EZ_PATH=%cd%\EZprototypes.js
SET RZ_PATH=..\..\..\revize\RZprototypes.js
set EASY_PATH=C:\Revize\www\revize\UTIL\EASY\js\EASY.prototypes.js

dir EZprototypes.js 1>nul 2>nul
if errorlevel 1 goto :MAKE-LINK

dir EZprototypes.js /a:l 1>nul 2>nul
if errorlevel 1 goto :CHECK-FOR-UPDATES

echo _________________________________________________________________
echo.
echo EZprototypes.js is link -- no updates
echo.
echo _________________________________________________________________
pause
goto :EOF

::----------------
:CHECK-FOR-UPDATES
::----------------
echo n | comp EZprototypes.js "C:\Revize\www\revize\UTIL\EASY\js\EASY.prototypes.js"
echo.
echo.
set update_path=%EASY_PATH%
if errorlevel 1 goto :HAS-UPDATES


echo _________________________________________________________________
echo.
echo EZprototypes.js has no updates -- convert to link

::----------------
:MAKE-LINK
::----------------
echo.
if exist EZprototypes.js del EZprototypes.js
mklink EZprototypes.js "C:\Revize\www\revize\UTIL\EASY\js\EASY.prototypes.js"
attrib EZprototypes.js +r /l
echo.
echo _________________________________________________________________
pause
goto :EOF


::----------------
:HAS-UPDATES
::----------------
echo _________________________________________________________________
echo.
echo EZprototypes.js contains changes NOT in:
echo.
echo       %update_path%
echo.
echo _________________________________________________________________
CHOICE /M "RUN winmerge"
if errorlevel 2 goto :EOF

set winmerge_args=/r /s /dl "EASY" "%EZ_PATH%" "%update_path%"

start "" /d "C:\Program Files (x86)\WinMerge\" WinMergeU.exe %winmerge_args:?= %

goto :EOF
