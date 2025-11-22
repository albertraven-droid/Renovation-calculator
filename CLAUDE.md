# CLAUDE.md - AI Assistant Development Guide

## Project Overview

**Project Name**: Jacksonville Renovation Cost Calculator
**Domain**: renovation.pro.cdsremodeling.com
**Type**: Single-page HTML application
**Purpose**: Lead generation tool for property investors in Jacksonville, FL market
**Primary Function**: Calculate renovation costs, capture leads, integrate with CRM

### Business Context
This calculator helps property investors estimate renovation costs for properties in the Jacksonville, FL market. It serves as a lead magnet by requiring contact information before showing detailed estimates, then automatically captures leads in GoHighLevel CRM via Make.com webhook integration.

---

## Architecture & Structure

### Project Type
This is a **monolithic single-file application** - everything (HTML, CSS, JavaScript) is contained in `index.html`. There is no build process, no package managers, and no bundlers.

### File Structure
```
/
├── index.html           # Main application (HTML + CSS + JS in one file)
├── README.md           # User-facing documentation
├── CNAME               # Custom domain configuration
├── .gitignore          # Git ignore patterns
└── CLAUDE.md          # This file (AI assistant guide)
```

### Why Single File?
- **Simplicity**: No build process required
- **Portability**: Easy to deploy anywhere (GitHub Pages, any web host)
- **Performance**: Single HTTP request, instant load
- **Maintenance**: All code in one place for quick edits

---

## Technology Stack

### Core Technologies
- **HTML5**: Semantic markup, form validation
- **CSS3**: Modern layouts (Flexbox, Grid), gradients, animations
- **Vanilla JavaScript**: No frameworks, ES6+ syntax
- **jsPDF**: Client-side PDF generation (CDN: v2.5.1)

### External Dependencies
```html
<!-- Only external dependency -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

### Browser Requirements
- Modern browsers with ES6+ support
- Fetch API support
- LocalStorage (for future enhancements)
- PDF blob download support

---

## Configuration Management

### Configuration Location
All configuration is in the `CONFIG` object at **line 702** of `index.html`:

```javascript
const CONFIG = {
    makeWebhookUrl: 'https://hook.us2.make.com/2ibua35llvqwxnrfah67knkisdi4jfag',
    ghlApiKey: 'pit-c1708855-d2ce-4904-a395-335e206d5632',
    ghlLocationId: 'Eikn1T3IJ5HrKqwyelJs',
    ghlApiVersion: '2021-07-28'
};
```

### Configuration Values

| Key | Purpose | Location in Code |
|-----|---------|------------------|
| `makeWebhookUrl` | Make.com webhook endpoint | Line 704 |
| `ghlApiKey` | GoHighLevel API key (reference only) | Line 707 |
| `ghlLocationId` | GHL Location/Sub-Account ID (reference only) | Line 708 |
| `ghlApiVersion` | API version (reference only) | Line 709 |

**IMPORTANT**: The GHL values are kept for reference but not directly used. All CRM integration now flows through Make.com webhook.

### Contact Information
Update consultant contact details at **line 688**:
```html
<a href="tel:9045288600" class="consultation-btn">Call Clayton: (904) 528-8600</a>
```

---

## Integration Points

### Make.com Webhook Integration

**Function**: `sendToGHL()` at **line 913**

**Flow**:
1. User submits calculator form
2. JavaScript sends POST request to Make.com webhook
3. Make.com scenario processes data and forwards to GoHighLevel
4. Contact created in GHL with all custom fields

**Data Structure Sent**:
```javascript
{
    // Contact basics
    first_name: string,
    last_name: string,
    email: string,
    phone: string,

    // Property details
    property_address: string,
    property_type: string,
    square_footage: number,
    property_age: string,
    property_condition: string,

    // Renovation details
    quality_level: string,
    investment_strategy: string,
    renovation_areas: string, // comma-separated

    // Cost estimates
    estimated_cost_low: number,
    estimated_cost_mid: number,
    estimated_cost_high: number,

    // Metadata
    calculation_date: ISO string,
    source: 'Renovation Calculator Website'
}
```

### GoHighLevel CRM Custom Fields

Required custom fields in GHL (field keys must match exactly):
- `property_address` (Text)
- `property_type` (Dropdown)
- `square_footage` (Number)
- `property_age` (Dropdown)
- `property_condition` (Dropdown)
- `quality_level` (Dropdown)
- `investment_strategy` (Dropdown)
- `renovation_areas` (Text Long)
- `estimated_cost_low` (Currency)
- `estimated_cost_mid` (Currency)
- `estimated_cost_high` (Currency)
- `calculation_date` (Date/Time)

---

## Code Organization

### HTML Structure (Lines 1-693)

**Header Section** (Lines 30-46)
- Gradient background
- Title and subtitle
- Responsive typography

**Form Sections**:
1. **Property Information** (Lines 462-512)
   - Address, type, square footage, age, condition
2. **Renovation Scope** (Lines 515-576)
   - 12 checkbox renovation categories
   - Bathroom count input
3. **Quality Level** (Lines 579-599)
   - Budget / Mid-Range / High-End selector
4. **Contact Information** (Lines 602-633)
   - Name, email, phone, investment strategy

**Results Section** (Lines 639-692)
- Hidden by default (`.results` class)
- Shows after calculation
- Cost summary cards
- Breakdown table
- PDF download button
- Consultation CTA

### CSS Styles (Lines 7-442)

**Design System**:
- Primary gradient: `#667eea` → `#764ba2`
- Dark gray: `#2d3748` → `#1a202c`
- Light backgrounds: `#f7fafc`, `#edf2f7`
- Border color: `#e2e8f0`

