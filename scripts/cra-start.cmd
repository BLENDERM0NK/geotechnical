@echo off
setlocal EnableExtensions EnableDelayedExpansion
REM Clear preload / module search noise that breaks Node before app code runs.
set "NODE_OPTIONS="
set "NODE_PATH="
set "NODE="
set "NODE_EXTRA_CA_CERTS="
set "NODE_CHANNEL_SERIALIZATION_MODE="
set "NODE_CHANNEL_FD="
set "NODE_UNIQUE_NAME="
cd /d "%~dp0.."
if not exist "scripts\run-react-scripts.cjs" (
  echo Missing scripts\run-react-scripts.cjs
  exit /b 1
)

set "NODE_EXE="
if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not defined NODE_EXE if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles(x86)%\nodejs\node.exe"

if not defined NODE_EXE (
  for /f "usebackq delims=" %%A in (`where.exe node 2^>nul`) do (
    echo %%A | findstr /i "\\Files\\" >nul
    if errorlevel 1 (
      if exist "%%A" (
        set "NODE_EXE=%%A"
        goto :runnode
      )
    )
  )
)

:runnode
if not defined NODE_EXE (
  echo.
  echo [ERROR] No usable node.exe found. A PATH entry may point at a missing portable Node
  echo         under this project ^(e.g. ...\Files\nodejs\^). Install Node from https://nodejs.org
  echo         and remove bad PATH / NODE_OPTIONS entries in Windows Environment Variables.
  echo.
  exit /b 1
)

"%SystemRoot%\System32\cmd.exe" /d /c echo [cra-start] Using node: "!NODE_EXE!"
"%SystemRoot%\System32\cmd.exe" /d /c echo [cra-start] NODE_OPTIONS="!NODE_OPTIONS!"
%SystemRoot%\System32\cmd.exe /d /c echo [cra-start] CWD="%CD%"
%SystemRoot%\System32\cmd.exe /d /c echo [cra-start] ARGS=%*
set "RUNNER=%CD%\scripts\run-react-scripts.cjs"
%SystemRoot%\System32\cmd.exe /d /c echo [cra-start] RUNNER="!RUNNER!"

 "!NODE_EXE!" "!RUNNER!" %*
exit /b %ERRORLEVEL%
