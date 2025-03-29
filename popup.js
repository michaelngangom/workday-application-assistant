document.addEventListener('DOMContentLoaded', () => {
  // Tab navigation
  setupTabs();
  
  // Load saved data
  loadUserData();
  
  // Setup dynamic form elements
  setupWorkExperienceSection();
  setupEducationSection();
  
  // Setup buttons
  document.getElementById('fill-form').addEventListener('click', fillFormAction);
  document.getElementById('detect-fields').addEventListener('click', detectFieldsAction);
  document.getElementById('save-data').addEventListener('click', saveUserData);
  document.getElementById('clear-data').addEventListener('click', clearUserData);
});

function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Remove active class from all tabs and content
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Add active class to clicked tab and its content
      e.target.classList.add('active');
      const tabId = `${e.target.dataset.tab}-tab`;
      document.getElementById(tabId).classList.add('active');
    });
  });
}

function setupWorkExperienceSection() {
  const container = document.getElementById('work-history-container');
  const addButton = document.getElementById('add-work');
  const template = document.getElementById('work-template');
  
  addButton.addEventListener('click', () => {
    const clone = document.importNode(template.content, true);
    setupRemoveButton(clone);
    container.appendChild(clone);
  });
  
  // Add the first work entry if none exists
  if (container.children.length === 0) {
    addButton.click();
  }
}

function setupEducationSection() {
  const container = document.getElementById('education-container');
  const addButton = document.getElementById('add-education');
  const template = document.getElementById('education-template');
  
  addButton.addEventListener('click', () => {
    const clone = document.importNode(template.content, true);
    setupRemoveButton(clone);
    container.appendChild(clone);
  });
  
  // Add the first education entry if none exists
  if (container.children.length === 0) {
    addButton.click();
  }
}

function setupRemoveButton(entryClone) {
  const removeButton = entryClone.querySelector('.remove-entry');
  removeButton.addEventListener('click', (e) => {
    const entryContainer = e.target.closest('.entry-container');
    entryContainer.remove();
  });
}

function fillFormAction() {
  // Check if current page is a Workday page
  checkWorkdayPage()
    .then(isWorkday => {
      if (isWorkday) {
        showStatusMessage('Filling form...');
        
        // Get user data
        getUserData().then(userData => {
          // Send message to content script to fill the form
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { 
              action: 'fillForm', 
              userData: userData 
            }, (response) => {
              if (response && response.success) {
                showStatusMessage('Form filled successfully!', 'success');
              } else {
                showStatusMessage('Error filling form: ' + (response?.message || 'Unknown error'), 'error');
              }
            });
          });
        });
      } else {
        showStatusMessage('Not a Workday page', 'error');
      }
    });
}

function detectFieldsAction() {
  checkWorkdayPage()
    .then(isWorkday => {
      if (isWorkday) {
        showStatusMessage('Detecting form fields...');
        
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'detectFields'
          }, (response) => {
            if (response && response.success) {
              showStatusMessage(`Detected ${response.fieldCount} form fields`, 'success');
            } else {
              showStatusMessage('Error detecting fields: ' + (response?.message || 'Unknown error'), 'error');
            }
          });
        });
      } else {
        showStatusMessage('Not a Workday page', 'error');
      }
    });
}

function checkWorkdayPage() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      const isWorkday = url.includes('workday.com') || 
                       url.includes('myworkday.com') || 
                       url.includes('myworkdayjobs.com');
      
      resolve(isWorkday);
    });
  });
}

function showStatusMessage(message, type = 'info') {
  const statusElem = document.getElementById('status-message');
  const errorElem = document.getElementById('error-message');
  
  if (type === 'error') {
    errorElem.textContent = message;
    errorElem.classList.remove('hidden');
    statusElem.classList.add('hidden');
    
    setTimeout(() => {
      errorElem.classList.add('hidden');
    }, 5000);
  } else {
    statusElem.textContent = message;
    statusElem.classList.remove('hidden');
    errorElem.classList.add('hidden');
    
    setTimeout(() => {
      statusElem.classList.add('hidden');
    }, 3000);
  }
}

function saveUserData() {
  getUserData().then(userData => {
    saveToStorage(userData).then(() => {
      showStatusMessage('Profile saved successfully!', 'success');
    }).catch(error => {
      showStatusMessage('Error saving profile: ' + error.message, 'error');
    });
  });
}

