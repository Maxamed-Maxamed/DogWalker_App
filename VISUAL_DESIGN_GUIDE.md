# Authentication UI Visual Design Guide

## 🎨 Color Palette

### Primary Colors
```
Blue:        #0a7ea4  ███████  Primary brand color
Blue Light:  #E6F4F9  ███████  Light backgrounds
Blue Dark:   #085F7C  ███████  Hover/active states
White:       #FFFFFF  ███████  Backgrounds
Black:       #000000  ███████  Apple branding
```

### Gray Scale (9-step)
```
Gray 50:   #F9FAFB  ███████  Lightest gray
Gray 100:  #F3F4F6  ███████  
Gray 200:  #E5E7EB  ███████  Divider lines, borders
Gray 300:  #D1D5DB  ███████  Input borders
Gray 400:  #9CA3AF  ███████  Placeholder text, icons
Gray 500:  #6B7280  ███████  Secondary text
Gray 600:  #4B5563  ███████  
Gray 700:  #374151  ███████  Labels, button text
Gray 800:  #1F2937  ███████  
Gray 900:  #111827  ███████  Primary text, headings
```

### Semantic Colors
```
Success:  #10B981  ███████  Green for success states
Error:    #EF4444  ███████  Red for errors
Warning:  #F59E0B  ███████  Orange for warnings
Info:     #3B82F6  ███████  Blue for information
```

### Social Brand Colors
```
Google:   #DB4437  ███████  Google red
Apple:    #000000  ███████  Apple black
```

---

## 📐 Spacing System (8px base unit)

```
xs:    4px   ▯
sm:    8px   ▯▯
md:   16px   ▯▯▯▯
lg:   24px   ▯▯▯▯▯▯
xl:   32px   ▯▯▯▯▯▯▯▯
xxl:  48px   ▯▯▯▯▯▯▯▯▯▯▯▯
xxxl: 64px   ▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯
```

---

## 🔤 Typography Scale

### Font Sizes
```
xs:    12px  Example Text
sm:    14px  Example Text
base:  16px  Example Text
lg:    18px  Example Text
xl:    20px  Example Text
2xl:   24px  Example Text
3xl:   30px  Example Text
4xl:   36px  Example Text
5xl:   48px  Example Text
```

### Font Weights
```
Regular:    400  Example Text
Medium:     500  Example Text
Semibold:   600  Example Text
Bold:       700  Example Text
Extrabold:  800  Example Text
```

---

## 📱 Login Screen Layout

```
┌─────────────────────────────────────┐
│                                     │
│          [LOGO - 80x80]            │
│                                     │
│         Welcome back                │  ← 36px bold
│   Sign in to continue your journey  │  ← 16px gray-600
│                                     │
│  ┌───────────────────────────────┐ │
│  │  🌐  Continue with Google     │ │  ← 56px height
│  └───────────────────────────────┘ │
│                                     │
│  ───── or sign in with email ───── │
│                                     │
│  Email                              │  ← 14px semibold
│  ┌───────────────────────────────┐ │
│  │ ✉  you@example.com            │ │  ← 56px height
│  └───────────────────────────────┘ │
│                                     │
│  Password                  Forgot?  │  ← 14px blue
│  ┌───────────────────────────────┐ │
│  │ 🔒  ******************  👁    │ │  ← 56px height
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │        Sign In                │ │  ← 56px blue button
│  └───────────────────────────────┘ │
│                                     │
│   Don't have an account? Sign Up   │
│                                     │
└─────────────────────────────────────┘
```

---

## 📱 Signup Screen Layout

```
┌─────────────────────────────────────┐
│    [HERO IMAGE - happydog.png]     │  ← 200px height
│    [Dark overlay 40% opacity]      │
│         [LOGO - 60x60]              │
│        Join DogWalker               │  ← 30px bold white
│  Start your journey with trusted   │
│            walkers                  │
└─────────────────────────────────────┘
│                                     │
│  ┌───────────────────────────────┐ │
│  │  🌐  Continue with Google     │ │  ← 56px height
│  └───────────────────────────────┘ │
│                                     │
│  ───── or sign up with email ───── │
│                                     │
│  Full Name                          │
│  ┌───────────────────────────────┐ │
│  │ 👤  John Doe                  │ │
│  └───────────────────────────────┘ │
│                                     │
│  Email                              │
│  ┌───────────────────────────────┐ │
│  │ ✉  you@example.com            │ │
│  └───────────────────────────────┘ │
│                                     │
│  Password                           │
│  ┌───────────────────────────────┐ │
│  │ 🔒  Create a strong password 👁│ │
│  └───────────────────────────────┘ │
│  Strong  ████████████████░░░░      │  ← Strength indicator
│                                     │
│  Confirm Password                   │
│  ┌───────────────────────────────┐ │
│  │ 🔒  Re-enter your password  👁│ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │      Create Account           │ │  ← 56px blue button
│  └───────────────────────────────┘ │
│                                     │
│  By signing up, you agree to our   │
│  Terms of Service and Privacy      │
│  Policy                             │
│                                     │
│   Already have an account? Sign In │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎯 Touch Target Specifications

### Minimum Sizes (Accessibility)
- **iOS Minimum**: 44x44 points
- **Android Material**: 48x48 dp
- **Comfortable**: 56x56 px ✅ (our standard)

### Component Sizes
```
Primary Button:      56px height  ✅
Input Field:         56px height  ✅
Social Auth Button:  56px height  ✅
Icon Button:         44px minimum ✅
Text Link:           44px touch area ✅
```

---

## 💫 Shadow Elevations

### Small (sm)
```
Used for: Social buttons, input focus
shadowColor: #000
shadowOffset: { width: 0, height: 1 }
shadowOpacity: 0.05
shadowRadius: 2
elevation: 2
```

### Medium (md)
```
Used for: Primary buttons, cards
shadowColor: #000
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.1
shadowRadius: 4
elevation: 4
```

### Large (lg)
```
Used for: Modals, elevated cards
shadowColor: #000
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.15
shadowRadius: 8
elevation: 8
```

---

## 🔄 Border Radius

```
none:    0px   □
sm:      4px   ▢
md:      8px   ▢
lg:     12px   ▢  ← Used for buttons/inputs
xl:     16px   ▢
xxl:    24px   ▢
full:  9999px  ●  ← Used for strength bar
```

---

## 🎨 Component Styling Reference

### Primary Button
```typescript
{
  height: 56,
  borderRadius: 12,
  backgroundColor: '#0a7ea4',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
}
```

### Input Container
```typescript
{
  height: 56,
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: '#D1D5DB',
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 16,
}
```

### Social Button
```typescript
{
  height: 56,
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: '#D1D5DB',
  backgroundColor: '#FFFFFF',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 2,
}
```

### Divider
```typescript
{
  height: 1,
  backgroundColor: '#E5E7EB',
}
```

---

## ♿ Accessibility Guidelines

### Color Contrast Ratios
```
Primary Text (Gray 900 on White):    16.5:1  ✅ AAA
Secondary Text (Gray 600 on White):   7.0:1  ✅ AAA
Placeholder (Gray 400 on White):      4.6:1  ✅ AA
Blue Button (White text on Blue):     4.5:1  ✅ AA
```

### Screen Reader Labels
```
Email Input:
  accessibilityLabel: "Email address"
  accessibilityHint: "Enter your email address"
  accessibilityRole: "text"

