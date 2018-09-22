@echo off

rem Parse all the sass files
call sass --no-source-map --style=compressed res/assets/scss/index.scss:res/assets/css/index.css >nul 2>&1
call sass --no-source-map --style=compressed res/assets/scss/login.scss:res/assets/css/login.css >nul 2>&1

rem Cleanup and create the /test folder
rmdir /s /q ".\test\" >nul 2>&1
mkdir ".\test\"

rem Copy the ijo to /test/panel
echo .git\ > exclude.txt
echo \test\ >> exclude.txt
xcopy ".\*" "..\test\panel\" /exclude:.\exclude.txt /d /h /y /e >nul 2>&1
xcopy "..\test\panel\*.*" ".\test\panel\" /d /h /y /e >nul 2>&1
rmdir /s /q "..\test\panel\" >nul 2>&1
del ".\exclude.txt" >nul 2>&1
rem Ask user if machine needs to be installed
rem set /P machine="Do you need a machine to be installed (y/n): "

rem if "%machine%"=="y" (
rem 	echo "A machine was intalled."
rem )

rem Install the ijo command
pushd ".\test\panel\"
call npm install -g >nul 2>&1
popd

rem Start IJO
pushd "./test"
ijo start
popd