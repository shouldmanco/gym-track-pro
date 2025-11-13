# GymTrack Pro

An elegant gym tracking application to log your workouts, view them on a calendar, and visualize your progress with charts.

## 🚀 Getting Started

This project was created with Vite and React.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Git](https://git-scm.com/)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/<YOUR_USERNAME>/gym-track-pro.git
cd gym-track-pro
npm install
```

### Running Locally

To start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Building for Production

To build the application for production:

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## 🌐 Deploying to GitHub Pages

### Option 1: Direct Deploy (Recommended for GitHub Pages)

1. **Update `package.json`** - Set the correct homepage URL:
   ```json
   "homepage": "https://<YOUR_USERNAME>.github.io/gym-track-pro"
   ```

2. **Update `vite.config.ts`** - Set the base path for your repository:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/gym-track-pro/',
     // ...
   })
   ```

3. **Build and deploy:**
   ```bash
   npm run build
   npm run deploy
   ```

4. **Enable GitHub Pages:**
   - Go to your repository settings
   - Scroll to "GitHub Pages"
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch
   - Save

### Option 2: Using Netlify (Easiest)

1. Push your repository to GitHub
2. Go to [Netlify](https://netlify.com)
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Deploy!

### Option 3: Using Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Select "React" as framework
4. Deploy!

## 🎯 Features

- 📅 Interactive calendar view
- ➕ Add, edit, and delete workouts
- 💪 Track workout types: Pierna, Pecho, Espalda, Cardio
- 📊 Weekly progress charts
- 💾 Data stored in IndexedDB (no backend needed)
- 📱 Responsive design (mobile-friendly)
- 🎨 Dark theme UI

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages

## 📝 Notes

- All data is stored locally in your browser using IndexedDB
- No server backend required
- Works completely offline after first load

## 📄 License

MIT

## 👨‍💻 Author

Your Name
    })
    ```

### 2. Despliega

Ejecuta el siguiente comando para construir y desplegar tu aplicación:

```bash
npm run deploy
```

Este comando creará una rama `gh-pages` en tu repositorio y subirá la versión construida de tu aplicación.

### 3. Activa GitHub Pages

1.  Ve a tu repositorio en GitHub.
2.  Haz clic en **Settings** > **Pages**.
3.  En la sección **Branch**, selecciona `gh-pages` como la fuente de despliegue y haz clic en **Save**.

Espera unos minutos y tu aplicación estará disponible en la URL que configuraste en el campo `homepage`.
