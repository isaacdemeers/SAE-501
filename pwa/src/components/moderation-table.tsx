'use client'

import { useState } from "react"
import { Search, Shield, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  name: string
  username: string
  registrationDate: string
}

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")

  const users: User[] = [
    {
      name: "Maire DESROCHES",
      username: "@marieroche",
      registrationDate: "18/02/2024",
    },
    {
      name: "Maire DESROCHES",
      username: "@marieroche",
      registrationDate: "18/02/2024",
    },
    {
      name: "Maire DESROCHES",
      username: "@marieroche",
      registrationDate: "18/02/2024",
    },
    {
      name: "Maire DESROCHES",
      username: "@marieroche",
      registrationDate: "18/02/2024",
    },
    {
      name: "Maire DESROCHES",
      username: "@marieroche",
      registrationDate: "18/02/2024",
    },
  ]

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Date d'inscription</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  )
}