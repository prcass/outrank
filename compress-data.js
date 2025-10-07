/**
 * Data Compression Utility for Know-It-All Game
 * Compresses JSON data files for better performance
 * 
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/**
 * Compress a JSON file using gzip
 */
function compressFile(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(inputPath);
        const writeStream = fs.createWriteStream(outputPath);
        const gzip = zlib.createGzip({ level: 9 });
        
        readStream
            .pipe(gzip)
            .pipe(writeStream)
            .on('finish', () => {
                const originalSize = fs.statSync(inputPath).size;
                const compressedSize = fs.statSync(outputPath).size;
                const ratio = Math.round((1 - compressedSize / originalSize) * 100);
                
                console.log(`✅ ${path.basename(inputPath)}: ${originalSize} → ${compressedSize} bytes (${ratio}% reduction)`);
                resolve({ originalSize, compressedSize, ratio });
            })
            .on('error', reject);
    });
}

/**
 * Minify JSON by removing unnecessary whitespace
 */
function minifyJSON(inputPath, outputPath) {
    try {
        const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
        const minified = JSON.stringify(data);
        fs.writeFileSync(outputPath, minified);
        
        const originalSize = fs.statSync(inputPath).size;
        const minifiedSize = fs.statSync(outputPath).size;
        const ratio = Math.round((1 - minifiedSize / originalSize) * 100);
        
        console.log(`🗜️ ${path.basename(inputPath)}: ${originalSize} → ${minifiedSize} bytes (${ratio}% minification)`);
        return { originalSize, minifiedSize, ratio };
    } catch (error) {
        console.error(`❌ Failed to minify ${inputPath}:`, error.message);
        return null;
    }
}

/**
 * Create chunked versions of large data files
 */
function createChunks(inputPath, chunkSize = 50000) {
    try {
        const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
        
        if (!data.items) {
            console.log(`⚠️ ${path.basename(inputPath)}: No items to chunk`);
            return [];
        }
        
        const items = Object.entries(data.items);
        const chunks = [];
        
        for (let i = 0; i < items.length; i += chunkSize) {
            const chunk = items.slice(i, i + chunkSize);
            const chunkData = {
                prompts: i === 0 ? data.prompts : [], // Only include prompts in first chunk
                items: Object.fromEntries(chunk),
                meta: {
                    chunk: Math.floor(i / chunkSize) + 1,
                    totalChunks: Math.ceil(items.length / chunkSize),
                    itemRange: [i, Math.min(i + chunkSize, items.length)]
                }
            };
            
            chunks.push(chunkData);
        }
        
        const baseName = path.basename(inputPath, '.json');
        const dir = path.dirname(inputPath);
        
        chunks.forEach((chunk, index) => {
            const chunkPath = path.join(dir, `${baseName}-chunk-${index + 1}.json`);
            fs.writeFileSync(chunkPath, JSON.stringify(chunk));
            console.log(`📦 Created chunk ${index + 1}/${chunks.length}: ${chunkPath}`);
        });
        
        return chunks;
    } catch (error) {
        console.error(`❌ Failed to create chunks for ${inputPath}:`, error.message);
        return [];
    }
}

/**
 * Main compression process
 */
async function main() {
    console.log('🔄 Starting data compression process...\n');
    
    const dataDir = './data';
    
    if (!fs.existsSync(dataDir)) {
        console.error('❌ Data directory not found');
        return;
    }
    
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    
    let totalOriginal = 0;
    let totalCompressed = 0;
    let totalMinified = 0;
    
    for (const file of files) {
        const filePath = path.join(dataDir, file);
        const baseName = path.basename(file, '.json');
        
        console.log(`\n📄 Processing ${file}...`);
        
        // 1. Minify JSON
        const minifiedPath = path.join(dataDir, `${baseName}.min.json`);
        const minifyResult = minifyJSON(filePath, minifiedPath);
        
        if (minifyResult) {
            totalOriginal += minifyResult.originalSize;
            totalMinified += minifyResult.minifiedSize;
            
            // 2. Compress minified version
            const compressedPath = path.join(dataDir, `${baseName}.min.json.gz`);
            try {
                const compressResult = await compressFile(minifiedPath, compressedPath);
                totalCompressed += compressResult.compressedSize;
            } catch (error) {
                console.error(`❌ Compression failed for ${file}:`, error.message);
            }
        }
        
        // 3. Create chunks for large files
        const fileSize = fs.statSync(filePath).size;
        if (fileSize > 100000) { // 100KB threshold
            console.log(`📦 Creating chunks for large file ${file}...`);
            createChunks(filePath, 25); // 25 items per chunk
        }
    }
    
    // Summary
    console.log('\n📊 Compression Summary:');
    console.log(`Original total: ${Math.round(totalOriginal / 1024)}KB`);
    console.log(`Minified total: ${Math.round(totalMinified / 1024)}KB`);
    console.log(`Compressed total: ${Math.round(totalCompressed / 1024)}KB`);
    
    const minificationSavings = Math.round((1 - totalMinified / totalOriginal) * 100);
    const compressionSavings = Math.round((1 - totalCompressed / totalOriginal) * 100);
    
    console.log(`\n💾 Savings:`);
    console.log(`Minification: ${minificationSavings}%`);
    console.log(`Compression: ${compressionSavings}%`);
    
    // Create compression manifest
    const manifest = {
        timestamp: new Date().toISOString(),
        files: files.map(file => {
            const filePath = path.join(dataDir, file);
            const originalSize = fs.statSync(filePath).size;
            
            return {
                original: file,
                originalSize,
                minified: `${path.basename(file, '.json')}.min.json`,
                compressed: `${path.basename(file, '.json')}.min.json.gz`,
                hasChunks: originalSize > 100000
            };
        }),
        totalSavings: {
            minification: minificationSavings,
            compression: compressionSavings
        }
    };
    
    fs.writeFileSync(path.join(dataDir, 'compression-manifest.json'), JSON.stringify(manifest, null, 2));
    console.log('\n📄 Compression manifest created: compression-manifest.json');
    
    console.log('\n✅ Compression process complete!');
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    compressFile,
    minifyJSON,
    createChunks
};