**Key UI Components**:
- `.quality-option`: Clickable quality level cards
- `.checkbox-item`: Renovation area checkboxes
- `.cost-card`: Result display cards
- `.breakdown-table`: Detailed cost table

**Responsive Breakpoint**: 768px (Lines 425-441)

### JavaScript Logic (Lines 698-1117)

**Key Functions**:

1. **Quality Selection Handler** (Lines 713-718)
   ```javascript
   // Toggles .selected class on quality options
   ```

2. **Cost Database** (Lines 721-782)
   - Pricing for all 12 renovation categories
   - Three quality levels per category
   - Fixed costs (min/max) or per-square-foot costs

3. **Form Submit Handler** (Lines 785-910)
   - Calculates costs based on selections
   - Generates breakdown
   - Adds 15% contingency
   - Displays results
   - Sends to Make.com webhook

4. **sendToGHL()** (Lines 913-975)
   - Prepares webhook payload
   - Sends POST to Make.com
   - Error handling (non-blocking)

5. **generatePDF()** (Lines 978-1115)
   - Uses jsPDF library
   - Multi-page PDF with formatting
   - Client-side generation and download

---

## Pricing Database

### Structure & Location
The `costDatabase` object (lines 721-782) contains all renovation pricing.

### Category Types

**Fixed Cost Range** (min/max):
```javascript
kitchen: {
    budget: { min: 8000, max: 15000 },
    'mid-range': { min: 15000, max: 30000 },
    'high-end': { min: 30000, max: 60000 }
}
```

**Per Square Foot**:
```javascript
flooring: {
    budget: { perSqFt: 3, multiplier: 1 },
    'mid-range': { perSqFt: 6, multiplier: 1 },
    'high-end': { perSqFt: 12, multiplier: 1 }
}
```

**Special Handling**:
- **Bathrooms**: Multiplied by bathroom count
- **Flooring, Paint, Roof, Siding**: Calculated per square footage

### Calculation Logic

1. **For fixed costs**:
   - Low: `min`
   - Mid: `(min + max) / 2`
   - High: `max`

2. **For per-sq-ft costs**:
   - Low: `perSqFt * squareFootage * 0.8`
   - Mid: `perSqFt * squareFootage`
   - High: `perSqFt * squareFootage * 1.2`

3. **Contingency**: 15% added to all totals

---

## Common Development Tasks

### 1. Update Make.com Webhook URL

**Location**: Line 704
**Task**: Change webhook endpoint
```javascript
makeWebhookUrl: 'https://hook.us2.make.com/YOUR_NEW_URL'
```

### 2. Modify Pricing

**Location**: Lines 721-782
**Task**: Update renovation category costs

