# Workday Application Assistant

A Chrome extension that automatically fills out job application forms on Workday to streamline the application process.

## Features

- Automatically detects and fills form fields on Workday job application pages
- Stores your profile information locally in your browser
- Supports personal information, work history, education, and skills
- Simple, user-friendly interface with tabbed navigation
- Visual feedback when fields are detected and filled
- Works with Workday's multi-step application process

## Installation

1. Download or clone this repository:
   ```
   git clone https://github.com/michaelngangom/workday-application-assistant.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension icon should appear in your Chrome toolbar

## Usage

1. Click the extension icon in your Chrome toolbar to open the popup
2. Fill out your profile information in each tab (Personal Info, Work History, Education, Skills)
3. Click "Save Profile" to store your information locally
4. When on a Workday application page:
   - Click "Detect Form Fields" to identify fillable fields (highlighted in blue)
   - Click "Fill Current Form" to automatically fill the form with your saved profile data (successfully filled fields turn green)
5. Review the filled information before submitting your application

## How It Works

The extension works by:
1. Detecting when you're on a Workday application page
2. Analyzing the page structure to identify form fields
3. Matching field labels with your stored profile data
4. Automatically filling forms with appropriate information
5. Providing visual feedback during the process

## Privacy

This extension stores all your data locally in your browser using Chrome's storage API. No data is sent to any external servers or third parties. Your personal information never leaves your browser.

## Contributing

Contributions are welcome! If you'd like to improve the extension:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT