call npx prisma generate > setup_log.txt 2>&1
echo "Generate done" >> setup_log.txt
call npx prisma db push >> setup_log.txt 2>&1
echo "Push done" >> setup_log.txt
call node prisma/seed.js >> setup_log.txt 2>&1
echo "Seed done" >> setup_log.txt
Dir prisma >> setup_log.txt
