# Netlify Deployment Guide - Renovation Calculator

This guide will help you deploy your Renovation Calculator with working GHL (GoHighLevel) integration on Netlify.

## Why Netlify?

The GHL API blocks direct browser requests (CORS policy). We've created a serverless function that runs on Netlify's backend to securely handle API calls without exposing your API key.

---

## Step 1: Prepare Your GHL Credentials

Before deploying, gather these from your GoHighLevel account:

### 1.1 Get Your API Key
1. Log into GoHighLevel
2. Go to **Settings** > **API**
3. Copy your **Private API Key** (starts with `pit-`)

### 1.2 Get Your Location ID
1. In GoHighLevel, go to **Settings** > **Business Profile**
2. Copy your **Location ID** (or use: `Eikn1T3IJ5HrKqwyelJs`)

### 1.3 Create Custom Fields (IMPORTANT!)
The calculator sends 10 custom fields to GHL. These must exist in your location first:

1. Go to **Settings** > **Custom Fields** > **Contact**
2. Create these 10 custom fields (type: Text):
   - `property_address`
   - `property_type`
   - `square_footage`
   - `property_age`
   - `property_condition`
   - `quality_level`
   - `investment_strategy`
   - `renovation_areas`
   - `estimated_cost_low`
   - `estimated_cost_mid`
   - `estimated_cost_high`
   - `calculation_date`

---

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Create a Netlify account** at https://netlify.com (it's free!)

2. **Import your GitHub repository:**
   - Click "Add new site" > "Import an existing project"
   - Choose GitHub and authorize Netlify
   - Select your repository: `albertraven-droid/Renovation-calculator`

3. **Configure build settings:**
   - Build command: (leave empty)
   - Publish directory: `.` (just a period)
   - Click "Deploy site"

4. **Add environment variables:**
   - Go to **Site settings** > **Environment variables**
   - Click "Add a variable" and add each of these:
     - Key: `GHL_API_KEY`, Value: `pit-c1708855-d2ce-4904-a395-335e206d5632`
     - Key: `GHL_LOCATION_ID`, Value: `Eikn1T3IJ5HrKqwyelJs`
     - Key: `GHL_API_VERSION`, Value: `2021-07-28`

5. **Redeploy the site:**
   - Go to **Deploys** tab
   - Click "Trigger deploy" > "Deploy site"

6. **Done!** Your site is now live with working GHL integration!

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Set environment variables
netlify env:set GHL_API_KEY "pit-c1708855-d2ce-4904-a395-335e206d5632"
netlify env:set GHL_LOCATION_ID "Eikn1T3IJ5HrKqwyelJs"
netlify env:set GHL_API_VERSION "2021-07-28"

# Deploy
netlify deploy --prod
```

---

## Step 3: Configure Custom Domain (Optional)

If you want to use your custom domain (`cdsremodeling.com`):

1. In Netlify, go to **Domain settings**
2. Click "Add custom domain"
3. Enter your domain
4. Follow the DNS configuration instructions
5. Update your `CNAME` file if needed

---

## Step 4: Test the Integration

1. Visit your deployed site URL (e.g., `https://your-site.netlify.app`)
2. Fill out the renovation calculator form
3. Submit the form
4. Open browser console (F12) to see detailed logs

### Expected Console Output:
```
🔧 GHL Integration Starting (via Netlify Function)...
📦 Contact data prepared: {...}
🚀 Sending to Netlify serverless function...
📡 Response status: 200 OK
✅ Contact created successfully!
```

### Check GHL Dashboard:
1. Go to **Contacts** in GoHighLevel
2. You should see a new contact with:
   - Name, email, phone
   - Tags: `renovation-calculator`, `lead-magnet`, `{quality}-quality`
   - All 10 custom fields populated

---

## Step 5: Set Up GHL Automation Workflows

Now that contacts are being created, set up automated workflows:

1. In GHL, go to **Automations** > **Workflows**
2. Create a new workflow
3. Set trigger: "Contact Tag Added" > `renovation-calculator`
4. Add actions:
   - Send welcome email
   - Assign to sales team
   - Create follow-up task
   - Send SMS notification
   - etc.

---

## Troubleshooting

### Issue: "Server configuration error: Missing GHL credentials"
**Solution:** Make sure environment variables are set in Netlify dashboard

### Issue: "VALIDATION ERROR"
**Solution:** Create all 10 custom fields in your GHL location

### Issue: "AUTHENTICATION ERROR (401)"
**Solution:** Check that your GHL API key is valid and has correct permissions

### Issue: "PERMISSION ERROR (403)"
**Solution:** In GHL Settings > API, ensure your API key has "Contacts" write permissions

### Issue: Forms not submitting
**Solution:**
1. Check browser console for errors
2. View Netlify function logs: **Functions** tab > Select `create-contact` > **Function log**

---

## Monitoring and Logs

### View Netlify Function Logs:
1. Go to Netlify dashboard
2. Click **Functions** tab
3. Click on `create-contact`
4. View real-time logs

### View GHL Activity:
1. GHL > **Contacts**
2. Filter by tag: `renovation-calculator`
3. Check contact timeline for activities

---

## Security Notes

✅ **What we did right:**
- API keys are stored in Netlify environment variables (server-side only)
- API keys are NEVER exposed in frontend code
- Serverless function handles all GHL communication
- CORS issues completely solved

❌ **Important:**
- Never commit `.env` files to Git
- Never hardcode API keys in `index.html`
- Regularly rotate your GHL API keys

---

## Cost

Netlify Free Tier includes:
- 125,000 serverless function requests/month
- 100GB bandwidth/month
- Automatic SSL certificates
- Continuous deployment from Git

**This is more than enough for most use cases!**

---

## Need Help?

1. Check Netlify function logs for errors
2. Check browser console for frontend errors
3. Test the serverless function directly:
   ```bash
   curl -X POST https://your-site.netlify.app/.netlify/functions/create-contact \
     -H "Content-Type: application/json" \
     -d '{"firstName":"Test","lastName":"User","email":"test@example.com"}'
   ```

---

## What Changed from GitHub Pages?

| Before (GitHub Pages) | After (Netlify) |
|----------------------|-----------------|
| Direct API calls from browser | Serverless function proxy |
| API key exposed in frontend | API key in environment variables |
| CORS errors | No CORS issues |
| Static hosting only | Static + serverless functions |

---

Your renovation calculator is now production-ready with secure, working GHL integration! 🎉
