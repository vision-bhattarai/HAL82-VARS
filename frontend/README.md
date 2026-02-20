# StartEzz Frontend

React-based frontend for the StartEzz fundraising platform.

## Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Navbar.js     # Navigation bar
│   └── Navbar.css
├── pages/            # Page components
│   ├── Landing.js    # Landing page with stats
│   ├── Login.js      # User login
│   ├── Register.js   # User registration
│   ├── Dashboard.js  # Campaign listings
│   ├── CampaignDetail.js  # Campaign details & donation
│   ├── AddCampaign.js     # Create campaign (startup only)
│   ├── BecomeStartup.js   # Upgrade to startup
│   └── *.css         # Component styles
├── services/         # API services
│   └── api.js        # Axios instance & API calls
├── App.js            # Main app component with routing
├── App.css          # Global styles
├── index.js         # React entry point
└── index.css        # Base styles
```

## Key Features

### Pages

1. **Landing Page** (`Landing.js`)
   - Shows platform statistics
   - Features overview
   - Call-to-action buttons

2. **Authentication** (`Login.js`, `Register.js`)
   - User registration with profile info
   - Secure login
   - Form validation

3. **Dashboard** (`Dashboard.js`)
   - Browse all active campaigns
   - Filter by trending/popular
   - Campaign cards with progress bars

4. **Campaign Detail** (`CampaignDetail.js`)
   - Full campaign information
   - Real-time progress tracking
   - Donation interface
   - Quick donation buttons

5. **Add Campaign** (`AddCampaign.js`)
   - Startup-only campaign creation
   - Product details and pricing
   - Image upload
   - Target dates

6. **Become Startup** (`BecomeStartup.js`)
   - Upgrade general user to startup
   - Company details
   - Industry category selection

### Components

- **Navbar**: Navigation with user menu
- **Campaign Card**: Displays campaign preview in grid
- **Progress Bar**: Visual funding progress

## API Integration

All API calls go through `services/api.js` which uses Axios with:
- Base URL: `http://localhost:8000/api`
- CORS credentials enabled
- Automatic error handling

### API Endpoints Used

- Authentication: Register, login, logout
- Users: Get current user, become startup
- Campaigns: List, create, update, get details
- Donations: Make donation, track progress

## Styling

- **Global Styles**: `index.css`
- **App Layout**: `App.css`
- **Component Styles**: Separate CSS file per component
- **Responsive**: Mobile-first design with media queries

### CSS Classes

- `.container`: Max-width content wrapper
- `.button-primary`: Primary action button
- `.button-secondary`: Secondary button
- `.button-success`: Success button
- `.error-message`: Error styling
- `.success-message`: Success notification
- `.card`: Card component
- `.progress-bar`: Progress bar element

## Environment Setup

The frontend expects the backend API at:
```
http://localhost:8000
```

To change the API URL, edit `src/services/api.js`:
```javascript
const API_URL = 'http://your-api-url/api';
```

## Development

### Debug Mode
- Check browser console for errors
- Use React DevTools browser extension
- API responses logged to console

### Hot Reload
- Changes automatically reflect in browser
- Saves development time

## Testing

```bash
npm test
```

Runs the test suite in interactive mode.

## Common Issues

### Port 3000 Already in Use
```bash
PORT=3001 npm start
```

### API Connection Issues
1. Ensure backend is running on port 8000
2. Check CORS configuration in Django settings
3. Verify API URL in `services/api.js`

### Module Not Found
```bash
npm install
```

### Blank Page on Load
1. Check browser console for errors
2. Verify internet connection
3. Clear browser cache and reload

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Build & Deployment

### Production Build
```bash
npm run build
```

This optimizes:
- Code minification
- Asset optimization
- Source map generation

### Deploy to Netlify/Vercel
1. Push code to Git repository
2. Connect repository to Netlify/Vercel
3. Set build command: `npm run build`
4. Set publish directory: `build/`

---

**StartEzz Frontend** - Fundraising Platform UI 🚀
