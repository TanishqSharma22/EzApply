# EzApply Fix TODO
Status: Approved plan - executing PHASE 2+

## PHASE 2: Config Fixes
- [x] 1. Create ezapply-backend/.env
- [x] 2. Create ezapply-frontend/.env
- [x] 3. Edit ezapply-backend/src/config/db.js (SSL always)
- [x] 4. Fix package.json files to exact spec

## PHASE 3: Install deps
- [x] Backend: clean + npm install
- [x] Frontend: clean + npm install

## PHASE 4: Database
- [x] Run node ezapply-backend/scripts/init-db.js (note: run after deps install complete)

## PHASE 5: Servers
- [ ] Backend: npm run dev
- [ ] Frontend: npm run dev

## PHASE 6: Tests
- [ ] Backend health curl
- [ ] Register user
- [ ] Jobs list
- [ ] Browser 8-step flow
