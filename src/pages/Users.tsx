import { useState } from "react";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { type ColumnDef } from "@tanstack/react-table";
import { mockUsers, type User } from "@/data/mock/users";
import { createDateCell, createPriceCell, createSortableHeader } from "@/components/ui/data-table/columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const roleVariants = {
  admin: {
    label: "Admin",
    className: "text-purple-700 dark:text-purple-500 border-purple-300 dark:border-purple-500 bg-purple-50 dark:bg-purple-950",
  },
  manager: {
    label: "Manager",
    className: "text-blue-700 dark:text-blue-500 border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-950",
  },
  user: {
    label: "User",
    className: "text-slate-700 dark:text-slate-500 border-slate-300 dark:border-slate-500 bg-slate-50 dark:bg-slate-950",
  },
};

const statusVariants = {
  active: {
    label: "Active",
    className: "text-emerald-700 dark:text-emerald-500 border-emerald-300 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950",
  },
  inactive: {
    label: "Inactive",
    className: "text-slate-700 dark:text-slate-500 border-slate-300 dark:border-slate-500 bg-slate-50 dark:bg-slate-950",
  },
  suspended: {
    label: "Suspended",
    className: "text-rose-700 dark:text-rose-500 border-rose-300 dark:border-rose-500 bg-rose-50 dark:bg-rose-950",
  },
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: createSortableHeader("User"),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: createSortableHeader("Role"),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "font-medium",
          roleVariants[row.original.role].className
        )}
      >
        {roleVariants[row.original.role].label}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: createSortableHeader("Status"),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "font-medium",
          statusVariants[row.original.status].className
        )}
      >
        {statusVariants[row.original.status].label}
      </Badge>
    ),
  },
  {
    accessorKey: "orders",
    header: createSortableHeader("Orders"),
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.orders}</span>
    ),
  },
  {
    accessorKey: "totalSpent",
    header: createSortableHeader("Total Spent"),
    cell: ({ row }) => createPriceCell(row.original.totalSpent),
  },
  {
    accessorKey: "lastActive",
    header: createSortableHeader("Last Active"),
    cell: ({ row }) => createDateCell(row.original.lastActive),
  },
];

export default function Users() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track your users
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={mockUsers}
        searchKey="name"
        onRowClick={handleViewUser}
      />

      {selectedUser && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>
                      {selectedUser.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      roleVariants[selectedUser.role].className
                    )}
                  >
                    {roleVariants[selectedUser.role].label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      statusVariants[selectedUser.status].className
                    )}
                  >
                    {statusVariants[selectedUser.status].label}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4 space-y-3">
                  <h4 className="font-medium">User Activity</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Orders</span>
                      <span className="font-medium">{selectedUser.orders}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Spent</span>
                      <span className="font-medium">{createPriceCell(selectedUser.totalSpent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Active</span>
                      <span className="font-medium">{createDateCell(selectedUser.lastActive)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Joined</span>
                      <span className="font-medium">{createDateCell(selectedUser.joinedAt)}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 space-y-3">
                  <h4 className="font-medium">Location</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      {selectedUser.location.city}, {selectedUser.location.country}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}