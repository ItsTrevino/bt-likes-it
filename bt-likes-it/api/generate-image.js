export default async function handler(req, res) {
  const { name } = req.query;
  if (!name) {
    return res.status(400).send("Missing name");
  }

  const canvas = require("canvas");
  const { createCanvas, loadImage } = canvas;

  const width = 1080;
  const height = 1350;
  const margin = 30;
  const bgUrl = "https://www.dropbox.com/scl/fi/fptpa6y930aie1rauwzoh/BT-ilikeittoo.png?rlkey=drjcbktrnwd66tr37l8ln0grg&raw=1";
  const letterBaseUrl = "https://www.dropbox.com/scl/fi/fptpa6y930aie1rauwzoh/";

  const canvasObj = createCanvas(width, height);
  const ctx = canvasObj.getContext("2d");

  const bg = await loadImage(bgUrl);
  ctx.drawImage(bg, 0, 0, width, height);

  const upperName = name.toUpperCase();
  let x = margin;
  let y = 1000; // adjust based on where you want text

  for (const char of upperName) {
    if (char === " ") {
      x += 40;
      continue;
    }
    const letterUrl = `${letterBaseUrl}${char}.png?raw=1`;
    try {
      const letterImg = await loadImage(letterUrl);
      const scale = 1.0;
      const letterWidth = letterImg.width * scale;
      const letterHeight = letterImg.height * scale;
      ctx.drawImage(letterImg, x, y, letterWidth, letterHeight);
      x += letterWidth + 5;
    } catch (err) {
      console.error("Error loading letter:", char, err);
    }
  }

  const likesUrl = `${letterBaseUrl}likesit.png?raw=1`;
  try {
    const likesImg = await loadImage(likesUrl);
    ctx.drawImage(likesImg, width - likesImg.width - margin, y + 100);
  } catch (err) {
    console.error("Error loading 'likes it':", err);
  }

  res.setHeader("Content-Type", "image/png");
  canvasObj.pngStream().pipe(res);
}
