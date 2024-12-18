import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchEventAdmin, UpdateEventAdmin } from '@/lib/request';

interface UserAdminFormData {
    title: string;
    description: string;
    datestart: string;
    dateend: string;
    location: string;
    Sharelink: string;
    img: string | File;
    visibility: number;
    maxparticipants: number;
    deleted_at: string;
    created_at: string;
    disable: boolean;
}

const EditEvents: React.FC = () => {
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [sizeerror, setSizeerror] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserAdminFormData>({
        title: '',
        description: '',
        datestart: '',
        dateend: '',
        location: '',
        Sharelink: '',
        img: '',
        visibility: 0,
        maxparticipants: 0,
        deleted_at: '',
        created_at: '',
        disable: false,
    });

    useEffect(() => {
        const hash = window.location.hash;
        const pathSegments = hash.split('%2F');
        const id = pathSegments[pathSegments.length - 1];
        if (id) {
            setUserId(parseInt(id, 10));
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetchEventAdmin(userId);
                if (!response) {
                    setError("Problème lors de la modification d'un utilisateur veuillez contacter la dsi");
                    return;
                }
                const data = await response.json();
                if (response.status !== 200) {
                    setError("Problème lors de la modification d'un utilisateur veuillez contacter la dsi");
                }
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
                if (data.datestart) {
                    const datestartDate = new Date(data.datestart);
                    data.datestart = datestartDate.toISOString().slice(0, 16);
                }
                if (data.dateend) {
                    const dateendDate = new Date(data.dateend);
                    data.dateend = dateendDate.toISOString().slice(0, 16);
                }
                if (data.img === null || data.img === undefined || data.img === 'logimg.png') {
                    data.img = 'event-background-desktop.png';
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

    const handleVisibilityChange = (value: string) => {
        setFormData({
            ...formData,
            visibility: parseInt(value, 10),
        });
    }

    const handleDateChange = (name: string, date: Date | null) => {
        if (date) {
            date.setHours(date.getHours() + 1);
            setFormData({
                ...formData,
                [name]: date.toISOString().slice(0, 16),
            });
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validExtensions = ['image/png', 'image/jpg', 'image/jpeg'];
            const maxSizeInBytes = 8 * 1024 * 1024; // 8 MB

            if (!validExtensions.includes(file.type)) {
                setSizeerror(true);
                console.error('Invalid file type');
                return;
            }

            if (file.size > maxSizeInBytes) {
                setSizeerror(true);
                console.error('File size exceeds 8 MB');
                return;
            }

            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                setSizeerror(false);
                setFormData({
                    ...formData,
                    img: file,
                });
            }
        }
    };

    const handleRemoveImage = () => {
        setFormData({
            ...formData,
            img: 'event-background-desktop.png',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let response = await UpdateEventAdmin(formData, userId);
            if (!response) {
                setError("Problème lors de la modification d'un utilisateur veuillez contacter la dsi");
                return;
            }
            const data = await response.json();
            if (response.status !== 200) {
                setError("Problème lors de la modification d'un utilisateur veuillez contacter la dsi");
            }
            if (response.status === 200) {
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
                    <Label className="text-black">Titre</Label>
                    <Input className="text-black" type="text" name="title" value={formData.title} onChange={handleChange} />
                </div>
                <div>
                    <Label className="text-black">Description</Label>
                    <Input className="text-black" type="text" name="description" value={formData.description} onChange={handleChange} />
                </div>
                <div>
                    <Label className="text-black">Date de début</Label>
                    <Input className="bg-neutral-600 text-white" type="datetime-local" name="datestart" value={formData.datestart} onChange={(e) => handleDateChange('datestart', new Date(e.target.value))} />
                </div>
                <div>
                    <Label className="text-black">Date de fin</Label>
                    <Input className="bg-neutral-600 text-white" type="datetime-local" name="dateend" value={formData.dateend} onChange={(e) => handleDateChange('dateend', new Date(e.target.value))} />
                </div>
                <div>
                    <Label className="text-black">Localisation de l'évènement</Label>
                    <Input className="text-black" type="text" name="location" value={formData.location} onChange={handleChange} />
                </div>
                <div>
                    <Label className="text-black">Lien de partage</Label>
                    <Input className="text-black" type="text" name="Sharelink" readOnly value={formData.Sharelink} onChange={handleChange} />
                </div>
                <div>
                    <Label className="text-black text-center">Image</Label>
                    <div className={`flex flex-col items-center justify-center border-2 border-dashed ${sizeerror ? 'border-red-500' : 'border-gray-300'} rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors relative`}>
                        <input onChange={handleFileChange} type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/png, image/jpg, image/svg" />
                        {formData.img && typeof formData.img === 'string' ? (
                            <>
                                <img src={formData.img} alt="Uploaded" className="w-full h-32 rounded-lg object-cover" />
                                <Button type="button" className="mt-2 z-10" onClick={handleRemoveImage}>Retirer l'image</Button>
                            </>
                        ) : formData.img && typeof formData.img !== 'string' ? (
                            <>
                                <img src={URL.createObjectURL(formData.img)} alt="Uploaded" className="w-full h-32 rounded-lg object-cover" />
                                <Button type="button" className="mt-2 z-10" onClick={handleRemoveImage}>Retirer l'image</Button>
                            </>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500 text-center">
                                    Appuyez pour télécharger une image ou faites glisser une image ici
                                    <br />
                                    PNG, or JPG (max. 8 mo)
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <div className='flex flex-col'>
                    <Label className="text-black">Visibilité de l'évènement</Label>
                    <Select name="visibility" value={formData.visibility.toString()} onValueChange={(value) => handleVisibilityChange(value)}>
                        <SelectTrigger className="text-black">
                            <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Publique</SelectItem>
                            <SelectItem value="0">Privé</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-black">Nombre de participants maximum</Label>
                    <Input className="text-black" type="number" name="maxparticipants" value={formData.maxparticipants} onChange={handleChange} />
                </div>
                <div>
                    <Label className="text-black">Supprimé le</Label>
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
                <Button type="submit">Mettre à jour l'évènement</Button>
            </form>
        </>
    );
};

export default EditEvents;
