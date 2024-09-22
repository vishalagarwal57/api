const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


function validateFile(base64String) {
  if (!base64String) return { isValid: false };

  try {
    const buffer = Buffer.from(base64String, 'base64');
    return {
      isValid: true,
      mimeType: 'application/octet-stream', 
      sizeKb: (buffer.length / 1024).toFixed(2),
    };
  } catch {
    return { isValid: false };
  }
}

// POST Route: /process-data
app.post('/process-data', (req, res) => {
  const { data, file_b64 } = req.body;
  const userId = 'your_full_name_ddmmyyyy'; 
  const email = 'your_email@example.com'; 
  const rollNumber = 'your_roll_number'; 
  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: 'Invalid input data format' });
  }

  // Separate numbers and alphabets
  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => /^[A-Za-z]$/.test(item));
  const lowerCaseAlphabets = alphabets.filter((item) => /^[a-z]$/.test(item));
  const highestLowerCaseAlphabet = lowerCaseAlphabets.length
    ? [lowerCaseAlphabets.sort().reverse()[0]]
    : [];

  // Validate the file
  const fileValidation = validateFile(file_b64);

  res.json({
    is_success: true,
    user_id: userId,
    email: email,
    roll_number: rollNumber,
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highestLowerCaseAlphabet,
    file_valid: fileValidation.isValid,
    file_mime_type: fileValidation.mimeType,
    file_size_kb: fileValidation.sizeKb,
  });
});

// GET Route: /operation-code
app.get('/operation-code', (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
