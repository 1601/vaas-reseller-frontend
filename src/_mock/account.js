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

const account = {
  displayName: localStorage.getItem('username') || 'Guest',
  email: localStorage.getItem('email') || 'guest@email.com',
  photoURL: '/assets/images/avatars/avatar_default.jpg',
};

console.log("Email from localStorage:", localStorage.getItem('email'));
console.log("Username from localStorage:", localStorage.getItem('username'));

export default account;
