# Production Deployment Guide

## Current Production Version
- **Version**: v2.3 (Critical Scoring Bugs Fixed)
- **Date**: 2025-07-20
- **Commit**: e61c6dc
- **Tag**: production-v2.3-20250720-143521

## What's New in v2.3
✅ **Fixed Critical Scoring Bugs**:
- Alice now correctly shows "✅ SUCCESS" when ranking cards properly
- Fixed `bidderSuccess` state synchronization between local and GameState
- Fixed `getPlayerTokens` default that gave everyone 3 bonus points incorrectly
- Fixed automated test ending mid-round
- Fixed JavaScript error in ranking validation logic
- Fixed syntax errors in nested timeout structures

✅ **Enhanced Automated Testing**:
- Tests now run through multiple complete rounds
- Increased winning score to 100 for testing to allow longer test runs
- Game completion checks only happen between rounds, not mid-round

## Deployment Instructions

### Option 1: GitHub Pages Deployment
1. Go to your repository settings
2. Navigate to Pages section
3. Set source to "Deploy from a branch"
4. Select `production` branch
5. Set folder to `/ (root)`

### Option 2: Manual Server Deployment
```bash
# Clone the production branch
git clone -b production https://github.com/prcass/outrank.git outrank-production

# Navigate to directory
cd outrank-production

# Start server
python3 -m http.server 8000
# OR
node server.js
```

## Rollback Instructions

### Emergency Rollback
If issues occur, immediately rollback to the previous stable version:

```bash
# Rollback to previous production version
git checkout production-rollback-20250720-143514

# Or rollback production branch
git checkout production
git reset --hard production-rollback-20250720-143514
git push --force-with-lease origin production
```

### Safe Rollback Tags Available
- `production-rollback-20250720-143514` - Previous stable version (before scoring fixes)
- `outrank-v2.1` - Last known stable release (July 14, 2025)

## Testing Checklist Before Going Live
- [ ] Run automated test (click "🤖 Run Automated Test")
- [ ] Verify Alice gets "SUCCESS" when ranking correctly  
- [ ] Test multiple rounds complete without premature ending
- [ ] Check scoring calculations are accurate
- [ ] Verify all 4 categories work (Countries, Movies, Companies, Sports)
- [ ] Test on mobile viewport (375px width)
- [ ] Confirm no JavaScript console errors

## Production URLs
- **GitHub Pages**: https://prcass.github.io/outrank/
- **Custom Domain**: (if configured)

## Support
If issues arise:
1. Check browser console for JavaScript errors
2. Try rollback procedure above
3. Check GitHub Issues for known problems
4. Contact development team

---
**Last Updated**: 2025-07-20 14:35 UTC
**Deployment Status**: Ready for Production ✅