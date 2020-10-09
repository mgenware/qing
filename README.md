<div align="center">
	<img src="./web/static/img/main/qing.svg" width="300" height="300" alt="The Qing Project">
	<br>
	<h1>Qing [Work in Progress]</h1>
</div>

Content management system (CMS) on Go/MySQL, start your forum / blog site in seconds!

**Qing is still in early stages and under heavy development, not ready for production yet.**

## Features

- Fast and modern, built with Go, TypeScript, Web Components, mingru
- SEO-friendly, no SPA on public pages
- i18n
- Universal, works on desktop and mobile
- Configurable and extensible
- Builtin dark theme support

## Tech stack

- Frontend
  - TypeScript
  - Web components (lit-element)
- Backend
  - Golang
  - [mingru](https://github.com/mgenware/mingru) for database access layer
- Database
  - MariaDB (or compatible versions of MySQL)
- External dependencies
  - Redis: in-memory cache
  - ImageMagick: image processing

Qing intended to run on docker in future.

## Roadmap

✅ Available 🚧 Work-in-progress ❌ Not started

|                        |     |
| ---------------------- | --- |
| Login and registration | ✅  |
| Blogging               | ✅  |
| Dashboard              | 🚧  |
| Integration tests      | 🚧  |
| Forum                  | ❌  |
| QnA                    | ❌  |
| 3rd-party OAuth login  | ❌  |
| Dockerfy               | ❌  |
