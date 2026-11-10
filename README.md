# Hands-free reading

A Tampermonkey userscript that scrolls long reads for you, on any website, so your hands can stay busy (brushing teeth, eating, holding a baby).

- **Nod to scroll** — nod down to read on, nod up to go back. Uses the front camera.
- **Turn your head** — left or right can scroll too, or move to the next / previous chapter.
- **Auto-scroll** — the page moves by itself at the speed you pick. Tap the text to pause.
- **Tap to scroll** — tap to move a quarter, half or full page. Either "anywhere moves down", or "left half back, right half down".

FanFiction.net chapters know their next and previous chapter. On other sites the script uses the page's own Next / Previous links (English and French).

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) (Firefox on Android works, as do desktop Chrome, Edge and Firefox).
2. Open the install link and press **Install**:
   **https://obsession-index.tinkerer.workers.dev/ffn-hands-free.user.js**

Install from the link rather than pasting the file: Tampermonkey then updates it by itself.

## Use

Tap the round head button (bottom right by default) and pick a mode. The same menu sets:

- what nodding does and what turning your head does (read on either way, change chapter, or nothing),
- how far a tap moves and where to tap,
- the Auto-scroll speed,
- where the button sits and how see-through it is.

Choices are saved in your browser. Auto-scroll and Tap to scroll run silently; tap the button to stop them.

## Privacy

The camera picture never leaves your phone. Face tracking runs on the device with Google MediaPipe 1.2.2, which the script loads from jsDelivr and Google's model storage. Nothing is sent anywhere else, and the script asks for no special Tampermonkey permissions (`@grant none`).

## Trouble

- **A red notice says two copies are on** — an older copy is still installed. Delete it in Tampermonkey, then reload.
- **Nods don't register** — hold the phone so your whole face is in the small preview, then tap Reset to take your starting position again.

## License: personal use only

You may use this script for your own personal use. **Commercial use is not allowed**: you may not sell it, bundle it into a paid product or service, or use it in a business.

The legal terms are the [PolyForm Noncommercial License 1.0.0](LICENSE.md). If you share a copy, keep the license and the copyright notice with it.

Copyright LadyDerpynette.

## Files

- `ffn-hands-free.user.js` — the script. It is a built file; changes are made in its source and rebuilt, so edits here are overwritten.
- `CHANGELOG.md` — what each version changed.
- `LICENSE.md` — the license terms.
