#!/usr/bin/env node

const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const program = require('commander');

program
  .version('1.0.0')
  .description('Accessibility Checker CLI');

program
  .command('check <url>')
  .description('Check accessibility for a specific URL')
  .action(async (url) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

      // Inject Axe-core into the page
      await page.evaluate(axeCore.source);

      // Run accessibility checks using Axe-core
      const axeResults = await page.evaluate(async () => {
        const results = await axe.run();
        return results;
      });

      await browser.close();

      if (axeResults.violations.length === 0) {
        console.log('Accessibility analysis completed for:', url);
        console.log('No accessibility violations found.');
      } else {
        console.log('Accessibility analysis completed for:', url);
        console.log('Accessibility violations found:');
        axeResults.violations.forEach((violation) => {
          console.log('  -', violation.help);
          console.log('    Impact:', violation.impact);
          console.log('    Tags:', violation.tags.join(', '));
        });
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  });

program.parse(process.argv);
