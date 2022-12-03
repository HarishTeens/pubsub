rm -rf out
mkdir out
cp -r build/* out/
cp package.json out/
cd out/ && npm install --omit=dev