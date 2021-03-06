var exec = require("child_process").exec;
// var eslint = require('eslint');
var fs = require("fs");
var errTip = [
  "还存在很多错误的地方哦！，避免隐患，还是现在改了吧！/(ㄒoㄒ)/~~",
  "哎呀呀！还有错误哦！=_=",
];
var successTip = ["不错哦！加油！↖(^ω^)↗ ", "赞！~\\(≧▽≦)/~", "棒棒哒！"];
var lint = function(cb) {
  exec("eslint ./ --cache --quiet", function(error, stdout, stderr) {
    // 通过node子进程执行命令，
    if (stdout) {
      console.log(
        "\x1B[31m%s",
        errTip[Math.floor(errTip.length * Math.random())]
      );
      console.log("\x1B[37m", stdout); //输出eslint错误信息
      cb(1);
      return;
    }
    cb(0);
  });
};

var extraTab = function(cb) {
  var conf = JSON.parse(fs.readFileSync("./.check", "utf8"));
  var name = conf.dir.join(" ");
  var bTabAndSpace = conf.bTabAndSpace;
  var array;
  var text;
  var checkTab = function(text, name) {
    //检测函数
    // console.log('===============================');
    if (name === "src/kstore/test.js") {
      console.log("ccc", text, name);
      console.log("checktab", name, /\t\s/.test(text));
    }

    // console.log('===============================');
    if (/\t\s/.test(text)) {
      console.log("\x1B[31m%s", name);
      console.log("\x1B[37m", "存在tab键和空格键乱用哦！");
      return false;
    }
    return true;
  };
  exec("git diff HEAD --name-only --diff-filter=ACMR -- " + name + "", function(
    error,
    stdout,
    stderr
  ) {
    // 通过node子进程执行命令
    // console.log('stdout', stdout);
    // console.log('------------------------');
    if (stdout) {
      array = stdout.split("\n"); //通过切割换行，拿到文件列表
      array.pop(); // 去掉最后一个换行符号
      array.forEach(function(value) {
        text = fs.readFileSync(value, "utf-8"); // 拿到文件内容
        // console.log('====+++++++++++++++++++++++======');
        // console.log('texxt', text);
        // console.log('===++++++++++++++++++++++++======');
        if (bTabAndSpace && !checkTab(text, value)) {
          //检测函数
          cb(1);
          return;
        }
      });
      cb(0);
    } else {
      cb(0);
    }
  });
};
var missingReadMe = function(cb) {
  exec("ls", function(error, stdout, stderr) {
    // 通过node子进程执行命令，
    const files = stdout.toLowerCase().split("\n");
    let f = false;
    if (files.indexOf("readme.md") !== -1) {
      f = true;
    }
    if (f) cb(0);
    else {
      console.log(
        "\x1B[31m%s",
        errTip[Math.floor(errTip.length * Math.random())]
      );
      console.log("\x1B[31m%s", "missing readme.md"); //输出
      cb(1);
    }
  });
};
const flinkcheck = function(cb) {
  try {
    const conf = JSON.parse(fs.readFileSync("./rules.json", "utf8"));
    const flinkConf = conf.flink;
    
    if (flinkConf) {
      const filenames = Object.keys(flinkConf.name);
      const isFlink =
        filenames.every((filename) => {
          const filetext = fs.readFileSync(filename, "utf-8");

          const re = RegExp(flinkConf.name[filename], "g");
          return re.test(filetext);
        }) || false;

      if (isFlink) {
          const rules = flinkConf.rules;
          console.log("checking flink config");
        
        const result = rules.every((rule) => {
            const [filepath] = Object.keys(rule);
         
            const filetext = fs.readFileSync(filepath, "utf-8");
            const keyword = rule[filepath];
            if (Array.isArray(keyword)) {
                const splits=["=",":"];
                const split = splits.find(iter=>filetext.includes(iter))
                const values = filetext.split('\n').map(str=>{
                    const [key, value] = str.split(split);
                    return value.trim();
                });
                const isContains = keyword.some(version=>values.find(iter=>iter===version));
                
                return isContains;
            } else {
                const re = RegExp(keyword, "gm");
                const result = Boolean(re.test(filetext));
               
                !result && console.error("\x1B[31m%s", "Flink pre-commit error:"+ JSON.stringify(rule));
                return result;
            }
        });
        
        if (result) cb(0);
        else cb(1);
      }
      cb(0);
    }
    cb(0);
  } catch (e) {
      console.log('error:',e);
    cb(0);
  }
};

var taskList = [extraTab, lint, missingReadMe, flinkcheck];
// 执行检查
var task = function() {
  if (!taskList.length) {
    console.log(
      "\x1B[32m%s",
      successTip[Math.floor(successTip.length * Math.random())]
    );
    process.exit(0);
    return;
  }
  var func = taskList.shift();
  func(function(pass) {
    if (pass === 1) {
      process.exit(1);
      return;
    }
    task();
  });
};

var startTask = function() {
  console.log("开始检查代码咯！O(∩_∩)O~\n");
  task();
};

// 执行检查
startTask();
