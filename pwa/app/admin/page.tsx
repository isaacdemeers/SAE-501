"use client";

import { useEffect, useState } from "react";
import { HydraAdmin, fetchHydra } from "@api-platform/admin";

export default function Admin() {
  const [mounted, setMounted] = useState(false);
  const entrypoint = process.env.NEXT_PUBLIC_ENTRYPOINT || 'https://localhost';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) return new Headers();

    const headers = new Headers({
      Authorization: `Bearer ${token}`,
      Accept: 'application/ld+json',
    });
    return headers;
  };

  return (
    <HydraAdmin
      entrypoint={entrypoint}
      fetchHeaders={getHeaders}
      authProvider={{
        login: ({ username, password }) => {
          return fetch(`${entrypoint}/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: username, password }),
          })
            .then(response => {
              if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
              }
              return response.json();
            })
            .then(({ token }) => {
              localStorage.setItem('token', token);
              return Promise.resolve();
            });
        },
        logout: () => {
          localStorage.removeItem('token');
          return Promise.resolve();
        },
        checkAuth: () => {
          return localStorage.getItem('token')
            ? Promise.resolve()
            : Promise.reject();
        },
        checkError: (error) => {
          const status = error.status;
          if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            return Promise.reject();
          }
          return Promise.resolve();
        },
        getPermissions: () => Promise.resolve(),
        getIdentity: () => Promise.resolve({ id: 'user', fullName: 'Admin' })
      }}
    />
  );
}
