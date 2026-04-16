const API_URL = "http://localhost:5019/api"

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    // 
    if (!response.ok) throw new Error('Invalid Credentials');
    return await response.json();
}