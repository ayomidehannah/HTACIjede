// Initialize Firebase
// Replace the config with your Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Firebase Storage
const storage = firebase.storage();

// Authentication state observer
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    document.getElementById('user-info').textContent = `Logged in as: ${user.email}`;
    loadAllSections();
  } else {
    // User is signed out
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
  }
});

// Login functionality
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      showToast('Login successful!', 'success');
    })
    .catch((error) => {
      const errorMessage = error.message;
      showToast(errorMessage, 'danger');
    });
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', function() {
  firebase.auth().signOut().then(() => {
    showToast('Logged out successfully', 'success');
  }).catch((error) => {
    showToast('Error signing out: ' + error.message, 'danger');
  });
});

// Function to load all sections from the database
function loadAllSections() {
  // Load homepage content
  loadHomepageContent();
  
  // Load about page content
  loadAboutContent();
  
  // Load activities content
  loadActivitiesContent();
  
  // Load events content
  loadEventsContent();
  
  // Load blog posts
  loadBlogPosts();
  
  // Load sermons
  loadSermons();
}

/************************* 
  HOMEPAGE FUNCTIONS 
*************************/

// Load homepage content
function loadHomepageContent() {
  db.collection('homepage').doc('content').get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        
        // Hero section
        document.getElementById('hero-title').value = data.heroTitle || '';
        document.getElementById('hero-subtitle').value = data.heroSubtitle || '';
        
        // Welcome section
        document.getElementById('welcome-title').value = data.welcomeTitle || '';
        document.getElementById('welcome-text').value = data.welcomeText || '';
        
        // Services section
        document.getElementById('services-title').value = data.servicesTitle || '';
        document.getElementById('services-description').value = data.servicesDescription || '';
        
        // Contact info
        document.getElementById('contact-email').value = data.contactEmail || '';
        document.getElementById('contact-phone').value = data.contactPhone || '';
        document.getElementById('contact-address').value = data.contactAddress || '';
        
        // Social media links
        document.getElementById('facebook-link').value = data.facebookLink || '';
        document.getElementById('twitter-link').value = data.twitterLink || '';
        document.getElementById('instagram-link').value = data.instagramLink || '';
        document.getElementById('youtube-link').value = data.youtubeLink || '';
      } else {
        console.log("No homepage document found!");
      }
    })
    .catch((error) => {
      console.error("Error getting homepage document:", error);
      showToast('Error loading homepage content', 'danger');
    });
}

// Save homepage content
document.getElementById('save-homepage').addEventListener('click', function() {
  const homepageData = {
    // Hero section
    heroTitle: document.getElementById('hero-title').value,
    heroSubtitle: document.getElementById('hero-subtitle').value,
    
    // Welcome section
    welcomeTitle: document.getElementById('welcome-title').value,
    welcomeText: document.getElementById('welcome-text').value,
    
    // Services section
    servicesTitle: document.getElementById('services-title').value,
    servicesDescription: document.getElementById('services-description').value,
    
    // Contact info
    contactEmail: document.getElementById('contact-email').value,
    contactPhone: document.getElementById('contact-phone').value,
    contactAddress: document.getElementById('contact-address').value,
    
    // Social media links
    facebookLink: document.getElementById('facebook-link').value,
    twitterLink: document.getElementById('twitter-link').value,
    instagramLink: document.getElementById('instagram-link').value,
    youtubeLink: document.getElementById('youtube-link').value,
    
    // Timestamp for last update
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  db.collection('homepage').doc('content').set(homepageData)
    .then(() => {
      showToast('Homepage content updated successfully!', 'success');
    })
    .catch((error) => {
      console.error("Error updating homepage document: ", error);
      showToast('Error updating homepage content', 'danger');
    });
});

// Upload hero image
document.getElementById('hero-image-upload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  uploadImage(file, 'homepage/hero-image.jpg', 'hero-image-preview', function(url) {
    db.collection('homepage').doc('content').update({
      heroImageUrl: url,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      showToast('Hero image updated successfully!', 'success');
    })
    .catch((error) => {
      console.error("Error updating hero image: ", error);
      showToast('Error updating hero image', 'danger');
    });
  });
});

/************************* 
  ABOUT PAGE FUNCTIONS 
*************************/

