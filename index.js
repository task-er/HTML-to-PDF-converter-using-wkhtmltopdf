const readline = require('readline');
const wkhtmltopdf = require('wkhtmltopdf');
const fs = require('fs');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const from = './from/index.html';
const abs_from = 'c:/users/sonmy/desktop/dev/html-to-pdf-converter-using-wkhtmltopdf/from/index.html';
const to = './to/dest.pdf';
const delay = 5000;
let flag = false;

/** wkhtmltopdf path */
wkhtmltopdf.command = 'c:/program files/wkhtmltopdf/bin/wkhtmltopdf.exe';
wkhtmltopdf_path = '"c:/program files/wkhtmltopdf/bin/wkhtmltopdf"';

/** 초기 실행시 입력 */
const question = () => {
  rl.question("use shell? (yes / no) ", (answer) => {
    // html to pdf
    // yes라고 답할 경우
    if (answer === 'yes') {
      flag = true;
      // 명령어로 실행
      exec(`${wkhtmltopdf_path} --javascript-delay ${delay} --enable-local-file-access --encoding UTF-8 ${abs_from} ${to}`, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          rl.close();
        }
        if (stderr) {
          console.log(err);
          rl.close();
        }
      });
      setTimeout(() => {
        rl.close();
      }, delay + 500);
    }
    // no라고 답할 경우
    if (answer === 'no') {
      flag = true;
      // 모듈로 실행
      wkhtmltopdf(fs.readFileSync(from, "utf8"), { output: to, javascriptDelay: delay, enableLocalFileAccess: true, encoding: "UTF-8" });
      setTimeout(() => {
        rl.close();
      }, delay + 500);
    }
    // yes | no 가 아닐 경우 질문 재귀 호출
    if (!flag) {
      question();
    }
  });
}
question();

/** close */
rl.on('close', function () {
  console.log('fin.');
  process.exit(0);
});