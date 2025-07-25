
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderHistory } from "@/components/OrderHistory";
import AddressManagement from "@/components/AddressManagement";
import ProfileSettings from "@/components/ProfileSettings";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 max-w-7xl text-center">Loading...</div>;
  }
  if (!isAuthenticated || !user) {
    return <div className="container mx-auto px-4 py-8 max-w-7xl text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="pb-4 sm:pb-6">
          {/* Mobile Layout */}
          <div className="flex flex-col sm:hidden items-center text-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.firstName || user.email} />
              <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                {(user.firstName?.[0] || user.email?.[0] || '?').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">
                {(user.firstName || user.lastName)
                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                  : user.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.firstName || user.email} />
              <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                {(user.firstName?.[0] || user.email?.[0] || '?').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {(user.firstName || user.lastName)
                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                  : user.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-auto">
              <TabsTrigger value="orders" className="text-xs sm:text-sm py-2 sm:py-2.5">
                <span className="hidden sm:inline">Order History</span>
                <span className="sm:hidden">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm py-2 sm:py-2.5">
                Settings
              </TabsTrigger>
              <TabsTrigger value="addresses" className="text-xs sm:text-sm py-2 sm:py-2.5">
                <span className="hidden sm:inline">Addresses</span>
                <span className="sm:hidden">Address</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-4 sm:mt-6">
              <OrderHistory />
            </TabsContent>
            <TabsContent value="settings" className="mt-4 sm:mt-6">
              <ProfileSettings user={{ ...user, name: `${user.firstName} ${user.lastName}`.trim(), avatar: user.avatar || "/placeholder.svg" }} />
            </TabsContent>
            <TabsContent value="addresses" className="mt-4 sm:mt-6">
              <AddressManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