// Load about page content
function loadAboutContent() {
  db.collection('about').doc('content').get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        
        // Main content
        document.getElementById('about-title').value = data.title || '';
        document.getElementById('about-subtitle').value = data.subtitle || '';
        document.getElementById('about-content').value = data.content || '';
        document.getElementById('mission-statement').value = data.missionStatement || '';
        document.getElementById('vision-statement').value = data.visionStatement || '';
        
        // Show current church image if it exists
        if (data.churchImageUrl) {
          document.getElementById('church-image-preview').src = data.churchImageUrl;
          document.getElementById('church-image-preview').style.display = 'block';
        }
        
        // Load staff members
        loadStaffMembers();
      } else {
        console.log("No about document found!");
      }
    })
    .catch((error) => {
      console.error("Error getting about document:", error);
      showToast('Error loading about content', 'danger');
    });
}

// Save about page content
document.getElementById('save-about').addEventListener('click', function() {
  const aboutData = {
    title: document.getElementById('about-title').value,
    subtitle: document.getElementById('about-subtitle').value,
    content: document.getElementById('about-content').value,
    missionStatement: document.getElementById('mission-statement').value,
    visionStatement: document.getElementById('vision-statement').value,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  db.collection('about').doc('content').set(aboutData, { merge: true })
    .then(() => {
      showToast('About page content updated successfully!', 'success');
    })
    .catch((error) => {
      console.error("Error updating about document: ", error);
      showToast('Error updating about content', 'danger');
    });
});

// Upload church image
document.getElementById('church-image-upload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  uploadImage(file, 'about/church-image.jpg', 'church-image-preview', function(url) {
    db.collection('about').doc('content').update({
      churchImageUrl: url,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      showToast('Church image updated successfully!', 'success');
    })
    .catch((error) => {
      console.error("Error updating church image: ", error);
      showToast('Error updating church image', 'danger');
    });
  });
});

// Load staff members
function loadStaffMembers() {
  const staffTableBody = document.getElementById('staff-table-body');
  staffTableBody.innerHTML = '';
  
  db.collection('about').doc('staff').collection('members').orderBy('order').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const staff = doc.data();
        const row = `
          <tr data-id="${doc.id}">
            <td>${staff.name}</td>
            <td>${staff.position}</td>
            <td>
              <button class="btn btn-sm btn-primary edit-staff-btn">Edit</button>
              <button class="btn btn-sm btn-danger delete-staff-btn">Delete</button>
            </td>
          </tr>
        `;
        staffTableBody.innerHTML += row;
      });
      
      // Add event listeners to buttons
      addStaffButtonListeners();
    })
    .catch((error) => {
      console.error("Error getting staff members: ", error);
      showToast('Error loading staff members', 'danger');
    });
}

// Add staff member
document.getElementById('add-staff-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const staffData = {
    name: document.getElementById('staff-name').value,
    position: document.getElementById('staff-position').value,
    bio: document.getElementById('staff-bio').value,
    email: document.getElementById('staff-email').value,
    phone: document.getElementById('staff-phone').value,
    order: parseInt(document.getElementById('staff-order').value) || 999,
    dateAdded: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  db.collection('about').doc('staff').collection('members').add(staffData)
    .then(() => {
      showToast('Staff member added successfully!', 'success');
      document.getElementById('add-staff-form').reset();
      loadStaffMembers();
    })
    .catch((error) => {
      console.error("Error adding staff member: ", error);
      showToast('Error adding staff member', 'danger');
    });
});

// Upload staff photo
document.getElementById('staff-photo-upload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    document.getElementById('staff-photo-name').textContent = file.name;
  }
});

// Add event listeners to staff buttons
function addStaffButtonListeners() {
  // Edit staff button
  document.querySelectorAll('.edit-staff-btn').forEach(button => {
    button.addEventListener('click', function() {
      const staffId = this.parentElement.parentElement.getAttribute('data-id');
      openStaffEditModal(staffId);
    });
  });
  
  // Delete staff button
  document.querySelectorAll('.delete-staff-btn').forEach(button => {
    button.addEventListener('click', function() {
      const staffId = this.parentElement.parentElement.getAttribute('data-id');
      const staffName = this.parentElement.parentElement.children[0].textContent;
      
      if (confirm(`Are you sure you want to delete ${staffName} from staff?`)) {
        db.collection('about').doc('staff').collection('members').doc(staffId).delete()
          .then(() => {
            showToast('Staff member deleted successfully!', 'success');
            loadStaffMembers();
          })
          .catch((error) => {
            console.error("Error removing staff member: ", error);
            showToast('Error deleting staff member', 'danger');
          });
      }
    });
  });
}

