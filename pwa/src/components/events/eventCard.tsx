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
            <Card className={`w-full flex relative text-slate-600  overflow-hidden`}>

                <section className="absolute flex items-center justify-center w-full h-full ">
                    <Image
                        src={imageUrl}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md brightness-75 opacity-70"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white via-white to-transparent"></div>
                </section>

                {/* Contenu */}
                <CardContent className="z-10 flex flex-col w-full gap-2 p-4 bg-transparent">
                    <h2 className="w-11/12 overflow-hidden text-lg font-bold sm:text-xl text-ellipsis text-nowrap">{title}</h2>
                    <p className="w-5/12 overflow-hidden text-xs text-slate-600 text-ellipsis text-nowrap">{description}</p>

                    <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex flex-col items-start justify-start gap-4 lg:flex-row lg:items-center">
                            <div className="flex items-center justify-between h-10 gap-2 rounded-lg">
                                <Clock className="w-4 h-4 mr-1" />
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
                                    {attendees > 0 && (
                                        <CustomBadge color={2} content={attendees.toString()} icon={<Users />} />
                                    )}
                                </li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-2 lg:flex-row lg:items-center">
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
