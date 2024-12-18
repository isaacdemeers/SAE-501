import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, UserIcon, Upload } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import { fetchUserAdmin, UpdateUserAdmin } from '@/lib/request';

interface UserAdminFormData {
    email: string;
    role: string;
    password: string;
    firstname: string;
    lastname: string;
    username: string;
    photo: string | File;
    emailverify: boolean;
    emaillink: string;
    regenerateemaillink: any;
    tokenpassword: string;
    regenerateToken: any;
    deleted_at: string;
    created_at: string;
    disable: boolean;
}

const EditUsers: React.FC = () => {
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [sizeerror, setSizeerror] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserAdminFormData>({
        email: '',
        role: '',
        password: '',
        firstname: '',
        lastname: '',
        username: '',
        photo: '',
        emailverify: false,
        emaillink: '',
        regenerateemaillink: false,
        tokenpassword: '',
        regenerateToken: false,
        deleted_at: '',
        created_at: '',
        disable: false,
    });

    useEffect(() => {
        // Extract user ID from the URL
        const hash = window.location.hash;
        const pathSegments = hash.split('%2F');
        const id = pathSegments[pathSegments.length - 1];
        if (id) {
            setUserId(parseInt(id, 10));
        }
    }, []);

    useEffect(() => {
        // Fetch user data based on userId
        const fetchUserData = async () => {
            try {
                const response = await fetchUserAdmin(userId);
                if (!response) {
                    setError("Problème lors de la modification d'un utilisateur veuillez contacter la dsi");
                    return;
                }
                const data = await response.json();
                if (response.status !== 200) {
                    setError("Problème lors de la modification d'un utilisateur veuillez contacter la dsi");
                }
                console.log(data);
                if (data.deleted_at === null || data.deleted_at === undefined) {
                    data.deleted_at = "";
                } else {
                    const deletedAtDate = new Date(data.deleted_at);
                    deletedAtDate.setHours(deletedAtDate.getHours() + 1);
                    data.deleted_at = deletedAtDate.toISOString();
                }
                if (data.created_at === null || data.created_at === undefined) {
                    data.created_at = "";
                } else {
                    const createdAtDate = new Date(data.created_at);
                    createdAtDate.setHours(createdAtDate.getHours() + 1);
                    data.created_at = createdAtDate.toISOString();
                }
                setFormData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validExtensions = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];
            const maxSize = 800; // 800px

            if (!validExtensions.includes(file.type)) {
                setSizeerror(true);
                console.error('Invalid file type');
                return;
            }

            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                if (img.width > maxSize || img.height > maxSize) {
                    setSizeerror(true);
                    console.error('Image dimensions exceed 800x800px');
                } else {
                    setSizeerror(false);
                    setFormData({
                        ...formData,
                        photo: file,
                    });
                }
            };
            img.onerror = () => {
                setSizeerror(true);
                console.error('Error loading image');
            };
        }
    };

    const handleRemoveImage = () => {
        setFormData({
            ...formData,
            photo: 'logimg.png',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let response = await UpdateUserAdmin(formData, userId);
            if (!response) {
                setError("Problème lors de la modification d'un utilisateur veuillez contacter la dsi");
                return;
            }
            const data = await response.json();
            if (response.status !== 200) {
                setError("Problème lors de la modification d'un utilisateur veuillez contacter la dsi");
            }
            if(response.status === 200){
                setSuccess("Utilisateur modifié avec succès");
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDisableClick = () => {
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 1);
        setFormData({
            ...formData,
            disable: !formData.disable,
            deleted_at: !formData.disable ? currentDate.toISOString() : '',
        });
    };

    return (
        <>
            {success && <p className="flex w-full item-center justify-center my-2 text-green-500">{success}</p>}
            {error && <p className="flex w-full item-center justify-center my-2 text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label className="text-black">Email</Label>
                <Input className="text-black" type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black">Role</Label>
                <Input className="text-black" type="text" name="role" value={formData.role} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black">Mot de passe</Label>
                <Input className="text-black" type="password" readOnly name="password" value={formData.password} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black">Prénom</Label>
                <Input className="text-black" type="text" name="firstname" value={formData.firstname} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black">Nom</Label>
                <Input className="text-black" type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black">Pseudonyme</Label>
                <Input className="text-black" type="text" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black text-center">Photo</Label>
                <div className={`flex flex-col items-center justify-center border-2 border-dashed ${sizeerror ? 'border-red-500' : 'border-gray-300'} rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors relative`}>
                    <input onChange={handleFileChange} type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/png, image/jpg, image/svg" />
                    {formData.photo && formData.photo !== 'logimg.png' && formData.photo !== 'default.jpg' ? (
                        <>
                            <img src={typeof formData.photo === 'string' ? formData.photo : URL.createObjectURL(formData.photo)} alt="Uploaded" className="w-32 h-32 rounded-full object-cover" />
                            <Button type="button" className="mt-2" onClick={handleRemoveImage}>Retirer l'image</Button>
                        </>
                    ) : (
                        <>
                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 text-center">
                                Appuyez pour télécharger une image de profil ou faites glisser une image ici
                                <br />
                                SVG, PNG, or JPG (max. 800x800px)
                            </p>
                        </>
                    )}
                </div>
                {!formData.photo && (
                    <UserIcon className="block mx-auto mt-2 w-32 h-32 rounded-full object-cover" size={36} />
                )}
            </div>
            <div>
                <Label className="text-black">Email vérification</Label>
                <Input className="text-black" type="checkbox" name="emailverify" checked={formData.emailverify} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black">Lien de vérification d'email</Label>
                <Input className="text-black" type="text" readOnly name="emaillink" value={formData.emaillink} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2 items-start justify-start">
                <Label className="text-black w-fit">Envoyer un mail de vérification de mot de passe</Label>
                <Checkbox className="text-black " name="regenerateemaillink" checked={formData.regenerateemaillink} onCheckedChange={(checked) => setFormData({ ...formData, regenerateemaillink: checked })} />
            </div>
            <div>
                <Label className="text-black">Token de la modification du mot de passe</Label>
                <Input className="text-black" type="text" name="tokenpassword" readOnly value={formData.tokenpassword} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2 items-start justify-start">
                <Label className="text-black w-fit">Envoyer un mail de réinitialisation de mot de passe</Label>
                <Checkbox className="text-black " name="regenerateToken" checked={!!formData.regenerateToken} onCheckedChange={(checked) => setFormData({ ...formData, regenerateToken: checked })} />
            </div>
            <div>
                <Label className="text-black">Supprimer le</Label>
                <div className="flex items-center">
                    <Input className="text-black" type="datetime-local" name="deleted_at" value={formData.deleted_at.slice(0, 16)} readOnly />
                    <Button type="button" className="ml-2" onClick={handleDisableClick}>
                        {formData.disable ? 'Enable' : 'Disable'}
                    </Button>
                </div>
            </div>
            <div>
                <Label className="text-black">Créé le</Label>
                <div className="flex items-center">
                    <Input className="text-black" type="datetime-local" name="created_at" value={formData.created_at.slice(0, 16)} readOnly />
                </div> 
            </div>
            <Button type="submit">Update User</Button>
            </form>
        </>
    );
};

export default EditUsers;
