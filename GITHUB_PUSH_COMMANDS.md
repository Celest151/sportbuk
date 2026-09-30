# Push current SPORTBUK changes to GitHub

Repository: `https://github.com/Celest151/sportbuk`  
Branch: `main`  
Run these commands **one at a time** in PowerShell from:

`E:\Learning\WebApplicationUSTH\ecommerce-main`

## 1. Review changes

```powershell
git status --short
git diff
git log --oneline -10
```

## 2. Stage code, catalog assets, and documentation

```powershell
git add -- .gitignore README.md IMAGE_ASSET_GUIDE.md GITHUB_PUSH_COMMANDS.md
git add -- backend/package.json backend/scripts/seed-demo.js backend/scripts/replace-demo-catalog.js backend/scripts/translate-catalog-to-english.js backend/src/routes/products.js backend/src/utils/productVariant.js
git add -- frontend/src frontend/public/assets/images/catalog
git add -- slides/presentation
```

These paths include the store locator, image crop editor, price-slider fix, English catalog migration, restored product images, and documentation. Raw originals in `img/` are not staged by these commands.

## 3. Review what will be committed

```powershell
git diff --cached --stat
git diff --cached
git status --short
```

Check the staged list before continuing. Local `.env` files, uploaded images in `backend/uploads/`, dependencies, and build output should not be included.

## 4. Commit and push

```powershell
git commit -m "Add store locator and update product catalog"
git push -u origin main
git status --short
```

Only run the push after the commit succeeds. Untracked `img/` files may still appear in the final status; they are local originals.

## If GitHub rejects the push because main has newer commits

```powershell
git pull --rebase origin main
git push -u origin main
```

If the rebase reports conflicts, resolve them before pushing:

```powershell
git status
```

Edit the reported conflicting files, stage each resolved file with `git add -- "path/to/file"`, then run:

```powershell
git rebase --continue
```

Repeat until the rebase finishes, then run `git push -u origin main`.

## Database changes

Git pushes source code and bundled assets, **not MongoDB records or admin-uploaded files**. On another machine with an existing Vietnamese catalog, run the migration from its `backend` directory:

```powershell
npm run catalog:english
```

Transfer the MongoDB data and `backend/uploads/` separately when reproducing your current edited catalog. The English migration does not create missing products.