Example - Update kitchen pricing:
```javascript
kitchen: {
    budget: { min: 10000, max: 18000 },      // Changed
    'mid-range': { min: 18000, max: 35000 },  // Changed
    'high-end': { min: 35000, max: 70000 }    // Changed
}
```

### 3. Add New Renovation Category

**Step 1**: Add checkbox in HTML (around line 520)
```html
<div class="checkbox-item">
    <input type="checkbox" id="newCategory" name="areas" value="newCategory">
    <label for="newCategory">New Category</label>
</div>
```

**Step 2**: Add pricing to database (around line 781)
```javascript
newCategory: {
    budget: { min: 3000, max: 6000 },
    'mid-range': { min: 6000, max: 12000 },
    'high-end': { min: 12000, max: 25000 }
}
```

The calculator will automatically include it in calculations.

### 4. Update Contact Information

**Phone Number**: Line 688
```html
<a href="tel:YOUR_NUMBER" class="consultation-btn">Call NAME: YOUR_NUMBER</a>
```

**Email**: Line 619 (placeholder text)
```html
<input type="tel" id="phone" placeholder="(YOUR_NUMBER)">
```

### 5. Modify Color Scheme

**Primary Gradient**: Line 16
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Header Gradient**: Line 31
```css
background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
```

### 6. Change Contingency Percentage

**Location**: Lines 839-847
**Current**: 15%
```javascript
const contingency = totalMid * 0.15;  // Change 0.15 to desired percentage
```

### 7. Add Form Fields

1. Add HTML input in appropriate section
2. Read value in form submit handler (line 785+)
3. Add to `window.calculationData.formData` (line 880+)
4. Include in `webhookData` object (line 922+)

---

## Deployment Process

### Current Setup
- **Hosting**: GitHub Pages (inferred from CNAME file)
- **Domain**: renovation.pro.cdsremodeling.com
- **Branch**: Typically `main` or `gh-pages`

### Deployment Steps

1. **Make Changes**: Edit `index.html`
2. **Test Locally**: Open in browser
3. **Commit**:
   ```bash
   git add index.html
   git commit -m "Description of changes"
   ```
4. **Push to Branch**:
   ```bash
   git push -u origin claude/YOUR-BRANCH-NAME
   ```
5. **Create Pull Request**: Merge to main branch
6. **GitHub Pages Auto-Deploys**: Changes live within 1-2 minutes

### Testing Checklist Before Deploy

- [ ] Form submission works
- [ ] Cost calculations are accurate
- [ ] PDF generation works
- [ ] Make.com webhook receives data
- [ ] Contact appears in GHL
- [ ] Mobile responsive (test at 375px, 768px, 1024px)
- [ ] All links work (phone number, CTAs)
- [ ] No console errors

---

## Development Workflow

### Branch Naming Convention
- Feature branches: `claude/descriptive-name-SESSION_ID`
- Example: `claude/add-field-helpers-018Cq9CMHNV2kcdt29KycH8T`

### Commit Message Style
Based on git history:
- Clear, descriptive messages
- Start with action verb
- Examples:
  - "Add Make.com webhook URL to calculator configuration"
  - "Update form to send data to Make.com webhook instead of direct GHL API"
  - "Update GHL API key to new value"

### Pull Request Process
1. Create feature branch from main
2. Make changes
3. Push to origin
4. Create PR with descriptive title
5. Merge to main (auto-deploys)

---

## Security Considerations

### Current Security Model

**Client-Side Only**:
- All code runs in browser
- No server-side validation
- Webhook URL visible in source code

### Known Limitations

1. **Webhook URL Exposure**: Anyone can view and potentially abuse the Make.com webhook URL
2. **No Rate Limiting**: Form can be submitted repeatedly
3. **No Bot Protection**: No CAPTCHA or anti-bot measures
4. **API Key Visibility**: GHL API key visible (though not actively used)

### Recommended Improvements

1. **Add CAPTCHA**: Implement reCAPTCHA or hCaptcha before form submission
2. **Server-Side Proxy**: Move webhook call to backend function
3. **Rate Limiting**: Implement submission throttling
4. **Input Sanitization**: Add validation beyond HTML5 required fields
5. **HTTPS Only**: Ensure domain uses SSL certificate

