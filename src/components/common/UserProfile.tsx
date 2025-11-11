import { LogOut, UserRound, LogIn, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('admin');
    
    setIsLoggedIn(!!token);
    
    if (admin) {
      try {
        const adminData = JSON.parse(admin);
        setUserName(adminData.name || 'Admin');
      } catch (error) {
        setUserName('Admin');
      }
    }
  }, []);

  const handleLogout = () => {
    toast.success('Logged out successfully');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Show Login button if not logged in
  if (!isLoggedIn) {
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

  // Show user profile if logged in
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="font-bold cursor-pointer flex items-center justify-between px-3"
        >
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5" />
            <span className="font-medium">{userName}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
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
  );
};

export default UserProfile;
