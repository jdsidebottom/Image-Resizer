import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all .tsx files
function findTsxFiles(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findTsxFiles(filePath, fileList);
      } else if (file.endsWith('.tsx')) {
        fileList.push(filePath);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return fileList;
}

// Function to copy .tsx files to .jsx
function convertTsxToJsx() {
  try {
    // Check if src directory exists
    if (!fs.existsSync('src')) {
      console.error('Error: src directory not found');
      return;
    }
    
    const tsxFiles = findTsxFiles('src');
    
    console.log(`Found ${tsxFiles.length} .tsx files to convert:`);
    
    if (tsxFiles.length === 0) {
      console.log('No .tsx files found in the src directory.');
      return;
    }
    
    tsxFiles.forEach(tsxFile => {
      try {
        const jsxFile = tsxFile.replace('.tsx', '.jsx');
        fs.copyFileSync(tsxFile, jsxFile);
        console.log(`Converted: ${tsxFile} → ${jsxFile}`);
      } catch (error) {
        console.error(`Error converting file ${tsxFile}:`, error);
      }
    });
    
    console.log('Conversion complete!');
  } catch (error) {
    console.error('Error during conversion process:', error);
  }
}

// Run the conversion
convertTsxToJsx();
