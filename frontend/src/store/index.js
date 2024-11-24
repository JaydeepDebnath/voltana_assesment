import { createStore } from 'vuex';

const connectionString = "http://localhost:8001/api/v1/user"

export default createStore({
    state:{
        user : null,
        token : localStorage.getItem('token') || null,
        isAuthenticated : false,
        isLoading : false,
        error : null,
    },
    mutations : {
      setUser(state,user){
        state.user = user;
      },
      setToken(state,token){
        // console.log('Setting token',token)
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
      setAuthenticated(state, isAuthenticated) {
        state.isAuthenticated = isAuthenticated;
    },
    },
    actions : {
        async register({commit,dispatch},userData){
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

                    await dispatch('login',{
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
        async login({commit},credentials){
            commit('setLoading',true);
            try {
                const response = await fetch(`${connectionString}/login`,{
                    method : 'POST',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(credentials),
                });

                const data = await response.json();

                if(response.ok) {
                    console.log('Received token:', data.token);
                    commit('setToken',data.token);
                    commit('setUser',data.user);
                    commit('setAuthenticated', true);
                    commit('setError',null);
                    localStorage.setItem('token', data.token);
                } else {
                    throw new Error (data.message || 'Login failed')
                }
                
            } catch (error) {
                commit('setLoading', false);
                commit('setError', error.message);
                console.error("Login error:", error);
            } finally{
                commit('setLoading', false);
            }
        },

        async logout({commit,state}){
            try {
                await fetch(`${connectionString}/logout`,{
                    method:'POST',
                    headers:{
                        'Authorization': `Bearer ${state.token}`,
                    }
                });
                
                commit('clearUser');
                commit('setError',null);
            } catch (error) {
                commit('setError', error.message);
            }
        },

        async refreshToken ({commit,state}){
            if (!state.token) {
                commit('setError', 'No token available to refresh');
                return;
            }
            try {
                const response = await fetch(`${connectionString}/refresh-token`,{
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
                console.error("Token refresh error:", error);
            }
        },
        async getUsers({commit,state}){
            console.log({...state})
            commit('setLoading',true);
            if (!state.token) {
                commit('setError', 'No token available to fetch users');
                commit('setLoading', false);
                return;
            }
            try {
                const response = await fetch(`${connectionString}/users`,{
                    method:'GET',
                    headers:{
                        'Authorization': `Bearer ${state.token}`,
                    },
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
                console.error("Error fetching users:", error);
            }
        },
        async updateAccountDetails({commit,state},userDetails){
            commit('setLoading',true);

            try {
                const response = await fetch(`${connectionString}/update`,{
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
                const response = await fetch(`${connectionString}/delete-account`,{
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
                const response = await fetch(`${connectionString}/invite-user`,{
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

        async setPassword({commit},{token, password}){
            try {
                const response = await fetch(`${connectionString}/set-password`,{
                    method:'POST',
                    headers:{
                        'Content-Type' :'application/json',
                    },
                    body : JSON.stringify({token, password}),
                });

                const data = await response.json();

                if(response.ok){
                    commit('setError',null);
                    return data.message;
                } else {
                    throw new Error(data.message || 'Failed to set password')
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