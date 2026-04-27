Dim shell
Set shell = CreateObject("WScript.Shell")
shell.Run """C:\Users\wee_w\AppData\Local\Programs\Python\Python312\pythonw.exe"" """ & Chr(34) & CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & "\serve.py" & Chr(34), 0, False
