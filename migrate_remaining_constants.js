const fs = require('fs');
const path = require('path');

// Mapping of file names to categories
const CATEGORY_MAPPING = {
  'assignmentsConstants.js': 'assignments',
  'chatWindowConstants.js': 'communication',
  'driversConstants.js': 'transportation',
  'eventFormConstants.js': 'ui_components',
  'exportConstants.js': 'export_import',
  'feedbackConstants.js': 'feedback',
  'guideAvailabilityConstants.js': 'availability',
  'hooksConstants.js': 'development',
  'languageConstants.js': 'internationalization',
  'layoutConstants.js': 'ui_components',
  'layoutContextConstants.js': 'ui_components',
  'monthViewConstants.js': 'ui_components',
  'photoUploadConstants.js': 'ui_components',
  'providersConstants.js': 'providers',
  'ratingsConstants.js': 'feedback',
  'reservationFiltersConstants.js': 'reservations',
  'reservationsConstants.js': 'reservations',
  'rewardsConstants.js': 'rewards',
  'settingsConstants.js': 'settings',
  'uploadConstants.js': 'export_import',
  'vehiclesConstants.js': 'transportation'
};

// Constants files to migrate
const CONSTANTS_TO_MIGRATE = [
  'assignmentsConstants.js',
  'chatWindowConstants.js',
  'driversConstants.js',
  'eventFormConstants.js',
  'exportConstants.js',
  'feedbackConstants.js',
  'guideAvailabilityConstants.js',
  'hooksConstants.js',
  'languageConstants.js',
  'layoutConstants.js',
  'layoutContextConstants.js',
  'monthViewConstants.js',
  'photoUploadConstants.js',
  'providersConstants.js',
  'ratingsConstants.js',
  'reservationFiltersConstants.js',
  'reservationsConstants.js',
  'rewardsConstants.js',
  'settingsConstants.js',
  'uploadConstants.js',
  'vehiclesConstants.js'
];

// Paths
const FRONTEND_CONSTANTS_PATH = path.join(__dirname, 'frontend_futurismo', 'src', 'constants');
const DB_JSON_PATH = path.join(__dirname, 'backend-simulator', 'db.json');

// Function to safely extract constants from a file
function extractConstantsFromFile(filePath, fileName) {
  try {
    console.log(`Processing ${fileName}...`);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return {};
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const constants = {};

    // Remove comments and clean content
    let cleanContent = content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/^\s*[\r\n]/gm, ''); // Remove empty lines

    // Find export const declarations
    const exportRegex = /export\s+const\s+([A-Z_][A-Z0-9_]*)\s*=\s*({[\s\S]*?});/g;
    let match;

    while ((match = exportRegex.exec(cleanContent)) !== null) {
      const constantName = match[1];
      const constantBody = match[2];

      try {
        // Try to evaluate the constant object
        const constantValue = eval(`(${constantBody})`);

        constants[constantName] = {
          name: constantName,
          category: CATEGORY_MAPPING[fileName] || 'miscellaneous',
          values: constantValue,
          description: generateDescription(constantName, fileName),
          extractedFrom: `frontend_futurismo/src/constants/${fileName}`
        };

        console.log(`  ✅ Extracted: ${constantName}`);
      } catch (error) {
        console.log(`  ⚠️  Failed to parse ${constantName}: ${error.message}`);

        // Fallback: store as raw string
        constants[constantName] = {
          name: constantName,
          category: CATEGORY_MAPPING[fileName] || 'miscellaneous',
          values: constantBody,
          description: generateDescription(constantName, fileName),
          extractedFrom: `frontend_futurismo/src/constants/${fileName}`,
          parseError: error.message
        };
      }
    }

    // Also look for default exports
    const defaultExportRegex = /export\s+default\s+({[\s\S]*?});?\s*$/m;
    const defaultMatch = defaultExportRegex.exec(cleanContent);

    if (defaultMatch) {
      try {
        const defaultValue = eval(`(${defaultMatch[1]})`);
        const defaultName = fileName.replace('.js', '').replace(/Constants$/, '').toUpperCase() + '_DEFAULT';

        constants[defaultName] = {
          name: defaultName,
          category: CATEGORY_MAPPING[fileName] || 'miscellaneous',
          values: defaultValue,
          description: `Default export from ${fileName}`,
          extractedFrom: `frontend_futurismo/src/constants/${fileName}`
        };

        console.log(`  ✅ Extracted default export as: ${defaultName}`);
      } catch (error) {
        console.log(`  ⚠️  Failed to parse default export: ${error.message}`);
      }
    }

    return constants;
  } catch (error) {
    console.error(`❌ Error processing ${fileName}: ${error.message}`);
    return {};
  }
}

