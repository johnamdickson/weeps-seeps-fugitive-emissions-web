
# <img src="" width="40" height="40">  &nbsp;Weeps, Seeps and Fugitive Emissions for Web

The deployed website can be found at this [link.](/)

![Responsive Mockup Screenshot](documentation/README-files/am-i-responsive.png)

---

## Contents
- [UX](#ux)
  - [Strategy](#strategy)
    - [Project Goals](#project-goals)
    - [Marketing Strategy](#marketing-strategy)
    - [Agile Methodology](#agile-methodology)
    - [User Stories](#user-stories)
  - [Scope](#scope)
    - [Essential Content](#essential-content)
    - [Optional Content](#optional-content)
  - [Structure](#structure)
    - [Data Storage](#data-storage)
    - [Search Engine Optimisation](#search-engine-optimisation)
  - [Skeleton](#skeleton)
    - [Wireframes](#wireframes)
  - [Surface (Design)](#surface-design)
    - [Colour Scheme](#colour-scheme)
    - [Mockups](#mockups)
    - [Imagery](#imagery)
    - [Icons](#icons)
    - [Logo](#logo)
    - [Typography](#typography)
- [Features](#features)
  - [Security Features](#security-features)
  - [Existing Features](#existing-features)
  - [Features Left to Implement](#features-left-to-implement)
- [Technologies Used](#technologies-used)
  - [Languages Used](#languages-used)
  - [Frameworks, Libraries & Programs Used](#frameworks-libraries--programs-used)
- [Testing](#testing)
- [Deployment](#deployment)
  - [Integrated Development Environment](#integrated-development-environment)
  - [Forking the GitHub Repository](#forking-the-github-repository)
  - [Making a Local Clone](#making-a-local-clone)
- [Credits](#credits)
  - [Content](#content)
  - [Media](#media)
  - [Acknowledgements](#acknowledgements)

---

## UX

### Strategy

#### Project Goals
- Create a secure, intuitive web platform for documenting and monitoring weeps, seeps, and fugitive emissions.
- Support authenticated users with personalized profiles and role-based access (Admin, Superuser, User).
- Automatically log out users after inactivity while warning them in advance.

#### Marketing Strategy
- Internal utility tool aimed at site inspectors, engineers, and emissions monitors.
- Branding reflects professionalism, simplicity, and safety.

#### Agile Methodology
The project followed Agile practices using GitHub Issues and Projects to manage epics and user stories with MoSCoW prioritization.

#### User Stories
Each user story was assigned timebox values using Fibonacci points and managed via a Kanban board. Example epics include:
- Auth and Session Management
- Profile and Avatar Handling
- Admin Features
- Toast Messaging System

---

### Scope

#### Essential Content
- Login/logout via Firebase Auth
- User profile modal with image upload
- Auto-logout with countdown toast
- Admin dashboard access control

#### Optional Content
- Search bar (currently front-end only)
- Debug page for internal testing
- UI enhancements via Bootstrap tooltips and modals

---

### Structure

#### Data Storage
- Firebase Auth stores user credentials.
- Firestore holds role claims.
- Firebase Storage manages avatar images.

#### Search Engine Optimisation
- A sitemap.xml and robots.txt exist in root.
- Basic metadata and semantic HTML used.

---

### Skeleton

#### Wireframes
- Can be found [here.]() *(add link)*

---

### Surface (Design)

#### Colour Scheme
- Base red: `#ae0c00`
- Accent: muted greys, white text

#### Mockups
- See [mockups here.]() *(add link)*

#### Imagery
- Placeholder avatar image in use when user has no profile picture

#### Icons
- Material Icons used for login/logout, search, and avatar

#### Logo
- Placeholder logo. Add real one here:
<p align="center">
  <img src="" width="200" height="200">
</p>

#### Typography
- Google Fonts: Roboto and Bootstrap system fonts

---

## Features

### Security Features
- Firebase Auth with JWT tokens
- Role-based access via custom claims
- Session timeout auto-logout
- Firestore/Storage access rules

### Existing Features
- 🔐 Login/logout system
- 👤 Profile modal with avatar upload & delete
- ⏱ Session warning toast with countdown and stay-logged-in action
- 🛡 Role-based admin link
- 🧪 Debug and search tools for developers

### Features Left to Implement
-

---

## Technologies Used

### Languages Used
- **JavaScript**
- **HTML5**
- **CSS3**
- **Markdown**

### Frameworks, Libraries & Programs Used
- **React**
- **React-Bootstrap**
- **Firebase Auth, Firestore, Storage**
- **React Router**
- **Material Icons**
- **Toast Context API**

---

## Testing
Testing details can be found [here.](TESTING.md)

---

## Deployment

### Integrated Development Environment
- Gitpod
- VS Code

### Forking the GitHub Repository
1. Go to the [repo](https://github.com/johnamdickson/weeps-seeps-fugitive-emissions-web)
2. Click Fork at the top right
3. You now have your own copy

### Making a Local Clone
```bash
git clone https://github.com/YOUR-USERNAME/weeps-seeps-fugitive-emissions-web.git
cd weeps-seeps-fugitive-emissions-web
npm install
npm start
```

---

## Credits

### Content
- Auth logic adapted from Firebase documentation

### Media
- Fonts: [Google Fonts](https://fonts.google.com/)
- Icons: Material UI

### Acknowledgements
- Built by [@johnamdickson](https://github.com/johnamdickson)
- UI inspired by modern dashboard layouts

---

<a href="#contents">BACK TO CONTENTS 🔼</a>
