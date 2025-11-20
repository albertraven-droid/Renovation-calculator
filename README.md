# 🏗️ Jacksonville Renovation Cost Calculator

A beautiful, professional web-based renovation cost calculator designed for property investors in the Jacksonville, FL market. This interactive tool helps users estimate renovation costs, captures leads, and integrates seamlessly with GoHighLevel CRM.

## ✨ Features

- **Professional Design**: Modern gradient UI with smooth animations
- **12 Renovation Categories**: Kitchen, Bathrooms, Flooring, Paint, Electrical, Plumbing, HVAC, Roof, Windows, Siding, Landscaping, and Structural repairs
- **Quality Levels**: Budget, Mid-Range, and High-End options with market-specific pricing
- **Instant Calculations**: Real-time cost estimates with low/mid/high range projections
- **Lead Capture**: Integrated contact form with email validation
- **PDF Generation**: Downloadable detailed reports with all cost breakdowns
- **GHL Integration**: Automatic contact creation in GoHighLevel CRM with custom fields
- **Mobile Responsive**: Works perfectly on all devices
- **Jacksonville Market Pricing**: Accurate costs based on local market rates

## 🚀 Quick Start

### 1. Setup the Calculator

1. Upload `index.html` to your web hosting (or open directly in a browser for testing)
2. The calculator will work immediately, but you'll need to configure GHL for lead capture

### 2. Configure GoHighLevel Integration

Open `index.html` and find the configuration section at the top of the `<script>` tag (around line 702):

```javascript
const GHL_CONFIG = {
    apiKey: 'pit-00d1e783-2f53-4a9e-8795-298f6cadf7fa',
    locationId: 'YOUR_LOCATION_ID', // Replace with your GHL Location/Sub-Account ID
    apiVersion: '2021-07-28'
};
```

**Required: Update `locationId`**

1. Log into your GoHighLevel account
2. Go to **Settings** → **Business Info**
3. Copy your **Location ID** (also called Sub-Account ID)
4. Replace `'YOUR_LOCATION_ID'` with your actual location ID

**Optional: Update `apiKey`** (if different from provided)

1. Go to **Settings** → **Integrations** → **Private Integrations**
2. Create a new private integration or use existing one
3. Copy the API key and replace the value in the config

### 3. Setup Custom Fields in GHL (Recommended)

To capture all the renovation data, create these custom fields in your GHL location:

**Go to Settings → Custom Fields → Add Custom Field:**

| Field Name | Field Type | Field Key |
|------------|------------|-----------|
| Property Address | Text | property_address |
| Property Type | Dropdown | property_type |
| Square Footage | Number | square_footage |
| Property Age | Dropdown | property_age |
| Property Condition | Dropdown | property_condition |
| Quality Level | Dropdown | quality_level |
| Investment Strategy | Dropdown | investment_strategy |
| Renovation Areas | Text (Long) | renovation_areas |
| Estimated Cost (Low) | Currency | estimated_cost_low |
| Estimated Cost (Mid) | Currency | estimated_cost_mid |
| Estimated Cost (High) | Currency | estimated_cost_high |
| Calculation Date | Date/Time | calculation_date |

### 4. Customize Contact Information

Update the phone number and consultant information in the HTML (around line 688):

```html
<a href="tel:9045288600" class="consultation-btn">Call Clayton: (904) 528-8600</a>
```

Replace with your actual phone number and name.

## 📊 How It Works

### User Flow

1. **User enters property details**: Address, type, square footage, age, and condition
2. **Selects renovation scope**: Checks off which areas need renovation
3. **Chooses quality level**: Budget, Mid-Range, or High-End finishes
4. **Provides contact info**: Name, email, phone (optional), and investment strategy
5. **Gets instant results**: Low/mid/high cost estimates with detailed breakdown
6. **Downloads PDF report**: Complete renovation estimate in professional PDF format
7. **Lead captured in GHL**: Contact automatically created with all data and tags

### Pricing Logic

The calculator uses Jacksonville market-specific pricing:

**Kitchen:**
- Budget: $8,000 - $15,000
- Mid-Range: $15,000 - $30,000
- High-End: $30,000 - $60,000

**Bathrooms (per bathroom):**
- Budget: $4,000 - $7,000
- Mid-Range: $7,000 - $12,000
- High-End: $12,000 - $25,000

**Flooring (per sq ft):**
- Budget: $3/sq ft
- Mid-Range: $6/sq ft
- High-End: $12/sq ft

