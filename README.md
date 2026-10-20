# Energia Frontend

The web client for **Energia**, a platform for fitness trainers and their clients. Trainers manage their clients, schedules and pricing. Clients book sessions from a trainer's public profile and pay online with Stripe. Admins manage the training categories and price list.

## Features

### Clients (members)
- Sign up or log in with email and password, or with Google.
- Browse a trainer's public profile at `/trainer/:username` and pick a session date and time slot.
- Choose a price package and pay with Stripe.
- See booked sessions on a calendar.
- Manage account settings and password, including a forgotten-password flow.

### Trainers
- Choose training categories on first login.
- Add clients. Each client gets an invite link to finish registration and set their login.
- Create, edit and delete schedules, and update clients' schedules.
- See upcoming payment dates and send payment reminders to clients.

### Admins
- Admin dashboard.
- Create and manage training categories.
- Create and manage the price list used for bookings.

## Tech Stack

| Area              | Libraries                                                    |
| ----------------- | ------------------------------------------------------------ |
| Framework         | React 18 (Create React App)                                  |
| Routing           | React Router v6                                              |
| State             | Redux, React Redux, React Context                            |
| Styling           | Tailwind CSS, Ant Design Icons, React Icons                  |
| Forms             | React Hook Form, React Datepicker, React Dropdown Select     |
| Calendar & dates  | React Big Calendar, Moment, date-fns                         |
| HTTP              | Axios                                                        |
| Auth              | Google OAuth (`@react-oauth/google`), JWT (`jwt-decode`), js-cookie |
| Payments          | Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`)      |
| UI extras         | React Toastify, React Tooltip, React Spinners, Lottie, React Typed |

## Project Structure

```
src/
├── App.jsx                  # Routes and the trainer category setup modal
├── index.jsx                # App entry: Redux store and router
├── assets/                  # Lottie loader animation
├── components/
│   ├── contexts/            # Context provider
│   ├── error/               # Error modal
│   ├── footer/, nav/, sidebar/   # Layout (web navbar, user/admin sidebars)
│   ├── forms/               # Image upload, local search
│   ├── functions/           # API calls: user, client, categories, pricing, payment
│   ├── handler/             # Completes registration from invite tokens
│   ├── pagination/
│   └── routes/              # Route guards: UserRoute, TrainerRoute, AdminRoute, NotLoggedInRoute
├── pages/
│   ├── Admin/               # Dashboard, Categories, PriceList
│   ├── Auth/                # Login, Register, Google auth, set credentials
│   ├── Booking/             # Checkout and Stripe checkout
│   ├── Home/                # Landing page and hero
│   ├── Profile/             # Trainer's public profile
│   ├── Schedule/            # Schedule details and time slot booking
│   ├── User/                # Dashboard, settings, client schedule, trainer tools
│   └── NotFound/
├── reducers/                # Redux user reducer
└── utils/                   # Time calculations, error handling, helpers
```

## Routes

| Path                                 | Access        | Page                       |
| ------------------------------------ | ------------- | -------------------------- |
| `/`                                  | Public        | Landing page               |
| `/trainer/:username`                 | Public        | Trainer's public profile   |
| `/trainer/:username/:id/:date`       | Public        | Schedule details and booking |
| `/login`, `/register`                | Logged out    | Login and sign-up          |
| `/complete-registration/:token`      | Logged out    | Finish an invited registration |
| `/dashboard`, `/settings`            | Logged in     | Dashboard and settings     |
| `/schedule-client`                   | Logged in     | Client's booked sessions   |
| `/checkout`                          | Logged in     | Stripe checkout            |
| `/clients`, `/clients/add-client`    | Trainer       | Client management          |
| `/schedule`                          | Trainer       | Trainer's schedule         |
| `/dashboard/next-payment-trainer`    | Trainer       | Upcoming payments          |
| `/admin/dashboard`                   | Admin         | Admin dashboard            |
| `/admin/categories`                  | Admin         | Manage categories          |
| `/admin/price-list`                  | Admin         | Manage pricing             |

## Getting Started

### Prerequisites

- Node.js 16+ and npm (or Yarn)
- The Energia backend API running and reachable

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/incodestudios/energia-frontend.git
   cd energia-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root that points to the backend. Include the trailing slash, because the endpoint paths are added straight onto this URL:

   ```env
   REACT_APP_BACKEND_URL=http://localhost:8000/api/
   ```

4. Start the development server:

   ```bash
   npm start
   ```

   The app runs at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command         | Description                                      |
| --------------- | ------------------------------------------------ |
| `npm start`     | Run the app in development mode                  |
| `npm run build` | Make a production build in `build/`              |
| `npm test`      | Run tests in watch mode                          |

## Configuration Notes

- **Backend URL:** all API requests use `REACT_APP_BACKEND_URL`.
- **Google sign-in:** the Google OAuth client ID is currently set inside `src/pages/Auth/GoogleAuth.jsx` and `GoogleAuthBooking.jsx`.
- **Stripe:** the Stripe publishable key is currently set inside `src/pages/Booking/Checkout.js` and uses a test key.

For production, move both into environment variables, for example `REACT_APP_GOOGLE_CLIENT_ID` and `REACT_APP_STRIPE_PUBLISHABLE_KEY`.

## License

Private. © Incode Studios.
