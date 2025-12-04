# Flex Living Reviews Dashboard

A comprehensive reviews management system for Flex Living properties, built for property managers to oversee, filter, and curate guest reviews from multiple channels.

**🔗 Live Demo**: [https://flex-living-reviews-dashboard-five.vercel.app/](https://flex-living-reviews-dashboard-five.vercel.app/)

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **APIs**:
  - Google Places API (for Google Reviews integration)
  - Hostaway API (mocked for demonstration)
- **State Management**: React Hooks + localStorage
- **Data Format**: JSON (normalized review structure)

## 📋 Setup & Installation

```bash
# Install dependencies
npm install

# Create environment file
# Add your Google Places API key to .env.local
GOOGLE_PLACES_API_KEY=your_api_key_here

# Run development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🎯 Key Features

### Manager Dashboard (`/dashboard`)

- **Multi-channel reviews**: View reviews from both Hostaway and Google Reviews
- **Advanced filtering**: Filter by property, channel, rating, and category issues
- **Performance metrics**: Per-property sentiment analysis and channel breakdown
- **Review visibility control**: Hide/show reviews for public display (blacklist approach)
- **Trend spotting**: Category-based filtering to identify recurring issues

### Public Property Pages (`/property/[slug]`)

- **Property-specific reviews**: Displays only reviews for the selected property
- **Responsive layout**: Flex Living-branded design matching the main website
- **Visibility filtering**: Automatically excludes reviews marked as hidden
- **Multi-source display**: Shows both Hostaway and Google Reviews

### Landing Page (`/`)

- Quick navigation to all properties
- Featured property cards with direct links
- Flex Living branding and aesthetics

## 🧠 Key Design Decisions

### 1. Blacklist vs Whitelist Approach

**Decision**: Implemented a "hide review" (blacklist) system instead of "select for public" (whitelist).

**Rationale**:

- More intuitive for managers (action only on problem reviews)
- Assumes reviews are public by default (opt-out vs opt-in)
- Reduces cognitive load when managing large review volumes

### 2. Review Normalization

**Decision**: Normalize all review sources into a unified `NormalizedReview` interface.

**Rationale**:

- Ensures consistency across different data sources
- Simplifies filtering and display logic
- Makes it easy to add new review channels in the future

**Normalized Structure**:

```typescript
{
  id: number
  listingName: string
  guestName: string
  date: string
  rating: number (0-10 scale)
  comment: string
  source: string
  type: string
  categories: { [key: string]: number }
}
```

### 3. Property Slug-Based Routing

**Decision**: Use slugified property names as URL parameters.

**Rationale**:

- SEO-friendly URLs
- Human-readable property identification
- No need for separate property ID system

**Implementation**: `"2B N1 A - 29 Shoreditch Heights"` → `/property/2b-n1-a-29-shoreditch-heights`

### 4. Category-Based Issue Filtering

**Decision**: Filter shows reviews with ratings **below 7** in the selected category.

**Rationale**:

- Focuses manager attention on problematic areas
- Helps spot recurring issues (e.g., "Cleanliness" problems across properties)
- Supports proactive property management

### 5. Dynamic Performance Metrics

**Decision**: Stats cards update based on active filters.

**Rationale**:

- Enables drill-down analysis (e.g., "Show me only Google Reviews for Property A")
- Sentiment bars provide instant visual feedback
- Channel breakdown shows data source diversity

## 🔌 API Behaviors

### Hostaway API (`/api/reviews/hostaway`)

**Status**: Mocked for demonstration

> **Note**: Real Hostaway API credentials were provided in the assessment (Account ID: 61148). However, initial testing returned a `403 Forbidden` error, likely due to endpoint permissions or authentication requirements beyond the scope of this assessment. To ensure a stable, feature-rich demonstration, I implemented a mock API that closely mirrors the expected Hostaway response structure. This approach allows the dashboard to showcase all required features (filtering, sorting, multi-property support) without API availability dependencies.

**Behavior**:

- Reads from `data/reviews.json`
- Normalizes review data
- Calculates overall rating from category averages
- Returns array of `NormalizedReview` objects

**Rating Calculation**:

```typescript
// Average of all category ratings
const avgRating =
  categories.reduce((sum, cat) => sum + cat.rating, 0) / categories.length;
```

### Google Places API (`/api/reviews/google`)

**Status**: Fully integrated

**Behavior**:

- Accepts `placeId` as query parameter
- Fetches reviews using Google Places API (New)
- Normalizes Google review structure to match Hostaway format
- Converts Google's 1-5 scale to 0-10 scale (`rating * 2`)
- Returns array of `NormalizedReview` objects

**API Configuration**:

```typescript
{
  endpoint: 'https://places.googleapis.com/v1/places/{placeId}',
  headers: {
    'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
    'X-Goog-FieldMask': 'reviews'
  }
}
```

## 🌟 Google Reviews Integration Findings

### Implementation Details

- **API Used**: Google Places API (New) - `places.googleapis.com/v1`
- **Place ID**: `ChIJPVqlfGyuEmsRHPcnCX1X1OE` (Art Gallery of New South Wales - used for demo)
- **Integration Status**: ✅ Successfully integrated

### Key Observations

1. **API Limitations**:

   - Google Places API requires a specific `placeId` for each location
   - Review data structure differs significantly from Hostaway
   - No category breakdown like Hostaway (cleanliness, communication, etc.)

2. **Data Normalization Challenges**:

   - Google uses 1-5 star rating (converted to 0-10 scale)
   - Author attribution structure is nested (`authorAttribution.displayName`)
   - Text content can be in `text.text` or `originalText.text`
   - No native review categories (would need NLP/sentiment analysis to extract)

3. **Production Considerations**:
   - Need to obtain Google Place IDs for all Flex Living properties
   - API has usage quotas and costs
   - Consider caching strategy to reduce API calls
   - May need to implement webhook/polling for new reviews

### Future Enhancements

- Implement sentiment analysis to extract category ratings from Google review text
- Add review response functionality
- Set up automated polling for new reviews
- Implement review analytics dashboard with time-series trends

## 🎨 Branding & Design

All pages follow Flex Living's brand guidelines:

- **Primary Color**: `#284E4C` (Dark Green)
- **Background**: `#FFFDF7` (Off-white/Cream)
- **Typography**: Clean, modern sans-serif
- **Spacing**: Generous padding for an airy, premium feel

## 📁 Project Structure

```
reviewsdashboard/
├── app/
│   ├── api/reviews/
│   │   ├── hostaway/route.ts    # Mocked Hostaway API
│   │   └── google/route.ts      # Google Places integration
│   ├── dashboard/page.tsx       # Manager dashboard
│   ├── property/[id]/page.tsx   # Property review pages
│   └── page.tsx                 # Landing page
├── components/
│   └── ReviewCard.tsx           # Review display component
├── data/
│   └── reviews.json             # Mock review data
└── .env.local                   # API keys (not committed)
```

## 🔒 Security Notes

- API keys stored in `.env.local` (excluded from version control)
- Client-side localStorage used for review visibility state (production would use database)
- Google API requests made from server-side route handlers to protect API key

---

**Built for**: Flex Living Developer Assessment  
**Date**: December 2025
