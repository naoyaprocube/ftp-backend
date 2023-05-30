const ftpd = require('ftpd');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const FileModel = require('./models/File');

try {
  mongoose.connect('mongodb://localhost:27017/files_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
  }).then((connection: any) => {
    console.log(`Connected to Mongo database "${connection.connections[0].name}"`)
    // FileModel.find({}, (err:any, result:any)=> {
    //   console.log(result)
    // });
  });
} catch (e) {
  console.error(e);
}


//コマンドライン引数からポートとルートになるフォルダの設定
var port = process.argv[2] || 10021;
var root = process.argv[3] || process.cwd();

//サーバーの設定
var server = new ftpd.FtpServer('localhost', {
  //接続後の初期ディレクトリ
  getInitialCwd: function() {
    return '/';
  },
  //ルートとなるフォルダの設定
  getRoot: function() {
    return root;
  },
  pasvPortRangeStart: 1025,
  pasvPortRangeEnd: 1050,
  tlsOptions: null,
  allowUnauthorizedTls: true,
});

//エラー
server.on('error', function(error:any) {
  console.log('FTP Server error:', error);
});

//クライアントが接続してきたら認証(してるフリ)
server.on('client:connected', function(connection:any) {
  let username:any
  connection.on('command:user', function(user:any, success:any, failure:any) {
    if (user) {
      username = user;
      success();
    } else {
      failure();
    }
  });

  connection.on('command:pass', function(pass:any, success:any, failure:any) {
    if (pass) {
      success(username);
    } else {
      failure();
    }
  });
});

//コンソールへの出力を最低限に
server.debugging = 10000;

//指定したポートでサーバー起動
server.listen(port);
console.log('Listening on port ' + port);
