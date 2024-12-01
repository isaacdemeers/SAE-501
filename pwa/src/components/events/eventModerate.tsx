import { Search, UserMinus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { GetEventUsers } from "@/lib/request";

interface User {
  id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  role: string;
}

interface EventModerateProps {
  eventId: number;
}

export default function EventModerate({ eventId }: EventModerateProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await GetEventUsers(eventId);
        setUsers(data.users);
      } catch (err) {
        setError("Erreur lors du chargement des utilisateurs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [eventId]);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRole = (role: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrateur';
      case 'ROLE_USER':
        return 'Participant';
      default:
        return role;
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-4xl font-bold">Gestion des participants</h1>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un participant..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nom d'utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.firstname} ${user.lastname}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{formatRole(user.role)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {user.role !== 'ROLE_ADMIN' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        onClick={() => {
                          console.log('Retirer utilisateur:', user.id);
                        }}
                      >
                        <UserMinus className="h-4 w-4" />
                        <span className="sr-only">Retirer l'utilisateur</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
