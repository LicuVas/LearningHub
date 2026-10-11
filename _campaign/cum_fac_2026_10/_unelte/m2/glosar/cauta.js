const fs = require("fs");
const g = JSON.parse(fs.readFileSync("C:/00/Projects/LearningHub/cum-fac/_sursa/termeni.json", "utf8"));
g.forEach((x, i) => {
  const s = JSON.stringify(x);
  if (/rigla|grup|start|tema|operati|cursor|true|antet|ancora/.test(x.forme.join("|") + "|" + x.t.toLowerCase()) &&
      /(rigl|grup|butonul start|^tem|operati|cursor|true|antet)/i.test(x.t + "|" + x.forme.join("|")))
    console.log(i, s.slice(0, 700));
});
