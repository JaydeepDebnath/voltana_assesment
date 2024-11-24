<template>
    <div class="set-password">
        <h2>Set Your Password</h2>

        <form @submit.prevent="onSubmit">
            <div v-if="error" class="error-message">
                <p>{{ error }}</p>
            </div>
            <div>
                <label for="password">New Password</label>
                <input
                type="password"
                v-model="password"
                id="password"
                required
                placeholder="Enter new password"
                /> 
            </div>
            <div>
                <label for="confirmPassword">Confirm Password</label>
                <input 
                    type="password"
                    v-model="confirmPassword"
                    id="confirmPassword"
                    required
                    placeholder="Confirm new Password"
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
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #d6d6d6;
}
</style>