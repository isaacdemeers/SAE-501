import API_BASE_URL from "../../utils/apiConfig";

export async function AddUser(data: any) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (data.image) {
    formData.append("file", data.image, data.image.name);
  }

  try {
    console.log(data);
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

export async function VerifyEmailToken(data: string) {
  let formData = {
    emailtoken: data,
  };
  try {
    console.log(data);
    const response = await fetch(`${API_BASE_URL}/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
}

export async function LoginUser(data: any) {
  try {
    console.log(data);
    const response = await fetch(`${API_BASE_URL}/auth`, {
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

export async function TestEmail(data: string) {
  let formData = {
    email: data,
  };
  try {
    console.log(formData);
    const response = await fetch(`${API_BASE_URL}/users/testemail`, {
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

export async function TestUsername(data: string) {
  let formData = {
    username: data,
  };
  try {
    console.log(formData);
    const response = await fetch(`${API_BASE_URL}/users/testusername`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error testing username:", error);
    throw error;
  }
}

export async function GetGrettings() {
  try {
    const jwtToken =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt_token="))
        ?.split("=")[1] || "";
    const response = await fetch(`${API_BASE_URL}/greetings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: jwtToken,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error getting greetings:", error);
    throw error;
  }
}

export async function ResetPassword(email: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/reset/passwordemail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}

export async function Newpass(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/reset/password`, {
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


export async function GetEvent(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
    
export async function GetAllEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function GetUserEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    console.error("Error getting event:", error);
    throw error;
  }
}
