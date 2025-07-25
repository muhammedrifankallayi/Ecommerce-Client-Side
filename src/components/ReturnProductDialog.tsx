
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Package, PackageX } from "lucide-react";

interface ReturnProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, images: string[], note: string) => void;
  orderId: string;
  productName: string;
}

export const ReturnProductDialog = ({
  isOpen,
  onClose,
  onConfirm,
  orderId,
  productName,
}: ReturnProductDialogProps) => {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the return",
        variant: "destructive",
      });
      return;
    }
    onConfirm(reason, images, note);
    setReason("");
    setNote("");
    setImages([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Return Product - Order #{orderId}</DialogTitle>
          <DialogDescription>
            Please provide a reason for returning {productName}. This will help us process your return request.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="Enter reason for return..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="min-h-[60px]"
        />
        <Textarea
          placeholder="Optional note for admin (e.g. defect details, box condition)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[40px] mt-2"
        />
        {/* Simple image URL input for demo; replace with upload if needed */}
        <input
          type="text"
          placeholder="Paste image URL (optional) and press Enter"
          className="mt-2 w-full border rounded px-2 py-1 text-sm"
          onKeyDown={e => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              setImages(imgs => [...imgs, e.currentTarget.value.trim()]);
              e.currentTarget.value = '';
            }
          }}
        />
        {images.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt="Return" className="w-12 h-12 object-cover rounded" />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() => setImages(imgs => imgs.filter((_, idx) => idx !== i))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            <Package className="mr-2 h-4 w-4" />
            Keep Product
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            <PackageX className="mr-2 h-4 w-4" />
            Return Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
