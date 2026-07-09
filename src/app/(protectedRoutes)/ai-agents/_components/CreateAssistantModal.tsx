import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createAssistant } from "@/actions/vapi";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateAssistantModal = ({ isOpen, onClose }: Props) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createAssistant(name);
      if (!res.success) {
        throw new Error(res.message);
      }
      router.refresh();
      setName("");
      onClose();
      toast.success("Assistant created successfully");
    } catch (error) {
      toast.error("Failed to create assistant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-md bg-muted/80 p-6 border-input shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create Assistant
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block font-medium mb-2">Assistant Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter assistant name"
              className="bg-neutral-800 border-neutral-700"
              required
            />
            <p className="text-xs text-neutral-400 mt-2">
              This name will be used to identify your assistant.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={!name.trim() || loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Assistant"
              )}
            </Button>
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssistantModal;
