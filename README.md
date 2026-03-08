# Match Time
Match Time is a full-stack marathon timer built with Ruby on Rails as a backend API that serves a React frontend bundled with Vite.
It uses a high-precision browser timer as well as bibs to track times for racers as they cross the finish line.
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

## Overview
- Match Time loads on the Timer tab. Racer, Category, and Results tabs are accessible in the same nav bar.
![1](https://github.com/user-attachments/assets/f252e98c-b68b-4ff7-87ca-2ea5fb10f151)
- Users can navigate to the Category tab to begin Match entry.
![2](https://github.com/user-attachments/assets/6b4e3a5f-4f7b-4724-ac2f-745aa95e9044)
- Users start by adding categories manually or importing via the button bar at the bottom of the screen.
![3](https://github.com/user-attachments/assets/15a3f9e2-87f6-4a66-b421-c6d92aca4896)
- Categories are added and displayed immediately upon submit. This will determine what categories racers are added to when entered into the app.
![4](https://github.com/user-attachments/assets/16c821d9-ca55-4bd5-9d23-704f71d2a264)
- Racers are displayed and added/edited/deleted via the Racer tab.
![5](https://github.com/user-attachments/assets/c894f5ef-d841-4a43-9b59-0bb16f33daa0)
- Sex, race number, and handicap are automatically filled in when a category is selected.
![6](https://github.com/user-attachments/assets/919d7050-06ec-4898-af90-b28e1984a03d)
![7](https://github.com/user-attachments/assets/bb07ebd9-70e5-4db6-b980-96366d2be51f)
- Newly added racers are immediately displayed onscreen.
![8](https://github.com/user-attachments/assets/345b10f3-80a0-4d06-a105-e86a4c8d6c72)
- Once the timer is started in the Timer tab, bib numbers can be entered and racer names are displayed but not submitted.
![9](https://github.com/user-attachments/assets/5a45e100-6dc5-4f56-b6f6-3d9db37954a3)
- Once the record button is hit, racers and their times are immediately displayed on the left.
![10](https://github.com/user-attachments/assets/99abf89c-7bf1-4648-94bb-b89e28b174c9)
- The results in the Result tab are also updated at the same time.
![11](https://github.com/user-attachments/assets/a5afd28d-1c7a-40e2-8f12-6dc3dbd3792c)
- Newly added racers are immediately accessible in the timer tab.
![12](https://github.com/user-attachments/assets/0ba9b019-b619-412a-bbbe-af2eaa21f4f4)
- If an unregistered bib number is entered, its place is entered into the display and results.
![13](https://github.com/user-attachments/assets/e7bc4ac5-0156-4851-a26d-777d89b9e296)
- The user is then able to register the previously unregistered bib number.
![14](https://github.com/user-attachments/assets/231dda38-224d-4e1c-81f8-d34465ddea2f)
- The timer is immediately updated with the racer's information.
![15](https://github.com/user-attachments/assets/56e561af-09c3-49c1-ba0d-9f39b5ce1c0e)
- Preliminary results are also immediately updated.
![16](https://github.com/user-attachments/assets/0fd4b832-86a5-4232-84bb-b6623fa68d67)
- Records can also be edited to switch bib numbers or adjust times if mistakes are made.
![17](https://github.com/user-attachments/assets/3f7f814a-298e-4424-be2d-d19acaefdab5)

