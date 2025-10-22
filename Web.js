// select Section
function showSection(sectionId) {
  document.querySelectorAll('section').forEach(section => {
    section.style.display = 'none';
  });
  const activeSection = document.getElementById(sectionId);
  activeSection.style.display = 'flex'; 
}

// Show/Hide button
function toggleExtraButtons() {
  const extraButtons = document.getElementById('extra-buttons');
  const toggleBtn = document.querySelector('.toggle-btn');
  
  if (extraButtons.style.display === 'none') {
    extraButtons.style.display = 'block';
    toggleBtn.textContent = 'Hide';
  } else {
    extraButtons.style.display = 'none';
    toggleBtn.textContent = 'Show';
  }
}

//font size changing button
let currentSize = 20; //default
function increaseFont() {
  if (currentSize < 32) {
    currentSize++;
    document.documentElement.style.setProperty('--text-size', currentSize + 'px');
    loadComments().then(comments => displayComments(comments));
  }
}
function decreaseFont() {
  if (currentSize > 8) {
    currentSize--;
    document.documentElement.style.setProperty('--text-size', currentSize + 'px');
    loadComments().then(comments => displayComments(comments));
  }
}

//Spotlight
function addSpotlight() {
  const input = prompt('Enter spotlight:');
  if (input && input.trim()) {
    const spotlightArea = document.getElementById('spotlight-area');
    const newItem = document.createElement('div');
    newItem.textContent = input.trim();
    spotlightArea.appendChild(newItem);
  }
}

//Bootstrap Modal Window
function showTimeModal() {
  const now = new Date();
  document.getElementById('currentTime').textContent = now.toLocaleString();
  
  // 用正确的方法显示modal
  const modal = new bootstrap.Modal(document.getElementById('timeModal'));
  modal.show();
}

//Form validation and Add Comment
async function addComment() {
  const email = document.getElementById('email').value;
  const color = document.querySelector('input[name="color"]:checked')?.value || 'gray';
  const comment = document.getElementById('comment').value;
  
  document.getElementById('email').setCustomValidity('');
  document.getElementById('comment').setCustomValidity('');
  
  if (!validateEmail(email)) {
    document.getElementById('email').setCustomValidity('Incorrect email format');
    document.getElementById('email').reportValidity();
    return;
  }
  
  if (!comment.trim()) {
    document.getElementById('comment').setCustomValidity('Empty comments!');
    document.getElementById('comment').reportValidity();
    return;
  }

  //After Validation
  const comments = await loadComments();
  comments.push({
    email: email,
    comment: comment,
    color: color,
    timestamp: new Date().toISOString()
  });
  
  await saveComments(comments);
  displayComments(comments);
  document.getElementById('commentForm').reset();
}

function displayComments(comments) {
  const commentsList = document.getElementById('commentsList');
  const currentSize = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-size') || '20px';
  
  commentsList.innerHTML = comments.map(comment => `
    <div class="comment-item" style="font-size: ${currentSize}">
      <div class="avatar" style="background: ${comment.color || 'gray'}; font-size: ${currentSize}">
        ${comment.email.charAt(0).toUpperCase()}
      </div>
      <div class="comment-content" style="font-size: ${currentSize}">
        <div class="user-email">${comment.email}</div>
        <div class="comment-text">${comment.comment}</div>
      </div>
    </div>
  `).join('');
}
  
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

//Load Comments
async function loadComments(){
    try {
    const response = await fetch('./comments.json');
    return await response.json();
    } catch (error) {
        return [];
  }
}
document.addEventListener('DOMContentLoaded', function() {
  loadComments().then(comments => {
    displayComments(comments);
  });
});

//Save Comments
async function saveComments(comments) {
  try {
    await fetch('./comments.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comments)
    });
  } catch (error) {
    localStorage.setItem('comments', JSON.stringify(comments));
  }

}
