/**
 * Content script for Workday Application Assistant
 * Interacts with Workday forms on the page
 */

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'fillForm':
      fillWorkdayForm(message.userData)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, message: error.message }));
      break;
    
    case 'detectFields':
      detectFormFields()
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, message: error.message }));
      break;
    
    case 'showNotification':
      showNotification(message.message);
      sendResponse({ success: true });
      break;
  }
  
  // Return true to indicate that response will be sent asynchronously
  return true;
});

/**
 * Fills Workday application form with user data
 * @param {Object} userData - User profile data
 * @returns {Promise<Object>} Result of the form filling operation
 */
async function fillWorkdayForm(userData) {
  try {
    // Check if we're on a Workday page
    if (!isWorkdayPage()) {
      throw new Error('Not a Workday page');
    }
    
    showFillStatus('Starting to fill form...');
    
    let filledFields = 0;
    
    // Fill personal information
    if (userData.personal) {
      filledFields += await fillPersonalInfo(userData.personal);
    }
    
    // Fill work history
    if (userData.work && userData.work.length > 0) {
      filledFields += await fillWorkHistory(userData.work);
    }
    
    // Fill education
    if (userData.education && userData.education.length > 0) {
      filledFields += await fillEducation(userData.education);
    }
    
    // Fill skills
    if (userData.skills) {
      filledFields += await fillSkills(userData.skills);
    }
    
    // Success notification
    showFillStatus(`Successfully filled ${filledFields} fields!`, 'success');
    
    return {
      success: true,
      fieldCount: filledFields,
      message: `Successfully filled ${filledFields} fields`
    };
  } catch (error) {
    console.error('Error filling form:', error);
    showFillStatus(`Error: ${error.message}`, 'error');
    
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Detects form fields on the current Workday page
 * @returns {Promise<Object>} Result of field detection
 */
async function detectFormFields() {
  try {
    if (!isWorkdayPage()) {
      throw new Error('Not a Workday page');
    }
    
    // Look for Workday form fields
    const fieldSelectors = [
      // Personal info fields
      'input[type="text"]',
      'input[type="email"]',
      'input[type="tel"]',
      'input[type="date"]',
      'select',
      'textarea',
      
      // Workday specific fields
      'input[aria-label]',
      'input[data-automation-id]',
      'select[data-automation-id]',
      'div[data-automation-id] input',
      
      // More specific Workday identifiers
      '[id*="firstName"]',
      '[id*="lastName"]',
      '[id*="email"]',
      '[id*="phone"]',
      '[id*="address"]',
      '[id*="country"]',
      '[id*="state"]',
      '[id*="city"]',
      '[id*="postal"]',
      '[id*="zip"]',
      '[id*="education"]',
      '[id*="workExperience"]',
      '[id*="skill"]'
    ];
    
    // Combine all selectors
    const allFields = document.querySelectorAll(fieldSelectors.join(', '));
    const uniqueFields = new Set(allFields);
    
    // Highlight fields temporarily to give visual feedback
    let highlightedCount = 0;
    uniqueFields.forEach(field => {
      if (isVisibleElement(field)) {
        highlightField(field);
        highlightedCount++;
      }
    });
    
    return {
      success: true,
      fieldCount: highlightedCount,
      message: `Detected ${highlightedCount} form fields`
    };
  } catch (error) {
    console.error('Error detecting fields:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Fills personal information fields
 * @param {Object} personalInfo - User's personal information
 * @returns {Promise<number>} Number of fields filled
 */
async function fillPersonalInfo(personalInfo) {
  let filledCount = 0;
  
  // Map common field identifiers to our data keys
  const fieldMappings = {
    // First name fields
    'firstName': personalInfo.firstName,
    'first-name': personalInfo.firstName,
    'first_name': personalInfo.firstName,
    'givenname': personalInfo.firstName,
    
    // Last name fields
    'lastName': personalInfo.lastName,
    'last-name': personalInfo.lastName,
    'last_name': personalInfo.lastName,
    'familyname': personalInfo.lastName,
    
    // Email fields
    'email': personalInfo.email,
    'emailAddress': personalInfo.email,
    'email-address': personalInfo.email,
    'email_address': personalInfo.email,
    
    // Phone fields
    'phone': personalInfo.phone,
    'phoneNumber': personalInfo.phone,
    'phone-number': personalInfo.phone,
    'phone_number': personalInfo.phone,
    'mobile': personalInfo.phone,
    'cellphone': personalInfo.phone,
    
    // Address fields
    'address': personalInfo.address,
    'streetAddress': personalInfo.address,
    'street-address': personalInfo.address,
    'street_address': personalInfo.address,
    'addr1': personalInfo.address,
    'addressLine1': personalInfo.address,
    
    // City fields
    'city': personalInfo.city,
    'cityName': personalInfo.city,
    'city-name': personalInfo.city,
    'city_name': personalInfo.city,
    'municipality': personalInfo.city,
    
    // State fields
    'state': personalInfo.state,
    'stateProvince': personalInfo.state,
    'state-province': personalInfo.state,
    'state_province': personalInfo.state,
    'region': personalInfo.state,
    
    // Zip/Postal code fields
    'zip': personalInfo.zip,
    'zipCode': personalInfo.zip,
    'zip-code': personalInfo.zip,
    'zip_code': personalInfo.zip,
    'postal': personalInfo.zip,
    'postalCode': personalInfo.zip,
    'postal-code': personalInfo.zip,
    'postal_code': personalInfo.zip,
    
    // Country fields
    'country': personalInfo.country,
    'countryName': personalInfo.country,
    'country-name': personalInfo.country,
    'country_name': personalInfo.country
  };
  
  // Try filling by ID, name, placeholder, label etc.
  for (const fieldId in fieldMappings) {
    const value = fieldMappings[fieldId];
    if (!value) continue; // Skip empty values
    
    // Try multiple selector strategies
    const selectors = [
      `#${fieldId}`,
      `[id*="${fieldId}"]`,
      `[name="${fieldId}"]`,
      `[name*="${fieldId}"]`,
      `[placeholder="${fieldId}"]`,
      `[placeholder*="${fieldId}"]`,
      `[aria-label*="${fieldId}"]`,
      `label[for*="${fieldId}"]`,
      `[data-automation-id*="${fieldId}"]`
    ];
    
    for (const selector of selectors) {
      let filled = false;
      
      try {
        // For label selectors, find the associated input
        if (selector.startsWith('label')) {
          const labels = document.querySelectorAll(selector);
          for (const label of labels) {
            const input = document.getElementById(label.getAttribute('for')) || 
                        findClosestInput(label);
            
            if (input && fillInput(input, value)) {
              filledCount++;
              filled = true;
              break;
            }
          }
        } else {
          // Direct element selectors
          const elements = document.querySelectorAll(selector);
          for (const element of elements) {
            if (fillInput(element, value)) {
              filledCount++;
              filled = true;
              break;
            }
          }
        }
        
        if (filled) break; // Move to next field if we successfully filled this one
      } catch (e) {
        console.warn(`Error filling field ${fieldId}:`, e);
      }
    }
    
    // Also try Workday specific field detection
    if (fillWorkdaySpecificField(fieldId, value)) {
      filledCount++;
    }
  }
  
  // Try to detect full name fields
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  if (fullName.length > 1) {
    const nameSelectors = [
      '[id*="name"]:not([id*="first"]):not([id*="last"])',
      '[name*="name"]:not([name*="first"]):not([name*="last"])',
      '[placeholder*="name"]:not([placeholder*="first"]):not([placeholder*="last"])',
      '[aria-label*="name"]:not([aria-label*="first"]):not([aria-label*="last"])'
    ];
    
    for (const selector of nameSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        if (fillInput(element, fullName)) {
          filledCount++;
          break;
        }
      }
    }
  }
  
  return filledCount;
}

/**
 * Fills work history sections
 * @param {Array} workHistory - User's work experience entries
 * @returns {Promise<number>} Number of fields filled
 */
async function fillWorkHistory(workHistory) {
  let filledCount = 0;
  
  // Check if we need to add multiple work entries
  const addButtons = findWorkExperienceAddButtons();
  
  // For each work history entry except the first one (which usually has fields already)
  for (let i = 1; i < workHistory.length; i++) {
    // Click add button if it exists
    if (addButtons.length > 0) {
      for (const button of addButtons) {
        if (isVisibleElement(button)) {
          button.click();
          await delay(1000); // Wait for form to load
          break;
        }
      }
    }
  }
  
  // Now fill all work history entries
  const workSections = findWorkExperienceSections();
  
  for (let i = 0; i < Math.min(workHistory.length, workSections.length); i++) {
    const section = workSections[i];
    const work = workHistory[i];
    
    // Map work fields
    const fieldMappings = {
      // Company fields
      'company': work.company,
      'employer': work.company,
      'organization': work.company,
      'companyName': work.company,
      
      // Job title fields
      'title': work.title,
      'jobTitle': work.title,
      'position': work.title,
      'role': work.title,
      
      // Start date fields
      'startDate': formatDateForInput(work.startDate),
      'dateFrom': formatDateForInput(work.startDate),
      'fromDate': formatDateForInput(work.startDate),
      
      // End date fields
      'endDate': work.currentJob ? '' : formatDateForInput(work.endDate),
      'dateTo': work.currentJob ? '' : formatDateForInput(work.endDate),
      'toDate': work.currentJob ? '' : formatDateForInput(work.endDate),
      
      // Job description fields
      'description': work.description,
      'jobDescription': work.description,
      'responsibilities': work.description,
      'duties': work.description
    };
    
    // Fill the current job checkbox if it exists
    const currentJobCheckboxes = findElementsInSection(section, [
      'input[type="checkbox"][id*="current"]',
      'input[type="checkbox"][name*="current"]',
      'input[type="checkbox"][id*="present"]',
      'input[type="checkbox"][name*="present"]'
    ]);
    
    for (const checkbox of currentJobCheckboxes) {
      if (isVisibleElement(checkbox)) {
        checkbox.checked = work.currentJob;
        simulateChange(checkbox);
        filledCount++;
        break;
      }
    }
    
    // Fill other work history fields
    for (const fieldId in fieldMappings) {
      const value = fieldMappings[fieldId];
      if (!value && fieldId !== 'endDate' && fieldId !== 'dateTo' && fieldId !== 'toDate') continue;
      
      const elements = findElementsInSection(section, [
        `[id*="${fieldId}"]`,
        `[name*="${fieldId}"]`,
        `[placeholder*="${fieldId}"]`,
        `[aria-label*="${fieldId}"]`,
        `label:contains("${fieldId}")`,
        `[data-automation-id*="${fieldId}"]`
      ]);
      
      for (const element of elements) {
        if (fillInput(element, value)) {
          filledCount++;
          break;
        }
      }
    }
  }
  
  return filledCount;
}

/**
 * Fills education sections
 * @param {Array} education - User's education entries
 * @returns {Promise<number>} Number of fields filled
 */
async function fillEducation(education) {
  let filledCount = 0;
  
  // Check if we need to add multiple education entries
  const addButtons = findEducationAddButtons();
  
  // For each education entry except the first one
  for (let i = 1; i < education.length; i++) {
    // Click add button if it exists
    if (addButtons.length > 0) {
      for (const button of addButtons) {
        if (isVisibleElement(button)) {
          button.click();
          await delay(1000); // Wait for form to load
          break;
        }
      }
    }
  }
  
  // Now fill all education entries
  const educationSections = findEducationSections();
  
  for (let i = 0; i < Math.min(education.length, educationSections.length); i++) {
    const section = educationSections[i];
    const edu = education[i];
    
    // Map education fields
    const fieldMappings = {
      // School fields
      'school': edu.school,
      'schoolName': edu.school,
      'institution': edu.school,
      'college': edu.school,
      'university': edu.school,
      
      // Degree fields
      'degree': edu.degree,
      'degreeName': edu.degree,
      'degreeType': edu.degree,
      'qualification': edu.degree,
      
      // Field of study
      'field': edu.fieldOfStudy,
      'major': edu.fieldOfStudy,
      'fieldOfStudy': edu.fieldOfStudy,
      'studyField': edu.fieldOfStudy,
      
      // Start date fields
      'startDate': formatDateForInput(edu.startDate),
      'fromDate': formatDateForInput(edu.startDate),
      'dateFrom': formatDateForInput(edu.startDate),
      
      // End date fields
      'endDate': edu.currentSchool ? '' : formatDateForInput(edu.endDate),
      'toDate': edu.currentSchool ? '' : formatDateForInput(edu.endDate),
      'dateTo': edu.currentSchool ? '' : formatDateForInput(edu.endDate)
    };
    
    // Fill the current education checkbox if it exists
    const currentEduCheckboxes = findElementsInSection(section, [
      'input[type="checkbox"][id*="current"]',
      'input[type="checkbox"][name*="current"]',
      'input[type="checkbox"][id*="present"]',
      'input[type="checkbox"][name*="present"]',
      'input[type="checkbox"][id*="inProgress"]',
      'input[type="checkbox"][name*="inProgress"]'
    ]);
    
    for (const checkbox of currentEduCheckboxes) {
      if (isVisibleElement(checkbox)) {
        checkbox.checked = edu.currentSchool;
        simulateChange(checkbox);
        filledCount++;
        break;
      }
    }
    
    // Fill other education fields
    for (const fieldId in fieldMappings) {
      const value = fieldMappings[fieldId];
      if (!value && fieldId !== 'endDate' && fieldId !== 'dateTo' && fieldId !== 'toDate') continue;
      
      const elements = findElementsInSection(section, [
        `[id*="${fieldId}"]`,
        `[name*="${fieldId}"]`,
        `[placeholder*="${fieldId}"]`,
        `[aria-label*="${fieldId}"]`,
        `label:contains("${fieldId}")`,
        `[data-automation-id*="${fieldId}"]`
      ]);
      
      for (const element of elements) {
        if (fillInput(element, value)) {
          filledCount++;
          break;
        }
      }
    }
  }
  
  return filledCount;
}

/**
 * Fills skills and additional information sections
 * @param {Object} skillsData - User's skills information
 * @returns {Promise<number>} Number of fields filled
 */
async function fillSkills(skillsData) {
  let filledCount = 0;
  
  // Map skills-related fields
  const fieldMappings = {
    // Skills fields
    'skills': skillsData.skills,
    'technicalSkills': skillsData.skills,
    'professionalSkills': skillsData.skills,
    
    // Certifications fields
    'certifications': skillsData.certifications,
    'certificates': skillsData.certifications,
    'licenses': skillsData.certifications,
    
    // Languages fields
    'languages': skillsData.languages,
    'languageSkills': skillsData.languages,
    'spokenLanguages': skillsData.languages
  };
  
  // Fill skills fields
  for (const fieldId in fieldMappings) {
    const value = fieldMappings[fieldId];
    if (!value) continue;
    
    // Try various selectors for skills fields
    const selectors = [
      `#${fieldId}`,
      `[id*="${fieldId}"]`,
      `[name="${fieldId}"]`,
      `[name*="${fieldId}"]`,
      `[placeholder*="${fieldId}"]`,
      `[aria-label*="${fieldId}"]`,
      `textarea[id*="${fieldId}"]`,
      `textarea[name*="${fieldId}"]`,
      `[data-automation-id*="${fieldId}"]`
    ];
    
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      let filled = false;
      
      for (const element of elements) {
        if (isVisibleElement(element) && fillInput(element, value)) {
          filledCount++;
          filled = true;
          break;
        }
      }
      
      if (filled) break;
    }
    
    // Try to find fields by labels
    if (!fillByLabel(fieldId, value)) {
      // Also try variations with spaces and capitalizations
      const variations = [
        fieldId,
        fieldId.replace(/([A-Z])/g, ' $1').trim(), // camelCase to words
        fieldId.charAt(0).toUpperCase() + fieldId.slice(1) // Capitalize first letter
      ];
      
      for (const variation of variations) {
        if (fillByLabel(variation, value)) {
          filledCount++;
          break;
        }
      }
    } else {
      filledCount++;
    }
  }
  
  return filledCount;
}

/**
 * Attempts to fill a field by finding its label
 * @param {string} labelText - The label text to search for
 * @param {string} value - Value to fill in the field
 * @returns {boolean} True if field was filled
 */
function fillByLabel(labelText, value) {
  // Find labels containing the text
  const labels = Array.from(document.querySelectorAll('label')).filter(label => 
    label.textContent.toLowerCase().includes(labelText.toLowerCase())
  );
  
  for (const label of labels) {
    // Try to find the associated input
    let input = null;
    
    // Check for 'for' attribute
    if (label.htmlFor) {
      input = document.getElementById(label.htmlFor);
    }
    
    // If no input found by ID, look for nearby inputs
    if (!input) {
      input = findClosestInput(label);
    }
    
    if (input && isVisibleElement(input) && fillInput(input, value)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Attempts to fill a Workday-specific field
 * @param {string} fieldType - The type of field to fill
 * @param {string} value - The value to fill in
 * @returns {boolean} True if a field was filled
 */
function fillWorkdaySpecificField(fieldType, value) {
  if (!value) return false;
  
  // Workday often uses data-automation-id attributes
  const automationFields = [
    `[data-automation-id*="${fieldType}"]`,
    `[data-automation-label*="${fieldType}"]`,
    `[automation-id*="${fieldType}"]`
  ];
  
  for (const selector of automationFields) {
    const elements = document.querySelectorAll(selector);
    
    for (const element of elements) {
      if (isVisibleElement(element) && fillInput(element, value)) {
        return true;
      }
    }
  }
  
  // Workday also nests inputs inside divs with specific IDs/classes
  const containerSelectors = [
    `[id*="${fieldType}"] input`,
    `[id*="${fieldType}"] textarea`,
    `[id*="${fieldType}"] select`,
    `[class*="${fieldType}"] input`,
    `[class*="${fieldType}"] textarea`,
    `[class*="${fieldType}"] select`
  ];
  
  for (const selector of containerSelectors) {
    const elements = document.querySelectorAll(selector);
    
    for (const element of elements) {
      if (isVisibleElement(element) && fillInput(element, value)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Fills an input element with the given value
 * @param {HTMLElement} element - The element to fill
 * @param {string} value - The value to set
 * @returns {boolean} True if element was filled
 */
function fillInput(element, value) {
  if (!element || !isVisibleElement(element)) return false;
  
  try {
    const tagName = element.tagName.toLowerCase();
    
    if (tagName === 'input') {
      const type = element.type.toLowerCase();
      
      switch (type) {
        case 'text':
        case 'email':
        case 'tel':
        case 'url':
        case 'number':
        case 'search':
          element.value = value;
          simulateChange(element);
          highlightField(element, 'filled');
          return true;
          
        case 'radio':
          // For radio buttons, try to find the one matching our value
          const name = element.name;
          if (name) {
            const radioGroup = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
            for (const radio of radioGroup) {
              const label = findLabelForElement(radio);
              if (label && label.textContent.toLowerCase().includes(value.toLowerCase())) {
                radio.checked = true;
                simulateChange(radio);
                highlightField(radio, 'filled');
                return true;
              }
            }
          }
          return false;
          
        case 'checkbox':
          // For checkboxes, we assume the value is a boolean
          const wantChecked = value === true || value === 'true' || value === '1' || value === 'yes';
          element.checked = wantChecked;
          simulateChange(element);
          highlightField(element, 'filled');
          return true;
          
        case 'date':
          // Format date correctly for date inputs
          element.value = formatDateForInput(value);
          simulateChange(element);
          highlightField(element, 'filled');
          return true;
          
        default:
          return false;
      }
    } else if (tagName === 'textarea') {
      element.value = value;
      simulateChange(element);
      highlightField(element, 'filled');
      return true;
      
    } else if (tagName === 'select') {
      // For dropdowns, try to find an option matching our value
      const options = element.options;
      let matched = false;
      
      // First try exact match
      for (let i = 0; i < options.length; i++) {
        if (options[i].value.toLowerCase() === value.toLowerCase() || 
            options[i].text.toLowerCase() === value.toLowerCase()) {
          element.selectedIndex = i;
          simulateChange(element);
          highlightField(element, 'filled');
          matched = true;
          break;
        }
      }
      
      // Then try contains match
      if (!matched) {
        for (let i = 0; i < options.length; i++) {
          if (options[i].value.toLowerCase().includes(value.toLowerCase()) || 
              options[i].text.toLowerCase().includes(value.toLowerCase())) {
            element.selectedIndex = i;
            simulateChange(element);
            highlightField(element, 'filled');
            matched = true;
            break;
          }
        }
      }
      
      return matched;
      
    } else if (element.isContentEditable) {
      // Handle contentEditable divs (Workday sometimes uses these)
      element.textContent = value;
      simulateChange(element);
      highlightField(element, 'filled');
      return true;
    }
  } catch (error) {
    console.warn('Error filling input:', error);
  }
  
  return false;
}

/**
 * Finds elements within a section using multiple selectors
 * @param {HTMLElement} section - The section to search within
 * @param {Array} selectors - Array of CSS selectors to try
 * @returns {Array} - Array of found elements
 */
function findElementsInSection(section, selectors) {
  const results = [];
  
  for (const selector of selectors) {
    try {
      const elements = section.querySelectorAll(selector);
      for (const element of elements) {
        if (isVisibleElement(element)) {
          results.push(element);
        }
      }
    } catch (e) {
      // Ignore invalid selectors
    }
  }
  
  return results;
}

/**
 * Finds sections that appear to be work experience entries
 * @returns {Array} Array of section elements
 */
function findWorkExperienceSections() {
  // Try various strategies to identify work sections
  const workSectionSelectors = [
    // Explicit work section identifiers
    '[id*="work-experience"]',
    '[id*="workExperience"]',
    '[id*="work-history"]',
    '[id*="workHistory"]',
    '[data-automation-id*="workExperience"]',
    '[data-automation-id*="work-experience"]',
    
    // Common work section container patterns
    'fieldset:has(legend:contains("Work"))',
    'fieldset:has(legend:contains("Employment"))',
    'div:has(h2:contains("Work Experience"))',
    'div:has(h3:contains("Work Experience"))',
    'div:has(h2:contains("Employment History"))',
    'div:has(h3:contains("Employment History"))',
    
    // Fallback to any section with job title fields
    'section:has([id*="jobTitle"])',
    'div:has([id*="jobTitle"])',
    'div:has([name*="company"])',
    'div:has([name*="employer"])'
  ];
  
  // First try to find all work sections
  let sections = [];
  
  for (const selector of workSectionSelectors) {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        sections = Array.from(elements);
        break;
      }
    } catch (e) {
      // Some selectors with :has() might not be supported in all browsers
    }
  }
  
  // If still no sections found, try to find repeated similar sections
  if (sections.length === 0) {
    // Look for repeatedly structured divs that might be work entries
    const jobTitleInputs = document.querySelectorAll(
      '[id*="jobTitle"], [id*="title"], [name*="jobTitle"], [name*="title"]'
    );
    
    if (jobTitleInputs.length > 0) {
      // For each job title field, get its closest container
      sections = Array.from(jobTitleInputs).map(input => {
        return findClosestContainer(input);
      }).filter(Boolean);
    }
  }
  
  // If only one large section found but should contain multiple entries, try to find the subdivisions
  if (sections.length === 1 && sections[0].querySelectorAll('input, select, textarea').length > 15) {
    // This might be a container with multiple entries
    const possibleSubSections = sections[0].querySelectorAll(
      'fieldset, [role="group"], .row, .form-group, div > div > div'
    );
    
    if (possibleSubSections.length > 0) {
      sections = Array.from(possibleSubSections).filter(section => {
        // Check if this subsection has enough form elements to be a work entry
        return section.querySelectorAll('input, select, textarea').length >= 3;
      });
    }
  }
  
  return sections;
}

/**
 * Finds sections that appear to be education entries
 * @returns {Array} Array of section elements
 */
function findEducationSections() {
  // Try various strategies to identify education sections
  const eduSectionSelectors = [
    // Explicit education section identifiers
    '[id*="education"]',
    '[id*="Education"]',
    '[data-automation-id*="education"]',
    
    // Common education section container patterns
    'fieldset:has(legend:contains("Education"))',
    'fieldset:has(legend:contains("Academic"))',
    'div:has(h2:contains("Education"))',
    'div:has(h3:contains("Education"))',
    'div:has(h2:contains("Academic"))',
    'div:has(h3:contains("Academic"))',
    
    // Fallback to any section with degree or school fields
    'section:has([id*="degree"])',
    'div:has([id*="degree"])',
    'div:has([name*="school"])',
    'div:has([name*="university"])'
  ];
  
  // First try to find all education sections
  let sections = [];
  
  for (const selector of eduSectionSelectors) {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        sections = Array.from(elements);
        break;
      }
    } catch (e) {
      // Some selectors with :has() might not be supported in all browsers
    }
  }
  
  // If still no sections found, try to find repeated similar sections
  if (sections.length === 0) {
    // Look for repeatedly structured divs that might be education entries
    const schoolInputs = document.querySelectorAll(
      '[id*="school"], [id*="university"], [id*="college"], [name*="school"], [name*="university"]'
    );
    
    if (schoolInputs.length > 0) {
      // For each school field, get its closest container
      sections = Array.from(schoolInputs).map(input => {
        return findClosestContainer(input);
      }).filter(Boolean);
    }
  }
  
  // If only one large section found but should contain multiple entries, try to find the subdivisions
  if (sections.length === 1 && sections[0].querySelectorAll('input, select, textarea').length > 15) {
    // This might be a container with multiple entries
    const possibleSubSections = sections[0].querySelectorAll(
      'fieldset, [role="group"], .row, .form-group, div > div > div'
    );
    
    if (possibleSubSections.length > 0) {
      sections = Array.from(possibleSubSections).filter(section => {
        // Check if this subsection has enough form elements to be an education entry
        return section.querySelectorAll('input, select, textarea').length >= 3;
      });
    }
  }
  
  return sections;
}

/**
 * Finds buttons that appear to add work experience entries
 * @returns {Array} Array of button elements
 */
function findWorkExperienceAddButtons() {
  // First try to find explicit work "add" buttons
  const addButtonSelectors = [
    'button:contains("Add") + :contains("Work")',
    'button:contains("Add") + :contains("Experience")',
    'button:contains("Add") + :contains("Employment")',
    'button:contains("Add Work")',
    'button:contains("Add Experience")',
    'button:contains("Add Employment")',
    'button[id*="add"]:has(span:contains("Work"))',
    'button[id*="add"]:has(span:contains("Experience"))',
    '[role="button"]:contains("Add Work")',
    '[role="button"]:contains("Add Experience")',
    '[data-automation-id*="addWorkExperience"]',
    '[data-automation-id*="addEmployment"]'
  ];
  
  let buttons = [];
  
  for (const selector of addButtonSelectors) {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        buttons = Array.from(elements);
        break;
      }
    } catch (e) {
      // Some selectors with :has() or :contains() might not be supported
    }
  }
  
  // If no buttons found, try more generic "add" buttons near work sections
  if (buttons.length === 0) {
    const workSections = findWorkExperienceSections();
    if (workSections.length > 0) {
      const lastSection = workSections[workSections.length - 1];
      const parent = lastSection.parentNode;
      
      if (parent) {
        const addButtons = parent.querySelectorAll('button, [role="button"]');
        buttons = Array.from(addButtons).filter(button => {
          const text = button.textContent.toLowerCase();
          return text.includes('add') && !text.includes('remov');
        });
      }
    }
  }
  
  return buttons;
}

/**
 * Finds buttons that appear to add education entries
 * @returns {Array} Array of button elements
 */
function findEducationAddButtons() {
  // First try to find explicit education "add" buttons
  const addButtonSelectors = [
    'button:contains("Add") + :contains("Education")',
    'button:contains("Add") + :contains("School")',
    'button:contains("Add") + :contains("Degree")',
    'button:contains("Add Education")',
    'button:contains("Add School")',
    'button:contains("Add Degree")',
    'button[id*="add"]:has(span:contains("Education"))',
    'button[id*="add"]:has(span:contains("School"))',
    '[role="button"]:contains("Add Education")',
    '[role="button"]:contains("Add School")',
    '[data-automation-id*="addEducation"]',
    '[data-automation-id*="addSchool"]'
  ];
  
  let buttons = [];
  
  for (const selector of addButtonSelectors) {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        buttons = Array.from(elements);
        break;
      }
    } catch (e) {
      // Some selectors with :has() or :contains() might not be supported
    }
  }
  
  // If no buttons found, try more generic "add" buttons near education sections
  if (buttons.length === 0) {
    const eduSections = findEducationSections();
    if (eduSections.length > 0) {
      const lastSection = eduSections[eduSections.length - 1];
      const parent = lastSection.parentNode;
      
      if (parent) {
        const addButtons = parent.querySelectorAll('button, [role="button"]');
        buttons = Array.from(addButtons).filter(button => {
          const text = button.textContent.toLowerCase();
          return text.includes('add') && !text.includes('remov');
        });
      }
    }
  }
  
  return buttons;
}

/**
 * Formats a date string for input into form fields
 * @param {string} dateStr - The date string to format
 * @returns {string} Formatted date string
 */
function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  
  try {
    // Handle YYYY-MM format (from month input)
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Invalid date, return as is
    
    // Format as YYYY-MM-DD for date inputs
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (e) {
    return dateStr;
  }
}

/**
 * Simulates a change event on an element
 * @param {HTMLElement} element - The element to trigger the event on
 */
function simulateChange(element) {
  // Create and dispatch an input event (for text fields)
  element.dispatchEvent(new Event('input', { bubbles: true }));
  
  // Create and dispatch a change event
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * Highlights a field to provide visual feedback
 * @param {HTMLElement} element - The element to highlight
 * @param {string} type - The type of highlight ('detect' or 'filled')
 */
function highlightField(element, type = 'detect') {
  if (!element) return;
  
  const originalBorder = element.style.border;
  const originalBackground = element.style.backgroundColor;
  
  if (type === 'filled') {
    // Green highlight for filled fields
    element.style.border = '2px solid #28a745';
    element.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
  } else {
    // Blue highlight for detected fields
    element.style.border = '2px solid #007bff';
    element.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
  }
  
  // Reset after a delay
  setTimeout(() => {
    element.style.border = originalBorder;
    element.style.backgroundColor = originalBackground;
  }, 2000);
}

/**
 * Finds the closest container for a form element
 * @param {HTMLElement} element - The element to find container for
 * @returns {HTMLElement} The container element
 */
function findClosestContainer(element) {
  const containers = ['fieldset', 'div[role="group"]', '.form-row', '.form-group'];
  
  for (let i = 0; i < containers.length; i++) {
    const container = element.closest(containers[i]);
    if (container) return container;
  }
  
  // If no specific container found, go up several div levels
  let parent = element.parentElement;
  for (let i = 0; i < 3; i++) {
    if (parent && parent.tagName === 'DIV') {
      parent = parent.parentElement;
    }
  }
  
  return parent;
}

/**
 * Finds the closest input element to a label
 * @param {HTMLElement} label - The label element
 * @returns {HTMLElement|null} The closest input element or null
 */
function findClosestInput(label) {
  // First try siblings
  let sibling = label.nextElementSibling;
  while (sibling) {
    if (isInputElement(sibling)) return sibling;
    sibling = sibling.nextElementSibling;
  }
  
  // Then try parent's children
  if (label.parentElement) {
    const inputs = label.parentElement.querySelectorAll('input, select, textarea');
    if (inputs.length > 0) return inputs[0];
  }
  
  // Try looking in nearby containers
  const container = findClosestContainer(label);
  if (container) {
    const inputs = container.querySelectorAll('input, select, textarea');
    if (inputs.length > 0) return inputs[0];
  }
  
  return null;
}

/**
 * Finds the label element for a given form element
 * @param {HTMLElement} element - The form element
 * @returns {HTMLElement|null} The label element or null
 */
function findLabelForElement(element) {
  if (!element || !element.id) return null;
  
  // Try finding label by "for" attribute
  const label = document.querySelector(`label[for="${element.id}"]`);
  if (label) return label;
  
  // Try parent's child labels
  const parent = element.parentElement;
  if (parent) {
    const labels = parent.querySelectorAll('label');
    if (labels.length > 0) return labels[0];
  }
  
  // Try container's labels
  const container = findClosestContainer(element);
  if (container) {
    const labels = container.querySelectorAll('label');
    if (labels.length > 0) return labels[0];
  }
  
  return null;
}

/**
 * Checks if an element is an input element
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if element is an input element
 */
function isInputElement(element) {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'select' || tagName === 'textarea';
}

/**
 * Checks if an element is visible on the page
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if element is visible
 */
function isVisibleElement(element) {
  if (!element) return false;
  
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         element.offsetWidth > 0 && 
         element.offsetHeight > 0;
}

/**
 * Checks if current page is a Workday page
 * @returns {boolean} True if current page is Workday
 */
function isWorkdayPage() {
  const url = window.location.href;
  return url.includes('workday.com') || 
         url.includes('myworkday.com') || 
         url.includes('myworkdayjobs.com');
}

/**
 * Shows a fill status notification on the page
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('info', 'success', 'error')
 */
function showFillStatus(message, type = 'info') {
  // Check if notification element already exists
  let notification = document.getElementById('workday-assistant-notification');
  
  if (!notification) {
    // Create notification element
    notification = document.createElement('div');
    notification.id = 'workday-assistant-notification';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '4px';
    notification.style.fontSize = '14px';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(notification);
  }
  
  // Set styles based on notification type
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#28a745';
      notification.style.color = 'white';
      break;
    case 'error':
      notification.style.backgroundColor = '#dc3545';
      notification.style.color = 'white';
      break;
    default: // info
      notification.style.backgroundColor = '#007bff';
      notification.style.color = 'white';
  }
  
  // Set message
  notification.textContent = message;
  
  // Show notification
  notification.style.display = 'block';
  
  // Hide after a delay
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

/**
 * Utility function to create a delay/pause
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} A promise that resolves after the delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
