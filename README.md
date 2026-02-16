# Event Email Parser

AI-powered tool to automatically extract event information from emails and add them to your calendar.

## Features

- 🤖 **AI-Powered Extraction**: Uses Google's Gemini API to intelligently parse event details from email text
- 📧 **Smart Gmail Integration**: Automatically fetches and filters emails from the last 7 days
- 🔍 **Keyword Pre-Filtering**: Hard-coded keywords (event, talk, seminar, etc.) filter emails before API calls to save costs
- 📅 **Calendar Integration**: Export events to Google Calendar or download .ics files for iCal
- 📋 **Event Management**: View all extracted events in one list, add to calendar or dismiss unwanted events
- 💾 **Persistent Storage**: Events are saved locally and persist across browser sessions
- 📱 **Mobile-Friendly**: Responsive design works on phones and desktops
- 🔒 **Secure**: API keys are stored server-side (or hardcoded for standalone use)
- ⚡ **Two Versions**: Server version (secure) or standalone HTML file (no installation needed)

## Event Information Extracted

- Event title
- Date (YYYY-MM-DD format)
- Time (24-hour format)
- Location
- Description
- Registration/event URL

## Setup

### Prerequisites

- **For server version** (`index.html`): Node.js (v14 or higher)
- **For standalone version** (`standalone.html`): Just a web browser
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **For Gmail integration**: OAuth 2.0 Client ID (see Gmail API Setup below)

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

### Gmail API Setup (Required for Email Fetching)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create a new project** (or select existing):
   - Click "Select a project" → "New Project"
   - Name it "Event Parser" → Click "Create"

3. **Enable Gmail API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click "Enable"

4. **Create OAuth credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"

5. **Configure OAuth consent screen** (if prompted):
   - User Type: **External** → Create
   - App name: "Event Parser"
   - User support email: your email
   - Developer contact: your email
   - Save and Continue (skip optional fields)
   - **Add scope**: `https://www.googleapis.com/auth/gmail.readonly`
   - Add your email as test user
   - Save and return to Credentials

6. **Create OAuth 2.0 Client ID**:
   - Application type: **Web application**
   - Name: "Event Parser"

