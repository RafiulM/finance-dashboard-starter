# App Flow Document

## Onboarding and Sign-In/Sign-Up

When a new visitor opens the finance dashboard starter, they arrive at the Sign Up page. This page shows a simple form asking for an email address and a password. After the user enters their details and clicks the Create Account button, the application sends these credentials to the backend endpoint at `/api/auth`. The server checks that the email is not already registered, hashes the password securely, and creates a new user record. On success, the user is automatically signed in and taken to the main dashboard.

If the visitor already has an account, they can switch to the Sign In page from a link at the bottom of the sign-up form. On the Sign In page, the user types their email and password and clicks the Sign In button. The credentials go to the same `/api/auth` endpoint for validation. If they match an existing account, the user is redirected to the dashboard. A Sign Out link is always visible in the header once signed in, allowing the user to end the session and return to the Sign In page.

There is no built-in password recovery flow in this version. If a user forgets their password, they must contact the site administrator or wait for an update that will add a reset link.

## Main Dashboard or Home Page

After signing in, the user lands on the Dashboard. At the top of the screen a fixed header shows the application name and a Sign Out link. On the left side, a vertical sidebar displays navigation options for Dashboard and, in future versions, other sections like Reports or Settings. The central area of the page presents financial insights pulled from a static `data.json` file. This area includes charts, tables, and summary cards that display key metrics such as total balances, recent transactions, and performance indicators. The layout is responsive so it adapts to different screen widths, ensuring the charts and tables remain easy to read.

From the dashboard, the user can click on any chart or table row to drill down into details. These details appear on new pages that reuse the same header and sidebar layout for consistency. If the user clicks Sign Out, the application clears their session token and returns them to the Sign In page.

## Detailed Feature Flows and Page Transitions

When the user submits the Sign Up form, the front end shows a loading spinner inside the button. The application calls the `/api/auth` route with a POST request carrying the email and password. If the server responds with a success status, the user’s session token is stored in a secure cookie, and the app navigates to the `/dashboard` route. If the server returns an error because the email is already taken, the form displays a red error message underneath the email field and allows the user to try again.

The Sign In flow works in a similar way. When the credentials are incorrect, the page shows an inline error message above the password field. On successful login, the app sets the session cookie and transitions to `/dashboard` without a full page reload, thanks to client-side routing.

Inside the dashboard, each widget or table row is interactive. If the user clicks on a widget card summarizing monthly spending, the app uses the Next.js file-based routing to load `/dashboard/monthly-spending`. The layout component wraps the new page automatically so the header and sidebar remain intact. As the user moves between data views, the sidebar highlights the current section.

Clicking Sign Out triggers a client-side call to an API endpoint that clears the token cookie. Then the app navigates back to `/sign-in`. Any attempt to access `/dashboard` without a valid session redirects the user to the Sign In page.

## Settings and Account Management

In this first version, account management is limited to signing out. There is no dedicated profile or preferences page. Users cannot change their email or password through the interface. All other account settings and notification preferences will be added in a later release. After signing out, users return to the Sign In page and can sign in again or create a new account.

## Error States and Alternate Paths

If a user submits the Sign In or Sign Up form with missing or invalid information, the form fields highlight in red and display a brief message explaining the issue. When the server is unreachable or returns a 500-level error, the page shows a banner at the top reading “Server error. Please try again later.” and the form fields remain editable so the user can retry.

When the user’s network drops while on the dashboard, a toast notification appears saying “Connection lost. Reconnecting…” and the widgets stop updating. Once connectivity returns, the notification disappears and the static data reloads. Any attempt to navigate to a protected route without a valid session token redirects the user back to the Sign In page.

## Conclusion and Overall App Journey

A person discovering the app first lands on the Sign Up page, enters an email and password, and creates an account. They are immediately authenticated and taken to the interactive Dashboard, where they can view financial charts and tables sourced from a placeholder data file. From there, they can navigate between detailed data views, always with the consistent header and sidebar visible. At any point, they can click Sign Out to end their session and return to the Sign In page. In its current form, the app focuses on a smooth onboarding experience and a clear, data-driven dashboard, with more advanced account settings and data integrations planned for future updates.