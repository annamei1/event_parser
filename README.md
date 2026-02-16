# Event Email Parser

AI-powered tool to automatically extract event information from emails and add them to your calendar.

## Features

- 🤖 **AI-Powered Extraction**: Uses Google's Gemini API to intelligently parse event details from email text
- 📅 **Calendar Integration**: Export events to Google Calendar or download .ics files for iCal
- 📱 **Mobile-Friendly**: Responsive design works on phones and desktops
- 🔒 **Secure**: API keys are stored server-side, not exposed in client code

## Event Information Extracted

- Event title
- Date (YYYY-MM-DD format)
- Time (24-hour format)
- Location
- Description
- Registration/event URL

## Setup

### Prerequisites

- Node.js (v14 or higher)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/event_parser.git
cd event_parser
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`:
```
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

### Running the Application

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. Copy the text content of an email containing event information
2. Paste it into the text area
3. Click "Extract Events"
4. View extracted events with all details
5. Add to Google Calendar or download .ics file

## Project Structure

```
event_parser/
├── index.html          # Frontend UI
├── server.js           # Express backend (API proxy)
├── package.json        # Dependencies
├── .env               # Environment variables (not committed)
├── .env.example       # Environment template
└── README.md          # This file
```

## Security

- API keys are stored in `.env` file (never committed to git)
- Backend proxy prevents key exposure in client-side code
- CORS enabled for local development

## Future Enhancements

### Stage 2: Gmail API Integration
- OAuth authentication
- Automatic email fetching from specific senders
- Batch processing of multiple emails

### Stage 3: Website Scraping
- Extract events from event listing websites
- Support for Eventbrite, Luma, and other platforms

### Stage 4: Smart Filtering
- User preferences for sender filtering
- Keyword-based filtering
- Automated scheduling (daily/weekly scans)

## Technology Stack

- **Frontend**: HTML, Tailwind CSS, Vanilla JavaScript
- **Backend**: Node.js, Express
- **AI**: Google Gemini 2.5 Flash
- **Calendar**: Google Calendar API, iCalendar format

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
