Dim shell, fso, folder
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
folder = fso.GetParentFolderName(WScript.ScriptFullName)

shell.Run """C:\Program Files (x86)\node.exe"" """ & folder & "\serve-node.mjs""", 0, False
