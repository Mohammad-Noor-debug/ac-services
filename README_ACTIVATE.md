# AC Services Riyadh

## How to Make the Website Active Again

If you want to make your website publicly accessible at your custom domain in the future:

1. **Go to the Vercel Dashboard:**
   - Visit https://vercel.com/dashboard and select your `ac-services` project.

2. **Add Your Domain:**
   - Navigate to the "Domains" section in your project settings.
   - Click "Add" and enter your custom domain (e.g., `ac-services.vercel.app` or your own domain).
   - Follow the instructions to verify and configure DNS if needed.

3. **Deploy Your Site:**
   - Make sure your `index.html` (or main entry file) is present in your project.
   - Commit and push any changes to your repository.
   - Vercel will redeploy and your site will be live at the domain you added.

---

**Tip:**
- If you want to temporarily hide your site, you can disconnect the domain or remove `index.html` and redeploy.
- To restore, simply add the domain back and ensure your site files are present.

---

For more details, see the [Vercel documentation](https://vercel.com/docs/concepts/projects/domains).
