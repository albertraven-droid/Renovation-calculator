// Netlify serverless function to handle GHL contact submission
// This avoids CORS issues by making the API call server-side

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // GHL Configuration
  const GHL_CONFIG = {
    apiKey: process.env.GHL_API_KEY || 'pit-c1708855-d2ce-4904-a395-335e206d5632',
    locationId: process.env.GHL_LOCATION_ID || 'Eikn1T3IJ5HrKqwyelJs',
    apiVersion: '2021-07-28'
  };

  try {
    // Parse the request body
    const data = JSON.parse(event.body);

    // Validate required fields
    if (!data.formData || !data.formData.email || !data.formData.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: name and email are required'
        })
      };
    }

    // Prepare data for GHL Contacts API v2
    const ghlData = {
      firstName: data.formData.name.split(' ')[0],
      lastName: data.formData.name.split(' ').slice(1).join(' ') || 'Unknown',
      email: data.formData.email,
      locationId: GHL_CONFIG.locationId,
      source: 'Renovation Calculator Website',
      tags: ['renovation-calculator', 'lead-magnet', data.formData.quality + '-quality']
    };

    // Add phone if provided
    if (data.formData.phone) {
      ghlData.phone = data.formData.phone;
    }

    // Add custom fields
    ghlData.customField = {
      property_address: data.formData.propertyAddress || 'Not provided',
      property_type: data.formData.propertyType,
      square_footage: String(data.formData.squareFootage),
      property_age: data.formData.propertyAge,
      property_condition: data.formData.condition,
      quality_level: data.formData.quality,
      investment_strategy: data.formData.strategy,
      renovation_areas: data.formData.selectedAreas.join(', '),
      estimated_cost_low: String(Math.round(data.totalLow)),
      estimated_cost_mid: String(Math.round(data.totalMid)),
      estimated_cost_high: String(Math.round(data.totalHigh)),
      calculation_date: new Date().toISOString()
    };

    console.log('Sending to GHL API...');

    // Send to GHL Contacts API v2
    const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'Version': GHL_CONFIG.apiVersion
      },
      body: JSON.stringify(ghlData)
    });

    // Get response text for logging
    const responseText = await response.text();

    if (!response.ok) {
      console.error('GHL API error:', response.status, responseText);

      // Return a more user-friendly error
      return {
        statusCode: response.status,
        body: JSON.stringify({
          success: false,
          error: `Failed to save contact information. Status: ${response.status}`,
          details: responseText
        })
      };
    }

    // Parse successful response
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { message: responseText };
    }

    console.log('Successfully sent to GHL:', result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Contact saved successfully',
        data: result
      })
    };

  } catch (error) {
    console.error('Error in submit-contact function:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