// Open staff edit modal
function openStaffEditModal(staffId) {
  db.collection('about').doc('staff').collection('members').doc(staffId).get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        
        // Populate the edit form
        document.getElementById('edit-staff-id').value = doc.id;
        document.getElementById('edit-staff-name').value = data.name || '';
        document.getElementById('edit-staff-position').value = data.position || '';
        document.getElementById('edit-staff-bio').value = data.bio || '';
        document.getElementById('edit-staff-email').value = data.email || '';
        document.getElementById('edit-staff-phone').value = data.phone || '';
        document.getElementById('edit-staff-order').value = data.order || '';
        
        // Show the image if it exists
        if (data.photoUrl) {
          document.getElementById('edit-staff-photo-preview').src = data.photoUrl;
          document.getElementById('edit-staff-photo-preview').style.display = 'block';
        } else {
          document.getElementById('edit-staff-photo-preview').style.display = 'none';
        }
        
        // Show the modal
        const editStaffModal = new bootstrap.Modal(document.getElementById('edit-staff-modal'));
        editStaffModal.show();
      } else {
        showToast('Staff member not found!', 'danger');
      }
    })
    .catch((error) => {
      console.error("Error getting staff member: ", error);
      showToast('Error loading staff member data', 'danger');
    });
}

// Save edited staff
document.getElementById('edit-staff-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const staffId = document.getElementById('edit-staff-id').value;
  
  const staffData = {
    name: document.getElementById('edit-staff-name').value,
    position: document.getElementById('edit-staff-position').value,
    bio: document.getElementById('edit-staff-bio').value,
    email: document.getElementById('edit-staff-email').value,
    phone: document.getElementById('edit-staff-phone').value,
    order: parseInt(document.getElementById('edit-staff-order').value) || 999,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  db.collection('about').doc('staff').collection('members').doc(staffId).update(staffData)
    .then(() => {
      showToast('Staff member updated successfully!', 'success');
      loadStaffMembers();
      
      // Close the modal
      const editStaffModal = bootstrap.Modal.getInstance(document.getElementById('edit-staff-modal'));
      editStaffModal.hide();
    })
    .catch((error) => {
      console.error("Error updating staff member: ", error);
      showToast('Error updating staff member', 'danger');
    });
});

// Upload edited staff photo
document.getElementById('edit-staff-photo-upload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const staffId = document.getElementById('edit-staff-id').value;
    uploadImage(file, `about/staff/${staffId}.jpg`, 'edit-staff-photo-preview', function(url) {
      document.getElementById('edit-staff-photo-preview').style.display = 'block';
      
      // Update the photo URL in the database
      db.collection('about').doc('staff').collection('members').doc(staffId).update({
        photoUrl: url,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
  }
});

/************************* 
  ACTIVITIES FUNCTIONS 
*************************/

// Load activities content
function loadActivitiesContent() {
  db.collection('activities').doc('content').get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        
        // Main content
        document.getElementById('activities-title').value = data.title || '';
        document.getElementById('activities-subtitle').value = data.subtitle || '';
        document.getElementById('activities-content').value = data.content || '';
      } else {
        console.log("No activities document found!");
      }
    })
    .catch((error) => {
      console.error("Error getting activities document:", error);
      showToast('Error loading activities content', 'danger');
    });
  
  loadActivitiesList();
}

// Load activities list
function loadActivitiesList() {
  const activitiesTableBody = document.getElementById('activities-table-body');
  activitiesTableBody.innerHTML = '';
  
  db.collection('activities').doc('list').collection('items').orderBy('order').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const activity = doc.data();
        const row = `
          <tr data-id="${doc.id}">
            <td>${activity.name}</td>
            <td>${activity.dayTime || 'Not specified'}</td>
            <td>
              <button class="btn btn-sm btn-primary edit-activity-btn">Edit</button>
              <button class="btn btn-sm btn-danger delete-activity-btn">Delete</button>
            </td>
          </tr>
        `;
        activitiesTableBody.innerHTML += row;
      });
      
      // Add event listeners to buttons
      addActivityButtonListeners();
    })
    .catch((error) => {
      console.error("Error getting activities: ", error);
      showToast('Error loading activities list', 'danger');
    });
}

// Save activities content
document.getElementById('save-activities').addEventListener('click', function() {
  const activitiesData = {
    title: document.getElementById('activities-title').value,
    subtitle: document.getElementById('activities-subtitle').value,
    content: document.getElementById('activities-content').value,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  db.collection('activities').doc('content').set(activitiesData, { merge: true })
    .then(() => {
      showToast('Activities content updated successfully!', 'success');
    })
    .catch((error) => {
      console.error("Error updating activities document: ", error);
      showToast('Error updating activities content', 'danger');
    });
});

// Add activity
document.getElementById('add-activity-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const activityData = {
    name: document.getElementById('activity-name').value,
    description: document.getElementById('activity-description').value,
    dayTime: document.getElementById('activity-daytime').value,
    location: document.getElementById('activity-location').value,
    contactPerson: document.getElementById('activity-contact').value,
    order: parseInt(document.getElementById('activity-order').value) || 999,
    dateAdded: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  db.collection('activities').doc('list').collection('items').add(activityData)
    .then(() => {
      showToast('Activity added successfully!', 'success');
      document.getElementById('add-activity-form').reset();
      loadActivitiesList();
    })
    .catch((error) => {
      console.error("Error adding activity: ", error);
      showToast('Error adding activity', 'danger');
    });
});

