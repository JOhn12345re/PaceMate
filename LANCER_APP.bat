@echo off
echo ========================================
echo    🏃‍♂️ PaceMate - Lanceur Automatique
echo ========================================
echo.

REM Vérifier si Python est installé
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Python detecte - Lancement du serveur...
    echo.
    echo 🌐 L'application va s'ouvrir sur http://localhost:8000
    echo.
    echo 💡 Pour arreter le serveur : Ctrl+C
    echo ========================================
    echo.
    start http://localhost:8000
    python -m http.server 8000
    goto :end
)

REM Si Python n'est pas installé, essayer d'ouvrir directement
echo ⚠️ Python non detecte
echo.
echo 📂 Ouverture directe du fichier HTML...
echo.
start index.html

:end
echo.
echo ========================================
echo    Merci d'avoir utilise PaceMate ! 🎉
echo ========================================
pause

