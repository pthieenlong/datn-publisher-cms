# Overview

- This is styling guide for this project

## UI Rules

### Color Scheme

#### Primary Colors

- **Blue primary**: blue-500 (#3b82f6)

- **Blue Hover**: blue-600 (#2563eb)

- **Blue Light**: blue-50 (#eff6ff), blue-100 (#dbeafe)

- **Blue Border**: border-blue-500, border-blue-500/60

#### Successful Colors

- **Green Primary**: green-500 (#22c55e)

- **Green Hover**: green-600 (#16a34a)

- **Green Light**: green-50, green-100, green-200

- **Green Text**: text-green-600

#### Error/Danger Colors

- **Red Primary**: red-500 (#ef4444)

- **Red Hover**: red-600 (#dc2626)

- **Red Light**: red-50, red-100, red-200

- **Red Text**: text-red-500, text-red-600

#### Background Colors

- **White**: bg-white - main background

- **Backdrop**: bg-black/50 with backdrop-blur-sm - modal overlays

- **Semi-transparent**: bg-white/50, bg-white/90 - headers, overlays

- **Light Backgrounds**: bg-zinc-50, bg-zinc-100 - stat cards, disabled states

- **Linear Gradient Backgrounds**:

  - Blue gradient: bg-linear-to-br from-sky-600 via-blue-600 to-indigo-600

  - Yellow/Orange gradient: bg-linear-to-br from-yellow-400 via-orange-500 to-pink-500

  - Blue to Indigo: bg-linear-to-br from-blue-500 to-indigo-600 - user avatars

  - Blue to Indigo light: bg-linear-to-br from-blue-50 to-indigo-50 - stat cards

### Typography

**Heading**: `"Poppins"` (600). **Body**: `"Poppins"` (400, 500).

## Styling guide

- Restrict using Box-shadow, using light fade border instead
- Only using Gradient or Linear when it is realy needed, for example, it could be used for hover button
- Rounded/Border-radius: child box radius must be smaller than father box radius
- Restrict glassmorphism / blur background
- Don't use linear background color: #3F5EFB - #FC466B
- Don't use Icon Emoji, use Lucide instead
- Restrict using animations, only when it is realy needed
