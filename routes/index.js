var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(process.cwd() + "/datasets/dataset.sqlite3", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to sqlite3");
});

lerp = function (a, b, u) {
  return (1 - u) * a + u * b;
};

ColorLerp = function (start, end, t) {

  return { r: lerp(start.r, end.r, t), g: lerp(start.g, end.g, t), b: lerp(start.b, end.b, t) };
};


/* GET home page. */
router.get('/', function (req, res, next) {
  let data = {};

  let max = -100;
  let min = 100;

  db.all("SELECT `Date/Time`, Year, Month, Day, `Mean Temp (°C)`  FROM weather", (err, rows) => {
    if (err)
      throw err;

    rows.forEach((row) => {
      let year = (Number)(row['Year']);
      let month = (Number)(row['Month']);
      let day = (Number)(row['Day']);


      if (data[year] === undefined)
        data[year] = {};

      if (data[year][month] === undefined)
        data[year][month] = {};

      // Blue
      let startColor = {
        r: 50,
        g: 245,
        b: 245
      }

      // Red
      let endColor = {
        r: 250,
        g: 10,
        b: 10
      }

      let temp = (Number)(row['Mean Temp (°C)'])
      let tempAdjusted = temp + 30;
      let percent = tempAdjusted / 60;
      let color = ColorLerp(startColor, endColor, percent);

      if (row['Mean Temp (°C)'] == "")
        color = { r: 0, g: 0, b: 0 };


      // if (temp > max) {
      //   max = temp;
      //   console.log("New Max: " + max);
      // }

      // if (temp < min) {
      //   min = temp;
      //   console.log("New Min: " + min);
      // }

      data[year][month][day] = [row['Mean Temp (°C)'], `rgb(${color.r},${color.g},${color.b})`];
    });

    res.render('index', { title: 'Express', data });
  });
});

module.exports = router;