### Data Handling

**Sensitive Data**:
- User names, emails, phone numbers
- Property addresses
- Investment strategies

**GDPR/Privacy Considerations**:
- Add privacy policy link
- Add consent checkbox
- Document data retention policy

---

## Testing Guidelines

### Manual Testing Scenarios

1. **Complete Flow Test**:
   - Fill all required fields
   - Select 3-5 renovation areas
   - Choose quality level
   - Submit form
   - Verify calculations
   - Download PDF
   - Check GHL for contact

2. **Edge Cases**:
   - Minimum square footage (1 sq ft)
   - Maximum square footage (99,999 sq ft)
   - Zero bathrooms selected
   - All renovation areas selected
   - None selected (should fail validation)

3. **Mobile Testing**:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)
   - Test touch interactions
   - Test form scrolling

4. **Browser Testing**:
   - Chrome/Edge (primary)
   - Safari (iOS users)
   - Firefox
   - Mobile Chrome/Safari

### Calculation Validation

Test these scenarios:
```
Example 1:
- Square footage: 1500
- Areas: Kitchen, Paint, Flooring
- Quality: Mid-Range
- Expected: ~$30,000-40,000

Example 2:
- Square footage: 2500
- Areas: All categories
- Quality: High-End
- Expected: $200,000+
```

### Integration Testing

1. **Make.com Webhook**:
   - Monitor Make.com scenario runs
   - Verify all fields populate
   - Check for errors in Make.com logs

2. **GHL Contact Creation**:
   - Verify contact created
   - Check all custom fields populated
   - Confirm correct tags applied

---

## AI Assistant Guidelines

### When Making Changes

1. **Always Read First**: Read `index.html` completely before making changes
2. **Understand Context**: Review this CLAUDE.md for architecture understanding
3. **Test Calculations**: Verify pricing logic if modifying `costDatabase`
4. **Preserve Formatting**: Maintain HTML indentation and structure
5. **Check Line Numbers**: When referencing code, note that line numbers may shift

### Common Pitfall to Avoid

**DON'T**: Split the single file into multiple files
- This project intentionally uses a monolithic structure
- Splitting requires build process setup
- Defeats the simplicity advantage

**DON'T**: Add frameworks or dependencies unnecessarily
- Vanilla JS is intentional
- Keep it simple and fast
- Only add dependencies if absolutely required

**DON'T**: Modify working integration code without testing
- Make.com webhook integration is fragile
- Test with actual Make.com scenario
- Verify GHL receives data correctly

### Recommended Approach for Changes

1. **Small, Focused Changes**: One feature at a time
2. **Preserve Working Code**: Don't refactor unnecessarily
3. **Test Incrementally**: Test after each change
4. **Document Config Changes**: Update this file if adding new config
5. **Maintain Backwards Compatibility**: Don't break existing Make.com scenarios

### When User Requests Are Unclear

**Ask About**:
- Which quality level should pricing target?
- Should change affect all quality levels?
- Mobile or desktop priority?
- Should this integrate with GHL/Make.com?

### Code Style Conventions

**JavaScript**:
- Use `const` for constants
- Use `let` for variables
- camelCase for variable names
- PascalCase for configuration objects
- Descriptive function names
- Comments for complex logic

**CSS**:
- kebab-case for class names
- Organized by component
- Mobile-first responsive design
- Use CSS custom properties for repeated values

**HTML**:
- Semantic tags where appropriate
- Descriptive IDs and classes
- Required attributes on form fields
- Accessibility attributes (labels, alt text)

---

## Troubleshooting Guide

### Issue: Form Submits But No Results Show

**Check**:
1. Line 908: Does `results` div have class `show` after submission?
2. Line 789: Is loading overlay removed after calculation?
3. Browser console: Any JavaScript errors?

**Fix**: Review form submit handler (lines 785-910)

### Issue: PDF Generation Fails

**Check**:
1. Line 696: Is jsPDF CDN accessible?
2. Browser console: jsPDF errors?
3. `window.calculationData` populated?

**Fix**:
- Test CDN link in browser
- Verify `generatePDF()` function (lines 978-1115)

### Issue: Make.com Not Receiving Data

