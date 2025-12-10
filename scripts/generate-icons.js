// scripts/generate-icons.js
import sharp from "sharp";
import fs from "fs";
import path from "path";

// Caminho do seu logo
const logoPath = path.resolve("public/logo.jpg");

// Tamanhos de ícones para PWA
const sizes = [192, 512];

// Pasta onde os ícones serão gerados
const outputDir = path.resolve("public/icons");

// Cria a pasta se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}.png`);
    await sharp(logoPath)
      .resize(size, size)
      .toFile(outputPath);
    console.log(`✅ Icon ${size}x${size} criado em ${outputPath}`);
  }
  console.log("Todos os ícones foram gerados!");
}

generateIcons().catch(console.error);