function getUserData() {
  return new Promise((resolve) => {
    // Collect personal information
    const personalData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zip: document.getElementById('zip').value,
      country: document.getElementById('country').value
    };
    
    // Collect work history
    const workEntries = document.querySelectorAll('.work-entry');
    const workHistory = Array.from(workEntries).map(form => {
      return {
        company: form.querySelector('[name="company"]').value,
        title: form.querySelector('[name="title"]').value,
        startDate: form.querySelector('[name="workStartDate"]').value,
        endDate: form.querySelector('[name="workEndDate"]').value,
        currentJob: form.querySelector('[name="currentJob"]').checked,
        description: form.querySelector('[name="description"]').value
      };
    });
    
    // Collect education
    const educationEntries = document.querySelectorAll('.education-entry');
    const education = Array.from(educationEntries).map(form => {
      return {
        school: form.querySelector('[name="school"]').value,
        degree: form.querySelector('[name="degree"]').value,
        fieldOfStudy: form.querySelector('[name="field"]').value,
        startDate: form.querySelector('[name="eduStartDate"]').value,
        endDate: form.querySelector('[name="eduEndDate"]').value,
        currentSchool: form.querySelector('[name="currentSchool"]').checked
      };
    });
    
    // Collect skills
    const skills = {
      skills: document.getElementById('skills').value,
      certifications: document.getElementById('certifications').value,
      languages: document.getElementById('languages').value
    };
    
    resolve({
      personal: personalData,
      work: workHistory,
      education: education,
      skills: skills
    });
  });
}

function loadUserData() {
  getFromStorage().then(userData => {
    if (!userData) return;
    
    // Fill personal data
    if (userData.personal) {
      const personal = userData.personal;
      document.getElementById('firstName').value = personal.firstName || '';
      document.getElementById('lastName').value = personal.lastName || '';
      document.getElementById('email').value = personal.email || '';
      document.getElementById('phone').value = personal.phone || '';
      document.getElementById('address').value = personal.address || '';
      document.getElementById('city').value = personal.city || '';
      document.getElementById('state').value = personal.state || '';
      document.getElementById('zip').value = personal.zip || '';
      document.getElementById('country').value = personal.country || '';
    }
    
    // Fill work history
    if (userData.work && userData.work.length > 0) {
      const workContainer = document.getElementById('work-history-container');
      workContainer.innerHTML = ''; // Clear default entry
      
      userData.work.forEach(workItem => {
        const template = document.getElementById('work-template');
        const clone = document.importNode(template.content, true);
        
        // Fill in work data
        clone.querySelector('[name="company"]').value = workItem.company || '';
        clone.querySelector('[name="title"]').value = workItem.title || '';
        clone.querySelector('[name="workStartDate"]').value = workItem.startDate || '';
        clone.querySelector('[name="workEndDate"]').value = workItem.endDate || '';
        clone.querySelector('[name="currentJob"]').checked = workItem.currentJob || false;
        clone.querySelector('[name="description"]').value = workItem.description || '';
        
        setupRemoveButton(clone);
        workContainer.appendChild(clone);
      });
    }
    
    // Fill education
    if (userData.education && userData.education.length > 0) {
      const educationContainer = document.getElementById('education-container');
      educationContainer.innerHTML = ''; // Clear default entry
      
      userData.education.forEach(eduItem => {
        const template = document.getElementById('education-template');
        const clone = document.importNode(template.content, true);
        
        // Fill in education data
        clone.querySelector('[name="school"]').value = eduItem.school || '';
        clone.querySelector('[name="degree"]').value = eduItem.degree || '';
        clone.querySelector('[name="field"]').value = eduItem.fieldOfStudy || '';
        clone.querySelector('[name="eduStartDate"]').value = eduItem.startDate || '';
        clone.querySelector('[name="eduEndDate"]').value = eduItem.endDate || '';
        clone.querySelector('[name="currentSchool"]').checked = eduItem.currentSchool || false;
        
        setupRemoveButton(clone);
        educationContainer.appendChild(clone);
      });
    }
    
    // Fill skills
    if (userData.skills) {
      document.getElementById('skills').value = userData.skills.skills || '';
      document.getElementById('certifications').value = userData.skills.certifications || '';
      document.getElementById('languages').value = userData.skills.languages || '';
    }
  });
}

function clearUserData() {
  if (confirm('Are you sure you want to clear all your profile data?')) {
    chrome.storage.local.remove('workdayAssistantData', () => {
      // Clear all inputs
      document.querySelectorAll('input, textarea').forEach(input => {
        if (input.type === 'checkbox') {
          input.checked = false;
        } else {
          input.value = '';
        }
      });
      
      // Reset sections with dynamic entries
      document.getElementById('work-history-container').innerHTML = '';
      document.getElementById('education-container').innerHTML = '';
      
      // Add back first entries
      document.getElementById('add-work').click();
      document.getElementById('add-education').click();
      
      showStatusMessage('Profile cleared successfully', 'success');
    });
  }
}
