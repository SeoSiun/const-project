import axios from 'axios'; 
import { 
	AUTH_USER, 
  SIGNIN_USER, 
	SIGNUP_USER
} from './types'; 

export function signinUser(dataToSubmit) { 

	const request = axios.post('/api/users/signin', dataToSubmit)
		.then(response => response.data)
	
	return { 
		type: SIGNIN_USER, 
		payload: request
	}
}

export function signupUser(dataToSubmit) { 

	const request = axios.post('/api/users/signup', dataToSubmit)
		.then(response => response.data)
	
	return { 
		type: SIGNUP_USER, 
		payload: request
	}
}

export async function auth() { 
	let local_data = await window.localStorage.getItem("user")

	if (local_data) { 
		local_data = JSON.parse(local_data); 
		const { status, user_id, email, name } = local_data; 
		return {
			type: AUTH_USER, 
			payload: {
				isAuth: true,
				status,
				user_id, 
				email,
				name
			}
		}
	}
	const request = axios.get('/api/users/auth')
		.then(response => response.data)
	return { 
		type: AUTH_USER, 
		payload: request
	}
}