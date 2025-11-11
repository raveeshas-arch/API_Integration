import { LogOut, UserRound, LogIn } from 'lucide-react';
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
  const userName = 'Raveesha';
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    // Check if user is logged in 
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
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
      <Button variant="outline" className="font-bold bg-gray-200 hover:bg-black hover:text-white cursor-pointer" onClick={handleLogin}>
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    );
  }

  // Show user profile if logged in
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-bold bg-gray-200 hover:bg-black hover:text-white cursor-pointer flex items-center gap-2 px-3">
          <UserRound className="h-5 w-5" />
          <span className="hidden md:block font-medium">{userName}</span>
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
