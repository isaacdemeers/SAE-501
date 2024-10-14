export async function AddUser(data: any){
  return await fetch("http://localhost/register", {        
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => response.json()
  );
}