<template>
  <div class="login">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        
        <div class="input-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        
        <button type="submit" class="login-btn" :disabled="isSubmitting">Login</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
      <p class="signup-prompt">
        Don't have an account? 
        <router-link to="/signup">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
    export default {
        data(){
            return {
                email:'',
                password:'',
                isSubmitting:false,
                errorMessage:''
            };
        },
        methods: {
            async handleLogin(){
                this.errorMessage = '',
                this.isSubmitting  = true;

            try {
                await this.$store.dispatch('login', {
                email: this.email,
                password: this.password,
                });

                this.$router.push({name:'dashboard'})
            } catch (error) {
                this.errorMessage = error.message  || 'Login failed. Please try again.';
            } finally {
                this.isSubmitting  = false;
            }
            }
        }
    }
</script>

<style scoped>
body {
  background: linear-gradient(135deg, #6e7df2, #e94e77);
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-card {
  background-color: #f9f9f981;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  font-size: 28px;
  font-weight: bold;
  color: #2f3c68;
  margin-bottom: 20px;
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

.login-btn {
  width: 50%;
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

.login-btn:hover {
  background-color: #5361eb;
}

.login-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 15px;
}

@media (max-width: 768px) {
  .login-card {
    max-width: 90%;
    padding: 20px;
  }

  h2 {
    font-size: 24px;
  }

  .input-group input,
  .login-btn {
    padding: 12px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .login-card {
    max-width: 95%;
    padding: 15px;
  }

  h2 {
    font-size: 22px;
  }

  .input-group input,
  .login-btn {
    padding: 10px;
    font-size: 12px;
  }
}

</style>