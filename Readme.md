# URL Shortener

A small Express app for creating short links, redirecting visitors, and counting clicks. Accounts are cookie sessions backed by MongoDB.

## Requirements

- Node.js 22 or newer (`nanoid` 6 does not run on older versions)
- MongoDB

## Setup

```bash
npm install
copy .env.example .env
```

Set `MONGO_URI` in `.env` to your database, then start the app:

```bash
npm start
```

The server listens on `PORT` from `.env`, or port `8000` if that variable is missing. It does not accept requests until MongoDB connects.

## Routes

| Method | Path | Auth | What it does |
| --- | --- | --- | --- |
| GET | `/` | No | Home page with the shorten form |
| GET | `/signup` | No | Sign-up form |
| GET | `/login` | No | Login form |
| POST | `/user` | No | Create an account and start a session |
| POST | `/user/login` | No | Log in |
| POST | `/url` | Yes | Create a short link for an `http` or `https` URL |
| GET | `/url/:shortId` | No | Redirect and record a click |
| GET | `/url/analytics/:shortId` | Yes | JSON click count and visit timestamps |

Short links are public. Creating a link and reading analytics require a logged-in session.

## Notes

Passwords are hashed with `scrypt` before they are stored. Accounts created before that change used plain text and will need to be signed up again.

Sessions live in memory. Restarting the server logs everyone out. The session cookie is `httpOnly`.
