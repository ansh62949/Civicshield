# 🚀 CivicSense - Deployment & Troubleshooting Guide

## 🏃 Quick Run (2 minutes)

### Windows
```cmd
cd "civicshield-frontend (2)\civicshield-frontend"
npm install
npm install react-globe.gl three
npm run dev
```

### Mac/Linux
```bash
cd civicshield-frontend*/civicshield-frontend
npm install && npm install react-globe.gl three
npm run dev
```

**Then open**: http://localhost:5173

---

## ⚠️ Troubleshooting

### Issue: `npm: command not found`
**Solution**: Install Node.js from https://nodejs.org (v16+)

### Issue: Port 5173 already in use
**Solution**: 
- Change in `vite.config.js`: `port: 5174`
- Or kill process: `lsof -ti:5173 | xargs kill -9`

### Issue: Globe not rendering (blank black area)
**Solution**: 
- Ensure `react-globe.gl` and `three` are installed
- Run: `npm install react-globe.gl three`
- Wait 30 seconds for GeoJSON to load from GitHub
- Check browser console (F12) for errors

### Issue: Styles not loading
**Solution**:
- Clear cache: `rm -rf node_modules` then `npm install`
- Restart dev server
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Module not found errors
**Solution**:
- Ensure all files are in correct folders
- Check file paths match imports
- Look for typos in component names
- Clear node_modules: `npm install`

### Issue: React components not updating
**Solution**:
- Check browser console for JS errors (F12)
- Ensure useState imports are at top of file
- Check that state updates use new objects (immutable)

### Issue: Slow performance on mobile
**Solution**:
- Close other tabs/apps
- Check browser console for errors
- Globe rendering is heavy - expect 2-3 sec load on first visit
- Disable bloat extensions

---

## 📦 Building for Production

```bash
# Build optimized production bundle
npm run build

# Output folder: dist/
# Deploy dist/ folder to any static hosting
```

### Deploy to Vercel (Free)
```bash
npm i -g vercel
cd civicshield-frontend
vercel
# Follow prompts
```

### Deploy to Netlify (Free)
```bash
# Build first
npm run build

# Then upload dist/ folder to netlify.com
# Or use Netlify CLI:
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages
```bash
# Update vite.config.js: base: '/repo-name/'
npm run build
# Then push dist/ as gh-pages branch
```

### Deploy to Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install react-globe.gl three
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
```

```bash
docker build -t civicsense .
docker run -p 3000:3000 civicsense
```

---

## 🔍 Testing Checklist

### Desktop (Chrome DevTools - responsive 768px+)
- [ ] TopBar displays correctly
- [ ] Left sidebar visible and sticky
- [ ] Center column shows content
- [ ] Right sidebar shows alerts/leaderboard
- [ ] All screens work
- [ ] 3-column layout responsive to window resize

### Tablet (768px - 1024px)
- [ ] Layout adapts smoothly
- [ ] Bottom nav visible on mobile breakpoint
- [ ] Sidebars hide/show correctly
- [ ] Touch interactions work
- [ ] Scrolling smooth

### Mobile (375px width)
- [ ] Single column layout
- [ ] TopBar at top (56px)
- [ ] Content scrolls
- [ ] BottomNav at bottom (64px)
- [ ] All 5 screens accessible via bottom nav
- [ ] Modals slide up from bottom
- [ ] Scrollable areas have smooth scroll
- [ ] No horizontal overflow (swipe doesn't reveal hidden content)

### Interactions Testing
- [ ] Click location pill → cycles through Sector 62 → Delhi → Mumbai
- [ ] Click story → opens story viewer
- [ ] Story auto-plays, tap sides to navigate
- [ ] Click filter chip → posts update
- [ ] Click post → detail modal opens
- [ ] Click upvote → count increments with animation
- [ ] Click escalate → toast appears
- [ ] Click "Post" button → post modal opens
- [ ] Post modal: type → AI preview appears
- [ ] Post modal: upload photo → preview shows
- [ ] Post submit → loading → success → closes
- [ ] New post appears in feed
- [ ] Click Globe → states clickable
- [ ] Click state → flies to region
- [ ] Region panel shows scores
- [ ] Search area → autocomplete works
- [ ] Click area → all scores update
- [ ] Click "Compare" → comparison view
- [ ] Click profile posts → detail opens
- [ ] All toasts disappear after 2 seconds

### Visual Testing
- [ ] All colors match design (teal #1D9E75, colors proper)
- [ ] Fonts are system fonts (not broken)
- [ ] Spacing consistent (4px base)
- [ ] Border radius correct (12px cards, 20px buttons)
- [ ] Shadows minimal/none (flat design)
- [ ] Hover states work (buttons darken, cards lift)
- [ ] Active states work (buttons pressed)
- [ ] Animations smooth (no jank)

---

## 📊 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Edge    | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Opera   | 76+     | ✅ Full |

Note: Globe rendering requires WebGL (supported on all modern browsers)

---

## 🔐 Security Notes

- ✅ No sensitive data (all mock)
- ✅ No API keys exposed
- ✅ No database connections
- ✅ Client-side only
- ✅ Safe to share source code
- ✅ No XSS vulnerabilities (React escapes by default)
- ✅ No CSRF (no forms with side effects)

---

## 📝 Code Quality Checks

```bash
# Lint code
npm run lint

# Format code
npm run format

# These commands are optional but good to run before deploying
```

---

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [React Globe GL](https://vasturiano.github.io/react-globe.gl/)
- [Three.js Docs](https://threejs.org)

---

## 📞 Common Questions

**Q: Can I add a backend later?**
A: Yes! Replace mockData.js with API calls. Keep component structure same.

**Q: Can I deploy this as-is?**
A: Yes! It's a static site. Works on any host (Vercel, Netlify, GitHub Pages, etc.)

**Q: How do I add more data?**
A: Edit `src/mockData.js` and add to the arrays. Components will render automatically.

**Q: Can I change colors?**
A: Edit `src/index.css` CSS variables, or update Tailwind config.

**Q: Is this mobile-app ready?**
A: Almost! Add PWA support (manifest.json, service worker) to make it installable.

**Q: Can I use this for production?**
A: With modifications: add authentication, connect to real API, add error handling, setup analytics.

---

## 🎯 Performance Tips

For faster dev experience:
1. Disable browser extensions
2. Use Chrome (fastest)
3. Close other tabs/apps
4. Use wired internet for GeoJSON fetch
5. Clear build cache: `npm run build && npm run preview`

For prod optimization:
1. Build: `npm run build`
2. Check size: `du -sh dist/`
3. Use CDN (Cloudflare, Bunny, etc.)
4. Enable gzip compression on server
5. Use image optimization for photos

---

## 📄 File Size Reference

Expected sizes after build:
- **HTML**: ~5 KB
- **CSS**: ~40 KB (Tailwind)
- **JS**: ~200 KB (React + Globe)
- **Total**: ~245 KB (gzipped ~80 KB)

---

## ✅ Deployment Checklist

Before going live:
- [ ] Test all 5 screens work
- [ ] Test on mobile (375px)
- [ ] Test on desktop (1920px)
- [ ] All interactions work
- [ ] No console errors (F12 → Console)
- [ ] Run `npm run build` succeeds
- [ ] dist/ folder has files
- [ ] ToastNotification appears properly
- [ ] Modals close/open correctly
- [ ] Animations are smooth

---

**Ready to launch! 🚀** Questions? Check browser console (F12) for detailed error messages.

---

Built for CivicSense Hackathon. Make cities safer, one report at a time. 🛡️
