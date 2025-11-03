import { DataTable } from "@/components/app/users/data-table";
import { createApiColumns, User as UserType } from "@/components/app/users/colomns";
import { useUsers, useProducts } from "@/hooks/useUser";
import { ApiUserDetailsDialog } from "@/components/app/users/ApiUserDetailsDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const API = () => {
  const { data: users = [], isLoading: usersLoading, error: usersError } = useUsers();
  const { data: products = [], isLoading: productsLoading, error: productsError } = useProducts();
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');

  const handleViewUser = (user: UserType) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">API Data</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setActiveTab('users')}
            variant={activeTab === 'users' ? 'default' : 'outline'}
          >
            Users
          </Button>
          <Button 
            onClick={() => setActiveTab('products')}
            variant={activeTab === 'products' ? 'default' : 'outline'}
          >
            Products
          </Button>
        </div>
      </div>

      {activeTab === 'users' && (
        <div>
          {usersLoading && <div>Loading users...</div>}
          {usersError && <div>Error: {usersError.message}</div>}
          {!usersLoading && !usersError && (
            <DataTable 
              columns={createApiColumns({ onViewUser: handleViewUser })} 
              data={users} 
            />
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          {productsLoading && <div>Loading products...</div>}
          {productsError && <div>Error: {productsError.message}</div>}
          {!productsLoading && !productsError && (
            <div className="grid gap-4">
              {products.map((product: any) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    <img src={product.thumbnail} alt={product.title} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.title}</h3>
                      <p className="text-gray-600 mb-2">{product.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="font-bold text-green-600">${product.price}</span>
                        <span className="text-gray-500">Brand: {product.brand}</span>
                        <span className="text-gray-500">Category: {product.category}</span>
                        <span className="text-yellow-600">⭐ {product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ApiUserDetailsDialog 
        user={selectedUser}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  );
};

export default API;