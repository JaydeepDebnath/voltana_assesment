<template>
    <div class="edit-user">
        <h2>Edit user details:</h2>
        <form @submit.prevent="updateUser">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="user.name" >
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="user.email" required />
            </div>
            <div>
                <label for="contactNumber">Contact Number:</label>
                <input type="contactNumber" id="contactNumber" v-model="user.contactNumber" >
            </div>
            <div>
                <label for="role">Role:</label>
                <input type="role" id="role" v-model="user.role" >
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="user.password" >
            </div>
            <div>
                <label for="confirmPassword">Confirm password:</label>
                <input type="password" id="confirmPassword" v-model="user.password"/>
            </div>
      <button type="submit" :disabled="isSubmitting">Update User</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                user:{
                    name:'',
                    email:'',
                    contactNumber: '',
                    role:'',
                    password:'',
                },
                isSubmitting:false,
                errorMessage:'',
            };
        },
        computed:{
            isLoading(){
                return this.$store.getters.isLoading; 
            },
        },
        async created(){
            const userId = this.$forceUpdate.params.id;
            await this.fetchUser(userId);
        },
        methods:{
            async fetchUser(userId){
                try {
                    const users = await this.$store.dispatch('getUsers');
                    const user = users.find(user => user.id === userId);
                    if(user){
                        this.user = {...user}
                    }else{
                        this.errorMessage = 'User not found !';
                    }
                } catch (error) {
                    this.errorMessage = error.message; 
                }
            },
            async updateUser(){
                this.isSubmitting = true;
                this.errorMessage = '';

                try {
                    const userId = this.$forceUpdate.params.id;
                    await this.$store.dispatch('updateAccountDetails',{
                        id:userId,
                        ...this.user
                    });
                    this.$router.push({name:'dashboard'});
                } catch (error) {
                    this.errorMessage = error.message;
                } finally {
                    this.isSubmitting = false;
                }
            }
        }
    }
</script>