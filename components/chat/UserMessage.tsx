"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { User } from "lucide-react";

export const UserMessage = ({ message }: { message: string }) => {
  const { user } = useUser();

  return (
    <div className="flex gap-3 justify-end">
      <Card className="p-4 max-w-[80%] bg-primary text-primary-foreground">
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </Card>
      <Avatar>
        <AvatarImage src={user?.picture || ""} alt={user?.name || ""} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