7. **Add Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:3000/
   http://127.0.0.1:3000
   ```

8. **Authorized redirect URIs** (add these):
   ```
   http://localhost:3000
   http://localhost:3000/
   ```

9. **Copy your Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)

10. **Add to your HTML files**:
    - For server version: Update `GOOGLE_CLIENT_ID` in `index.html` (line 49)
    - For standalone: Update `GOOGLE_CLIENT_ID` in `standalone.html` (line 68)

### Running the Application

#### Option 1: Server Version (Secure, Requires Node.js)

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

#### Option 2: Standalone Version (No Server Required)

Simply open `standalone.html` in your web browser:
- Double-click the file, or
- Drag it to your browser, or
- Right-click → Open with → Your browser

**Note**: Gmail OAuth will work, but you'll see your Gemini API key in the HTML source code (acceptable for personal use).

## Usage

### Method 1: Auto-Extraction from Gmail (Recommended)

1. **Sign in**: Click "Sign in with Google"
2. **Grant Permission**: Allow read-only access to your Gmail
3. **Automatic Processing**: The app will:
   - Automatically fetch emails from the last 7 days
   - Filter emails using keywords (event, talk, seminar, conference, etc.) to reduce API usage
   - Extract event information from filtered emails
   - Display all events in a consolidated list
4. **Manage Events**: For each event, you can:
   - Click "Add to Calendar" to export to Google Calendar or download .ics file
   - Click "Dismiss" to remove events you're not interested in
5. **Refresh**: Click "Refresh (Last 7 Days)" to fetch new emails anytime

### Method 2: Manual Paste (Still Available)

1. Copy the text content of an email containing event information
2. Paste it into the text area
3. Click "Extract Events"
4. Events will be added to your event list
5. Manage events as described above

### Smart Features

- **Persistent Storage**: All extracted events are saved in your browser and will be available when you return
- **Duplicate Detection**: The app automatically prevents duplicate events from being added
- **Auto-Sorting**: Events are displayed in chronological order (upcoming first)
- **Clear All**: Option to clear all events when needed

## Project Structure

```
event_parser/
├── index.html          # Server version (with backend API proxy)
├── standalone.html     # Standalone version (no server needed)
├── server.js           # Express backend (API proxy)
├── package.json        # Dependencies
├── .env               # Environment variables (not committed)
├── .env.example       # Environment template
└── README.md          # This file
```

## Version Comparison

| Feature | `index.html` (Server) | `standalone.html` |
|---------|----------------------|-------------------|
| **Requires Node.js** | ✅ Yes | ❌ No |
| **Gmail Integration** | ✅ Yes | ✅ Yes |
| **Event Extraction** | ✅ Yes | ✅ Yes |
| **Calendar Export** | ✅ Yes | ✅ Yes |
| **API Key Security** | 🔒 Secure (server-side) | ⚠️ Visible in code |
| **Setup Complexity** | Medium | Easy |
| **Best For** | Production use | Personal use |

## Security

### Server Version (`index.html`)
- API keys are stored in `.env` file (never committed to git)
- Backend proxy prevents key exposure in client-side code
- CORS enabled for local development
- OAuth Client ID is public (normal for OAuth)

### Standalone Version (`standalone.html`)
- Gemini API key is visible in HTML source code (acceptable for personal use)
- OAuth Client ID is public (normal for OAuth)
- Gmail access is read-only
- No sensitive data stored on any server

## Troubleshooting

### Gmail OAuth Error: "App doesn't comply with Google's OAuth policy"

**Problem**: Getting "You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy for keeping apps secure"

**Solution**: Add your email as a test user:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "OAuth consent screen"
4. Scroll down to **"Audience"** section
5. Under "Test users", click "+ ADD USERS"
6. Enter your Gmail address (the one you'll use to sign in)
7. Click "Save"
8. Return to your app and try signing in again
9. You'll see a warning "This app hasn't been verified" - click "Continue" → "Go to [App Name] (unsafe)"

**Note**: Your app will stay in "Testing" mode (visible in the Audience section). This is normal for personal apps and allows up to 100 test users.

### Gmail OAuth Error: "redirect_uri_mismatch"

**Problem**: Getting Error 400 when trying to sign in with Google

**Solution**: Add authorized origins to your OAuth credentials:
1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. Under "Authorized JavaScript origins", add:
   - `http://localhost:3000`
   - `http://localhost:3000/`
   - `http://127.0.0.1:3000`
4. Under "Authorized redirect URIs", add:
   - `http://localhost:3000`
   - `http://localhost:3000/`
5. Click "Save"
6. Wait a few seconds for changes to propagate
7. Refresh your browser and try again

### Gmail Sign-In Not Ready

**Problem**: Clicking "Sign in with Google" shows "Google Sign-In not ready yet"

**Solution**: Wait a few seconds after page load for Google APIs to initialize, then try again

### No Emails Fetched

**Problem**: "Fetch Latest Emails" returns no results

**Solution**:
- Check that your Gmail account has emails
- Try increasing the number of emails to fetch
- Check that you granted Gmail read permission during OAuth

### Event Extraction Failed

**Problem**: "Failed: load failed" or API errors

**Solution**:
- **Server version**: Make sure Node.js server is running (`npm start`)
- **Standalone version**: Check that your Gemini API key is correct in the HTML file
- Verify your Gemini API key is valid at https://aistudio.google.com/app/apikey

## Current Keyword Filters

Events are automatically pre-filtered using these keywords to reduce API calls:
- event, talk, seminar, conference, workshop, meeting
- webinar, symposium, lecture, presentation, session
- rsvp, register, registration, invite, invitation
- join us, save the date, you're invited, calendar

Only emails containing these keywords are processed by the AI, significantly reducing API usage and costs.

## Future Enhancements

### Stage 3: Website Scraping
- Extract events from event listing websites
- Support for Eventbrite, Luma, and other platforms

### Stage 4: Smart Filtering
- User preferences for sender filtering
- Customizable keyword filtering
- Automated scheduling (daily/weekly scans)
- Smart categorization (work, personal, networking, etc.)

## Technology Stack

- **Frontend**: HTML, Tailwind CSS, Vanilla JavaScript
- **Backend**: Node.js, Express (server version only)
- **AI**: Google Gemini 2.5 Flash
- **Email**: Gmail API (OAuth 2.0)
- **Calendar**: Google Calendar URL API, iCalendar (.ics) format

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
