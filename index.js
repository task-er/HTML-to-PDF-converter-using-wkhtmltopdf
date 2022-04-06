const readline = require('readline');
const wkhtmltopdf = require('wkhtmltopdf');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const from = './from/index.html';
const from_css ='./from/index.css'
const abs_from = path.join(process.env.PROJECT_PATH, from);
const to = './to/dest.pdf';
const delay = 5000;
let flag = false;

/** wkhtmltopdf path */
wkhtmltopdf.command = `${process.env.WKHTMLTOPDF_PATH}.exe`;
wkhtmltopdf_path = `"${process.env.WKHTMLTOPDF_PATH}"`;

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
      // 여기서는 절대 path를 사용해야 하므로 환경변수 값으로 변경하는 작업이 필요하다.
      const html = fs.readFileSync(from, "utf8").replace('./index.css', path.join(process.env.PROJECT_PATH, from_css));
      // 모듈로 실행.
      wkhtmltopdf(html, { output: to, javascriptDelay: delay, enableLocalFileAccess: true, encoding: "UTF-8" });
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