import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search, Trash2, Edit, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { insertUserSchema } from "@shared/schema";
import type { User } from "@shared/schema";
import { z } from "zod";

const Users = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Extended schema for form validation
  const formSchema = insertUserSchema.extend({
    confirmPassword: z.string().optional(),
  }).refine((data) => {
    if (!editingUser && data.password !== data.confirmPassword) {
      return false;
    }
    return true;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  // Fetch users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  // Setup form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      email: '',
      role: 'user',
      avatarUrl: '',
    },
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "User Created",
        description: "The user has been created successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => 
      apiRequest('PATCH', `/api/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "User Updated",
        description: "The user has been updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingUser(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "User Deleted",
        description: "The user has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Define columns for data table
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "User",
      accessorKey: "username",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.fullName}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{user.username}</div>
            </div>
          </div>
        );
      }
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
            role === 'admin' 
              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
              : 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
          }`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        );
      }
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleEdit(user)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDelete(user.id)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const handleOpenDialog = () => {
    form.reset({
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      email: '',
      role: 'user',
      avatarUrl: '',
    });
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset({
      username: user.username,
      password: '', // Don't populate password
      confirmPassword: '',
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: any) => {
    // Remove confirmPassword as it's not in the schema
    const { confirmPassword, ...submissionData } = data;
    
    // When editing, if password is empty, remove it from submission
    if (editingUser && !submissionData.password) {
      delete submissionData.password;
    }
    
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: submissionData });
    } else {
      createMutation.mutate(submissionData);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage user accounts</p>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center w-full max-w-sm space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={users || []} 
          isLoading={isLoading}
          title="Users"
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!!editingUser} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{editingUser ? "New Password (leave blank to keep current)" : "Password"}</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingUser 
                      ? "Update User" 
                      : "Add User"
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Users;
