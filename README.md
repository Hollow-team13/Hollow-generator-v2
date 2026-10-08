# Hollow Generator

A dark, focused generator for Giveaway and Condo microsites.

## Giveaway pages

Create a shareable Giveaway page for games such as Murder Mystery 2, Adopt Me!,
Blox Fruits, Grow a Garden, Pet Simulator 99, or Blade Ball. Configure the prize,
number of winners, end date, accent color, and (optionally) an HTTPS verification
destination. The generated page redirects participants to that destination; it
does not validate entries, store participant data, or run a drawing.

This project is hosted on GitHub Pages, so generated settings are encoded in the
share URL and are not private. Never put passwords, cookies, tokens, or other
secrets in the generator.

## GitHub Pages deployment

The `Deploy GitHub Pages` workflow builds the Vite app from `main` and publishes
the static output to the existing `gh-pages` branch.
