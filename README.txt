FlipQuest — Closer Neon Design (HTML + CSS)
==========================================

This package is a STATIC UI FOUNDATION, not a playable game.

TO USE WITH YOUR EXISTING FLIPQUEST FOLDER:
1. Copy css/style.css over your existing css/style.css.
2. Create assets/images if it does not exist.
3. Copy assets/images/topographic-background.svg into that folder.
4. If your existing index.html matches the class names from our recent
   FlipQuest HTML lesson, you can keep it. Otherwise, use the provided
   index.html as a visual reference, but confirm with your teammates first.
5. Open index.html in Chrome and refresh with Ctrl+Shift+R.

Do NOT overwrite your teammates' js/game.js or js/ui.js.

KEY IDS TO KEEP CONSISTENT WITH YOUR TEAM:
- easy, medium, hard (difficulty radio buttons)
- play-button, card-grid, card1 ... card18
- timer, moves, combo, matched-pairs, total-pairs
- time-limit, freeze-button, hint-button, peek-button
- sound-button, settings-button, support-button

CURRENT BEHAVIOR:
- Easy visually shows 12 cards in a 4 x 3 layout.
- Medium and Hard visually show 18 cards in a 6 x 3 layout.
- Other controls are static; gameplay, timer, costs, card symbols,
  and matched-pair totals are managed by your team's JavaScript.
- Your instructor requires a fully working 12-card version. Complete
  that first before treating 18-card modes as finished.

BACKGROUND:
assets/images/topographic-background.svg is a generated abstract pattern
in a dark navy / neon teal / pink / lime style to approximate your mockup.
The original concept image is an illustration, so CSS cannot reproduce its
exact artwork pixel-for-pixel without custom artwork; this implementation
uses reusable editable HTML/CSS and a local vector background instead.

All resources in this package work offline.
