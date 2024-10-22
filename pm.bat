@echo off
:: Cambiar directorio a la carpeta .pm2
cd C:\Users\sistemas10\.pm2

:: Restaurar procesos PM2
pm2 resurrect
