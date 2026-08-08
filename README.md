# Tijdcapsule — versie 14

Dit is de huidige versie van de Tijdcapsule-site.

## Bestanden

- `index.html`
- `style.css`
- `script.js`
- `images/hero.jpg`
- `images/pietro.jpg`
- `images/usb.png`

## Zelf een foto toevoegen bij "Hoe werkt het?"

Er staat bewust een placeholder.

Upload in GitHub simpelweg een foto naar:

`images/conversation.jpg`

Je hoeft niets aan de HTML of CSS te veranderen. Zodra dat bestand bestaat,
wordt de placeholder automatisch vervangen door jouw foto.

## Tekstwijziging in deze versie

Onder **"Een goed gesprek, gewoon goed bewaard."** staat nu:

- Een Tijdcapsule kan een gesprek zijn tussen ouder en kind, twee vrienden,
  partners, grootouder en kleinkind, of iemand die zijn of haar verhaal wil vastleggen.
- Geef een Tijdcapsule cadeau voor een verjaardag, jubileum of pensioen.
- Je bepaalt zelf waar het gesprek over gaat. Sommige mensen vertellen hun levensverhaal,
  anderen praten over hun jeugd, werk of familie. Alles is goed.

## Nog vervangen

In `index.html` staat nog het tijdelijke e-mailadres:

`hello@example.com`

Vervang dit door je eigen e-mailadres.


## Versie 15 — boekingsaanvraag

De pakketknoppen openen nu een boekingsformulier in een modal.

Het formulier vraagt om:
- naam
- e-mail
- telefoonnummer
- voor wie de Tijdcapsule is
- voorgestelde datum
- voorgestelde tijd
- optionele extra informatie

De pakketkeuze wordt automatisch ingevuld als iemand vanuit een pakket op de knop klikt.

### Formspree koppelen

De site is klaar voor Formspree, maar er staat bewust nog een placeholder in `index.html`:

`https://formspree.io/f/YOUR_FORM_ID`

Maak bij Formspree een formulier aan en vervang `YOUR_FORM_ID` door je echte formulier-ID.

Daarna worden aanvragen echt verstuurd en verschijnt na een succesvolle inzending automatisch het bevestigingsscherm.

Totdat die ID is ingevuld doet de site alsof er **niet** is verzonden: de bezoeker krijgt dan een nette foutmelding in plaats van een valse bevestiging.
