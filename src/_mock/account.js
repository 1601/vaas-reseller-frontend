// ----------------------------------------------------------------------

async function fetchUserData(id) {
  const response = await fetch(`/api/user/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}` 
    }
  });
  const data = await response.json();
  return data;
}

const user = JSON.parse(localStorage.getItem('user'));

const account = {
  displayName: user ? (user.username || 'Guest') : 'Guest',
  email: user ? (user.email || 'guest@email.com') : 'guest@email.com',
  photoURL: '/assets/images/avatars/avatar_default.jpg',
};

console.log("Email from localStorage:", user ? user.email : 'N/A');
console.log("Username from localStorage:", user ? user.username : 'N/A');

export default account;

