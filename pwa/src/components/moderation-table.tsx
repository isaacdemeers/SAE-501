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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">Modération</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="registered" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="registered">Inscrits</TabsTrigger>
            <TabsTrigger value="banned">Bannis</TabsTrigger>
          </TabsList>
          <TabsContent value="registered" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Nom d&apos;utilisateur</TableHead>
                    <TableHead>Inscrit le :</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.registrationDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <UserX className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Ban user</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Shield className="h-4 w-4" />
                            <span className="sr-only">Protect user</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                No users found matching your search.
              </div>
            )}
          </TabsContent>
          <TabsContent value="banned">
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Aucun utilisateur banni
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}