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

export async function editUser(id: number, data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Failed to edit user");
    }

    return await response.json(); // Retourne les données mises à jour de l'utilisateur
  } catch (error) {
    console.error("Error editing user:", error);
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
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    console.error("Error getting event:", error);
    throw error;
  }
}




export async function AddEvent(formData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/event/create`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
} catch (error) {
    console.error('Error creating event:', error);
}
}

export async function JoinEvent(event: number , email: string) {
  if(email === "") {
  try {
    const response = await fetch(`${API_BASE_URL}/event/${event}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    console.error('Error joining event:', error);
  }
}
else {
  
  const formData = new FormData();
  formData.append("email", email);
  try {
    const response = await fetch(`${API_BASE_URL}/event/${event}/join`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    console.error('Error joining event:', error);
  }
}
}

export async function IsAuthentificated() {
  try {
    const response = await fetch('/api/auth/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error authenticating user:', error);
  }
}

export async function NewConnectionUUID(uuid: string , id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/userevents/${id}/new-connection-uuid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"uuid": uuid}),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating new connection UUID:', error);
  }
}


export async function VerifyConnectionUUID(uuid: string , id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/userevents/${id}/verify-connection-uuid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"uuid": uuid}),
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    console.error('Error verifying connection UUID:', error);
  }
}


export async function unsubscribeConnectedUser(id:number){
  try {
    const response = await fetch(`${API_BASE_URL}/userevents/${id}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    console.error('Error unsubscribing connected user:', error);
  }
}


export async function unsubscribeUUID(uuid: string , id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/userevents/${id}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "uuid": uuid }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error unsubscribing UUID:', error);
  }
}


export async function ShareInvitation(id: number ,emails: string[]) {
  let formData = new FormData();
  formData.append('emails', JSON.stringify(emails));
  try {
    const response = await fetch(`${API_BASE_URL}/userevents/${id}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"emails": emails}),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sharing invitation:', error);
  }
}
// stocker les users qu'on invite pour event privé 
// stocker id + email + uuid pour le lien de pas connecter
// pour priver prend le lien et obliger de se connecter ou créer un compte pour voir le compte

export async function UpdateEvent(id: string, data: any): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update event');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

export async function GetEventAdmin(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}/admin`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch event admin');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching event admin:', error);
    throw error;
  }
}

export async function GetEventUsers(eventId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/users`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch event users');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching event users:', error);
    throw error;
  }
}

export async function RemoveEventUser(eventId: number, userId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove user from event');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing user from event:', error);
    throw error;
  }
}