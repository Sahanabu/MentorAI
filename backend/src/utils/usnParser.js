const { USN_PATTERNS, ENTRY_TYPES, DEPARTMENTS } = require('../config/constants');

/**
 * Parse USN and extract information
 * USN Format: 2KA + YY + DEPT + SERIAL
 * Example: 2KA21CS001
 */
const parseUSN = (usn) => {
  if (!usn || typeof usn !== 'string') {
    throw new Error('Invalid USN format');
  }

  const cleanUSN = usn.trim().toUpperCase();
  
  // Validate USN format
  const usnRegex = /^2KA(\d{2})([A-Z]{2})(\d{3})$/;
  const match = cleanUSN.match(usnRegex);
  
  if (!match) {
    throw new Error('USN format should be 2KA + YY + DEPT + SERIAL (e.g., 2KA21CS001)');
  }

  const [, yearDigits, deptCode, serialNumber] = match;
  
  // Parse year
  const year = parseInt(yearDigits);
  const admissionYear = 2000 + year;
  
  // Validate year
  const currentYear = new Date().getFullYear();
  if (admissionYear < 2020 || admissionYear > currentYear) {
    throw new Error(`Invalid admission year: ${admissionYear}`);
  }

  // Parse department
  if (!DEPARTMENTS[deptCode]) {
    throw new Error(`Invalid department code: ${deptCode}`);
  }

  // Parse serial number and determine entry type
  const serial = parseInt(serialNumber);
  let entryType;
  
  if (serial >= USN_PATTERNS.REGULAR_RANGE.min && serial <= USN_PATTERNS.REGULAR_RANGE.max) {
    entryType = ENTRY_TYPES.REGULAR;
  } else if (serial >= USN_PATTERNS.LATERAL_RANGE.min && serial <= USN_PATTERNS.LATERAL_RANGE.max) {
    entryType = ENTRY_TYPES.LATERAL;
  } else {
    throw new Error(`Invalid serial number: ${serialNumber}`);
  }

  return {
    usn: cleanUSN,
    admissionYear,
    department: deptCode,
    departmentName: DEPARTMENTS[deptCode],
    serialNumber: serial,
    entryType,
    isValid: true
  };
};

/**
 * Validate USN format
 */
const validateUSN = (usn) => {
  try {
    parseUSN(usn);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Generate USN suggestions based on department and year
 */
const generateUSNSuggestions = (department, year, count = 5) => {
  const suggestions = [];
  const yearDigits = year.toString().slice(-2);
  
  for (let i = 1; i <= count; i++) {
    const serial = i.toString().padStart(3, '0');
    suggestions.push(`2KA${yearDigits}${department}${serial}`);
  }
  
  return suggestions;
};

/**
 * Get current semester based on admission year and entry type
 */
const getCurrentSemester = (admissionYear, entryType) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 0-indexed
  
  // Calculate years since admission
  let yearsSinceAdmission = currentYear - admissionYear;
  
  // Adjust for academic year (June to May)
  if (currentMonth < 6) {
    yearsSinceAdmission -= 1;
  }
  
  // Calculate semester
  let semester;
  if (entryType === ENTRY_TYPES.LATERAL) {
    // Lateral entry students start from 3rd semester
    semester = 3 + (yearsSinceAdmission * 2);
    if (currentMonth >= 6 && currentMonth <= 11) {
      semester += 1; // Odd semester (July-Dec)
    }
  } else {
    // Regular students start from 1st semester
    semester = 1 + (yearsSinceAdmission * 2);
    if (currentMonth >= 6 && currentMonth <= 11) {
      semester += 1; // Odd semester (July-Dec)
    }
  }
  
  // Ensure semester is within valid range
  return Math.min(Math.max(semester, 1), 8);
};

/**
 * Extract batch information from USN
 */
const getBatchInfo = (usn) => {
  const parsed = parseUSN(usn);
  const currentSemester = getCurrentSemester(parsed.admissionYear, parsed.entryType);
  
  return {
    ...parsed,
    currentSemester,
    batchName: `${parsed.admissionYear}-${parsed.admissionYear + 4}`,
    graduationYear: parsed.admissionYear + 4
  };
};

module.exports = {
  parseUSN,
  validateUSN,
  generateUSNSuggestions,
  getCurrentSemester,
  getBatchInfo
};