/**
 * Workday Field Mappings
 * 
 * This file contains common Workday form field identifiers to help
 * the extension better locate and fill fields on Workday application forms.
 */

const workdayFieldMappings = {
  // Personal Information
  personalInfo: {
    firstNameSelectors: [
      '#firstName',
      '#first_name',
      '#first-name',
      '#givenName',
      '[name="firstName"]',
      '[name="first_name"]',
      '[name="first-name"]',
      '[name="givenName"]',
      '[aria-label*="First Name"]',
      '[aria-label*="first name"]',
      '[data-automation-id*="firstName"]',
      '[automation-id*="firstName"]'
    ],
    
    lastNameSelectors: [
      '#lastName',
      '#last_name',
      '#last-name',
      '#familyName',
      '[name="lastName"]',
      '[name="last_name"]',
      '[name="last-name"]',
      '[name="familyName"]',
      '[aria-label*="Last Name"]',
      '[aria-label*="last name"]',
      '[data-automation-id*="lastName"]',
      '[automation-id*="lastName"]'
    ],
    
    emailSelectors: [
      '#email',
      '#emailAddress',
      '#email_address',
      '#email-address',
      '[name="email"]',
      '[name="emailAddress"]',
      '[name="email_address"]',
      '[name="email-address"]',
      '[type="email"]',
      '[aria-label*="Email"]',
      '[aria-label*="email"]',
      '[data-automation-id*="email"]',
      '[automation-id*="email"]'
    ],
    
    phoneSelectors: [
      '#phone',
      '#phoneNumber',
      '#phone_number',
      '#phone-number',
      '#mobilePhone',
      '#mobile',
      '[name="phone"]',
      '[name="phoneNumber"]',
      '[name="phone_number"]',
      '[name="phone-number"]',
      '[name="mobilePhone"]',
      '[name="mobile"]',
      '[type="tel"]',
      '[aria-label*="Phone"]',
      '[aria-label*="phone"]',
      '[data-automation-id*="phone"]',
      '[automation-id*="phone"]'
    ],
    
    addressSelectors: [
      '#address',
      '#streetAddress',
      '#street_address',
      '#street-address',
      '#addressLine1',
      '#address1',
      '[name="address"]',
      '[name="streetAddress"]',
      '[name="street_address"]',
      '[name="street-address"]',
      '[name="addressLine1"]',
      '[name="address1"]',
      '[aria-label*="Address"]',
      '[aria-label*="address"]',
      '[data-automation-id*="address"]',
      '[automation-id*="address"]'
    ],
    
    citySelectors: [
      '#city',
      '#cityName',
      '#city_name',
      '#city-name',
      '[name="city"]',
      '[name="cityName"]',
      '[name="city_name"]',
      '[name="city-name"]',
      '[aria-label*="City"]',
      '[aria-label*="city"]',
      '[data-automation-id*="city"]',
      '[automation-id*="city"]'
    ],
    
    stateSelectors: [
      '#state',
      '#stateProvince',
      '#state_province',
      '#state-province',
      '#region',
      '[name="state"]',
      '[name="stateProvince"]',
      '[name="state_province"]',
      '[name="state-province"]',
      '[name="region"]',
      '[aria-label*="State"]',
      '[aria-label*="state"]',
      '[aria-label*="Province"]',
      '[aria-label*="province"]',
      '[data-automation-id*="state"]',
      '[automation-id*="state"]'
    ],
    
    zipSelectors: [
      '#zip',
      '#zipCode',
      '#zip_code',
      '#zip-code',
      '#postalCode',
      '#postal_code',
      '#postal-code',
      '[name="zip"]',
      '[name="zipCode"]',
      '[name="zip_code"]',
      '[name="zip-code"]',
      '[name="postalCode"]',
      '[name="postal_code"]',
      '[name="postal-code"]',
      '[aria-label*="Zip"]',
      '[aria-label*="zip"]',
      '[aria-label*="Postal"]',
      '[aria-label*="postal"]',
      '[data-automation-id*="zip"]',
      '[data-automation-id*="postal"]',
      '[automation-id*="zip"]',
      '[automation-id*="postal"]'
    ],
    
    countrySelectors: [
      '#country',
      '#countryName',
      '#country_name',
      '#country-name',
      '[name="country"]',
      '[name="countryName"]',
      '[name="country_name"]',
      '[name="country-name"]',
      '[aria-label*="Country"]',
      '[aria-label*="country"]',
      '[data-automation-id*="country"]',
      '[automation-id*="country"]'
    ]
  },
  
  // Work Experience
  workExperience: {
    // Common container selectors
    sectionSelectors: [
      '[id*="work-experience"]',
      '[id*="workExperience"]',
      '[id*="employment-history"]',
      '[id*="employmentHistory"]',
      '[data-automation-id*="workExperience"]',
      '[data-automation-id*="employmentHistory"]',
      'fieldset:has(legend:contains("Work"))',
      'fieldset:has(legend:contains("Employment"))'
    ],
    
    // Add button selectors
    addButtonSelectors: [
      'button:contains("Add Work Experience")',
      'button:contains("Add Employment")',
      'button:contains("Add Another Position")',
      '[aria-label*="Add Work Experience"]',
      '[aria-label*="Add Employment"]',
      '[data-automation-id*="addWorkExperience"]',
      '[data-automation-id*="addEmployment"]'
    ],
    
    // Company name selectors
    companySelectors: [
      '[id*="company"]',
      '[id*="employer"]',
      '[id*="organization"]',
      '[name*="company"]',
      '[name*="employer"]',
      '[name*="organization"]',
      '[aria-label*="Company"]',
      '[aria-label*="Employer"]',
      '[aria-label*="Organization"]',
      '[data-automation-id*="company"]',
      '[data-automation-id*="employer"]',
      '[data-automation-id*="organization"]'
    ],
    
    // Job title selectors
    titleSelectors: [
      '[id*="title"]',
      '[id*="position"]',
      '[id*="role"]',
      '[name*="title"]',
      '[name*="position"]',
      '[name*="role"]',
      '[aria-label*="Title"]',
      '[aria-label*="Position"]',
      '[aria-label*="Role"]',
      '[data-automation-id*="title"]',
      '[data-automation-id*="position"]',
      '[data-automation-id*="role"]'
    ],
    
    // Start date selectors
    startDateSelectors: [
      '[id*="startDate"]',
      '[id*="start-date"]',
      '[id*="start_date"]',
      '[id*="fromDate"]',
      '[id*="from-date"]',
      '[id*="from_date"]',
      '[name*="startDate"]',
      '[name*="start-date"]',
      '[name*="start_date"]',
      '[name*="fromDate"]',
      '[name*="from-date"]',
      '[name*="from_date"]',
      '[aria-label*="Start Date"]',
      '[aria-label*="From Date"]',
      '[data-automation-id*="startDate"]',
      '[data-automation-id*="fromDate"]'
    ],
    
    // End date selectors
    endDateSelectors: [
      '[id*="endDate"]',
      '[id*="end-date"]',
      '[id*="end_date"]',
      '[id*="toDate"]',
      '[id*="to-date"]',
      '[id*="to_date"]',
      '[name*="endDate"]',
      '[name*="end-date"]',
      '[name*="end_date"]',
      '[name*="toDate"]',
      '[name*="to-date"]',
      '[name*="to_date"]',
      '[aria-label*="End Date"]',
      '[aria-label*="To Date"]',
      '[data-automation-id*="endDate"]',
      '[data-automation-id*="toDate"]'
    ],
    
    // Current job checkbox selectors
    currentJobSelectors: [
      '[id*="current"]',
      '[id*="present"]',
      '[name*="current"]',
      '[name*="present"]',
      '[aria-label*="Current"]',
      '[aria-label*="Present"]',
      '[data-automation-id*="current"]',
      '[data-automation-id*="present"]'
    ],
    
    // Job description selectors
    descriptionSelectors: [
      '[id*="description"]',
      '[id*="responsibilities"]',
      '[id*="duties"]',
      '[name*="description"]',
      '[name*="responsibilities"]',
      '[name*="duties"]',
      '[aria-label*="Description"]',
      '[aria-label*="Responsibilities"]',
      '[aria-label*="Duties"]',
      '[data-automation-id*="description"]',
      '[data-automation-id*="responsibilities"]'
    ]
  },
  
  // Education
  education: {
    // Common container selectors
    sectionSelectors: [
      '[id*="education"]',
      '[id*="academic"]',
      '[data-automation-id*="education"]',
      '[data-automation-id*="academic"]',
      'fieldset:has(legend:contains("Education"))',
      'fieldset:has(legend:contains("Academic"))'
    ],
    
    // Add button selectors
    addButtonSelectors: [
      'button:contains("Add Education")',
      'button:contains("Add School")',
      'button:contains("Add Another Degree")',
      '[aria-label*="Add Education"]',
      '[aria-label*="Add School"]',
      '[data-automation-id*="addEducation"]',
      '[data-automation-id*="addSchool"]'
    ],
    
    // School/institution selectors
    schoolSelectors: [
      '[id*="school"]',
      '[id*="institution"]',
      '[id*="university"]',
      '[id*="college"]',
      '[name*="school"]',
      '[name*="institution"]',
      '[name*="university"]',
      '[name*="college"]',
      '[aria-label*="School"]',
      '[aria-label*="Institution"]',
      '[aria-label*="University"]',
      '[aria-label*="College"]',
      '[data-automation-id*="school"]',
      '[data-automation-id*="institution"]',
      '[data-automation-id*="university"]'
    ],
    
    // Degree selectors
    degreeSelectors: [
      '[id*="degree"]',
      '[id*="qualification"]',
      '[name*="degree"]',
      '[name*="qualification"]',
      '[aria-label*="Degree"]',
      '[aria-label*="Qualification"]',
      '[data-automation-id*="degree"]',
      '[data-automation-id*="qualification"]'
    ],
    
    // Field of study selectors
    fieldOfStudySelectors: [
      '[id*="field"]',
      '[id*="major"]',
      '[id*="discipline"]',
      '[name*="field"]',
      '[name*="major"]',
      '[name*="discipline"]',
      '[aria-label*="Field"]',
      '[aria-label*="Major"]',
      '[aria-label*="Discipline"]',
      '[data-automation-id*="field"]',
      '[data-automation-id*="major"]',
      '[data-automation-id*="discipline"]'
    ],
    
    // Start date selectors
    startDateSelectors: [
      '[id*="startDate"]',
      '[id*="start-date"]',
      '[id*="start_date"]',
      '[id*="fromDate"]',
      '[id*="from-date"]',
      '[id*="from_date"]',
      '[name*="startDate"]',
      '[name*="start-date"]',
      '[name*="start_date"]',
      '[name*="fromDate"]',
      '[name*="from-date"]',
      '[name*="from_date"]',
      '[aria-label*="Start Date"]',
      '[aria-label*="From Date"]',
      '[data-automation-id*="startDate"]',
      '[data-automation-id*="fromDate"]'
    ],
    
    // End date selectors
    endDateSelectors: [
      '[id*="endDate"]',
      '[id*="end-date"]',
      '[id*="end_date"]',
      '[id*="toDate"]',
      '[id*="to-date"]',
      '[id*="to_date"]',
      '[id*="graduationDate"]',
      '[name*="endDate"]',
      '[name*="end-date"]',
      '[name*="end_date"]',
      '[name*="toDate"]',
      '[name*="to-date"]',
      '[name*="to_date"]',
      '[name*="graduationDate"]',
      '[aria-label*="End Date"]',
      '[aria-label*="To Date"]',
      '[aria-label*="Graduation Date"]',
      '[data-automation-id*="endDate"]',
      '[data-automation-id*="toDate"]',
      '[data-automation-id*="graduationDate"]'
    ],
    
    // Current education checkbox selectors
    currentEducationSelectors: [
      '[id*="current"]',
      '[id*="inProgress"]',
      '[id*="in-progress"]',
      '[id*="in_progress"]',
      '[name*="current"]',
      '[name*="inProgress"]',
      '[name*="in-progress"]',
      '[name*="in_progress"]',
      '[aria-label*="Current"]',
      '[aria-label*="In Progress"]',
      '[data-automation-id*="current"]',
      '[data-automation-id*="inProgress"]'
    ]
  },
  
  // Skills and Additional Info
  skills: {
    // Skills selectors
    skillsSelectors: [
      '[id*="skills"]',
      '[id*="proficiencies"]',
      '[id*="abilities"]',
      '[name*="skills"]',
      '[name*="proficiencies"]',
      '[name*="abilities"]',
      '[aria-label*="Skills"]',
      '[aria-label*="Proficiencies"]',
      '[aria-label*="Abilities"]',
      '[data-automation-id*="skills"]',
      '[data-automation-id*="proficiencies"]'
    ],
    
    // Certifications selectors
    certificationsSelectors: [
      '[id*="certification"]',
      '[id*="certificate"]',
      '[id*="license"]',
      '[name*="certification"]',
      '[name*="certificate"]',
      '[name*="license"]',
      '[aria-label*="Certification"]',
      '[aria-label*="Certificate"]',
      '[aria-label*="License"]',
      '[data-automation-id*="certification"]',
      '[data-automation-id*="certificate"]',
      '[data-automation-id*="license"]'
    ],
    
    // Languages selectors
    languagesSelectors: [
      '[id*="language"]',
      '[id*="linguistic"]',
      '[name*="language"]',
      '[name*="linguistic"]',
      '[aria-label*="Language"]',
      '[aria-label*="Linguistic"]',
      '[data-automation-id*="language"]',
      '[data-automation-id*="linguistic"]'
    ]
  }
};

// Make mappings available globally
window.workdayFieldMappings = workdayFieldMappings;