// Add event listeners to activity buttons
function addActivityButtonListeners() {
  // Edit activity button
  document.querySelectorAll('.edit-activity-btn').forEach(button => {
    button.addEventListener('click', function() {
      const activityId = this.parentElement.parentElement.getAttribute('data-id');
      openActivityEditModal(activityId);
    });
  });
  
  // Delete activity button
  document.querySelectorAll('.delete-activity-btn').forEach(button => {
    button.addEventListener('click', function() {
      const activityId = this.parentElement.parentElement.getAttribute('data-id');
      const activityName = this.parentElement.parentElement.children[0].textContent;
      
      if (confirm(`Are you sure you want to delete "${activityName}" activity?`)) {
        db.collection('activities').doc('list').collection('items').doc(activityId).delete()
          .then(() => {
            showToast('Activity deleted successfully!', 'success');
            loadActivitiesList();
          })
          .catch((error) => {
            console.error("Error removing activity: ", error);
            showToast('Error deleting activity', 'danger');
          });
      }
    });
  });
}

// Open activity edit modal
function openActivityEditModal(activityId) {
  db.collection('activities').doc('list').collection('items').doc(activityId).get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        
        // Populate the edit form
        document.getElementById('edit-activity-id').value = doc.id;
        document.getElementById('edit-activity-name').value = data.name || '';
        document.getElementById('edit-activity-description').value = data.description || '';
        document.getElementById('edit-activity-daytime').value = data.dayTime || '';
        document.getElementById('edit-activity-location').value = data.location || '';
        document.getElementById('edit-activity-contact').value = data.contactPerson || '';
        document.getElementById('edit-activity-order').value = data.order || '';
        
        // Show the image if it exists
        if (data.imageUrl) {
          document.getElementById('edit-activity-image-preview').src = data.imageUrl;
          document.getElementById('edit-activity-image-preview').style.display = 'block';
        } else {
          document.getElementById('edit-activity-image-preview').style.display = 'none';
        }
        
        // Show the modal
        const editActivityModal = new bootstrap.Modal(document.getElementById('edit-activity-modal'));
        editActivityModal.show();
      } else {
        showToast('Activity not found!', 'danger');
      }
    })
    .catch((error) => {
      console.error("Error getting activity: ", error);
      showToast('Error loading activity data', 'danger');
    });
}

// Save edited activity
document.getElementById('edit-activity-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const activityId = document.getElementById('edit-activity-id').value;
  
  const activityData = {
    name: document.getElementById('edit-activity-name').value,
    description: document.getElementById('edit-activity-description').value,
    dayTime: document.getElementById('edit-activity-daytime').value,
    location: document.getElementById('edit-activity-location').value,
    contactPerson: document.getElementById('edit-activity-contact').value,
    order: parseInt(document.getElementById('edit-activity-order').value) || 999,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  db.collection('activities').doc('list').collection('items').doc(activityId).update(activityData)
    .then(() => {
      showToast('Activity updated successfully!', 'success');
      loadActivitiesList();
      
      // Close the modal
      const editActivityModal = bootstrap.Modal.getInstance(document.getElementById('edit-activity-modal'));
      editActivityModal.hide();
    })
    .catch((error) => {
      console.error("Error updating activity: ", error);
      showToast('Error updating activity', 'danger');
    });
});

// Upload activity image
document.getElementById('edit-activity-image-upload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const activityId = document.getElementById('edit-activity-id').value;
    uploadImage(file, `activities/${activityId}.jpg`, 'edit-activity-image-preview', function(url) {
      document.getElementById('edit-activity-image-preview').style.display = 'block';
      
      // Update the image URL in the database
      db.collection('activities').doc('list').collection('items').doc(activityId).update({
        imageUrl: url,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
  }
});

/************************* 
  EVENTS FUNCTIONS 
*************************/

// Load events content
function loadEventsContent() {
  db.collection('events').doc('content').get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        
        // Main content
        document.getElementById('events-title').value = data.title || '';
        document.getElementById('events-subtitle').value = data.subtitle || '';
        document.getElementById('events-content').value = data.content || '';
      } else {
        console.log("No events document found!");
      }
    })
    .catch((error) => {
      console.error("Error getting events document:", error);
      showToast('Error loading events content', 'danger');
    });
  
  loadEventsList();
}

