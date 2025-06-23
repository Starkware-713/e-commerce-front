import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { ClientDashboardService } from '../../../services/client-dashboard.service';
import { SellerService } from '../../../services/seller.service';
import { BehaviorSubject, Observable, Subject, Subscription, catchError, firstValueFrom, interval, map, of, startWith, takeUntil } from 'rxjs';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// Service interfaces (matching the actual service types)
interface ServiceProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  category?: string;
}

interface ServiceOrder {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
}

interface ServiceCustomer {
  id: string;
  name: string;
  email: string;
  orders: ServiceOrder[];
  createdAt: string;
}

// Component interfaces
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image: string;
  category?: string;
  lastUpdated?: Date;
}

export interface Order {
  id: string;
  customerName: string;
  customerId: string;
  date: Date;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
  paymentStatus: 'paid' | 'pending' | 'failed';
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: Date;
  joinDate: Date;
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  totalSales: number;
  activeProducts: number;
  registeredCustomers: number;
  pendingOrders: number;
  revenueToday: number;
  salesGrowth: number;
  averageOrderValue: number;
  conversionRate: number;
}

export interface ChartData {
  salesByMonth: MonthlyData[];
  topProducts: Product[];
  customerGrowth: MonthlyData[];
}

interface MonthlyData {
  month: string;
  value: number;
}

// Interfaz para usuario según el formato solicitado
export interface SellerUser {
  email: string;
  name: string;
  lastname: string;
  id: number;
  is_active: boolean;
  rol: string;
}

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './seller.html',
  styleUrls: ['./seller.css']
})
export class Seller implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private refreshInterval?: Subscription;
  
  // Services
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly clientService = inject(ClientDashboardService);

  // Inyectar SellerService correctamente por propiedad
  constructor(
    // ...otros servicios...
    private sellerService: SellerService
  ) {}

  // State
  activeTab: string = 'dashboard';
  isLoading = new BehaviorSubject<boolean>(false);
  error = new BehaviorSubject<string | null>(null);
  
  // Data streams
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  private readonly salesSubject = new BehaviorSubject<Order[]>([]);
  private readonly customersSubject = new BehaviorSubject<Customer[]>([]);
  private readonly statsSubject = new BehaviorSubject<DashboardStats>({
    totalSales: 0,
    activeProducts: 0,
    registeredCustomers: 0,
    pendingOrders: 0,
    revenueToday: 0,
    salesGrowth: 0,
    averageOrderValue: 0,
    conversionRate: 0
  });

  // New property for orders
  readonly orders$ = new BehaviorSubject<Order[]>([]);

  // Public observables
  readonly products$ = this.productsSubject.asObservable();
  readonly sales$ = this.salesSubject.asObservable();
  readonly customers$ = this.customersSubject.asObservable();
  readonly statistics$ = this.statsSubject.asObservable();
  readonly isLoading$ = this.isLoading.asObservable();
  readonly error$ = this.error.asObservable();

  // Signals
  readonly stats = toSignal(this.statistics$);
  readonly loading = toSignal(this.isLoading$);

  // Chart data
  chartData: ChartData = {
    salesByMonth: [],
    topProducts: [],
    customerGrowth: []
  };

  // Usuarios
  users: SellerUser[] = [];
  usersLoading = false;
  usersError: string | null = null;

  // Estado para el sidebar responsive
  sidebarOpen = false;

  // Estado y lógica para agregar productos
  showAddProduct = false;
  newProduct: Partial<Product> & { description?: string; sku?: string } = {
    name: '',
    price: 0,
    stock: 0,
    category: '',
    image: '',
    description: '',
  };

  // Agregado para mostrar el spinner solo en el usuario que se está actualizando
  updatingUserId: number | null = null;

  // Opciones de categoría válidas para el desplegable
  readonly categoryOptions = [
    { value: 'vuelos', label: 'Vuelos' },
    { value: 'alquiler_autos', label: 'Alquiler de autos' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'all_inclusive', label: 'All Inclusive' }
  ];

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSidebarOnMobile() {
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false;
    }
  }

  onEditRol(user: SellerUser) {
    // Pedir el nuevo rol al usuario (prompt simple, puedes reemplazar por modal si lo deseas)
    const newRole = prompt('Nuevo rol para ' + user.email + ':', user.rol);
    if (!newRole || newRole === user.rol) return;

    this.usersLoading = true;
    this.usersError = null;
    this.sellerService.updateUserRole(user.id, newRole).subscribe({
      next: () => {
        alert('Rol actualizado correctamente');
        this.loadUsers(); // Refresca la lista de usuarios
        this.usersLoading = false;
      },
      error: (err) => {
        this.usersError = 'Error al actualizar el rol';
        alert('Error al actualizar el rol: ' + err.message);
        this.usersLoading = false;
      }
    });
  }

  // Cambia el rol del usuario y actualiza los datos requeridos por la API
  onRolChange(user: SellerUser, newRol: string) {
    this.updatingUserId = user.id;
    this.usersLoading = true;
    this.usersError = null;
    // Actualiza el rol y los datos en una sola petición, como requiere la API
    this.sellerService.updateUserData(user.id, {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      rol: newRol // Asegura que el rol se envía junto con los datos
    }).subscribe({
      next: () => {
        alert('Rol y datos actualizados correctamente');
        this.loadUsers();
        this.usersLoading = false;
        this.updatingUserId = null;
      },
      error: (err) => {
        this.usersError = 'Error al actualizar los datos del usuario';
        alert('Error al actualizar los datos: ' + err.message);
        this.usersLoading = false;
        this.updatingUserId = null;
      }
    });
  }
