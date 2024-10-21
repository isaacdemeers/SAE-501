export async function AddUser(data: any) {
  try {
    console.log(data);
    const response = await fetch("https://scaling-disco-jj5v6vp6rg97hq64r-443.app.github.dev/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

export async function LoginUser(data: any) {
  try {
    console.log(data);
    const response = await fetch("https://scaling-disco-jj5v6vp6rg97hq64r-443.app.github.dev/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

export async function TestEmail(data: string){
 let formData = {
    email: data
  }
  try {
    console.log(formData);
    const response = await fetch("https://scaling-disco-jj5v6vp6rg97hq64r-443.app.github.dev/users/testemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error testing email:", error);
    throw error;
  }
}





export async function GetGrettings() {
  try {
    const jwtToken = document.cookie.split('; ').find(row => row.startsWith('jwt_token='))?.split('=')[1] || '';
    const response = await fetch("https://scaling-disco-jj5v6vp6rg97hq64r-443.app.github.dev/greetings", {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      "Authorization": jwtToken
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error getting greetings:", error);
    throw error;
  }
}