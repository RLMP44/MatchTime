# Match Time
Match Time is a full-stack marathon timer built with Ruby on Rails as a backend API that serves a React frontend bundled with Vite.
It uses a high-precision browser timer as well as bibs to track times for racers as they cross the finish line.
It also calculates pace and adjusted times using the provided handicaps for each division.

## Tech Stack
- Ruby on Rails: 7.2.3
- Ruby: 3.3.1
- React: 18.3.1
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
- Match Time loads on the Timer tab. Racer, Category, Division, and Results tabs are accessible in the same nav bar.<img width="1353" height="773" alt="1" src="https://github.com/user-attachments/assets/70f8149c-d70e-4b5e-8b5b-6d4b66083c28" />
- Users can navigate to the Category tab to begin Match entry. Users start by adding categories manually or importing via the button bar at the bottom of the screen.<br><img width="407" height="300" alt="5" src="https://github.com/user-attachments/assets/1369808b-6ce7-41cc-8ced-8651e7ed4ef9" /><img width="407" height="235" alt="3" src="https://github.com/user-attachments/assets/907d51c6-b43e-46c2-9faa-ecac351b43ae" /><br>

- Categories are added and displayed immediately upon submit. This will populate the required category dropdown when racers are added.<br><img width="1352" height="770" alt="2" src="https://github.com/user-attachments/assets/c42e17d5-60b2-4cda-ae44-497c79e8429e" /><br>
- Edits are also available once categories are added by clicking on a specific category.<br><img width="397" height="236" alt="4" src="https://github.com/user-attachments/assets/7d3c1582-1e68-48af-af49-4bd52ea04e5a" /><b4>
- Divisions are then added in the Division tab, where handicaps are automatically calculated.<img width="407" height="273" alt="7" src="https://github.com/user-attachments/assets/a8c2f8e8-53c8-4d9d-aa01-ba0aff676daf" /><img width="407" height="273" alt="8" src="https://github.com/user-attachments/assets/778d56fa-3bf5-4278-b829-250d1d37f7a7" /><br><img width="1353" height="773" alt="6" src="https://github.com/user-attachments/assets/45db69e7-757d-49b8-8ef1-b42572c29967" /><br>

- Racers are displayed and added/edited/deleted via the Racer tab.<img width="1356" height="772" alt="9" src="https://github.com/user-attachments/assets/c20721a3-8aa3-4891-b6dc-e9d62a1c1cdf" /><br>

- Sex and race number are automatically filled in when a category is selected. Handicap can be filled by hand, or left blank to use default handicaps.<br><img width="687" height="437" alt="14" src="https://github.com/user-attachments/assets/45eb3bea-5eb1-4d6d-8b42-947e471d908b" /><br>

- Newly added racers are immediately displayed onscreen.<img width="1357" height="773" alt="10" src="https://github.com/user-attachments/assets/a6ce23d6-24b7-4afd-afef-5417e150870c" /><br><img width="1352" height="775" alt="11" src="https://github.com/user-attachments/assets/8215edd5-a6a1-4c16-8ee6-0c44dd0122e2" /><br>
- Once the timer is started in the Timer tab, bib numbers can be entered and racer names will be displayed on the right. Once the record button is hit, the racers and their times are immediately displayed on the left.<img width="1352" height="771" alt="12" src="https://github.com/user-attachments/assets/ca58c83b-a17a-4aab-94ce-6a14c0a53069" /><br>
- The results in the Result tab are also updated at the same time.<img width="1353" height="772" alt="13" src="https://github.com/user-attachments/assets/be676c6f-1185-4966-9b0f-e59282fcbc62" /><br>

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
- Records can also be edited to switch bib numbers or adjust times if mistakes are made.<br><img width="500" height="295" alt="1" src="https://github.com/user-attachments/assets/c30fc3ef-99cc-4359-888e-c3d4562b5ec4" />