nuevoCupon = { codigo: '', descuento: 0, expiracion: '' };
cupones: any[] = [];

crearCupon() {
  // Aquí deberías llamar a tu servicio para guardar el cupón en la API
  this.cupones.push({ ...this.nuevoCupon });
  this.nuevoCupon = { codigo: '', descuento: 0, expiracion: '' };
}
  ngOnInit() {
    this.initializeRealTimeUpdates();
    this.loadDashboardData();
    this.loadUsers(); // Cargar usuarios al iniciar
    this.loadOrders(); // Add this line
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.refreshInterval?.unsubscribe();
  }

  private initializeRealTimeUpdates() {
    this.refreshInterval = interval(300000)
      .pipe(
        startWith(0),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadDashboardData();
      });
  }

  loadDashboardData() {
    this.isLoading.next(true);
    this.error.next(null);

    Promise.all([
      this.loadProducts(),
      this.loadSales(),
      this.loadCustomers()
    ])
    .then(() => {
      this.updateStatistics();
      this.isLoading.next(false);
    })
    .catch(error => {
      console.error('Error loading dashboard data:', error);
      this.error.next('Failed to load dashboard data. Please try again.');
      this.isLoading.next(false);
    });
  }

  private async loadProducts(): Promise<void> {
    try {
      const products = await firstValueFrom(
        this.productService.getProducts().pipe(
          map((response: any) => {
            if (!Array.isArray(response)) return [];
            return response.map(item => ({
              id: item.id || '',
              name: item.name || '',
              price: Number(item.price) || 0,
              stock: Number(item.stock) || 0,
              description: item.description,
              category: item.category
            } as ServiceProduct));
          }),
          map(serviceProducts => this.mapServiceProductsToProducts(serviceProducts)),
          catchError(() => of([]))
        )
      );

      this.productsSubject.next(products);
      this.updateTopProducts(products);
    } catch (error) {
      console.error('Error in loadProducts:', error);
      this.productsSubject.next([]);
    }
  }

  private async loadSales(): Promise<void> {
    try {
      const orders = await firstValueFrom(
        this.orderService.getOrders().pipe(
          map((response: any) => {
            if (!Array.isArray(response)) return [];
            return response.map(item => ({
              id: item.id || '',
              userId: item.userId || '',
              items: Array.isArray(item.items) ? item.items : [],
              total: Number(item.total) || 0,
              status: item.status || 'pending',
              createdAt: item.createdAt || new Date().toISOString()
            } as ServiceOrder));
          }),
          map(serviceOrders => this.mapServiceOrdersToOrders(serviceOrders)),
          catchError(() => of([]))
        )
      );

      this.salesSubject.next(orders);
      this.updateSalesStatistics(orders);
    } catch (error) {
      console.error('Error in loadSales:', error);
      this.salesSubject.next([]);
    }
  }

  loadUsers() {
    this.usersLoading = true;
    this.usersError = null;
    this.sellerService.getUsers().subscribe({
      next: (users: any) => {
        // Mostrar todos los usuarios sin filtrar
        this.users = Array.isArray(users) ? users : [];
        this.usersLoading = false;
      },
      error: (err) => {
        this.usersError = 'Error al cargar usuarios';
        this.usersLoading = false;
      }
    });
  }

  private async loadCustomers(): Promise<void> {
    try {
      const customers = await firstValueFrom(
        this.clientService.getUserProfile().pipe(
          map((response: any) => {
            if (!Array.isArray(response)) return [];
            // Filtrar solo clientes con rol 'comprador' o 'cliente'
            return response
              .filter((item: any) =>
                item.rol?.toLowerCase() === 'comprador' || item.rol?.toLowerCase() === 'cliente')
              .map(item => ({
                id: item.id || '',
                name: item.name || '',
                email: item.email || '',
                orders: Array.isArray(item.orders) ? item.orders : [],
                createdAt: item.createdAt || new Date().toISOString()
              } as ServiceCustomer));
          }),
          map(serviceCustomers => this.mapServiceCustomersToCustomers(serviceCustomers)),
          catchError(() => of([]))
        )
      );

      this.customersSubject.next(customers);
      this.updateCustomerMetrics(customers);
    } catch (error) {
      console.error('Error in loadCustomers:', error);
      this.customersSubject.next([]);
    }
  }

  private updateStatistics() {
    const currentStats = this.statsSubject.value;
    const today = new Date();
    
    this.orderService.getOrders().pipe(
      map((response: any) => {
        if (!Array.isArray(response)) return [];
        return response.map(item => ({
          id: item.id || '',
          userId: item.userId || '',
          items: Array.isArray(item.items) ? item.items : [],
          total: Number(item.total) || 0,
          status: item.status || 'pending',
          createdAt: item.createdAt || new Date().toISOString()
        } as ServiceOrder));
      }),
      map(serviceOrders => this.mapServiceOrdersToOrders(serviceOrders)),
      map(orders => orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.toDateString() === today.toDateString();
      })),
      catchError(() => of([]))
    ).subscribe(todayOrders => {
      const revenueToday = this.calculateTotalRevenue(todayOrders);
      const averageOrderValue = this.calculateAverageOrderValue(todayOrders);
      const growth = this.calculateGrowth(revenueToday, currentStats.totalSales);
      
      this.statsSubject.next({
        ...currentStats,
        revenueToday,
        salesGrowth: growth,
        averageOrderValue,
        conversionRate: this.calculateConversionRate(todayOrders.length, 100)
      });
    });
  }

  private updateTopProducts(products: Product[]) {
    this.chartData.topProducts = products
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }

  private updateSalesStatistics(orders: Order[]) {
    const totalSales = this.calculateTotalRevenue(orders);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    
    const currentStats = this.statsSubject.value;
    this.statsSubject.next({
      ...currentStats,
      totalSales,
      pendingOrders
    });

    this.updateSalesTrend(orders);
  }

  private updateCustomerMetrics(customers: Customer[]) {
    const currentStats = this.statsSubject.value;
    const activeCustomers = customers.filter(c => c.status === 'active').length;

    this.statsSubject.next({
      ...currentStats,
      registeredCustomers: customers.length
    });

    this.updateCustomerGrowthTrend(customers);
  }

  private calculateTotalRevenue(orders: Order[]): number {
    return orders.reduce((total, order) => total + order.total, 0);
  }

  private calculateAverageOrderValue(orders: Order[]): number {
    if (orders.length === 0) return 0;
    return this.calculateTotalRevenue(orders) / orders.length;
  }

  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  }

  private calculateConversionRate(orders: number, visits: number): number {
    if (visits === 0) return 0;
    return (orders / visits) * 100;
  }

  private updateSalesTrend(orders: Order[]) {
    // Group sales by month
    const salesByMonth = this.groupByMonth(orders, order => order.total);
    this.chartData.salesByMonth = salesByMonth;
  }

  private updateCustomerGrowthTrend(customers: Customer[]) {
    // Group customer sign-ups by month
    const customersByMonth = this.groupByMonth(customers, () => 1);
    this.chartData.customerGrowth = customersByMonth;
  }

  private groupByMonth<T>(items: T[], valueGetter: (item: T) => number): MonthlyData[] {
    const grouped = items.reduce((acc, item: any) => {
      const date = new Date(item.date || item.joinDate);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + valueGetter(item);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([month, value]) => ({ month, value }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }

  getFilteredProducts(filter: string = ''): Product[] {
    const lowerFilter = filter.toLowerCase();
    return this.productsSubject.value.filter(product => 
      product.name.toLowerCase().includes(lowerFilter) ||
      product.category?.toLowerCase().includes(lowerFilter)
    );
  }

  getFilteredSales(filter: string = ''): Order[] {
    const lowerFilter = filter.toLowerCase();
    return this.salesSubject.value.filter(sale => 
      sale.id.toLowerCase().includes(lowerFilter) ||
      sale.customerName.toLowerCase().includes(lowerFilter)
    );
  }

  getFilteredCustomers(filter: string = ''): Customer[] {
    const lowerFilter = filter.toLowerCase();
    return this.customersSubject.value.filter(customer => 
      customer.name.toLowerCase().includes(lowerFilter) ||
      customer.email.toLowerCase().includes(lowerFilter)
    );
  }

  getFilteredOrders(searchValue: string) {
    if (!searchValue) {
      // If no search value, restore original orders
      this.loadOrders();
      return;
    }

    const searchLower = searchValue.toLowerCase();
    this.orders$.pipe(
      map(orders => orders.filter(order => 
        order.id.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower)
      ))
    ).subscribe(filteredOrders => {
      this.orders$.next(filteredOrders);
    });
  }

  // Mapping functions to convert service types to component types
  private mapServiceProductsToProducts(serviceProducts: ServiceProduct[]): Product[] {
    return serviceProducts.map(sp => ({
      id: sp.id,
      name: sp.name,
      price: sp.price,
      stock: sp.stock,
      sales: 0, // This would need to be calculated from orders
      status: sp.stock > 0 ? 'active' : 'out_of_stock',
      image: '/assets/images/products/default.png', // Default image path
      category: sp.category,
      lastUpdated: new Date()
    }));
  }

  private mapServiceOrdersToOrders(serviceOrders: ServiceOrder[]): Order[] {
    return serviceOrders.map(so => ({
      id: so.id,
      customerName: 'Loading...', // This would need to be fetched from customer service
      customerId: so.userId,
      date: new Date(so.createdAt),
      total: so.total,
      status: this.mapOrderStatus(so.status),
      items: this.mapOrderItems(so.items),
      paymentStatus: 'pending' // This would need to be fetched from payment service
    }));
  }

  private mapServiceCustomersToCustomers(serviceCustomers: ServiceCustomer[]): Customer[] {
    return serviceCustomers.map(sc => ({
      id: sc.id,
      name: sc.name,
      email: sc.email,
      orderCount: sc.orders?.length || 0,
      totalSpent: this.calculateCustomerTotalSpent(sc.orders),
      lastOrderDate: this.getLastOrderDate(sc.orders),
      joinDate: new Date(sc.createdAt),
      status: 'active'
    }));
  }

  private mapOrderStatus(status: string): 'pending' | 'completed' | 'cancelled' {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'done':
        return 'completed';
      case 'cancelled':
      case 'canceled':
        return 'cancelled';
      default:
        return 'pending';
    }
  }

  private mapOrderItems(items: ServiceOrder['items']): OrderItem[] {
    return items.map(item => ({
      productId: item.productId,
      productName: 'Loading...', // This would need to be fetched from product service
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price
    }));
  }

  private calculateCustomerTotalSpent(orders: ServiceOrder[]): number {
    return orders?.reduce((total, order) => total + order.total, 0) || 0;
  }

  private getLastOrderDate(orders: ServiceOrder[]): Date {
    if (!orders?.length) return new Date();
    const lastOrder = orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    return new Date(lastOrder.createdAt);
  }

  onAddProduct() {
    // Aquí puedes abrir un modal, navegar a un formulario o implementar la lógica para agregar un producto
    alert('Funcionalidad para agregar producto (implementa aquí el formulario/modal)');
  }

  addProduct() {
    if (!this.newProduct.name || this.newProduct.price == null || this.newProduct.stock == null || !this.newProduct.category) return;
    this.isLoading.next(true);
    // Enviar solo los campos requeridos por la API
    const payload = {
      name: this.newProduct.name,
      description: this.newProduct.description || '',
      price: Number(this.newProduct.price),
      category: String(this.newProduct.category), // fuerza a string plano
      stock: Number(this.newProduct.stock),
      image_url: this.newProduct.image || '',
      sku: this.newProduct.sku || ''
    };
    this.productService.createProduct(payload as any).subscribe({
      next: () => {
        this.isLoading.next(false);
        this.showAddProduct = false;
        this.newProduct = { name: '', price: 0, stock: 0, category: '', image: '', description: '', sku: '' };
        this.loadProducts();
        console.log(this.newProduct);
      },
      error: (err) => {
        this.isLoading.next(false);
        alert('Error al agregar producto: ' + (err?.error?.message || err.message || 'Error desconocido'));
      }
    });
  }

  // Cargar todas las órdenes al iniciar o al limpiar filtro
  loadOrders() {
    this.isLoading.next(true);
    this.orderService.getAllOrders().pipe(
      takeUntil(this.destroy$),
      map((response: any) => {
        if (!Array.isArray(response)) return [];
        return response.map(item => ({
          id: item.id || '',
          userId: item.userId || '',
          items: Array.isArray(item.items) ? item.items : [],
          total: Number(item.total) || 0,
          status: item.status || 'pending',
          createdAt: item.createdAt || new Date().toISOString()
        } as ServiceOrder));
      }),
      map(serviceOrders => this.mapServiceOrdersToOrders(serviceOrders)),
      catchError(error => {
        this.error.next('Error loading orders: ' + error.message);
        return of([]);
      })
    ).subscribe(orders => {
      this.orders$.next(orders);
      this.isLoading.next(false);
    });
  }

  // Actualizar viewOrders para usar los métodos correctos
  viewOrders(user: SellerUser, type: 'pending' | 'all') {
    this.isLoading.next(true);
    const ordersObservable = type === 'pending' 
      ? this.orderService.getPendingOrdersForSeller()
      : this.orderService.getAllOrders();

    ordersObservable.pipe(
      takeUntil(this.destroy$),
      map((response: any) => {
        if (!Array.isArray(response)) return [];
        return response.map(item => ({
          id: item.id || '',
          userId: item.userId || '',
          items: Array.isArray(item.items) ? item.items : [],
          total: Number(item.total) || 0,
          status: item.status || 'pending',
          createdAt: item.createdAt || new Date().toISOString()
        } as ServiceOrder));
      }),
      map(serviceOrders => this.mapServiceOrdersToOrders(serviceOrders)),
      catchError(error => {
        this.error.next('Error loading orders: ' + error.message);
        return of([]);
      })
    ).subscribe(orders => {
      this.orders$.next(orders);
      this.isLoading.next(false);
    });
  }
}