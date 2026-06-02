# One Community Public Mobile App

A high-quality mobile-first service-discovery app for Cameroon.

One Community Public Mobile App is a real-world pilot product designed to help people in Cameroon find trusted local skilled workers and small service providers. Public users can search for services, view skill details, review provider profiles, and contact providers quickly through familiar channels such as WhatsApp and email inquiry.

This app is separate from the provider mobile app. The public app is for service discovery. The provider app is for approved providers to create and edit skills, upload images, update media, and manage their listings securely.

---

## Product Direction

Build a separate public mobile app called **One Community** for public service discovery while keeping provider skill creation, editing, and image upload in a separate authenticated provider app.

The first version will be tested as a controlled pilot with selected users and providers in Cameroon. If the app proves useful, the platform can then move toward stronger production infrastructure and additional features.

### Core Product Statement

**One Community is a local service-discovery platform designed to help people in Cameroon find trusted skilled workers and small service providers, view their profiles, and contact them quickly through familiar channels such as WhatsApp and email inquiry.**

---

## Target Users

| App / Platform | Audience | Primary Purpose |
| --- | --- | --- |
| One Community Public Mobile App | Public users in Cameroon | Search for local services, view skill details, contact providers, and review provider profiles. |
| One Community Provider App | Approved service providers | Create and edit skills, upload images, update media, and manage provider listings securely. |
| One Community Admin Portal | Platform administrators | Approve providers, manage requests, monitor system activity, review listings, and support operations. |

---

## App Boundary

The public mobile app should remain focused on service discovery.

| Area | Public App | Provider App |
| --- | --- | --- |
| Authentication | Not required for basic search | Required |
| Skill search | All approved public skills | Provider-owned skills only |
| Create/edit skill | No | Yes |
| Upload images | No | Yes |
| Contact provider | WhatsApp and email inquiry | Not the main purpose |
| Reviews | View initially; submit later | Provider can view later |
| Admin controls | No | No - handled in admin portal |

---

## Pilot MVP Scope

The first public release should be simple, attractive, fast, and professional enough to present to real users and potential supporters.

### Included in the Pilot MVP

- Home/search screen showing skills near the user or selected city.
- Keyword search for services such as carpenter, plumber, tutor, mechanic, tailor, or electrician.
- Popular category dropdown with simple local categories.
- Skill cards with thumbnail, skill name, category, city, trust label, and short description.
- Skill detail screen with images, description, location information, provider preview, WhatsApp action, and email inquiry modal.
- Provider profile screen with provider information, all public skills, and reviews placeholder.
- English interface for pilot launch, with bilingual-ready architecture for future French support.

### Deferred Until After Pilot Validation

- Public user accounts and saved favorites.
- In-app chat and push notifications.
- Full map view and distance routing.
- Payment integration and subscriptions.
- Public review submission and rating moderation.
- Advanced analytics dashboard for growth and advertising decisions.

---

## High-Quality Interface Direction

The app should feel like a serious product from the beginning. It should not look like a class project, unfinished prototype, or basic mockup.

### Design Principles

| Principle | How it should appear in the app |
| --- | --- |
| Mobile-first simplicity | Large touch targets, readable cards, clear action buttons, and no crowded screens. |
| Trust and safety | Visible provider status labels such as Verified Provider, Profile Reviewed, and Available by WhatsApp. |
| Local relevance | City, region, area, and category should be visible on cards and detail pages. |
| Professional branding | Clean green/white theme, consistent spacing, modern typography, and polished empty/loading states. |
| Fast decision flow | Users should move from search to provider contact in a few taps. |
| Low-friction adoption | No account should be required for search or provider contact during the pilot. |

### Target Design Feel

The app should feel like a combination of:

- Google local search simplicity.
- Uber-style mobile clarity.
- A trustworthy local service directory for Cameroon.

---

## Main Screens

### 1. Home / Search Screen

The opening screen should immediately communicate value:

> Find trusted local services near you.

Main elements:

- One Community logo/name.
- Location status or city selector.
- Search bar with placeholder: `What service do you need?`
- Popular category dropdown.
- Local skill/provider results.
- Professional skill cards with thumbnail, category, city, and trust label.

Recommended categories:

- All Categories
- Carpentry
- Plumbing
- Electrical
- Mechanic
- Tutoring
- Tailoring
- Hairdressing
- Cleaning
- Driving
- Other

### 2. Skill Detail Screen

The skill detail screen should help users decide whether to contact a provider.

Main elements:

