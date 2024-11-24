<template>
    <div class="login">
        <h2>Login</h2>
        <form @submit.prevent = "handleLogin">
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required/>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password">
            </div>
            <button type="submit" :disabled="isSubmitting">Login</button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </form>
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
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

div {
  margin-bottom: 15px;
}

label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #646cff;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #5361eb;
}

button:disabled {
  background-color: #d1d1d1;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}
</style>