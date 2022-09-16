var code = require("./script.js");
var fs = require('fs');

for (iter = 0; iter < 1; ++iter){
  var html = fs.readFileSync("./before.html", 'utf-8');

  modify_html = code(html);

  fs.writeFileSync('./after.html', modify_html);
}