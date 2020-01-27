

# SCTCE Unofficial Attendance App
An Android application for SCTCE students to view their attendance data.
### Preview

<img src="https://github.com/hari-govind/sctce/blob/master/github_assets/app_preview.gif?raw=true" width="234px" height="415px" alt="App Preview GIF">

## Features
- Multiple account management
- Calculates the hours to be attended to make attendance 75%
- Summary view with visual clues and search
- Compact overview of daily attendance in a calender view

## How it works
- Using the provided user login, the app scrapes attendance details from the official SCTCE attendance application(~~CampusSoft~~ SCTCE now uses a third-party attendance solution.).
- The retrieved data is converted into JSON and processed.
- The processed data is then presented in a user-friendly manner

## Implementation Details
- Cheerio is used to scrape and retrieve attendance details from the official website
- React Navigation, React Native Vector Icons and React Native Calenders are used for data presentation.
