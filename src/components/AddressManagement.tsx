
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Star, Trash2, Pencil } from "lucide-react";
import { addressService } from "@/services/addressService";
import type { UserAddress, AddressRequest } from "@/types/api";

const defaultFormValues: AddressRequest = {
  type: "shipping",
  isDefault: false,
  name: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
};

const AddressManagement = () => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<UserAddress | null>(null);

  const form = useForm<AddressRequest>({
    defaultValues: defaultFormValues,
  });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load addresses", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddOrEdit = async (values: AddressRequest) => {
    try {
      if (editAddress) {
        await addressService.updateAddress(editAddress._id, values);
        toast({ title: "Address updated", description: "Address updated successfully." });
      } else {
        await addressService.addAddress(values);
        toast({ title: "Address added", description: "Address added successfully." });
      }
      setModalOpen(false);
      setEditAddress(null);
      form.reset(defaultFormValues);
      fetchAddresses();
    } catch (err) {
      toast({ title: "Error", description: "Failed to save address", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await addressService.deleteAddress(id);
      toast({ title: "Address deleted", description: "Address deleted successfully." });
      fetchAddresses();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete address", variant: "destructive" });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressService.setDefaultAddress(id);
      toast({ title: "Default address set", description: "This address is now your default." });
      fetchAddresses();
    } catch (err) {
      toast({ title: "Error", description: "Failed to set default address", variant: "destructive" });
    }
  };

  const openAddModal = () => {
    setEditAddress(null);
    form.reset(defaultFormValues);
    setModalOpen(true);
  };

  const openEditModal = (address: UserAddress) => {
    setEditAddress(address);
    form.reset({
      type: address.type,
      isDefault: address.isDefault,
      name: address.name,
      phone: address.phone,
      address: { ...address.address },
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Saved Addresses</h3>
        <Button onClick={openAddModal}>Add New Address</Button>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px] address-modal-content overflow-y-auto">
          <DialogHeader className="sticky top-0 left-0 z-20 bg-white border-b border-gray-200">
            <DialogTitle>{editAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddOrEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Type</FormLabel>
                    <FormControl>
                      <Input placeholder="shipping, billing, other" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address.postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Postal Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Set as Default</FormLabel>
                    <FormControl>
                      <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="sticky bottom-0 left-0 w-full bg-white pt-2 pb-2 z-10">
                <Button type="submit" className="w-full">{editAddress ? "Update Address" : "Save Address"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
        <style>{`
          @media (min-width: 640px) {
            .address-modal-content {
              height: 90vh !important;
              max-height: 90vh !important;
            }
          }
        `}</style>
      </Dialog>
      <div className="space-y-4">
        {loading ? (
          <div>Loading...</div>
        ) : addresses.length === 0 ? (
          <div className="text-muted-foreground">No addresses found.</div>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className={`border rounded-lg p-4 space-y-2 ${address.isDefault ? 'border-primary' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{address.type}</h4>
                  {address.isDefault && <Star className="h-4 w-4 text-yellow-500" />}
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <Button size="sm" variant="outline" onClick={() => handleSetDefault(address._id)}>
                      Set as Default
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => openEditModal(address)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(address._id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <p>{address.address.street}, {address.address.city}, {address.address.state} {address.address.postalCode}, {address.address.country}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <p>{address.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Name:</span>
                  <p>{address.name}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressManagement;