Password Toggle:
  accessibilityLabel: "Hide password" / "Show password"
  accessibilityRole: "button"

Google Button:
  accessibilityLabel: "Continue with Google"
  accessibilityHint: "Sign in using your Google account"
  accessibilityRole: "button"
```

### Touch Targets
```
✅ All buttons: 56px height
✅ All inputs: 56px height
✅ Icon buttons: 44px minimum
✅ Text links: 44px touch area
✅ Toggle icons: 44px touch area
```

---

## 🎭 Interactive States

### Button States
```
Default:   Blue background, white text
Pressed:   95% scale, darker blue
Loading:   Spinner, disabled
Disabled:  60% opacity
```

### Input States
```
Default:   Gray border, white background
Focused:   Blue border, white background
Error:     Red border, white background
Disabled:  Gray background, 60% opacity
```

### Password Strength
```
Weak:    Red (#EF4444)    25% progress
Fair:    Orange (#F59E0B) 50% progress
Good:    Blue (#0a7ea4)   75% progress
Strong:  Green (#10B981)  100% progress
```

---

## 📏 Layout Measurements

### Padding & Margins
```
Screen horizontal padding:  24px (lg)
Screen vertical padding:    32px (xl)
Section spacing:            24px (lg)
Input group spacing:        8px (sm)
Form field spacing:         24px (lg)
Button margin top:          8px (sm)
Footer margin top:          32px (xl)
```

### Header Spacing
```
Logo margin bottom:    16px (md)
Title margin bottom:   4px (xs)
Subtitle alignment:    center
Header padding top:    32px (xl)
Header padding bottom: 24px (lg)
```

### Hero Image (Signup)
```
Height:           200px
Overlay opacity:  40%
Logo size:        60x60
Title size:       30px
Subtitle size:    16px
```

---

## 🖼️ Asset Requirements

### Logos
```
newlogo.png:   Used in login header
happydog.png:  Used in signup hero
```

### Recommended Sizes
```
@1x:  80x80 (login), 60x60 (signup overlay)
@2x:  160x160, 120x120
@3x:  240x240, 180x180
```

---

## 🎬 Animation Timing

```
Fast:    150ms  - Button press feedback
Normal:  250ms  - Input focus transitions
Slow:    350ms  - Modal animations

Easing:  ease-in-out  - Default
Spring:  cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## 📱 Responsive Breakpoints

```
Small:   Width < 375px   (iPhone SE)
Medium:  375-414px        (iPhone 12/13)
Large:   414px+           (iPhone 14 Pro Max)
Tablet:  768px+           (iPad)
```

### Adaptations
- Small: Compact spacing, smaller fonts
- Medium: Standard spacing (our base)
- Large: Generous spacing, larger fonts
- Tablet: Multi-column layouts (future)

---

## 🔐 Security Visual Indicators

### Password Visibility Toggle
```
Hidden:  eye-off-outline icon (Ionicons)
Visible: eye-outline icon (Ionicons)
Color:   Gray 400 (#9CA3AF)
Size:    20px
```

### Password Strength Colors
```
Empty:   No indicator
Weak:    Red bar, red text
Fair:    Orange bar, orange text
Good:    Blue bar, blue text
Strong:  Green bar, green text
```

### Loading States
```
Button:         White spinner on blue
Social button:  Gray spinner on white
Overlay:        Prevents interaction
```

---

## 🎯 Design Principles Checklist

✅ **Bold Minimalism**
- Strong visual hierarchy ✅
- Generous whitespace ✅
- Clear CTAs ✅
- Minimal decoration ✅

✅ **Mobile-First**
- Touch-optimized (56px) ✅
- Keyboard-aware ✅
- Safe area respecting ✅
- Responsive layouts ✅

✅ **Trust & Safety**
- Professional aesthetics ✅
- Security features visible ✅
- Transparent actions ✅
- Error prevention ✅

✅ **Accessibility**
- Screen reader support ✅
- Large touch targets ✅
- High contrast ✅
- Semantic roles ✅

---

This visual design guide ensures consistency across the authentication experience and provides clear specifications for future design work! 🎨✨
