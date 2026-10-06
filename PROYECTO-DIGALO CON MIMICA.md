## Charades Web App - Project Specification

## Overview

A lightweight, browser-based Charades (Mímica / Dígalo con Mímica) application focused on getting people playing as quickly as possible.

The objective is not to replace party games with a complex application, but to eliminate the friction that most existing websites have:

- Too many ads.

- Limited categories.

- Forced registration or downloads.

- Slow game setup.

- No support for custom words.

The application should work as a random word generator with optional score tracking, allowing players to use their own timer and house rules.

## Project Goals

- Extremely fast to start a game.

- No login.

- No backend.

- No persistence.

- Mobile-first design.

- Clean and modern UI.

- Easy to use during a real party.

Everything exists only during the current browser session.

Refreshing the page resets the game.

## Game Modes

## 1. Free Play

The simplest mode.

Players choose one or more categories and start receiving random words.


No score.

No timer.

No restrictions.

Players organize the game however they prefer.

This mode is intended for people who already use another phone or device as a timer.

## 2. Score Mode

Adds lightweight score tracking without making the game more complicated.

Configuration:

- Number of teams

- Optional team names

Example:

- Team 1

- Team 2

or

- Red Team

- Blue Team

- Friends

- Family

During each turn:

- Correct (+1)

- Pass

The application keeps score only during the current session.

At the end it displays the final ranking.

No history is stored.


## Categories

Initial built-in categories:

- Movies

- TV Series

- Activities

- Objects

- Animals

- Video Games

- Sports

- Famous People

- Food

- Countries

- Professions

Additional categories can easily be added in the future.

## Movie & TV Series Titles

One feature that differentiates this project:

For Movies and TV Series, each entry should contain both:

- English title

- Latin American Spanish title

## Example:

Finding Nemo

Buscando a Nemo

or

The Office

The Office

or


Home Alone

Mi Pobre Angelito

Many players know a title in only one language.

Showing both versions avoids confusion and keeps the game flowing.

Whenever possible, use the official Latin American Spanish title, not the Spain localization.

## Word Randomization

Words should never repeat until every available word has been shown.

Implementation:

- Shuffle the selected word pool.

- Remove each word after showing it.

- When empty:

- Notify the user that all words have been used.

## Category Selection

Users can:

- Select one category.

- Select multiple categories.

- Mix all selected categories together.

Example:

Movies

TV Series

Video Games

Result:

One combined randomized pool.


## Custom Categories

One of the main features.

Users can create temporary categories during the session.

No account required.

No saving required.

Three input methods:

## Manual

Paste or type words directly.

Example:

Iron Man Thor Captain America Hulk

Loki

## TXT Upload

Upload a plain text file.

Each line represents one word.

Example:

```
Iron Man Thor Captain America Hulk
```


## XLSX Upload

Support simple Excel files.

Accepted formats:

Single column:

Word

Thor

Hulk

or

Category Word

Marvel

Thor

Marvel

Hulk

## Mix Custom Categories

When importing a category, users can choose:

Use only this category

Mix with selected built-in categories

## AI Prompt Helper

The project will not integrate directly with an AI model.

Instead, it will include a helper section for quickly generating custom categories using ChatGPT or any

preferred AI assistant.

Example message:

## Generate a Custom Category


Copy the prompt below, replace the category name, and send it to your favorite AI assistant.

Generate a plain text list containing 150 unique items for a Charades game.

Category: [CATEGORY NAME]

Rules:

- \- One item per line.

- \- No numbering.

- \- No bullet points.

- \- No duplicates.

- \- Keep names concise.

- \- Return only the list.

Example:

Category: Marvel Characters

The generated list can then be pasted directly into the application or saved as a TXT file.

This approach keeps the project simple while still giving users an easy way to create unlimited custom categories.

## UI Flow

## Home

- Choose Game Mode

- Choose Categories

- Import Category (optional)

- Create Category (optional)

- Configure Teams (Score Mode only)

- Play

## Playing

Display one large word at a time.


Possible actions:

- Next Word (Free Play)

or

- Correct • Pass

(Score Mode)

The interface should be extremely minimal.

The current word should occupy most of the screen.

Tapping anywhere on the screen may also advance to the next word.

## End of Game

## Score Mode only.

## Display:

- Team rankings

- Total correct answers

- Total passes

Buttons:

- Play Again

- Back to Home

## Technical Stack

## Frontend

- React

- TypeScript

- Tailwind CSS

- Vite

Libraries

- XLSX (Excel import)


- React Dropzone (optional)

## Storage

- None

Backend

- None

Authentication

- None

Database

- None

Everything runs entirely in the browser.

## Future Ideas (Out of Scope)

These ideas are intentionally left out of the first version:

• User accounts • Cloud storage • Online multiplayer • Shared categories • AI integration • Timers • Sound effects • Animations tied to gameplay • Category marketplace

Keeping the scope small increases the chances of finishing a polished product.

## Why This Project?

This application solves a simple but common problem:

When friends want to play Charades, finding a clean, flexible website is surprisingly difficult.

Existing options are often filled with ads, require installation, or don't allow custom categories.


This project focuses on one goal:

## Open the website, choose some categories, and start playing in less than 30 seconds.
