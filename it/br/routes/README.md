# Writing tests for routes

Route tests should cover the following cases:

- Implicit language via browser settings
- Explicit language via cookies
- Setting default language via server config
- Some routes need to check 404 results (for example, `/p/<not_found>`)
