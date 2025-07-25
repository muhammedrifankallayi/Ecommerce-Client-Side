
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { 
  UserCog,
  KeyRound,
  Bell,
  Shield,
} from "lucide-react";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface ProfileSettingsProps {
  user: User;
}

const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
});

const securitySchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const notificationSchema = z.object({
  orderUpdates: z.boolean(),
  promotions: z.boolean(),
  newProducts: z.boolean(),
  accountAlerts: z.boolean(),
});

const privacySchema = z.object({
  shareData: z.boolean(),
  activityTracking: z.boolean(),
  profileVisibility: z.boolean(),
});

const ProfileSettings = ({ user }: ProfileSettingsProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");

  // Personal information form
  const personalForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: "",
    },
  });

  // Security form
  const securityForm = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Notification preferences form
  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      orderUpdates: true,
      promotions: false,
      newProducts: true,
      accountAlerts: true,
    },
  });

  // Privacy settings form
  const privacyForm = useForm<z.infer<typeof privacySchema>>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      shareData: false,
      activityTracking: true,
      profileVisibility: true,
    },
  });

  const onPersonalSubmit = (values: z.infer<typeof personalInfoSchema>) => {
    console.log(values);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const onSecuritySubmit = (values: z.infer<typeof securitySchema>) => {
    console.log(values);
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
    });
    securityForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const onNotificationSubmit = (values: z.infer<typeof notificationSchema>) => {
    console.log(values);
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const onPrivacySubmit = (values: z.infer<typeof privacySchema>) => {
    console.log(values);
    toast({
      title: "Privacy settings updated",
      description: "Your privacy settings have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 h-auto gap-1">
          <TabsTrigger value="personal" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <UserCog className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Personal</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <KeyRound className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline sm:inline">Notifications</span>
            <span className="xs:hidden sm:hidden">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Privacy</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Form {...personalForm}>
            <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-4">
              <FormField
                control={personalForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Used for order updates and account recovery.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Form {...securityForm}>
            <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
              <FormField
                control={securityForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={securityForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={securityForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Change Password</Button>
            </form>
          </Form>
        </TabsContent>

        {/* Notification Preferences */}
        <TabsContent value="notifications">
          <Form {...notificationForm}>
            <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={notificationForm.control}
                  name="orderUpdates"
                  render={({ field }) => (
                     <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 sm:p-4 space-y-2 sm:space-y-0">
                       <div className="space-y-0.5">
                         <FormLabel className="text-sm sm:text-base font-medium">Order Updates</FormLabel>
                         <FormDescription className="text-xs sm:text-sm">
                           Receive notifications about your order status.
                         </FormDescription>
                       </div>
                       <FormControl>
                         <Switch
                           checked={field.value}
                           onCheckedChange={field.onChange}
                         />
                       </FormControl>
                     </FormItem>
                  )}
                />
                 <FormField
                   control={notificationForm.control}
                   name="promotions"
                   render={({ field }) => (
                     <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 sm:p-4 space-y-2 sm:space-y-0">
                       <div className="space-y-0.5">
                         <FormLabel className="text-sm sm:text-base font-medium">Promotions & Offers</FormLabel>
                         <FormDescription className="text-xs sm:text-sm">
                           Get notified about sales, discounts, and special offers.
                         </FormDescription>
                       </div>
                       <FormControl>
                         <Switch
                           checked={field.value}
                           onCheckedChange={field.onChange}
                         />
                       </FormControl>
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={notificationForm.control}
                   name="newProducts"
                   render={({ field }) => (
                     <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 sm:p-4 space-y-2 sm:space-y-0">
                       <div className="space-y-0.5">
                         <FormLabel className="text-sm sm:text-base font-medium">New Products</FormLabel>
                         <FormDescription className="text-xs sm:text-sm">
                           Be the first to know about new product releases.
                         </FormDescription>
                       </div>
                       <FormControl>
                         <Switch
                           checked={field.value}
                           onCheckedChange={field.onChange}
                         />
                       </FormControl>
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={notificationForm.control}
                   name="accountAlerts"
                   render={({ field }) => (
                     <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 sm:p-4 space-y-2 sm:space-y-0">
                       <div className="space-y-0.5">
                         <FormLabel className="text-sm sm:text-base font-medium">Account Alerts</FormLabel>
                         <FormDescription className="text-xs sm:text-sm">
                           Important notifications about your account and security.
                         </FormDescription>
                       </div>
                       <FormControl>
                         <Switch
                           checked={field.value}
                           onCheckedChange={field.onChange}
                         />
                       </FormControl>
                     </FormItem>
                   )}
                 />
              </div>
              <Button type="submit">Save Preferences</Button>
            </form>
          </Form>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Form {...privacyForm}>
            <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
              <div className="space-y-4">
                 <FormField
                   control={privacyForm.control}
                   name="shareData"
                   render={({ field }) => (
                     <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 sm:p-4 space-y-2 sm:space-y-0">
                       <div className="space-y-0.5">
                         <FormLabel className="text-sm sm:text-base font-medium">Data Sharing</FormLabel>
                         <FormDescription className="text-xs sm:text-sm">
                           Allow us to share your data with marketing partners.
                         </FormDescription>
                       </div>
                       <FormControl>
                         <Switch
                           checked={field.value}
                           onCheckedChange={field.onChange}
                         />
                       </FormControl>
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={privacyForm.control}
                   name="activityTracking"
                   render={({ field }) => (
                     <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 sm:p-4 space-y-2 sm:space-y-0">
                       <div className="space-y-0.5">
                         <FormLabel className="text-sm sm:text-base font-medium">Activity Tracking</FormLabel>
                         <FormDescription className="text-xs sm:text-sm">
                           Allow us to track your browsing activity for improved recommendations.
                         </FormDescription>
                       </div>
                       <FormControl>
                         <Switch
                           checked={field.value}
                           onCheckedChange={field.onChange}
                         />
                       </FormControl>
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={privacyForm.control}
                   name="profileVisibility"
                   render={({ field }) => (
                     <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 sm:p-4 space-y-2 sm:space-y-0">
                       <div className="space-y-0.5">
                         <FormLabel className="text-sm sm:text-base font-medium">Profile Visibility</FormLabel>
                         <FormDescription className="text-xs sm:text-sm">
                           Make your profile and reviews visible to other users.
                         </FormDescription>
                       </div>
                       <FormControl>
                         <Switch
                           checked={field.value}
                           onCheckedChange={field.onChange}
                         />
                       </FormControl>
                     </FormItem>
                   )}
                 />
              </div>
              <Button type="submit">Save Privacy Settings</Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
