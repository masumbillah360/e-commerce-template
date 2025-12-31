import {
    pgTable,
    text,
    integer,
    decimal,
    boolean,
    timestamp,
    uuid,
    index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from '@/db/schema';

// --- HELPER ---
// Standard timestamp columns for all tables
const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .default(sql`current_timestamp`)
        .$onUpdate(() => new Date()),
};

// --- CONTENT MANAGEMENT (CMS) ---

// 1. Billboards (Hero images for categories/home)
export const billboards = pgTable('billboard', {
    id: uuid('id').defaultRandom().primaryKey(),
    label: text('label').notNull(), // "Winter Collection"
    imageUrl: text('image_url').notNull(),
    ...timestamps,
});

// 2. Categories
export const categories = pgTable('category', {
    id: uuid('id').defaultRandom().primaryKey(),
    billboardId: uuid('billboard_id').references(() => billboards.id, {
        onDelete: 'set null',
    }),
    name: text('name').notNull(), // "Shoes", "Clothing"
    slug: text('slug').unique().notNull(), // "shoes"
    ...timestamps,
});

// 3. Sizes (Global Attributes)
export const sizes = pgTable('size', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(), // "Small", "Medium"
    value: text('value').notNull(), // "S", "M" (For UI display)
    ...timestamps,
});

// 4. Colors (Global Attributes)
export const colors = pgTable('color', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(), // "Red"
    value: text('value').notNull(), // "#FF0000" (Hex code for UI dots)
    ...timestamps,
});

// --- PRODUCTS ---

// 5. Products
export const products = pgTable(
    'product',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        categoryId: uuid('category_id')
            .references(() => categories.id, { onDelete: 'cascade' })
            .notNull(),
        sizeId: uuid('size_id').references(() => sizes.id, {
            onDelete: 'set null',
        }), // Optional if product has no size
        colorId: uuid('color_id').references(() => colors.id, {
            onDelete: 'set null',
        }), // Optional if product has no color

        name: text('name').notNull(),
        slug: text('slug').unique(), // Optional: for SEO friendly URLs
        description: text('description'),
        price: decimal('price', { precision: 10, scale: 2 })
            .notNull()
            .default('0'), // stored as string in JS, e.g. "99.99"

        isFeatured: boolean('is_featured').default(false).notNull(), // For Home page carousel
        isArchived: boolean('is_archived').default(false).notNull(), // Soft delete/Hidden
        stock: integer('stock').default(0).notNull(), // Inventory management

        ...timestamps,
    },
    (table) => [
        index('product_category_idx').on(table.categoryId),
        index('product_size_idx').on(table.sizeId),
        index('product_color_idx').on(table.colorId),
    ]
);

// 6. Product Images (One product -> Many images)
export const images = pgTable(
    'image',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        productId: uuid('product_id')
            .references(() => products.id, { onDelete: 'cascade' })
            .notNull(),
        url: text('url').notNull(),
        ...timestamps,
    },
    (table) => [ index('image_product_idx').on(table.productId) ]
);

// --- TRANSACTIONS ---

// 7. Orders
export const orders = pgTable('order', {
    id: uuid('id').defaultRandom().primaryKey(),
    // references 'user' table from Better Auth.
    // NOTE: Better Auth uses text IDs usually. Ensure this matches your Better Auth config.
    userId: text('user_id').notNull(),

    orderNumber: text('order_number').unique(), // Friendly ID like "ORD-001"
    isPaid: boolean('is_paid').default(false).notNull(),
    status: text('status').default('pending'), // pending, processing, shipped, delivered, cancelled

    // Address snapshot (in case user updates profile address, order history shouldn't change)
    phone: text('phone').default(''),
    address: text('address').default(''),

    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
    stripePaymentIntentId: text('stripe_payment_intent_id'),

    ...timestamps,
});

// 8. Order Items (The bridge between Orders and Products)
export const orderItems = pgTable(
    'order_item',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        orderId: uuid('order_id')
            .references(() => orders.id, { onDelete: 'cascade' })
            .notNull(),
        productId: uuid('product_id')
            .references(() => products.id)
            .notNull(),
        quantity: integer('quantity').default(1).notNull(),
        price: decimal('price', { precision: 10, scale: 2 }).notNull(), // Snapshot of price at time of purchase
    },
    (table) => [ index('order_item_product_idx').on(table.productId) ],
);

// --- REVIEWS (Optional) ---

export const reviews = pgTable(
    'review',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'set null' }), // Better Auth ID
        productId: uuid('product_id')
            .references(() => products.id, { onDelete: 'cascade' })
            .notNull(),
        rating: integer('rating').notNull(), // 1-5
        comment: text('comment'),
        ...timestamps,
    },
    (table) => [index('review_user_idx').on(table.userId), index('review_product_idx').on(table.productId)]
);
