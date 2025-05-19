/**
 * Script to run tests with coverage and generate a report
 * 
 * Usage:
 * node scripts/test-with-coverage.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

// Function to colorize text
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Function to run tests with coverage
function runTestsWithCoverage() {
  console.log(colorize('Running tests with coverage...', 'cyan'));
  
  try {
    // Create coverage directory
    const coverageDir = path.join(process.cwd(), 'coverage');
    ensureDirectoryExists(coverageDir);
    
    // Run Jest with coverage
    execSync('jest --coverage', { stdio: 'inherit' });
    
    // Check if coverage report was generated
    const coverageReportDir = path.join(coverageDir, 'lcov-report');
    if (fs.existsSync(coverageReportDir)) {
      console.log(colorize('\n✅ Coverage report generated successfully!', 'green'));
      console.log(colorize(`\nCoverage report is available at: ${coverageReportDir}`, 'blue'));
      
      // Open the coverage report in the default browser
      const platform = process.platform;
      const reportPath = path.join(coverageReportDir, 'index.html');
      
      console.log(colorize('\nOpening coverage report in browser...', 'cyan'));
      
      try {
        switch (platform) {
          case 'win32':
            execSync(`start "" "${reportPath}"`);
            break;
          case 'darwin': // macOS
            execSync(`open "${reportPath}"`);
            break;
          case 'linux':
            execSync(`xdg-open "${reportPath}"`);
            break;
          default:
            console.log(colorize(`Please open ${reportPath} in your browser manually.`, 'yellow'));
        }
      } catch (error) {
        console.log(colorize(`Could not open browser automatically. Please open ${reportPath} manually.`, 'yellow'));
      }
    } else {
      console.log(colorize('\n⚠️ Coverage report was not generated.', 'yellow'));
    }
  } catch (error) {
    console.error(colorize(`\n❌ Error running tests: ${error.message}`, 'red'));
    process.exit(1);
  }
}

// Function to generate a summary of the test results
function generateTestSummary() {
  console.log(colorize('\nGenerating test summary...', 'cyan'));
  
  try {
    // Check if coverage summary exists
    const coverageSummaryPath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    if (!fs.existsSync(coverageSummaryPath)) {
      console.log(colorize('⚠️ Coverage summary not found.', 'yellow'));
      return;
    }
    
    // Read and parse the coverage summary
    const coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
    const total = coverageSummary.total;
    
    if (!total) {
      console.log(colorize('⚠️ Coverage data not found in summary.', 'yellow'));
      return;
    }
    
    // Display the coverage summary
    console.log(colorize('\nTest Coverage Summary:', 'bold'));
    console.log(colorize('------------------------', 'bold'));
    
    const metrics = [
      { name: 'Statements', key: 'statements' },
      { name: 'Branches', key: 'branches' },
      { name: 'Functions', key: 'functions' },
      { name: 'Lines', key: 'lines' }
    ];
    
    metrics.forEach(metric => {
      const coverage = total[metric.key];
      if (coverage) {
        const percentage = coverage.pct;
        const color = percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red';
        console.log(`${metric.name}: ${colorize(`${percentage}%`, color)} (${coverage.covered}/${coverage.total})`);
      }
    });
    
    // Generate a simple text report
    const reportDir = path.join(process.cwd(), 'reports');
    ensureDirectoryExists(reportDir);
    
    const reportPath = path.join(reportDir, 'test-summary.txt');
    let report = 'Test Coverage Summary\n';
    report += '------------------------\n';
    
    metrics.forEach(metric => {
      const coverage = total[metric.key];
      if (coverage) {
        report += `${metric.name}: ${coverage.pct}% (${coverage.covered}/${coverage.total})\n`;
      }
    });
    
    report += '\nGenerated on: ' + new Date().toLocaleString();
    
    fs.writeFileSync(reportPath, report);
    console.log(colorize(`\nTest summary saved to: ${reportPath}`, 'blue'));
    
  } catch (error) {
    console.error(colorize(`Error generating test summary: ${error.message}`, 'red'));
  }
}

// Main function
function main() {
  console.log(colorize('=== Map Controls Test Runner ===', 'bold'));
  
  // Run tests with coverage
  runTestsWithCoverage();
  
  // Generate test summary
  generateTestSummary();
}

// Run the script
main();
