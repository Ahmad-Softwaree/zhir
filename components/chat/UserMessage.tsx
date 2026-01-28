"use client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";
import { User } from "lucide-react";

export const UserMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex gap-3 justify-end">
      <Card className="p-4 max-w-[80%] bg-primary text-primary-foreground">
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </Card>
      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground">
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