**Check**:
1. Line 704: Is webhook URL correct?
2. Make.com scenario active?
3. Browser network tab: Request sent?
4. Make.com logs: Any errors?

**Fix**:
- Verify webhook URL
- Check Make.com scenario configuration
- Test webhook with Postman

### Issue: Calculations Seem Wrong

**Check**:
1. Lines 721-782: Pricing database values
2. Lines 806-836: Calculation logic
3. Line 839: Contingency percentage

**Fix**:
- Recalculate expected values manually
- Add console.log statements for debugging
- Verify square footage input

### Issue: Mobile Layout Broken

**Check**:
1. Lines 425-441: Media query CSS
2. Browser width < 768px?
3. Touch targets at least 44px?

**Fix**:
- Test in device emulator
- Adjust breakpoints
- Increase touch target sizes

---

## Key Metrics & Performance

### Performance Benchmarks

- **Load Time**: < 1 second (single file, minimal assets)
- **Time to Interactive**: < 2 seconds
- **File Size**: ~36KB (index.html)
- **External Requests**: 1 (jsPDF CDN)

### Conversion Funnel

1. **Page Load**: 100%
2. **Form Start**: ~60-70% (industry average)
3. **Form Complete**: ~30-40% (multi-step form)
4. **PDF Download**: ~80% (of completions)
5. **Phone Contact**: ~10-15% (of completions)

### Lead Quality Indicators

**High Intent**:
- Selected 5+ renovation areas
- High-end quality level
- Phone number provided
- Investment strategy: "Fix & Flip" or "BRRRR"

**Low Intent**:
- Selected 1-2 areas
- No phone number
- Strategy: "Still Researching"

---

## Future Enhancement Ideas

### Short Term (Easy Wins)
- [ ] Add Google Analytics tracking
- [ ] Add Facebook Pixel for retargeting
- [ ] Implement CAPTCHA
- [ ] Add field validation messages
- [ ] Add loading states for better UX

### Medium Term
- [ ] Multi-step form wizard (improve completion rate)
- [ ] Save/resume calculations (localStorage)
- [ ] Email PDF instead of client-side download
- [ ] Add photo upload for property condition
- [ ] Calculator results page with shareable link

### Long Term (Requires Backend)
- [ ] User accounts and saved properties
- [ ] Contractor recommendation engine
- [ ] ROI calculator with ARV estimates
- [ ] Integration with property data APIs (Zillow, Realtor.com)
- [ ] Admin dashboard for lead management
- [ ] A/B testing framework

---

## Version History

### v1.0 (Current)
- Initial release
- Single-page calculator
- Make.com webhook integration
- jsPDF client-side generation
- 12 renovation categories
- 3 quality levels
- Jacksonville market pricing

### Recent Changes (from git log)
- **Nov 2025**: Added Make.com webhook integration
- **Nov 2025**: Updated to use webhook instead of direct GHL API
- **Nov 2025**: Configured GHL Location ID
- **Nov 2025**: Updated contact information

---

## Support & Contact

### Repository
- **URL**: github.com/albertraven-droid/Renovation-calculator
- **Issues**: Create GitHub issue for bugs

### Business Contact
- **Name**: Clayton Davis
- **Phone**: (904) 528-8600
- **Email**: cdavis@cdsremodeling.com
- **Company**: CDS Remodeling

### Development
- **Lead Developer**: AI-assisted development via Claude
- **Maintenance**: Active
- **Support**: Available via GitHub issues

---

## Quick Reference

### File Locations
- Main app: `index.html`
- Config: Line 702
- Pricing: Lines 721-782
- Form handler: Lines 785-910
- Webhook: Lines 913-975
- PDF generator: Lines 978-1115

### Configuration Keys
- Make.com webhook: `CONFIG.makeWebhookUrl`
- GHL API key: `CONFIG.ghlApiKey`
- GHL location: `CONFIG.ghlLocationId`

### Key Functions
- `sendToGHL()`: Webhook integration
- `generatePDF()`: PDF generation
- Form submit handler: Anonymous function at line 785

### External Links
- jsPDF: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
- Live site: https://renovation.pro.cdsremodeling.com

---

**Last Updated**: November 22, 2025
**Document Version**: 1.0
**Maintained By**: AI Assistant Team
