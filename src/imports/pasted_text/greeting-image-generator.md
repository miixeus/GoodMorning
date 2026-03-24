Update the existing mobile-first web app design into a fully functional UI/UX ready for code export.

GOAL:
Create a simple and intuitive web app that dynamically generates shareable greeting images (Bom dia, Boa tarde, Boa noite) using random background images and text overlay, with full interaction flow.

TARGET AUDIENCE:
People aged 40+, low technical knowledge. The interface must be extremely simple, clear, and easy to use.

---

STYLE & DESIGN RULES:

* Minimalist and clean
* Very large buttons
* High contrast
* Rounded corners (border-radius: 16px or more)
* Soft shadows
* Friendly and warm visual tone
* No clutter, no complex UI

COLOR PALETTE:

* Primary: #00cf40 (green)
* Secondary: #5f19ea (purple)
* Background: #ffffff
* Text: #000000
* Light gray sections: #f5f5f5

TYPOGRAPHY:

* Sans-serif (Inter or Roboto)
* Large font sizes (minimum 16px, titles 24px+)
* Strong readability

---

FUNCTIONAL REQUIREMENTS (IMPORTANT):

Design the UI already thinking about real functionality implementation.

The system must:

1. Select greeting type (Bom dia / Boa tarde / Boa noite)
2. Accept optional name input
3. Generate dynamic message text
4. Load a random background image based on category
5. Overlay text on the image
6. Allow refreshing image (new background with same message)
7. Enable WhatsApp sharing

---

SCREENS:

1. HOME / GENERATOR SCREEN

Elements:

* Title:
  "Crie sua mensagem"

* Subtitle:
  "Escolha uma opção e gere sua imagem"

* 3 large buttons (stacked or grid):
  🌞 Bom dia
  🌇 Boa tarde
  🌙 Boa noite

* Input field:
  Placeholder: "Digite seu nome (opcional)"

* Main CTA button (very large, green):
  "Gerar imagem"

---

2. RESULT SCREEN (MAIN FUNCTIONAL SCREEN)

Elements:

* Image preview card (very prominent):

  * Rounded corners
  * Shadow
  * Aspect ratio 1:1 or 4:5
  * Background image (dynamic)
  * Dark overlay (30–40%) for text readability

* Dynamic text overlay (centered):
  Example:
  "Bom dia, Maria! ✨
  Que seu dia seja incrível!"

* Buttons below image:

PRIMARY BUTTON (green):
"Compartilhar no WhatsApp"

SECONDARY BUTTON (outlined or p
