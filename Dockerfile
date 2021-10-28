# ベースイメージを指定
# 今回は LTS の 14.17にする
FROM node:14.17
# node.js の環境変数を定義する
# 本番環境では production
ENV NODE_ENV=development
# 雛形を生成するのに必要なパッケージのインストール
# RUN npm install -g express-generator
COPY . .
# CMD ["npm", "install"]
# ディレクトリを移動する
WORKDIR /app
# RUN express -f --view=ejs /app
RUN npm install
# RUN npm install --save jquery
# RUN npm install --save mongodb
# RUN npm install --save bootstrap
# ポート3000番を開放npmする
EXPOSE 3000
CMD [ "npm", "start" ]