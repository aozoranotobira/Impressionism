var img, width, height;
var maxSize = { width: 1024, height: 2048 };
var thick = 2;
var maxLen = { length: 20, fix: false };
var maxDeg = { degree: 360, fix: false };
var mixColor = { red: 204, blue: 204, green: 204, amount: 0 };
var speed = 1000;

function setup() {
  let file = createFileInput(handleFile);
  file.parent('file');

  let maxWidth = select('#width_number');
  maxWidth.input(() => { maxSize.width = maxWidth.value(); });

  let maxHeight = select('#height_number');
  maxHeight.input(() => { maxSize.height = maxHeight.value(); });

  let thickness = select('#thickness_select');
  setOption(thickness, 1, 10, 1, 0, 'px', thick);
  thickness.changed(() => { thick = thickness.value(); });

  let maxLength = select('#length_select');
  setOption(maxLength, 1, 100, 1, 0, 'px', maxLen.length);
  maxLength.changed(() => { maxLen.length = maxLength.value(); });

  let fixLength = select('#length_check');
  fixLength.changed(() => { maxLen.fix = fixLength.checked(); });

  let maxDegree = select('#degree_select');
  setOption(maxDegree, 0, 360, 10, 0, '°', maxDeg.degree);
  maxDegree.changed(() => { maxDeg.degree = maxDegree.value(); });

  let fixDegree = select('#degree_check');
  fixDegree.changed(() => { maxDeg.fix = fixDegree.checked(); });

  let mixRed = select('#red_select');
  setOption(mixRed, 0, 255, 1, 0, '', mixColor.red);
  mixRed.changed(() => { mixColor.red = mixRed.value(); });

  let mixGreen = select('#green_select');
  setOption(mixGreen, 0, 255, 1, 0, '', mixColor.green);
  mixGreen.changed(() => { mixColor.green = mixGreen.value(); });

  let mixBlue = select('#blue_select');
  setOption(mixBlue, 0, 255, 1, 0, '', mixColor.blue);
  mixBlue.changed(() => { mixColor.blue = mixBlue.value(); });

  let mixAmount = select('#amount_select');
  setOption(mixAmount, 0, 100, 5, 100, '', mixColor.amount);
  mixAmount.changed(() => { mixColor.amount = mixAmount.value(); });

  let speediness = select('#speed-range');
  speediness.input(() => { speed = speediness.value(); });

  select('#play_button').mousePressed(() => { isLooping() ? noLoop() : loop(); });

  let canvas = createCanvas(0, 0);
  canvas.parent('canvas');
}

function setOption(select, min, max, increment, divisor, sign, initial) {
  for (let i = min; i <= max; i = i + increment) {
    if (divisor == 0) {
      select.option(`${i}${sign}`, i);
    } else {
      let value = i / divisor;
      select.option(`${value}${sign}`, value);
    }
  }
  select.selected(initial);
}

function draw() {
  if (!img) return;
  noStroke();
  for (let i = 0; i <= speed; i++) {
    // 色を取得する位置をランダムに決定
    let x = int(random(width));
    let y = int(random(height));
    // 指定した場所の色を取得
    let clr = img.get(x, y);
    // 色の彩度を角度に反映
    let rotation = maxDeg.fix ? maxDeg.degree : map(saturation(clr), 0, 255, 0, maxDeg.degree);
    // 明度を長さに反映
    let length = maxLen.fix ? maxLen.length : map(brightness(clr), 0, 255, 1, maxLen.length);
    let radius = thick / 2;
    // 塗りつぶす色を決定
    let mainColor = color(red(clr), green(clr), blue(clr));
    let subColor = color(mixColor.red, mixColor.green, mixColor.blue);
    fill(lerpColor(mainColor, subColor, mixColor.amount));
    push();
    translate(x, y);
    rotate(radians(rotation));
    // 四角形を描画
    rect(0, 0, thick, length, radius, radius, radius, radius);
    pop();
  }
}

function handleFile(file) {
  // 画像を読み込み
  if (file.type === 'image') {
    img = loadImage(file.data, () => {
      // 画像のサイズを取得
      if (img.width <= maxSize.width && img.height <= maxSize.height) {
        width = img.width;
        height = img.height;
      } else {
        // 画像をリサイズ
        if (img.width > maxSize.width) {
          width = maxSize.width;
          height = img.height * (maxSize.width / img.width);
          img.resize(width, height);
        }
        if (img.height > maxSize.height) {
          height = maxSize.height;
          width = img.width * (maxSize.height / img.height);
          img.resize(width, height);
        }
      }
      // キャンバスをリサイズ
      resizeCanvas(width, height);
      // 背景を白に変更
      background(255);
    });
  }
}
