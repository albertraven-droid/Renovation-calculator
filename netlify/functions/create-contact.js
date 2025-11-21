/**
 * Netlify Serverless Function - GHL Contact Creation Proxy
 * This function acts as a secure proxy to create contacts in GoHighLevel
 * Solves CORS issues by making the API call server-side
 */

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    // Get environment variables (configured in Netlify dashboard)
    const GHL_API_KEY = process.env.GHL_API_KEY;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
    const GHL_API_VERSION = process.env.GHL_API_VERSION || '2021-07-28';

    // Validate environment variables
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
        console.error('Missing required environment variables');
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Server configuration error: Missing GHL credentials'
            })
        };
    }

    try {
        // Parse the incoming contact data
        const contactData = JSON.parse(event.body);

        console.log('📥 Received contact creation request:', {
            email: contactData.email,
            name: `${contactData.firstName} ${contactData.lastName}`
        });

        // Prepare the GHL API payload
        const ghlPayload = {
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email,
            locationId: GHL_LOCATION_ID,
            source: contactData.source || 'Renovation Calculator Website',
            tags: contactData.tags || []
        };

        // Add optional phone if provided
        if (contactData.phone) {
            ghlPayload.phone = contactData.phone;
        }

        // Add custom fields if provided
        if (contactData.customField) {
            ghlPayload.customField = contactData.customField;
        }

        console.log('🚀 Sending to GHL API...');

        // Make the API call to GoHighLevel
        const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Content-Type': 'application/json',
                'Version': GHL_API_VERSION
            },
            body: JSON.stringify(ghlPayload)
        });

        // Get the response text first
        const responseText = await response.text();

        // Log the raw response for debugging
        console.log('📡 GHL API Response Status:', response.status);

        if (!response.ok) {
            console.error('❌ GHL API Error:', responseText);

            // Parse error details
            let errorDetails;
            try {
                errorDetails = JSON.parse(responseText);
            } catch (e) {
                errorDetails = { message: responseText };
            }

            // Return appropriate error response
            return {
                statusCode: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: false,
                    error: errorDetails,
                    status: response.status
                })
            };
        }

        // Parse successful response
        const result = JSON.parse(responseText);
        console.log('✅ Contact created successfully:', result.contact?.id);

        // Return success response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                contact: result.contact,
                message: 'Contact created successfully'
            })
        };

    } catch (error) {
        console.error('❌ Error in create-contact function:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                error: error.message || 'Internal server error'
            })
        };
    }
};