- Large image or image carousel.
- Skill title, category, city, region, area, and full description.
- Provider preview section.
- Trust labels such as Approved Provider, Profile Reviewed, or Verified Provider.
- Primary WhatsApp contact button.
- Secondary Email Inquiry button.
- Clear spacing and strong call-to-action buttons.

### 3. Email Inquiry Modal

Fields:

- Name
- Email
- Phone, optional
- Message

The modal should submit to the backend inquiry/contact endpoint and show a clear success or error message.

### 4. Provider Profile Screen

Main elements:

- Provider name, city, region, and optional verification/status indicator.
- Short provider bio or service summary.
- Contact actions, if available.
- All public skills belonging to the provider.
- Reviews placeholder: `Reviews coming soon`.

---

## Pilot User Journey

```text
App opens
  -> Home/Search Screen
  -> Search or filter by category/city
  -> Skill List Results
  -> Skill Detail Screen
  -> Contact by WhatsApp or Email Inquiry
  -> Provider Profile if more trust information is needed
```

The user should be able to complete the search-to-contact journey without creating an account.

---

## Language Strategy

The app should support both English and French in the future, but the first pilot will launch in English for speed and focus.

### Phase 1 - Pilot MVP

- English interface only.
- All visible text should be stored in translation files instead of hardcoded directly in screens.
- Translation keys should be used from the beginning.

### Phase 2 - Improved Pilot

- Add French translations.
- Add a simple language selector.

### Phase 3 - Production Growth

- Support English/French preferences.
- Localize category names.
- Support region-specific content if needed.

Example implementation rule:

```js
// Instead of hardcoding this directly in a screen:
"Find trusted local services near you"

// Use a translation key:
t("home.heroTitle")
```

---

## Recommended Technology Stack

| Layer | Recommended Choice |
| --- | --- |
| Mobile framework | Expo + React Native |
| Navigation | React Navigation |
| API client | Axios with environment-based API base URL |
| Location | Expo Location with manual city fallback |
| Translations | i18next or simple translation-file structure ready for English/French |
| Contact actions | React Native Linking for WhatsApp and email actions |
| State management | Local component state first; add global state only if needed later |
| Styling | Reusable theme files for colors, spacing, typography, and shadows |

---

## Backend Endpoint Plan

The app should use the real backend routes after the backend repository is scanned. These ideal routes can be adapted if the existing backend uses different route names.

| Endpoint | Purpose |
| --- | --- |
| `GET /skills` | Public skill search/list with optional query, category, city, latitude, longitude, page, and limit filters. |
| `GET /skills/:id` | Public skill detail with images, provider summary, and contact fields. |
| `GET /skills/provider/:providerId` | Public list of all active skills from one provider. |
| `GET /providers/:providerId/public` | Public provider profile information. |
| `GET /providers/:providerId/reviews` | Provider reviews and ratings when reviews are implemented. |
| `POST /contact/skill-inquiry` | Send email inquiry from public user to provider or admin workflow. |

Future-ready search query example:

```text
/skills?q=mechanic&category=Mechanic&city=Douala&lat=4.0511&lng=9.7679&page=1&limit=20
```

---

## Recommended Repository Structure

```text
one-community-public-mobile-app/
|-- README.md
|-- package.json
|-- app.json
|-- babel.config.js
|-- eas.json
|-- index.js
|-- .gitignore
|-- .env.example
|-- assets/
|   |-- icon.png
|   |-- splash.png
|   `-- adaptive-icon.png
`-- src/
    |-- api/
    |   |-- apiClient.js
    |   |-- skillApi.js
    |   |-- providerApi.js
    |   `-- inquiryApi.js
    |-- components/
    |   |-- AppButton.jsx
    |   |-- AppInput.jsx
    |   |-- CategoryDropdown.jsx
    |   |-- EmptyState.jsx
    |   |-- ErrorState.jsx
    |   |-- LoadingScreen.jsx
    |   |-- SkillCard.jsx
    |   |-- SkillImageCarousel.jsx
    |   `-- InquiryModal.jsx
    |-- navigation/
    |   `-- AppNavigator.jsx
    |-- screens/
    |   |-- HomeScreen.jsx
    |   |-- SkillDetailScreen.jsx
    |   `-- ProviderProfileScreen.jsx
    |-- services/
    |   |-- locationService.js
    |   |-- whatsappService.js
    |   `-- linkService.js
    |-- i18n/
    |   |-- en.js
    |   `-- fr.js
    |-- utils/
    |   |-- constants.js
    |   |-- formatters.js
    |   `-- validators.js
    `-- theme/
        |-- colors.js
        |-- spacing.js
        `-- typography.js
