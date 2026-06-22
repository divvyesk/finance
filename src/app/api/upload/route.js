import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getData, saveData } from '../../lib/db';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;
    
    // Auth is optional for simple playground but let's record if user exists
    let userId = sessionId || 'anonymous';

    const contentType = request.headers.get('content-type') || '';
    
    let source = '';
    let extractedData = {};
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      
      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
      
      source = `Uploaded file: ${file.name}`;
      
      // Simulate OCR & AI Extraction based on filename or random seed
      // We customize output slightly based on names to make it feel real
      const filenameLower = file.name.toLowerCase();
      
      let salary = 80000;
      let bonus = 5000;
      let state = 'California';
      let payFrequency = 'biweekly';
      let employmentType = 'full_time';

      if (filenameLower.includes('offer') || filenameLower.includes('letter')) {
        salary = 115000;
        bonus = 10000;
        state = 'California';
        payFrequency = 'biweekly';
        employmentType = 'full_time';
      } else if (filenameLower.includes('contract')) {
        salary = 95000;
        bonus = 0;
        state = 'Texas';
        payFrequency = 'monthly';
        employmentType = 'contract';
      } else if (filenameLower.includes('stub') || filenameLower.includes('pay')) {
        salary = 65000;
        bonus = 2000;
        state = 'New York';
        payFrequency = 'semimonthly';
        employmentType = 'full_time';
      }

      extractedData = {
        country: 'US',
        state,
        salary,
        bonus,
        pay_frequency: payFrequency,
        employment_type: employmentType,
        ocr_confidence: 0.96,
        source
      };
    } else {
      // Manual entry JSON
      const body = await request.json();
      source = 'Manual Input';
      
      extractedData = {
        country: body.country || 'US',
        state: body.state || 'California',
        salary: Number(body.salary) || 80000,
        bonus: Number(body.bonus) || 0,
        pay_frequency: body.pay_frequency || 'biweekly',
        employment_type: body.employment_type || 'full_time',
        ocr_confidence: 1.0, // perfect confidence for manual input
        source
      };
    }

    // Validation layer checks
    const validationErrors = [];
    if (!extractedData.state) {
      validationErrors.push('Missing state of employment');
    }
    if (!extractedData.pay_frequency) {
      validationErrors.push('Missing pay frequency');
    }
    if (extractedData.salary < 10000) {
      validationErrors.push('Suspiciously low salary detected. Please verify gross annual salary.');
    }
    if (extractedData.salary > 1000000) {
      validationErrors.push('Extremely high salary detected. Verification suggested.');
    }

    const payload = {
      success: true,
      data: extractedData,
      validation: {
        isValid: validationErrors.length === 0,
        errors: validationErrors
      }
    };

    // Save to local db
    const db = getData();
    db.uploads.push({
      userId,
      timestamp: new Date().toISOString(),
      source,
      extractedData,
      validation: payload.validation
    });
    saveData(db);

    return NextResponse.json(payload);
  } catch (error) {
    console.error('OCR/Extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to process document intake: ' + error.message },
      { status: 500 }
    );
  }
}