// Load events list
function loadEventsList() {
  const eventsTableBody = document.getElementById('events-table-body');
  eventsTableBody.innerHTML = '';
  
  // Get only future events or events from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  db.collection('events').doc('list').collection('items')
    .orderBy('eventDate', 'desc')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const event = doc.data();
        
        // Format the date
        let eventDate = event.eventDate ? event.eventDate.toDate() : new Date();
        const formattedDate = eventDate.toLocaleDateString();
        
        // Check if the event is upcoming
        const isUpcoming = eventDate >= new Date();
        const badgeClass = isUpcoming ? 'bg-success' : 'bg-secondary';
        const status = isUpcoming ? 'Upcoming' : 'Past';
        
        const row = `
          <tr data-id="${doc.id}">
            <td>${event.title}</td>
            <td>${formattedDate}</td>
            <td><span class="badge ${badgeClass}">${status}</span></td>
            <td>
              <button class="btn btn-sm btn-primary edit-event-btn">Edit</button>
              <button class="btn btn-sm btn-danger delete-event-btn">Delete</button>
            </td>
          </tr>
        `;
        eventsTableBody.innerHTML += row;
      });
      
      // Add event listeners to buttons
      addEventButtonListeners();
    })
    .catch((error) => {
      console.error("Error getting events: ", error);
      showToast('Error loading events list', 'danger');
    });
}

// Save events content
document.getElementById('save-events').addEventListener('click', function() {
  const eventsData = {
    title: document.getElementById('events-title').value,
    subtitle: document.getElementById('events-subtitle').value,
    content: document.getElementById('events-content').value,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  db.collection('events').doc('content').set(eventsData, { merge: true })
    .then(() => {
      showToast('Events content updated successfully!', 'success');
    })
    .catch((error) => {
      console.error("Error updating events document: ", error);
      showToast('Error updating events content', 'danger');
    });
});

// Add event
document.getElementById('add-event-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Convert date string to Firestore timestamp
  const eventDateStr = document.getElementById('event-date').value;
  const eventTimeStr = document.getElementById('event-time').value;
  const eventDateTime = new Date(`${eventDateStr}T${eventTimeStr || '00:00'}`);
  
  const eventData = {
    title: document.getElementById('event-title').value,
    description: document.getElementById('event-description').value,
    eventDate: firebase.firestore.Timestamp.fromDate(eventDateTime),
    location: document.getElementById('event-location').value,
    organizerContact: document.getElementById('event-contact').value,
    isFeatured: document.getElementById('event-featured').checked,
    dateAdded: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  db.collection('events').doc('list').collection('items').add(eventData)
    .then(() => {
      showToast('Event added successfully!', 'success');
      document.getElementById('add-event-form').reset();
      loadEventsList();
    })
    .catch((error) => {
      console.error("Error adding event: ", error);
      showToast('Error adding event', 'danger');
    });
});

// Add event listeners to event buttons
function addEventButtonListeners() {
  // Edit event button
  document.querySelectorAll('.edit-event-btn').forEach(button => {
    button.addEventListener('click', function() {
      const eventId = this.parentElement.parentElement.getAttribute('data-id');
      openEventEditModal(eventId);
    });
  });
  
  // Delete event button
  document.querySelectorAll('.delete-event-btn').forEach(button => {
    button.addEventListener('click', function() {
      const eventId = this.parentElement.parentElement.getAttribute('data-id');
      const eventTitle = this.parentElement.parentElement.children[0].textContent;
      
      if (confirm(`Are you sure you want to delete "${eventTitle}" event?`)) {
        db.collection('events').doc('list').collection('items').doc(eventId).delete()
          .then(() => {
            showToast('Event deleted successfully!', 'success');
            loadEventsList();
          })
          .catch((error) => {
            console.error("Error removing event: ", error);
            showToast('Error deleting event', 'danger');
          });
      }
    });
  });
}


// Open event edit modal
function openEventEditModal(eventId) {
  db.collection('events').doc('list').collection('items').doc(eventId).get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        
        // Populate the edit form
        document.getElementById('edit-event-id').value = doc.id;
        document.getElementById('edit-event-title').value = data.title || '';
        document.getElementById('edit-event-description').value = data.description || '';
        document.getElementById('edit-event-date').value = data.eventDate ? data.eventDate.toDate().toISOString().split('T')[0] : '';