import { createStore } from 'vuex';

export default createStore({
    state:{
        user : null,
        token : null,
        isAuthenticated : false,
        isLoading : false,
        error : null,
    },
    mutations : {
      setUser(state,user){
        state.user = user;
      },
      setToken(state,token){
        state.token = token;
      },
      clearUser(state) {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      },
      setLoading(state, loadingStatus) {
        state.isLoading = loadingStatus;
      },
      setError(state, errorMessage) {
        state.error = errorMessage;
      },
    },
    actions : {
        async register({commit},userData){
            commit('setLoading',true)
            try {
                const response = await fetch("http://localhost:8000/api/v1/user/register",{
                    method:'POST',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body : JSON.stringify(userData),
                });
                const data = await response.json();

                if(response.ok){
                    commit('setError',null);
                    commit('setLoading',false);

                    dispatch('login',{
                        email:userData.email,
                        password: userData.password,
                    });
                }else {
                    throw new Error(data.message || 'Registration failed')
                }
            } catch (error){
                commit('setLoading',false);
                commit('setError',error.message);
            }
        },
        async login({commit,dispatch},credentials){
            commit('setLoading',true);
            try {
                const response = await fetch("http://localhost:8000/api/v1/user/login",{
                    method : 'POST',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(credentials),
                });

                const data = await response.json();

                if(response.ok) {
                    commit('setToken',data.token);
                    commit('setUser',data.user);
                    commit('setError',null);
                    commit('setLoading',false);
                } else {
                    throw new Error (data.message || 'Login failed')
                }
                
            } catch (error) {
                commit('setLoading', false);
                commit('setError', error.message);
            }
        },

        async logout({commit}){
            try {
                await fetch("http://localhost:8000/api/v1/user/logout",{
                    method:'POST',
                    headers:{
                        'Authorization': `Bearer ${this.state.token}`,
                    }
                });
                
                commit('clearUser');
                commit('setError',null);
            } catch (error) {
                commit('setError', error.message);
            }
        },

        async refreshToken ({commit,state}){
            try {
                const response = await fetch("http://localhost:8000/api/v1/user/refresh-token",{
                    method:"POST",
                    headers:{
                        'Authorization': `Bearer ${state.token}`,
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    commit('setToken', data.newAccessToken);
                } else {
                    throw new Error('Failed to refresh token');
                }
            } catch (error) {
                commit('setError', error.message);
            }
        },
        async getUsers({commit,state}){
            commit('setLoading',true);
            try {
                const response = await fetch("http://localhost:8000/api/v1/user/users",{
                    method:'GET',
                    headers:{
                        'Authorization': `Bearer ${state.token}`,
                    }
                    
                });

                    const data = await response.json();
                    if (response.ok) {
                        commit('setError', null); 
                        commit('setLoading', false);
                        return data;
                    } else {
                        throw new Error(data.message || 'Failed to fetch users');
                    }
            } catch (error) {
                commit('setLoading', false);
                commit('setError', error.message);
            }
        },
        async updateAccountDetails({commit,state},userDetails){
            commit('setLoading',true);

            try {
                const response = await fetch("http://ocalhost:8000/api/v1/user/update",{
                    method:'PATCH',
                    headers:{
                        'Authorization': `Bearer ${state.token}`,
                        'Content-Type': 'application/json',
                    },
                    body : JSON.stringify(userDetails)
                });

                const data = await response.json();


            if (response.ok) {
                commit('setError', null); 
                commit('setLoading', false);
                commit('setUser', data);
            } else {
                throw new Error(data.message || 'Failed to update account details');
            }
                
            } catch (error) {
                commit('setLoading', false);
                commit('setError', error.message);
            }
        },

        async deleteAccount({commit,state}){
            try {
                const response = await fetch("http://localhost:8000/api/v1/user/delete-account",{
                    method:'DELETE',
                    headers:{
                        'Authorization': `Bearer ${state.token}`,
                    },
                });

                const data = await response.json();

                if(response.ok){
                    commit('clearUser');
                    commit('setError',null);
                }else {
                    throw new Error(data.message || 'Failed to delete account');
                }
                
            } catch (error) {
                commit('setError', error.message);  
            }
        },

        async inviteUser({commit},email){
            try {
                const response = await fetch("http://localhost:8000/api/v1/user/invite-user",{
                    method:'POST',
                    headers:{
                        'Content-Type' :'application/json',
                    },
                    body : JSON.stringify({email}),
                });

                const data = await response.json();

                if(response.ok){
                    commit('setError',null);
                    return data.message;
                } else {
                    throw new Error(data.message || 'Failed to invite user')
                }
                
            } catch (error) {
                commit('setError', error.message);
            }
        },
    },
    getters:{
        isAuthenticated: (state) => state.isAuthenticated,
        getUser: (state) => state.user,
        getToken: (state) => state.token,
        getError: (state) => state.error,
        isLoading: (state) => state.isLoading,
    },
});