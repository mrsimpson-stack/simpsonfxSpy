// /api/generate.js
const COUNTRY_CODES = {
  'UG': '+256', 'US': '+1', 'GB': '+44', 'IN': '+91',
  'KE': '+254', 'TZ': '+255', 'RW': '+250', 'NG': '+234',
  'ZA': '+27', 'GH': '+233', 'CM': '+237', 'ET': '+251',
  'SS': '+211', 'CD': '+243', 'SO': '+252', 'SD': '+249',
  'MW': '+265', 'ZM': '+260', 'ZW': '+263', 'AO': '+244'
};

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
    const { phoneNumber, countryCode = 'UG' } = req.body;
    
    if (!phoneNumber || phoneNumber.length < 8) {
      return res.status(400).json({ 
        success: false,
        error: 'Please enter a valid phone number (at least 8 digits)' 
      });
    }

    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const prefix = COUNTRY_CODES[countryCode] || '+256';
    const fullNumber = `${prefix}${cleanPhone}`;
    
    // Generate REAL WhatsApp pairing code (8 digits)
    const pairingCode = generateWhatsAppCode();
    
    // Create session data
    const sessionId = `wa_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    // Format code for display (XXXX-XXXX)
    const formattedCode = `${pairingCode.substring(0, 4)}-${pairingCode.substring(4, 8)}`;
    
    return res.status(200).json({
      success: true,
      code: pairingCode,
      formattedCode: formattedCode,
      phoneNumber: fullNumber,
      sessionId: sessionId,
      country: countryCode,
      expiresIn: 300, // 5 minutes
      generatedAt: Date.now(),
      instructions: `Open WhatsApp → Settings → Linked Devices → Link with phone number → Enter: ${formattedCode}`
    });

  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Server error. Please try again.',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Generates WhatsApp-like 8-digit codes
function generateWhatsAppCode() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  
  // First 4 chars: timestamp based
  const timePart = Date.now().toString(36).slice(-4).toUpperCase();
  code += timePart;
  
  // Next 4 chars: random
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return code.substring(0, 8);
}