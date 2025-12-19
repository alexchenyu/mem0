"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setUserId } from "@/store/profileSlice";
import { UserCircle, Check, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function UserSwitcher() {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state: RootState) => state.profile.userId);
  const [isOpen, setIsOpen] = useState(false);
  const [newUserId, setNewUserId] = useState(currentUserId);
  const { toast } = useToast();

  const handleSave = () => {
    if (!newUserId.trim()) return;
    
    dispatch(setUserId(newUserId.trim()));
    setIsOpen(false);
    
    toast({
      title: "User Switched",
      description: `Now viewing memories for user: ${newUserId}`,
    });

    // Optional: Reload page to ensure clean state
    window.location.reload();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 text-zinc-400 hover:text-white"
        >
          <UserCircle className="h-5 w-5" />
          <span className="hidden sm:inline-block max-w-[100px] truncate">
            {currentUserId}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-zinc-950 border-zinc-800">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-white">Switch User</h4>
            <p className="text-sm text-zinc-400">
              Enter the User ID you want to view or manage.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="userId" className="text-zinc-200">User ID</Label>
              <Input
                id="userId"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                className="col-span-2 h-8 bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <Button onClick={handleSave} className="w-full mt-2 bg-primary hover:bg-primary/90">
              <RefreshCw className="mr-2 h-4 w-4" />
              Switch & Reload
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

