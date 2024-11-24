<template>
    <div class="signup">
        <h2>Create a new Account</h2>
        <form @submit.prevent="handleSignUp">
            <div>
                <label for="name">Name:</label>
                <input type="name" id="name" v-model="name" required/>
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required/>
            </div>
            <div>
                <label for="contactNumber">Contact Number:</label>
                <input type="tel" id="contactNumber" v-model="contactNumber" required/>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required/>
            </div>
            <div>
                <label for="confirmPassword">Confirm password:</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" required/>
            </div>
            <button type="submit" :disabled="isSubmitting">Sign Up</button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </form>
    </div>
</template>

<script>
export default {
    data(){
        return {
            email : '',
            password : '',
            confirmPassword : '',
            isSubmitting : false,
            errorMessage : ''
        };
    },
    methods: {
        async handleSignUp(){
            if(this.password !== this.confirmPassword){
                this.errorMessage = 'Password does not match!';
                return;
            }

            if (!/\S+@\S+\.\S+/.test(this.email)) {
                this.errorMessage = 'Please enter a valid email address.';
                return;
            }
            if (!/^\d{10}$/.test(this.contactNumber)) {
                this.errorMessage = 'Please enter a valid contact number.';
                return;
            }

            this.isSubmitting = true;
            this.errorMessage = '';

            try {
              await this.$store.dispatch('register',{
                email : this.email,
                password : this.password,
                contactNumber:this.contactNumber,
              });
              this.$router.push({name:'dashboard'});
            } catch (error) {
                this.errorMessage = 'Sign up failed. Please try again.';
            } finally {
                this.isSubmitting = false;
            }
        }
    }
}
</script>

<style scoped>
.signup {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7f7f7;
  font-family: 'Arial', sans-serif;
}

.signup-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  border-color: #646cff;
  outline: none;
}

.signup-btn {
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

.signup-btn:hover {
  background-color: #5361eb;
}

.signup-btn:disabled {
  background-color: #d1d1d1;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>