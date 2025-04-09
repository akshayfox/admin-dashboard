import { 
  users, 
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct, 
  type Order, 
  type InsertOrder, 
  type OrderItem, 
  type InsertOrderItem,
  type DashboardStats,
  type OrderWithUser,
  type TopProduct,
  type SalesData
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User Methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // Product Methods
  getProduct(id: number): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Order Methods
  getOrder(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  getOrderWithUser(id: number): Promise<OrderWithUser | undefined>;
  getAllOrdersWithUsers(): Promise<OrderWithUser[]>;
  getRecentOrdersWithUsers(): Promise<OrderWithUser[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<Order>): Promise<Order>;
  deleteOrder(id: number): Promise<void>;
  
  // Order Item Methods
  getOrderItem(id: number): Promise<OrderItem | undefined>;
  getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Dashboard Methods
  getDashboardStats(): Promise<DashboardStats>;
  getTopProducts(): Promise<TopProduct[]>;
  getSalesData(timeRange: string): Promise<SalesData[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private userCurrentId: number;
  private productCurrentId: number;
  private orderCurrentId: number;
  private orderItemCurrentId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.userCurrentId = 1;
    this.productCurrentId = 1;
    this.orderCurrentId = 1;
    this.orderItemCurrentId = 1;
    
    // Initialize with some dummy data
    this.initializeDummyData();
  }

  private initializeDummyData() {
    // Add a default admin user
    this.createUser({
      username: "admin",
      password: "admin",
      fullName: "Admin User",
      email: "admin@example.com",
      role: "admin",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    });
    
    // Add some example products
    const products = [
      { name: "Laptop Pro", description: "High-end laptop for professionals", price: 1299.99, imageUrl: "https://placehold.co/600x400", category: "Electronics", stock: 25 },
      { name: "Smart Watch", description: "Latest smart watch with health tracking", price: 249.99, imageUrl: "https://placehold.co/600x400", category: "Wearables", stock: 40 },
      { name: "Wireless Earbuds", description: "Premium noise-cancelling earbuds", price: 179.99, imageUrl: "https://placehold.co/600x400", category: "Audio", stock: 60 },
      { name: "4K Monitor", description: "Ultra HD monitor for graphic designers", price: 499.99, imageUrl: "https://placehold.co/600x400", category: "Computer Accessories", stock: 15 },
      { name: "Gaming Mouse", description: "Precision gaming mouse with customizable buttons", price: 89.99, imageUrl: "https://placehold.co/600x400", category: "Gaming", stock: 50 }
    ];
    
    for (const product of products) {
      this.createProduct(product);
    }
    
    // Add some example users
    const users = [
      { username: "john", password: "password", fullName: "John Doe", email: "john@example.com", role: "customer", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
      { username: "jane", password: "password", fullName: "Jane Smith", email: "jane@example.com", role: "customer", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
      { username: "bob", password: "password", fullName: "Bob Johnson", email: "bob@example.com", role: "manager", avatarUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
    ];
    
    for (const user of users) {
      this.createUser(user);
    }
    
    // Add some example orders
    const orderData = [
      { userId: 2, status: "completed", totalAmount: 1299.99, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), orderNumber: `ORD-${Date.now().toString().slice(-4)}-${randomUUID().slice(0, 4).toUpperCase()}` },
      { userId: 3, status: "shipped", totalAmount: 339.98, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), orderNumber: `ORD-${Date.now().toString().slice(-4)}-${randomUUID().slice(0, 4).toUpperCase()}` },
      { userId: 4, status: "processing", totalAmount: 499.99, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), orderNumber: `ORD-${Date.now().toString().slice(-4)}-${randomUUID().slice(0, 4).toUpperCase()}` },
      { userId: 2, status: "pending", totalAmount: 89.99, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), orderNumber: `ORD-${Date.now().toString().slice(-4)}-${randomUUID().slice(0, 4).toUpperCase()}` },
      { userId: 3, status: "cancelled", totalAmount: 179.99, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), orderNumber: `ORD-${Date.now().toString().slice(-4)}-${randomUUID().slice(0, 4).toUpperCase()}` }
    ];
    
    for (const order of orderData) {
      this.createOrder(order);
    }
    
    // Add order items
    const orderItems = [
      { orderId: 1, productId: 1, quantity: 1, price: 1299.99 },
      { orderId: 2, productId: 2, quantity: 1, price: 249.99 },
      { orderId: 2, productId: 3, quantity: 1, price: 89.99 },
      { orderId: 3, productId: 4, quantity: 1, price: 499.99 },
      { orderId: 4, productId: 5, quantity: 1, price: 89.99 },
      { orderId: 5, productId: 3, quantity: 1, price: 179.99 }
    ];
    
    for (const item of orderItems) {
      this.createOrderItem(item);
    }
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<void> {
    if (!this.users.has(id)) {
      throw new Error(`User with id ${id} not found`);
    }
    
    this.users.delete(id);
  }
  
  // Product Methods
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const product = await this.getProduct(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<void> {
    if (!this.products.has(id)) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    this.products.delete(id);
  }
  
  // Order Methods
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getOrderWithUser(id: number): Promise<OrderWithUser | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;
    
    const user = await this.getUser(order.userId);
    if (!user) return undefined;
    
    return {
      ...order,
      user
    };
  }
  
  async getAllOrdersWithUsers(): Promise<OrderWithUser[]> {
    const orders = await this.getAllOrders();
    const result: OrderWithUser[] = [];
    
    for (const order of orders) {
      const user = await this.getUser(order.userId);
      if (user) {
        result.push({
          ...order,
          user
        });
      }
    }
    
    return result;
  }
  
  async getRecentOrdersWithUsers(): Promise<OrderWithUser[]> {
    const orders = await this.getAllOrdersWithUsers();
    // Sort by date, most recent first
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const newOrder: Order = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrder(id: number, updates: Partial<Order>): Promise<Order> {
    const order = await this.getOrder(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    
    const updatedOrder = { ...order, ...updates };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  async deleteOrder(id: number): Promise<void> {
    if (!this.orders.has(id)) {
      throw new Error(`Order with id ${id} not found`);
    }
    
    // Also delete order items
    const orderItems = await this.getOrderItemsByOrderId(id);
    for (const item of orderItems) {
      this.orderItems.delete(item.id);
    }
    
    this.orders.delete(id);
  }
  
  // Order Item Methods
  async getOrderItem(id: number): Promise<OrderItem | undefined> {
    return this.orderItems.get(id);
  }
  
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }
  
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemCurrentId++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }
  
  // Dashboard Methods
  async getDashboardStats(): Promise<DashboardStats> {
    const orders = await this.getAllOrders();
    const products = await this.getAllProducts();
    const users = await this.getAllUsers();
    
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount.toString()), 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayOrders = orders.filter(order => new Date(order.createdAt) >= todayStart);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount.toString()), 0);
    
    return {
      totalRevenue,
      todayRevenue,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      totalProducts: products.length,
      totalCustomers: users.filter(user => user.role === 'customer').length,
      lowStockProducts: products.filter(product => product.stock && product.stock < 10).length,
    };
  }
  
  async getTopProducts(): Promise<TopProduct[]> {
    const products = await this.getAllProducts();
    const orderItems = Array.from(this.orderItems.values());
    
    // Calculate sales for each product
    const productSales = products.map(product => {
      const items = orderItems.filter(item => item.productId === product.id);
      const totalSold = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalRevenue = items.reduce((sum, item) => sum + parseFloat(item.price.toString()) * item.quantity, 0);
      
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        totalSold,
        totalRevenue,
        imageUrl: product.imageUrl
      };
    });
    
    // Sort by total sold and return top 5
    return productSales
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
  }
  
  async getSalesData(timeRange: string): Promise<SalesData[]> {
    const orders = await this.getAllOrders();
    
    // Calculate start date based on time range
    const now = new Date();
    let startDate = new Date();
    
    if (timeRange === 'weekly') {
      startDate.setDate(now.getDate() - 7);
      return this.getSalesByDay(orders, startDate, now);
    } else if (timeRange === 'monthly') {
      startDate.setDate(now.getDate() - 30);
      return this.getSalesByDay(orders, startDate, now);
    } else { // yearly
      startDate.setFullYear(now.getFullYear() - 1);
      return this.getSalesByMonth(orders, startDate, now);
    }
  }
  
  private getSalesByDay(orders: Order[], startDate: Date, endDate: Date): SalesData[] {
    const result: SalesData[] = [];
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getDate() === date.getDate() && 
               orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });
      
      const revenue = dayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount.toString()), 0);
      
      result.push({
        date: date.toISOString().split('T')[0],
        revenue
      });
    }
    
    return result;
  }
  
  private getSalesByMonth(orders: Order[], startDate: Date, endDate: Date): SalesData[] {
    const result: SalesData[] = [];
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                  (endDate.getMonth() - startDate.getMonth()) + 1;
    
    for (let i = 0; i < months; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });
      
      const revenue = monthOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount.toString()), 0);
      
      result.push({
        date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        revenue
      });
    }
    
    return result;
  }
}

export const storage = new MemStorage();
