'use client';
import React, { useState } from 'react';
import API_BASE_URL from '../../utils/apiConfig';

const CreateEventPage: React.FC = () => {
    const [eventName, setEventName] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventImage, setEventImage] = useState<File | null>(null);
    const [eventDescription, setEventDescription] = useState('');
    const [eventVisibility, setEventVisibility] = useState(true);
    const [maxParticipants, setMaxParticipants] = useState<number | ''>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const today = new Date().toISOString().split('T')[0];
        if (eventStartDate < today) {
            setErrorMessage('Event start date cannot be before today.');
            return;
        }

        if (eventEndDate <= eventStartDate) {
            setErrorMessage('Event end date must be after the start date.');
            return;
        }

        const formData = new FormData();
        formData.append('title', eventName);
        formData.append('datestart', new Date(eventStartDate).toISOString());
        formData.append('dateend', new Date(eventEndDate).toISOString());
        formData.append('location', eventLocation);
        if (eventImage) {
            formData.append('img', eventImage, eventImage.name);
        }
        formData.append('description', eventDescription);
        formData.append('visibility', eventVisibility.toString());
        formData.append('maxparticipant', maxParticipants.toString());

        try {
            const response = await fetch(`${API_BASE_URL}/events`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Event created successfully:', result);
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 8 * 1024 * 1024) { // 8MB in bytes
                setErrorMessage('File size should not exceed 8MB');
                setEventImage(null);
                e.target.value = ''; // Clear the input value
            } else {
                setErrorMessage(null);
                setEventImage(file);
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Event</h1>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Event Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={eventStartDate}
                        onChange={(e) => setEventStartDate(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Event End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={eventEndDate}
                        onChange={(e) => setEventEndDate(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Event Location:</label>
                    <input
                        type="text"
                        id="location"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Event Image:</label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Event Description:</label>
                    <textarea
                        id="description"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">Event Visibility:</label>
                    <select
                        id="visibility"
                        value={eventVisibility ? 'public' : 'private'}
                        onChange={(e) => setEventVisibility(e.target.value === 'public')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">Max Participants:</label>
                    <input
                        type="number"
                        id="maxParticipants"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(e.target.value ? parseInt(e.target.value) : '')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEventPage;