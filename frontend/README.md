# CourseSignal Frontend

## Build

To build the frontend, run `npm install && npm run build-css` from the `frontend` directory in your terminal.

## Run

To run the frontend for testing purposes, run `npm start` from the `frontend` directory. This will start a `live-server` instance serving the contents of the `public` folder with hot-reload capabilities.

## Deploy

You can deploy the frontend by serving the contexts of the `frontend/public` folder with your HTTP server of choice.

## Contributing

HTML files can be placed directly in the `public` folder. Any changes to styles should be added to `src/styles.css` or `tailwind.config.js`; changes to these files will need to be built via `npm run build-css` to reflect on the page.
