# Snake and Ladder Game

A browser-based Snake and Ladder game with multiple themes, animated avatars, dice controls, and custom game dialogs.

Live demo: https://raaz2507.github.io/snake-and-Ladder-Game/

## Features

- Classical Snake and Ladder board
- 1 to 4 player setup
- Animated dice and manual dice mode
- Theme selector with saved preference
- Custom themed confirmation dialog for starting a new game
- Auto-dismissing in-game messages
- Full-screen style toggle with dynamic text
- Multiple animated character avatars

## Themes

Available themes:

- Light
- Dark
- Forest
- Neon
- Royal
- Candy
- Classic
- Jungle
- Ocean
- Sunset
- Minimal

## Avatars

Current character options:

- Red Hero
- Robot
- Ninja
- Royal
- Princess
- Wizard
- Pirate
- Explorer
- Astronaut
- Knight
- Fairy
- Detective
- Villager
- Queen
- Cyber Ninja
- Mermaid

## Project Structure

```text
index.html                    Main mode selection page
snake_n_Ladder_classic.html   Playable classic game
snake_n_Ladder_neo.html       Neo mode placeholder

css/
  index.css                   Styles for index.html
  classic.css                 Styles for classic game page
  neo.css                     Styles for neo page
  style.css                   Shared classic imports
  base.css                    Theme variables and base styles
  header.css                  Header styles
  main.css                    Main layout styles
  aside.css                   Sidebar, theme selector, controls
  bord.css                    Board styles
  dice_style.css              Dice styles
  new_player_popup.css        Player setup and custom dialogs
  footer.css                  Footer styles
  victory.css                 Victory overlay styles

js/
  script.js                   App entry point
  dashbord.js                 Main game dashboard logic
  theme.js                    Theme selection and localStorage
  dice_script.js              Dice logic
  animation.js                Avatar, snake, and ladder animation config
  animation_engine.js         Sprite animation engine

img/avatars/                  All avatar PNG spritesheets
img/snakes/                   Snake PNG spritesheets
img/ladders/                  Ladder PNG spritesheets
```

## Run Locally

Open `index.html` in a browser, or serve the folder with any local static server.

Example:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500/
```
