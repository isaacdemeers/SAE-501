import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CirclePlus, Clock, Users, Eye, Lock, LockOpen } from "lucide-react";
import CustomBadge from "@/components/utils/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger, DialogHeader, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface EventCardProps {
    title: string;
    date: string;
    isPublic: boolean;
    attendees: number;
    imageUrl: string;
    type: string;
}

export default function EventCard({ title, date, isPublic, attendees, imageUrl, type }: EventCardProps) {
    return (
        type === "searchResult" ? (
            <Card className={`w-full flex relative text-slate-600 overflow-hidden`}>
                {/* Image de fond */}
                <section className="absolute w-full h-full flex items-center justify-center">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="brightness-75 rounded-md opacity-70 object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-gradient-to-r from-white via-white to-transparent h-full w-full"></div>
                </section>

                {/* Contenu */}
                <CardContent className="flex z-10 flex-col w-full p-4 gap-2 bg-transparent">
                    <h2 className="sm:text-xl text-lg font-bold text-ellipsis w-11/12 overflow-hidden text-nowrap">{title}</h2>

                    <div className="flex gap-4 w-full justify-between items-center">
                        {/* Informations */}
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <p className="text-xs text-slate-600">{date}</p>
                            </div>
                            <Separator orientation="vertical" className="h-5" />
                            <ul className="flex items-center gap-2">
                                <li>
                                    {isPublic ? (
                                        <CustomBadge color="blue" content="PUBLIC" icon={<LockOpen />} />
                                    ) : (
                                        <CustomBadge color="red" content="PRIVATE" icon={<Lock />} />
                                    )}
                                </li>
                                <li>
                                    <CustomBadge color="green" content={attendees.toString()} icon={<Users />} />
                                </li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col lg:flex-row gap-2 items-end lg:items-center">
                            <Button variant="outline">
                                <Eye className="w-4 h-4 mr-2" />
                                Voir l&apos;événement
                            </Button>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="flex gap-2">
                                        <CirclePlus size={16} className="stroke-white" />
                                        S'inscrire
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <h2>S'inscrire</h2>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4">
                                        <p>Veuillez vous inscrire avec votre email ou vous connecter.</p>
                                        <Input placeholder="Email" />
                                        <Button>Se connecter</Button>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline">Fermer</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ) : (
            <></>
        )
    );
}
