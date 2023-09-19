const fs = require('fs');

fs.readFile('.env', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
  let tempData = [];
  let tempEnv = '';
  data = data.split('\n');
  data = data.forEach((element) => {
    let key = element.split('=')[0];
    if (key.length != 0) {
      tempData.push(key.concat(`=#Your ${key} here\n`));
    }
  });

  //zapier env:set 1.0.0 MY_SECRET_VALUE=1234v
  tempData.forEach((element) => {
    tempEnv = `${tempEnv}${element}`;
  });

  fs.writeFile('.env.template', tempEnv, function (err) {
    if (err) throw err;
    console.log('.env.template file created successfully');
  });
});