
set old=C:\Users\Dell\AppData\Roaming\Adobe\Dreamweaver CC 2014.1\en_US\Configuration\Shared\EZ\compare.old.txt
set new=C:\Users\Dell\AppData\Roaming\Adobe\Dreamweaver CC 2014.1\en_US\Configuration\Shared\EZ\compare.new.txt

start "" /d "C:\Program Files (x86)\WinMerge\" WinMergeU.exe /dl "OLD / ACTUAL" /dr "NEW EXPECTED" "%old%" "%new%"


