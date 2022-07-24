# Writing tests for routes

Route tests should cover the following cases:

- Implicit locales via browser settings
- Explicit locales via cookies
- Setting the default locale via server config
- Some routes need to check 404 results (for example, `/p/<not_found>` should be 404 instead of throwing a DB-record-not-found error)
- Some routes require user sessions and should be 404 for visitors
