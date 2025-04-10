import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { pgTable, serial, text, integer, timestamp, boolean, decimal } from 'drizzle-orm/pg-core';

// User schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull(),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login')
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Product schema
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price').notNull(),
  imageUrl: text('image_url'),
  category: text('category').notNull(),
  stock: integer('stock').notNull(),
  inStock: boolean('in_stock').default(true)
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Order status type
export type OrderStatus = 'completed' | 'processing' | 'shipped' | 'cancelled' | 'pending';

// Order schema
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  orderNumber: text('order_number').notNull(),
  totalAmount: decimal('total_amount').notNull(),
  status: text('status').notNull().$type<OrderStatus>(),
  createdAt: timestamp('created_at').defaultNow(),
  shippingAddress: text('shipping_address'),
  paymentMethod: text('payment_method')
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Item schema
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price').notNull()
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Dashboard Stats schema (for reference, not stored in database)
export interface DashboardStats {
  totalRevenue: number | string;
  todayRevenue: number | string;
  totalOrders: number | string;
  pendingOrders: number | string;
  completedOrders: number | string;
  totalProducts: number | string;
  totalCustomers: number | string;
  lowStockProducts: number | string;
}

// Top Product schema (for reference, not stored in database)
export interface TopProduct {
  id: number | string;
  name: string;
  category?: string;
  totalSold: number | string;
  totalRevenue: number | string;
  imageUrl?: string;
  iconName?: 'box' | 'smile' | 'file' | 'users';
}

// Sales Data schema (for reference, not stored in database)
export interface SalesData {
  date: string;
  revenue: number | string;
}

// Enhanced types for API responses
export interface OrderWithUser extends Order {
  user: User;
}