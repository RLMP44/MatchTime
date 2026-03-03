# Match Time
Match Time is a full-stack marathon timer built with Ruby as Rails as a backend API that serves a React frontend bundled with Vite.
It is uses a high-precision browser timer as well as bibs to track times for racers as they cross the finish line.
It also calculates pace and adjusted times using the provided handicaps for each division.

## Tech Stack
- Ruby on Rails: 7.2.3
- Ruby: 3.3.1
- React: 19.2.0
- Vite: 7.2.4 (used only for bundling and development)

## Architecture Overview
Rails is the root application and provides all backend functionality.
React lives in /frontend and is built using Vite.
The production React build is copied into public/ and committed to the repository.
New developers do not need Node, npm, or Vite installed to run the app.
Rails serves the frontend directly from public/.

## Getting Started
- Fork the repository
- In bash:
  - 'bundle install'
  - 'rails db:setup'
  - 'rails serve'

## When updating the frontend
- React source code lives in /frontend.
- To update the frontend, you must rebuild the frontend and copy it into Rails using the following steps in bash:
  - ./scripts/build_frontend.sh
  - git add public
  - git commit -m 'commit-message'

## Development Workflow
- Use Vite (npm run dev) when actively developing React UI.
- Use Rails (rails s) for backend development.
