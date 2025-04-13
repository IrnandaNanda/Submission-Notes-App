export function formatCreatedAtDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

// function to generate a unique ID for each note
export function generateId() {
  return `notes-${Math.random().toString(36).substr(2, 10)}`;
}

// function to validate the note title and body
export function validateNote(title, body) {
  if (title.trim() === '' || body.trim() === '') {
    return 'Title and body cannot be empty.';
  }
  return '';
}