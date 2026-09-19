// Demo data mock for authentication
const MOCK_USERS = {
  'student@example.com': {
    id: 1,
    email: 'student@example.com',
    first_name: 'Demo',
    last_name: 'Student',
    role: 'STUDENT',
  },
  'university@example.com': {
    id: 2,
    email: 'university@example.com',
    first_name: 'Demo',
    last_name: 'University',
    role: 'UNIVERSITY',
  },
  'industry@example.com': {
    id: 3,
    email: 'industry@example.com',
    first_name: 'Demo',
    last_name: 'Industry',
    role: 'INDUSTRY',
  }
};

let currentDemoUser = null;

export const authDemoAdapter = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS[email];
        if (user && password === 'demo123') {
          currentDemoUser = user;
          // Store fake tokens in local storage directly inside adapter to mock behavior
          resolve({
            access_token: `demo_access_token_${user.id}`,
            refresh_token: `demo_refresh_token_${user.id}`,
            token_type: 'bearer'
          });
        } else if (user && (password === 'student123' || password === 'university123' || password === 'industry123')) {
           currentDemoUser = user;
           resolve({
            access_token: `demo_access_token_${user.id}`,
            refresh_token: `demo_refresh_token_${user.id}`,
            token_type: 'bearer'
          });
        }
        else {
          reject(new Error('Invalid email or password (Try: student@example.com / student123)'));
        }
      }, 800); // Simulate network delay
    });
  },

  getMe: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const token = localStorage.getItem('access_token');
        if (token && token.startsWith('demo_access_token_')) {
          const userId = parseInt(token.split('_').pop());
          const user = Object.values(MOCK_USERS).find(u => u.id === userId) || currentDemoUser;
          if (user) resolve(user);
          else reject(new Error('User not found'));
        } else {
          reject(new Error('Not authenticated'));
        }
      }, 400);
    });
  },

  register: async (userData, roleType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Math.floor(Math.random() * 1000) + 10,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: roleType.toUpperCase(),
        };
        MOCK_USERS[userData.email] = newUser;
        resolve(newUser);
      }, 1000);
    });
  }
};
