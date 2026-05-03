## Created on 22th April 2026, Finalized on 27th April 2026 by Viola Voon Li Wei

## A lightweight, full-stack web application designed for HR departments to register, track, and analyze workforce distribution. This system provides a secure entry point for employee data and a high-level visual dashboard for administrative oversight.

## Folder Structure
1. backend/: The Server-Side layer.

- api.php: The REST API Controller that handles routing and business logic.

- employees.json: The Persistence Layer acting as a lightweight flat-file database.

2. frontend/: The Client-Side layer.

- src/App.js: Built with React, managing the stateful UI and API communication.

- src/App.css: Custom styling following UI/UX best practices for a clean, modern dashboard.

## Technical Stack
1. Frontend
- React.js: For a dynamic, single-page application (SPA) experience.

- CSS3: Custom variables and grid layouts for a sleek, modern aesthetic.

- State Management: React Hooks (useState, useEffect) for real-time UI updates.

2. Backend
- PHP: Handles API routing and server-side logic.

- JSON Storage: Uses a flat-file database approach for high portability and speed.

- RESTful API: Clean separation of concerns between data fetching and UI rendering.

## Installation & Setup
1. Backend:

- Place the backend folder in the PHP server directory (e.g., htdocs for XAMPP).

- Ensure employees.json has write permissions.

2. Frontend:

- Navigate to the frontend folder.

- Run npm install to install dependencies.

- Run npm start to launch the dashboard.

## Workflow
1. Frontend Validation: React ensures required fields are filled before sending data.

2. API Communication: Data is passed via REST API using JSON payloads.

3. Backend Validation: PHP sanitizes and validates data to ensure integrity.

4. Data Storage: Validated records are stored in a structured JSON format.

## Created on 22th April 2026, Finalized on 27th April 2026 by Viola Voon Li Wei

## A lightweight, full-stack web application designed for HR departments to register, track, and analyze workforce distribution. This system provides a secure entry point for employee data and a high-level visual dashboard for administrative oversight.

## Folder Structure
1. backend/: The Server-Side layer.

- api.php: The REST API Controller that handles routing and business logic.

- employees.json: The Persistence Layer acting as a lightweight flat-file database.

2. frontend/: The Client-Side layer.

- src/App.js: Built with React, managing the stateful UI and API communication.

- src/App.css: Custom styling following UI/UX best practices for a clean, modern dashboard.

## Technical Stack
1. Frontend
- React.js: For a dynamic, single-page application (SPA) experience.

- CSS3: Custom variables and grid layouts for a sleek, modern aesthetic.

- State Management: React Hooks (useState, useEffect) for real-time UI updates.

2. Backend
- PHP: Handles API routing and server-side logic.

- JSON Storage: Uses a flat-file database approach for high portability and speed.

- RESTful API: Clean separation of concerns between data fetching and UI rendering.

## Installation & Setup
1. Backend:

- Place the backend folder in the PHP server directory (e.g., htdocs for XAMPP).

- Ensure employees.json has write permissions.

2. Frontend:

- Navigate to the frontend folder.

- Run npm install to install dependencies.

- Run npm start to launch the dashboard.

## Workflow
1. Frontend Validation: React ensures required fields are filled before sending data.

2. API Communication: Data is passed via REST API using JSON payloads.

3. Backend Validation: PHP sanitizes and validates data to ensure integrity.

4. Data Storage: Validated records are stored in a structured JSON format.

5. Data Retrieval: The dashboard fetches and maps the JSON data into a clean, readable interface.
