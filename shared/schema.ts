import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"), // admin, user
  avatarUrl: text("avatar_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  role: true,
  avatarUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  category: text("category"),
  stock: integer("stock").notNull().default(0),
});

export const insertProductSchema = createInsertSchema(products)
  .pick({
    name: true,
    description: true,
    price: true,
    imageUrl: true,
    category: true,
    stock: true,
  })
  .extend({
    price: z.number().or(z.string()),
  });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Order schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderNumber: text("order_number").notNull().unique(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, completed, cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders)
  .pick({
    userId: true,
    orderNumber: true,
    totalAmount: true,
    status: true,
  })
  .extend({
    totalAmount: z.number().or(z.string()),
    createdAt: z.date().optional(),
  });

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// OrderItem schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems)
  .pick({
    orderId: true,
    productId: true,
    quantity: true,
    price: true,
  })
  .extend({
    price: z.number().or(z.string()),
  });

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Dashboard statistics schema for API responses
export const dashboardStatsSchema = z.object({
  totalRevenue: z.number(),
  todayRevenue: z.number(),
  totalOrders: z.number(),
  pendingOrders: z.number(),
  completedOrders: z.number(),
  totalProducts: z.number(),
  totalCustomers: z.number(),
  lowStockProducts: z.number(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Extended order type with customer info for UI display
export const orderWithUserSchema = z.object({
  id: z.number(),
  userId: z.number(),
  orderNumber: z.string(),
  totalAmount: z.union([z.number(), z.string()]),
  status: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  user: z.object({
    id: z.number(),
    username: z.string(),
    fullName: z.string(),
    email: z.string(),
    role: z.string(),
    avatarUrl: z.string().nullable().optional(),
  }),
});

export type OrderWithUser = z.infer<typeof orderWithUserSchema>;

// Top products schema for dashboard
export const topProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string().optional(),
  totalSold: z.number(),
  totalRevenue: z.number(),
  imageUrl: z.string().optional(),
});

export type TopProduct = z.infer<typeof topProductSchema>;

// Sales data schema for chart
export const salesDataSchema = z.object({
  date: z.string(),
  revenue: z.number(),
});

export type SalesData = z.infer<typeof salesDataSchema>;
