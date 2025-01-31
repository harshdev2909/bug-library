
# Bug Report Widget

A bug reporting widget with built-in screenshot capture and Cloudinary integration, designed to help developers easily collect and manage bug reports from users. This library provides an intuitive UI for reporting bugs and capturing screenshots, all integrated with Cloudinary for seamless image uploads.

## Features

- **Bug Reporting**: Allows users to report bugs with descriptions.
- **Screenshot Capture**: Captures screenshots of the user's screen and attaches them to the bug report.
- **Cloudinary Integration**: Uploads screenshots to Cloudinary for easy storage and retrieval.
- **Customizable**: Easy to integrate into your React projects by simply passing an API key and API URL.
- **Responsive**: Fully responsive design for smooth user interaction on all devices.

## Installation

### Step 1: Install the package

To install the bug reporting widget, run the following command:

```bash
npm install bug-report-widget
```

### Step 2: Set up Cloudinary

1. Create a Cloudinary account if you don't have one: [Cloudinary](https://cloudinary.com).
2. Get your **Cloudinary API Key** and **Cloudinary API Secret** from the Cloudinary console.

### Step 3: Integrate the widget into your React project

In your React component, import and use the widget as follows:

```jsx
import React from "react";
import BugReportWidget from "bug-report-widget";

const App = () => {
  const apiKey = "YOUR_API_KEY";
  const apiUrl = "YOUR_API_URL";  // The URL for your backend API

  return (
    <div>
      <BugReportWidget apiKey={apiKey} apiUrl={apiUrl} />
    </div>
  );
};

export default App;
```

### Step 4: Backend Setup (for screenshot uploads)

You need to set up an API endpoint in your backend to handle bug reports and upload screenshots to Cloudinary.

Here’s an example of a simple Express backend:

```javascript
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const app = express();
const port = 5000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: "YOUR_CLOUD_NAME",
  api_key: "YOUR_API_KEY",
  api_secret: "YOUR_API_SECRET",
});

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle bug report submissions
app.post("/bugs/report", upload.single("screenshot"), async (req, res) => {
  const { description } = req.body;
  const { file } = req;

  // Upload the screenshot to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(file.buffer, {
    resource_type: "auto",
  });

  // Save the bug report with the screenshot URL
  // You can save this data to your database

  res.json({
    message: "Bug reported successfully!",
    screenshotUrl: cloudinaryResponse.secure_url,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

### Step 5: Testing

Once you have integrated the widget and backend API, start your application and test the bug reporting functionality. Click the "Report Bug" button, describe the bug, capture a screenshot, and submit the report. The screenshot will be uploaded to Cloudinary, and the bug report will be saved in your backend.

## Configuration

You can configure the following properties in the `BugReportWidget`:

- **`apiKey`**: The API key used to authenticate requests to your backend.
- **`apiUrl`**: The URL of your backend API endpoint where the bug reports are submitted.

Example:

```jsx
<BugReportWidget apiKey="YOUR_API_KEY" apiUrl="http://localhost:5000/api" />
```

## Dependencies

- `axios`: For making HTTP requests.
- `html2canvas`: For capturing screenshots of the webpage.
- `cloudinary`: For uploading images to Cloudinary.
- `react`: For building the widget as a React component.
- `tailwindcss`: For styling the widget.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
