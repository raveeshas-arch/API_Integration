import { LogOut, UserRound, LogIn, ChevronDown, User, Camera, Upload } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { logoutAdmin } from '@/apis/admin';

interface UserProfileProps {
  isAuthenticated?: boolean;
}

const UserProfile = ({ isAuthenticated = true }: UserProfileProps) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const [editProfilePic, setEditProfilePic] = useState('');
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    
    if (admin) {
      try {
        const adminData = JSON.parse(admin);
        setUserName(adminData.name || 'Admin');
        setProfilePic(adminData.profilePic || null);
        setAdmin(adminData);
        setEditProfilePic(adminData.profilePic || '');
      } catch (error) {
        setUserName('Admin');
        setProfilePic(null);
        setAdmin(null);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      localStorage.removeItem('expiresAt');
      
      // Clear browser cache
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      
      toast.success('Logged out successfully');
      window.location.href = '/login?t=' + Date.now();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setEditProfilePic(result);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfilePic = () => {
    if (admin && editProfilePic) {
      const updatedAdmin = { ...admin, profilePic: editProfilePic };
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));
      setAdmin(updatedAdmin);
      setProfilePic(editProfilePic || null);
      setIsEditingPic(false);
      setSelectedFile(null);
      toast.success('Profile picture updated successfully!');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Show Login button if not authenticated
  if (!isAuthenticated) {
    return (
      <Button 
        variant="ghost" 
        className="font-bold cursor-pointer" 
        onClick={handleLogin}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    );
  }

  // Show user profile if authenticated
  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="font-bold cursor-pointer flex items-center justify-between px-3"
        >
          <div className="flex items-center gap-2">
            {profilePic ? (
              <img 
                src={profilePic} 
                alt="Profile" 
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <UserRound className="h-5 w-5" />
            )}
            <span className="font-medium">{userName}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => setShowAccountDialog(true)}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          My Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-700"
        >
          <LogOut className="mr-2 h-4 w-4 text-red-600" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Account Details Dialog */}
    {showAccountDialog && (
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>My Account</DialogTitle>
        </DialogHeader>
        
        {admin && (
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt="Profile" 
                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                    <UserRound className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <button
                  onClick={() => setIsEditingPic(true)}
                  className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5"
                >
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{admin.name}</h3>
                <p className="text-gray-600 text-sm">{admin.email}</p>
              </div>
            </div>

            {/* Profile Picture Edit */}
            {isEditingPic && (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <Label>Update Profile Picture</Label>
                
                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="fileUpload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                  </Label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="editProfilePic">Or enter image URL</Label>
                  <Input
                    id="editProfilePic"
                    type="url"
                    placeholder="Enter profile picture URL"
                    value={editProfilePic}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditProfilePic(e.target.value)}
                  />
                </div>

                {/* Preview */}
                {editProfilePic && (
                  <div className="flex justify-center">
                    <img 
                      src={editProfilePic} 
                      alt="Preview" 
                      className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button onClick={handleUpdateProfilePic} size="sm" disabled={!editProfilePic}>
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditingPic(false);
                      setEditProfilePic(admin?.profilePic || '');
                      setSelectedFile(null);
                    }} 
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="space-y-3">
              <h4 className="font-medium">Account Information</h4>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-gray-500">Full Name</Label>
                  <p className="text-sm">{admin.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Email</Label>
                  <p className="text-sm">{admin.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Account ID</Label>
                  <p className="text-sm font-mono">{admin.id}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
      </Dialog>
    )}
    </>
  );
};

export default UserProfile;