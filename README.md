# Food Tracker

Mobile-first calorie and macro tracker built as an installable web app.

## Current features

- Daily calorie target and progress
- Protein, carbohydrate, and fat targets
- Manual food / meal logging
- Meal categories: Breakfast, Lunch, Dinner, Snack
- Delete entries
- Date navigation
- Seven-day calorie + protein snapshot
- Persistent browser storage using `localStorage`
- Camera / photo upload flow
- Editable AI food-analysis results UI
- Progressive Web App manifest + service worker

## GitHub Pages

The static app can be hosted directly with GitHub Pages.

In GitHub:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select the `main` branch and `/ (root)`.
4. Save.

The manual tracker will work entirely on GitHub Pages.

## Photo AI architecture

Do **not** place an OpenAI API key in `index.html`, JavaScript, GitHub Pages settings, or any client-visible configuration.

The browser sends a POST request to:

`/api/analyze`

with JSON shaped like:

```json
{
  "image": "data:image/jpeg;base64,..."
}
```

The secure backend should return:

```json
{
  "foods": [
    {
      "name": "Grilled chicken breast",
      "serving": "about 180 g",
      "cal": 300,
      "p": 56,
      "c": 0,
      "f": 7,
      "fiber": 0
    }
  ],
  "note": "Estimated from the image; verify portions, oils, and sauces."
}
```

The app lets the user edit every detected item before saving the meal.

If the backend lives on another origin, enter its base URL under **Settings → AI backend URL**. For example, if the setting is `https://food-api.example.com`, the app calls `https://food-api.example.com/api/analyze`.

## Data

Version 1 stores food history locally on the device/browser. This makes it fast and private, but clearing site data or switching phones will not automatically transfer history. Cloud sync can be added later.