```

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/emmauopeople/one-community-public-mobile-app.git
cd one-community-public-mobile-app
```

### 2. Create the Expo app if the repository is still empty

```bash
npx create-expo-app@latest . --template blank
```

### 3. Install required dependencies

```bash
npm install axios @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context expo-location
```

### 4. Create environment file

```bash
cp .env.example .env
```

Example `.env.example`:

```env
EXPO_PUBLIC_API_BASE_URL=https://api.cameroonskills.org/api
```

### 5. Start the app

```bash
npx expo start
```

---

## MVP Implementation Order

1. Initialize Expo app and create the recommended folder structure.
2. Add React Navigation and configure Home, Skill Detail, and Provider Profile screens.
3. Create theme files for colors, spacing, typography, shadows, and reusable UI patterns.
4. Build the Home/Search screen using polished mock data.
5. Build reusable SkillCard, AppButton, AppInput, CategoryDropdown, LoadingScreen, ErrorState, and EmptyState components.
6. Add translation file structure and use English keys for all visible text.
7. Connect public skill search API after verifying available backend routes.
8. Add category filtering and city/location filtering.
9. Build Skill Detail screen with carousel, details, provider preview, and contact buttons.
10. Add WhatsApp open action with a prefilled message.
11. Add Email Inquiry modal and connect to backend contact endpoint.
12. Build Provider Profile screen with provider details, provider skills, and reviews placeholder.
13. Prepare demo APK for controlled testing with selected users and providers.

---

## Cameroon Pilot Plan

The pilot should be presented as a practical community service-discovery experiment, not as a finished company or school project.

### Pilot Goals

- Test whether users understand the app quickly.
- Test whether users can find a service provider easily.
- Test whether provider profiles create enough trust to make contact.
- Test whether users prefer WhatsApp, email inquiry, or phone contact.
- Decide whether to invest in production infrastructure and additional features.

### Suggested Pilot Categories

- Carpentry
- Plumbing
- Electrical
- Mechanic
- Tailoring
- Hairdressing
- Tutoring
- Cleaning
- Driving
- Other

### Suggested Presentation Message

> One Community is a local service-discovery platform designed to help people in Cameroon find trusted skilled workers and small service providers. The first pilot focuses on simple search, provider profiles, service listings, and WhatsApp contact. The goal is to test it with real users, collect feedback, and improve it before moving to full production infrastructure.

---

## Trust, Safety, Privacy, and Operational Quality

For real-world use, trust is as important as features.

| Area | Requirement |
| --- | --- |
| Provider trust labels | Use accurate labels such as Approved Provider, Profile Reviewed, or Verified Provider only when supported by backend status. |
| Public contact safety | Do not expose unnecessary private provider data. Show only approved public contact methods. |
| User inquiry privacy | Collect only required information: name, email, optional phone, and message. |
| Content quality | Skill images should be clear, appropriate, and related to the service. |
| Error handling | Use friendly messages for no results, network failures, and inquiry submission errors. |
| Performance | Load skill cards quickly, use thumbnails, and avoid heavy screens in the pilot. |
| Operational monitoring | Track search errors, inquiry errors, API availability, and common categories after production migration. |

---

## Production Migration Roadmap

| Stage | Focus |
| --- | --- |
| Pilot demo | Expo APK, controlled backend access, reviewed pilot data, manual feedback collection. |
| Improved pilot | Real backend connection, stable media loading, French translation, provider trust labels, inquiry tracking. |
| Production migration | Hardened cloud infrastructure, managed database, object storage, SSL, CI/CD, monitoring, backups, and incident response. |
| Growth stage | Reviews, favorites, maps, analytics, public accounts, push notifications, and possible monetization strategy. |

The first pilot should stay focused on validation. Production migration should happen after users and providers confirm that the app solves a real problem.

---

## Success Metrics

| Metric | What It Tells Us |
| --- | --- |
| Search success | Can users find a relevant provider or service within a short time? |
| Contact intent | Do users tap WhatsApp or send an inquiry after viewing a skill? |
| Profile trust | Do users say the provider profile gives enough confidence to make contact? |
| Category demand | Which services are searched most often? |
| Provider interest | Are local providers willing to create profiles and keep them updated? |
| Language feedback | Do users request French strongly enough to prioritize it immediately after MVP? |
| Repeat usefulness | Would users recommend the app to family, friends, or neighbors? |

---

## Current Status

Project planning is complete. The next step is to build the Expo React Native app using polished mock data first, then connect the real backend routes after the interface is stable.

---

## License

License to be decided before production release.
