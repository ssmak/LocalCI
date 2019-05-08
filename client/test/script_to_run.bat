cd i:/tmp/localci/client/helpers
node kill_process.js --port 80
cd i:/tmp/blank
git reset --hard
git config http.sslVerify false
git pull
npm install && npm start
