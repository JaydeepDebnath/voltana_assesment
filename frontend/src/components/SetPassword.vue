<template>
  <div class="set-password">
    <h2>Set Your Password</h2>

    <form @submit.prevent="onSubmit">
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>

      <div class="form-group">
        <label for="password">New Password</label>
        <input
          type="password"
          v-model="password"
          id="password"
          required
          placeholder="Enter new password"
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          v-model="confirmPassword"
          id="confirmPassword"
          required
          placeholder="Confirm new password"
        />
      </div>

      <button type="submit" :disabled="isSubmitting">Set Password</button>
    </form>
  </div>
</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        data(){
            return {
                password: '',
                confirmPassword: '',
                error: null,
                isSubmitting: false,
                token: null, 
            };
        },
        computed:{
            error: state => state.error
        },
        methods:{
            async onSubmit(){
                if (this.password !== this.confirmPassword) {
                this.error = "Passwords do not match.";
                return;  
            }

            this.isSubmitting = true;

            try {
                const responseMessage = await this.setPassword({ token: this.token, password: this.password });
                alert(responseMessage);
            } catch (error) {
                this.error = error.message || "Something went wrong!";
            } finally{
                this.isSubmitting = false;
            }
        },

        extractTokenFromURL(){
            const urlParams = new URLSearchParams(window.location.search);
            this.token = urlParams.get('token');
            if(!this.token){
                this.error = 'Invaild or missing token';
            }
        }
    },
    created(){
        this.extractTokenFromURL();
    },
    methods:{
        ...mapActions({
            setPassword:'setPassword'
        }),
    }
};
</script>

<style scoped>
.set-password {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  text-align: center;
}

.set-password h2 {
  color: #333;
  font-size: 32px;
  margin-bottom: 30px;
  font-weight: 600;
}

.form-group {
  text-align: left;
  margin-bottom: 20px;
}

.error-message {
  color: #d9534f;
  font-size: 14px;
  font-weight: 600;
  background-color: #f8d7da;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d9534f;
  margin-bottom: 20px;
}

label {
  font-size: 16px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  display: block;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

button:disabled {
  background-color: #d6d6d6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .set-password {
    padding: 25px;
  }

  .set-password h2 {
    font-size: 28px;
  }

  input,
  button {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .set-password {
    padding: 15px;
  }

  .set-password h2 {
    font-size: 24px;
  }

  input,
  button {
    font-size: 14px;
  }
}
</style>