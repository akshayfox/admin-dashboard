import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProductSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you would use sessions/JWT here
      res.json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    res.json({ success: true });
  });
  
  app.get("/api/auth/me", async (req, res) => {
    try {
      // For demo purposes, return a mock user
      // In a real app, this would check session data
      const user = await storage.getUserByUsername("admin");
      
      if (user) {
        return res.json({
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        });
      }
      
      res.status(401).json({ message: "Not authenticated" });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Fetch users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Fetch user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  app.get("/api/users/profile", async (req, res) => {
    try {
      // For demo purposes, return a mock profile
      // In a real app, this would use authenticated user
      const user = await storage.getUserByUsername("admin");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Fetch profile error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const validationResult = insertUserSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid user data", errors: validationResult.error.flatten() });
      }
      
      const existingUser = await storage.getUserByUsername(validationResult.data.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(validationResult.data);
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only update specific fields
      const allowedFields = ["fullName", "email", "role", "avatarUrl", "password"];
      const updates: Record<string, any> = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      
      const updatedUser = await storage.updateUser(id, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  app.delete("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.deleteUser(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  
  app.post("/api/users/change-password", async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      
      // In a real app, this would verify current password against the DB
      // For demo purposes, we'll just return success
      res.json({ success: true });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Fetch products error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Fetch product error:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  app.post("/api/products", async (req, res) => {
    try {
      const validationResult = insertProductSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid product data", errors: validationResult.error.flatten() });
      }
      
      const newProduct = await storage.createProduct(validationResult.data);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  
  app.patch("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Only update specific fields
      const allowedFields = ["name", "description", "price", "imageUrl", "category", "stock"];
      const updates: Record<string, any> = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      
      const updatedProduct = await storage.updateProduct(id, updates);
      res.json(updatedProduct);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      await storage.deleteProduct(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  
  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrdersWithUsers();
      res.json(orders);
    } catch (error) {
      console.error("Fetch orders error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  
  app.get("/api/orders/recent", async (req, res) => {
    try {
      const orders = await storage.getRecentOrdersWithUsers();
      res.json(orders);
    } catch (error) {
      console.error("Fetch recent orders error:", error);
      res.status(500).json({ message: "Failed to fetch recent orders" });
    }
  });
  
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderWithUser(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Fetch order error:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  
  app.post("/api/orders", async (req, res) => {
    try {
      const validationResult = insertOrderSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid order data", errors: validationResult.error.flatten() });
      }
      
      // Generate a unique order number
      const orderData = {
        ...validationResult.data,
        orderNumber: `ORD-${Date.now().toString().slice(-4)}-${randomUUID().slice(0, 4).toUpperCase()}`
      };
      
      const newOrder = await storage.createOrder(orderData);
      
      // Handle order items if provided
      if (Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          const itemValidation = insertOrderItemSchema.safeParse({
            ...item,
            orderId: newOrder.id
          });
          
          if (itemValidation.success) {
            await storage.createOrderItem(itemValidation.data);
          }
        }
      }
      
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  
  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Only update specific fields
      const allowedFields = ["status", "totalAmount"];
      const updates: Record<string, any> = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      
      const updatedOrder = await storage.updateOrder(id, updates);
      res.json(updatedOrder);
    } catch (error) {
      console.error("Update order error:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });
  
  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      await storage.deleteOrder(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete order error:", error);
      res.status(500).json({ message: "Failed to delete order" });
    }
  });
  
  // Dashboard routes
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      // Get stats data
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Fetch dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
  
  app.get("/api/dashboard/top-products", async (req, res) => {
    try {
      // Get top products
      const topProducts = await storage.getTopProducts();
      res.json(topProducts);
    } catch (error) {
      console.error("Fetch top products error:", error);
      res.status(500).json({ message: "Failed to fetch top products" });
    }
  });
  
  app.get("/api/dashboard/sales", async (req, res) => {
    try {
      const timeRange = (req.query.timeRange as string) || 'monthly';
      
      // Get sales data based on time range
      const salesData = await storage.getSalesData(timeRange);
      res.json(salesData);
    } catch (error) {
      console.error("Fetch sales data error:", error);
      res.status(500).json({ message: "Failed to fetch sales data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
