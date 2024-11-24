<template>
  <div class="signup">
    <div class="signup-card">
      <h2>Create a New Account</h2>
      <form @submit.prevent="handleSignUp">
        <div class="input-group">
          <label for="name">Name:</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            required 
            :class="{'input-error': errorMessage && !name}"
            aria-describedby="nameError"
            placeholder="Enter your name"
          />
        </div>

        <div class="input-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            :class="{'input-error': errorMessage && !email}"
            aria-describedby="emailError"
            placeholder="Enter your email"
          />
        </div>

        <div class="input-group">
          <label for="contactNumber">Contact Number:</label>
          <input 
            type="tel" 
            id="contactNumber" 
            v-model="contactNumber" 
            required 
            :class="{'input-error': errorMessage && !contactNumber}"
            aria-describedby="contactNumberError"
            placeholder="Enter your contact number"
          />
        </div>

        <div class="input-group">
          <label for="role">Role:</label>
          <input 
            type="text" 
            id="role" 
            v-model="role" 
            required
            :class="{'input-error': errorMessage && !role}"
            placeholder="Enter your role"
          />
        </div>

        <div class="input-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            :class="{'input-error': errorMessage && !password}"
            placeholder="Enter your password"
          />
        </div>

        <div class="input-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required 
            :class="{'input-error': errorMessage && !confirmPassword}"
            placeholder="Confirm your password"
          />
        </div>

        <button type="submit" class="signup-btn" :disabled="isSubmitting">Sign Up</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
      <p class="redirect-message">
        Already have an account? 
        <a href="#" @click.prevent="redirectToLogin">Login here</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      contactNumber: '',
      role: '',
      confirmPassword: '',
      isSubmitting: false,
      errorMessage: ''
    };
  },
  methods: {
    async handleSignUp() {
      this.errorMessage = ''; // Clear previous errors

      // Validate password match
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      // Validate email
      if (!/\S+@\S+\.\S+/.test(this.email)) {
        this.errorMessage = 'Please enter a valid email address.';
        return;
      }

      // Validate contact number
      if (!/^\d{10}$/.test(this.contactNumber)) {
        this.errorMessage = 'Please enter a valid contact number.';
        return;
      }

      this.isSubmitting = true;
      try {
        // Dispatch register action
        await this.$store.dispatch('register', {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
          contactNumber: this.contactNumber
        });
        // Navigate to dashboard on successful sign up
        this.$router.push({ name: 'dashboard' });
      } catch (error) {
        // Handle sign up failure
        this.errorMessage = error.message || 'Sign up failed. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    },
    redirectToLogin() {
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #6e7df2, #e94e77);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.signup-card {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 6px;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #6e7df2;
  box-shadow: 0 0 8px rgba(110, 125, 242, 0.3);
  outline: none;
}

.input-group input.input-error {
  border-color: #f44336;
  background-color: #fff3f3;
}

.signup-btn {
  width: 100%;
  padding: 14px;
  background-color: #6e7df2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.signup-btn:hover {
  background-color: #5361eb;
}

.signup-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 12px;
}

.redirect-message {
  margin-top: 20px;
  font-size: 14px;
}

.redirect-message a {
  color: #6e7df2;
  text-decoration: none;
}

.redirect-message a:hover {
  text-decoration: underline;
}

/* Mobile and Tablet Responsive */
@media (max-width: 768px) {
  .signup-card {
    max-width: 90%;
    padding: 20px;
  }

  h2 {
    font-size: 24px;
  }

  .input-group input,
  .signup-btn {
    font-size: 14px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .signup-card {
    max-width: 95%;
    padding: 15px;
  }

  h2 {
    font-size: 22px;
  }

  .input-group input,
  .signup-btn {
    font-size: 12px;
    padding: 8px;
  }
}
</style>
