import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon, UserIcon , Upload } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import { fetchUserAdmin } from '@/lib/request';

interface UserAdminFormData {
    email: string;
    role: string;
    password: string;
    firstname: string;
    lastname: string;
    username: string;
    photo: string | File;
    emailVerify: boolean;
    emailLink: string;
    tokenPassword: boolean;
    regenerateToken: boolean;
    deleted_at: string;
    created_at: string;
}

const EditUsers: React.FC = () => {
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [sizeerror , setSizeerror] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserAdminFormData>({
        email: '',
        role: '',
        password: '',
        firstname: '',
        lastname: '',
        username: '',
        photo: '',
        emailVerify: false,
        emailLink: '',
        tokenPassword: false,
        regenerateToken: false,
        deleted_at: '',
        created_at: '',
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
                const data = await response.json();
                console.log(data);
                if(data.deleted_at === null || data.deleted_at === undefined){
                    data.deleted_at = "";
                }
                if(data.created_at === null || data.created_at === undefined){
                    data.created_at = "";
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

    const [date, setDate] = useState<Date | undefined>(undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
    };

    const formatDateTime = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
        return adjustedDate.toISOString().slice(0, 16);
    };

    return (
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
                <Label className="text-black">Password</Label>
                <Input className="text-black" type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black">First Name</Label>
                <Input className="text-black" type="text" name="firstname" value={formData.firstname} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black">Last Name</Label>
                <Input className="text-black" type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black">Username</Label>
                <Input className="text-black" type="text" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black text-center">Photo</Label>
                <div className={`flex flex-col items-center justify-center border-2 border-dashed ${sizeerror ? 'border-red-500' : 'border-gray-300'} rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors relative`}>
                    <input onChange={handleFileChange} type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/png, image/jpg, image/svg" />
                    {formData.photo && formData.photo !== 'logimg.png' && formData.photo !== 'default.jpg' ? (
                        <img src={typeof formData.photo === 'string' ? formData.photo : URL.createObjectURL(formData.photo)} alt="Uploaded" className="w-32 h-32 rounded-full object-cover" />
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
                <Label className="text-black">Email Verify</Label>
                <Input className="text-black" type="checkbox" name="emailVerify" checked={formData.emailVerify} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black">Email Link</Label>
                <Input className="text-black" type="text" name="emailLink" value={formData.emailLink} onChange={handleChange} />
            </div>
            <div>
                <Label className="text-black">Token Password</Label>
                <Input className="text-black" type="text" name="tokenPassword" value={formData.emailLink} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2 items-start justify-start">
                <Label className="text-black w-fit">Regenerate Token</Label>
                <Checkbox className="text-black " name="regenerateToken" checked={formData.regenerateToken} onCheckedChange={(checked) => handleChange({ target: { name: 'regenerateToken', value: checked, type: 'checkbox', checked } } as React.ChangeEvent<HTMLInputElement>)} />
            </div>
            <div>
                <Label className="text-black">Deleted At</Label>
                <div className="flex items-center">
                <Input className="text-black" type="datetime-local" name="deleted_at" value={formData.deleted_at.slice(0, 16)} onChange={handleChange} />
                <Popover>
                        <PopoverTrigger asChild>
                            <Button type="button" className="ml-2">
                            <CalendarIcon size={16} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selectedDate) => {
                                    setDate(selectedDate);
                                    setFormData({
                                        ...formData,
                                        deleted_at: selectedDate ? formatDateTime(selectedDate) : '',
                                    });
                                }}
                                className="rounded-md border mt-2"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div>
                <Label className="text-black">Created At</Label>
                <div className="flex items-center">
                <Input className="text-black" type="datetime-local" name="created_at" value={formData.created_at.slice(0, 16)} onChange={handleChange} />
                <Popover>
                        <PopoverTrigger asChild>
                            <Button type="button" className="ml-2">
                                <CalendarIcon size={16} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selectedDate) => {
                                    setDate(selectedDate);
                                    setFormData({
                                        ...formData,
                                        created_at: selectedDate ? formatDateTime(selectedDate) : '',
                                    });
                                }}
                                className="rounded-md border mt-2"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <Button type="submit" className="mt-4">Save</Button>
        </form>
    );
};

export default EditUsers;