*See code for complete pricing database*

**Automatic 15% Contingency**: Added to all estimates to account for unexpected expenses

## 🎨 Customization

### Update Branding

**Colors**: Edit the CSS gradient values (around line 13):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Header**: Edit the header section (around line 418):
```html
<h1>🏗️ Property Renovation Cost Calculator</h1>
<p>Get Accurate Jacksonville Market Estimates in Minutes</p>
```

### Modify Pricing

Edit the `costDatabase` object in the JavaScript (around line 717) to adjust pricing for your market.

### Add/Remove Renovation Categories

1. Add checkbox in HTML (around line 520)
2. Add pricing data to `costDatabase` object
3. Calculator will automatically include in calculations

## 📥 PDF Report Features

Generated PDFs include:
- ✓ Client information
- ✓ Property details
- ✓ Cost estimate range (low/mid/high)
- ✓ Detailed cost breakdown by category
- ✓ Recommended timeline estimates
- ✓ Important considerations and notes
- ✓ Next steps and contractor tips
- ✓ Contact information for consultation

## 🔧 Technical Details

### Technologies Used
- **HTML5/CSS3**: Modern, semantic markup with flexbox/grid layouts
- **Vanilla JavaScript**: No framework dependencies for fast loading
- **jsPDF**: Client-side PDF generation
- **GoHighLevel API v2**: Contact creation and lead capture
- **Fetch API**: Asynchronous HTTP requests

### Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- **File size**: ~30KB (single HTML file)
- **Load time**: < 1 second
- **No external dependencies** (except jsPDF CDN)

## 🔐 Security Notes

1. **API Key Protection**: The API key is visible in the client-side code. For production, consider:
   - Using a serverless function (AWS Lambda, Netlify Functions, etc.)
   - Setting up CORS restrictions in GHL
   - Rate limiting on your hosting

2. **Input Validation**: All form fields have HTML5 validation. Consider adding server-side validation if you add a backend.

3. **HTTPS**: Always serve over HTTPS when handling contact information

## 📱 Mobile Responsiveness

The calculator is fully responsive with breakpoints at:
- Desktop: > 768px
- Tablet: 768px
- Mobile: < 768px

Mobile optimizations include:
- Single column layout
- Larger touch targets
- Simplified quality selector
- Easy-to-read text sizes

## 🎯 Lead Capture Strategy

### Tags Applied Automatically
- `renovation-calculator`: All leads from this tool
- `lead-magnet`: Marketing funnel tracking
- `budget-quality` / `mid-range-quality` / `high-end-quality`: Segment by budget level

### Follow-up Automation Ideas

Create workflows in GHL that trigger on these tags:

1. **Immediate**: Send PDF via email (if not using client-side generation)
2. **Day 1**: "Did you get the estimate?" follow-up email
3. **Day 3**: "Questions about your renovation?" SMS
4. **Day 7**: "Ready to move forward?" call task for sales rep
5. **Day 14**: "Financing options" email if high-cost estimate

## 🐛 Troubleshooting

### GHL Integration Not Working

**Check console for errors** (F12 in browser):
- `GHL locationId not configured`: Update the locationId in config
- `401 Unauthorized`: Check API key is correct and has permissions
- `CORS error`: Ensure request is from allowed domain in GHL settings

### PDF Not Generating

- Check browser console for jsPDF errors
- Ensure CDN link is accessible: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`
- Try clearing browser cache

### Calculation Errors

- Verify all form fields are filled (required fields marked with *)
- Check browser console for JavaScript errors
- Test with different property types and sizes

## 📈 Future Enhancements

Potential additions:
- [ ] Backend API for secure GHL integration
- [ ] Email delivery of PDF reports via SendGrid/Mailgun
- [ ] ROI calculator based on local ARV data
- [ ] Timeline estimation by category
- [ ] Contractor recommendations database
- [ ] Photo upload for condition assessment
- [ ] Multi-language support
- [ ] Analytics tracking (Google Analytics, Facebook Pixel)
- [ ] A/B testing different layouts/copy

## 📞 Support

For questions or issues:
- **Email**: cdavis@cdsremodeling.com
- **Phone**: (904) 528-8600

## 📄 License

This calculator is proprietary software. All rights reserved.

---

**Version**: 1.0.0
**Last Updated**: November 2025
**Market**: Jacksonville, FL
