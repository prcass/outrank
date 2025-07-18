#!/usr/bin/env node

/**
 * update_prompts.js - Update prompt text for challenges
 * 
 * Usage:
 *   node update_prompts.js <category> <challenge_id> "<new_prompt_text>"
 * 
 * Examples:
 *   node update_prompts.js countries coffee_consumption "Rank by coffee consumed per person annually (most to least)"
 *   node update_prompts.js movies box_office_gross "Rank by total worldwide revenue (highest to lowest)"
 */

const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
if (args.length !== 3) {
    console.log('Usage: node update_prompts.js <category> <challenge_id> "<new_prompt_text>"');
    console.log('Categories: countries, movies, sports, companies');
    process.exit(1);
}

const [category, challengeId, newPromptText] = args;

// Map friendly names to actual category keys
const categoryMap = {
    'countries': 'countries',
    'movies': 'movies', 
    'sports': 'sports',
    'companies': 'companies',
    'sports teams': 'sports',
    'sports_teams': 'sports'
};

const actualCategory = categoryMap[category.toLowerCase()];
if (!actualCategory) {
    console.error(`Invalid category: ${category}`);
    console.log('Valid categories: countries, movies, sports, companies');
    process.exit(1);
}

// Load the data file
const dataPath = path.join(__dirname, 'data.js');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Create backup
const backupPath = dataPath + '.backup.' + Date.now();
fs.writeFileSync(backupPath, dataContent);
console.log(`Created backup: ${backupPath}`);

// Find and update the prompt
try {
    // Use regex to find the specific prompt within the category
    const categoryPattern = new RegExp(`"${actualCategory}":\\s*{[^}]*"prompts":\\s*\\[`, 's');
    const categoryMatch = dataContent.match(categoryPattern);
    
    if (!categoryMatch) {
        throw new Error(`Category "${actualCategory}" not found in data structure`);
    }
    
    // Find the specific challenge within this category's prompts
    const challengePattern = new RegExp(
        `("challenge":\\s*"${challengeId}"[^}]*"label":\\s*)"([^"]*)"`,
        'g'
    );
    
    let found = false;
    let updatedContent = dataContent;
    
    // Search specifically within the category section
    const categoryStartIndex = dataContent.indexOf(`"${actualCategory}": {`);
    const nextCategoryMatch = dataContent.slice(categoryStartIndex + 1).match(/"[^"]+": {/);
    const categoryEndIndex = nextCategoryMatch 
        ? categoryStartIndex + nextCategoryMatch.index + 1
        : dataContent.length;
    
    const categorySection = dataContent.slice(categoryStartIndex, categoryEndIndex);
    
    if (categorySection.includes(`"challenge": "${challengeId}"`)) {
        updatedContent = dataContent.replace(challengePattern, (match, prefix, oldLabel) => {
            // Only replace if we're in the right category section
            const matchIndex = dataContent.indexOf(match);
            if (matchIndex >= categoryStartIndex && matchIndex < categoryEndIndex) {
                found = true;
                console.log(`\nFound prompt to update:`);
                console.log(`  Category: ${actualCategory}`);
                console.log(`  Challenge: ${challengeId}`);
                console.log(`  Old prompt: "${oldLabel}"`);
                console.log(`  New prompt: "${newPromptText}"`);
                return `${prefix}"${newPromptText}"`;
            }
            return match;
        });
    }
    
    if (!found) {
        throw new Error(`Challenge "${challengeId}" not found in category "${actualCategory}"`);
    }
    
    // Write the updated content
    fs.writeFileSync(dataPath, updatedContent);
    console.log('\n✅ Successfully updated prompt!');
    
    // Verify the update
    const verifyContent = fs.readFileSync(dataPath, 'utf8');
    if (verifyContent.includes(newPromptText)) {
        console.log('✅ Update verified');
    } else {
        console.error('❌ Update verification failed');
        // Restore backup
        fs.writeFileSync(dataPath, dataContent);
        process.exit(1);
    }
    
} catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    // Restore backup on error
    fs.writeFileSync(dataPath, dataContent);
    console.log('Restored from backup due to error');
    process.exit(1);
}