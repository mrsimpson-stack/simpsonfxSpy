// /api/verify.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST' });
  }

  try {
    const { code, sessionId, phoneNumber } = req.body;
    
    if (!code || !sessionId) {
      return res.status(400).json({ 
        success: false,
        error: 'Code and session ID are required' 
      });
    }

    // Clean code (remove dashes)
    const cleanCode = code.replace(/-/g, '').toUpperCase();
    
    // Validate code format (8 alphanumeric chars)
    if (!/^[A-Z0-9]{8}$/.test(cleanCode)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid code format. Must be 8 characters (letters/numbers)' 
      });
    }

    // Simulate verification (in real app, check database)
    const isValid = true; // Always valid for demo
    
    if (isValid) {
      return res.status(200).json({
        success: true,
        message: '✅ WhatsApp linked successfully!',
        code: cleanCode,
        sessionId: sessionId,
        phoneNumber: phoneNumber || 'Not provided',
        linkedAt: Date.now(),
        features: [
          'Web WhatsApp Access',
          'Message History',
          'Send/Receive Messages',
          'Media Download',
          'Auto-Reply System',
          'Chat Export'
        ],
        dashboardUrl: '/dashboard'
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired code. Please generate a new one.'
      });
    }

  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Verification failed. Please try again.'
    });
  }
}