// Function to generate descriptions based on constant name and file
function generateDescription(constantName, fileName) {
  const descriptions = {
    // Assignments
    'ASSIGNMENT_STATUS': 'Status values for guide assignments',
    'ASSIGNMENT_TYPES': 'Types of assignments available',

    // Chat/Communication
    'CHAT_STATUS': 'Chat window status constants',
    'MESSAGE_TYPES': 'Types of messages in chat',
    'CHAT_EVENTS': 'Chat event constants',

    // Transportation
    'DRIVER_STATUS': 'Driver availability status',
    'VEHICLE_TYPES': 'Types of vehicles available',
    'VEHICLE_STATUS': 'Vehicle operational status',

    // UI Components
    'FORM_FIELDS': 'Form field definitions',
    'LAYOUT_TYPES': 'Layout configuration types',
    'MONTH_VIEW': 'Month view display constants',
    'UPLOAD_TYPES': 'File upload type definitions',

    // Export/Import
    'EXPORT_FORMATS': 'Available export formats',
    'EXPORT_TYPES': 'Types of data export',

    // Feedback
    'RATING_SCALE': 'Rating scale definitions',
    'FEEDBACK_TYPES': 'Types of feedback',

    // Availability
    'AVAILABILITY_STATUS': 'Guide availability status',
    'TIME_SLOTS': 'Available time slot definitions',

    // Development
    'HOOK_TYPES': 'React hook type definitions',
    'DEBUG_LEVELS': 'Debug level constants',

    // Internationalization
    'LANGUAGES': 'Supported language codes',
    'LOCALES': 'Locale configuration',

    // Providers
    'PROVIDER_STATUS': 'Provider status values',
    'PROVIDER_TYPES': 'Types of service providers',

    // Reservations
    'RESERVATION_STATUS': 'Reservation status values',
    'FILTER_TYPES': 'Available filter types',

    // Rewards
    'REWARD_TYPES': 'Types of rewards available',
    'REWARD_STATUS': 'Reward status values',

    // Settings
    'SETTING_CATEGORIES': 'Setting category definitions',
    'CONFIG_TYPES': 'Configuration type constants'
  };

  return descriptions[constantName] || `Constants from ${fileName}`;
}

// Main migration function
async function migrateRemainingConstants() {
  console.log('🚀 Starting migration of remaining constants...\n');

  try {
    // Read current db.json
    console.log('📖 Reading current db.json...');
    const dbContent = fs.readFileSync(DB_JSON_PATH, 'utf8');
    const db = JSON.parse(dbContent);

    // Initialize remaining_constants section
    const remainingConstants = {};
    let totalExtracted = 0;
    let totalFiles = 0;

    // Process each constants file
    for (const fileName of CONSTANTS_TO_MIGRATE) {
      const filePath = path.join(FRONTEND_CONSTANTS_PATH, fileName);
      const fileConstants = extractConstantsFromFile(filePath, fileName);

      if (Object.keys(fileConstants).length > 0) {
        Object.assign(remainingConstants, fileConstants);
        totalExtracted += Object.keys(fileConstants).length;
        totalFiles++;
      }
    }

    // Add remaining constants to db
    db.remaining_constants = remainingConstants;

    // Add metadata
    db.remaining_constants_metadata = {
      migrationDate: new Date().toISOString(),
      totalConstantsExtracted: totalExtracted,
      totalFilesProcessed: totalFiles,
      categories: Object.values(CATEGORY_MAPPING),
      sourceLocation: 'frontend_futurismo/src/constants/',
      description: 'Remaining constants migrated from frontend application',
      migrationScript: 'migrate_remaining_constants.js'
    };

    // Write updated db.json
    console.log('\n💾 Writing updated db.json...');
    fs.writeFileSync(DB_JSON_PATH, JSON.stringify(db, null, 2), 'utf8');

    console.log('\n✅ Migration completed successfully!');
    console.log(`📊 Statistics:`);
    console.log(`   - Files processed: ${totalFiles}`);
    console.log(`   - Constants extracted: ${totalExtracted}`);
    console.log(`   - Categories used: ${new Set(Object.values(CATEGORY_MAPPING)).size}`);

    // Generate summary by category
    const categoryStats = {};
    Object.values(remainingConstants).forEach(constant => {
      categoryStats[constant.category] = (categoryStats[constant.category] || 0) + 1;
    });

    console.log('\n📈 Constants by category:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} constants`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  migrateRemainingConstants();
}

module.exports = { migrateRemainingConstants };