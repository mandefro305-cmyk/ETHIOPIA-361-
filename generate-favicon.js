const sharp = require('sharp');
const fs = require('fs');

async function processFavicon() {
  const inputPath = '/tmp/file_attachments/IMG_20260409_091925_273.jpg';

  if (!fs.existsSync('public/img')) {
      fs.mkdirSync('public/img', { recursive: true });
  }

  try {
    const size = 512;
    const circleSvg = `<svg width="${size}" height="${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white" />
    </svg>`;
    const circleBuffer = Buffer.from(circleSvg);

    const metadata = await sharp(inputPath).metadata();
    const minDim = Math.min(metadata.width, metadata.height);

    // First step: extract a square and resize it exactly to the target size
    const squaredImageBuffer = await sharp(inputPath)
      .extract({
        left: Math.floor((metadata.width - minDim) / 2),
        top: Math.floor((metadata.height - minDim) / 2),
        width: minDim,
        height: minDim
      })
      .resize(size, size)
      .toBuffer();

    // Second step: composite the mask on the properly sized square
    const processedImageBuffer = await sharp(squaredImageBuffer)
      .composite([{
        input: circleBuffer,
        blend: 'dest-in'
      }])
      .png({ quality: 100 })
      .toBuffer();

    // 2. Output 512x512 high quality PNG (apple-touch-icon)
    await sharp(processedImageBuffer)
      .toFile('public/img/apple-touch-icon.png');

    // 3. Output 192x192 PNG
    await sharp(processedImageBuffer)
      .resize(192, 192)
      .toFile('public/img/favicon-192x192.png');

    // 4. Output 32x32 PNG
    await sharp(processedImageBuffer)
      .resize(32, 32)
      .toFile('public/img/favicon-32x32.png');

    // 5. Output 16x16 PNG
    await sharp(processedImageBuffer)
      .resize(16, 16)
      .toFile('public/img/favicon-16x16.png');

    console.log('Favicons generated successfully.');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

processFavicon();
