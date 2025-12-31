import { relations } from 'drizzle-orm';
import {
    billboards,
    categories,
    sizes,
    colors,
    products,
    images,
    orders,
    orderItems,
    reviews,
    account,
    session,
    user
} from '@/db/schema';

// --- CATEGORY & BILLBOARD ---
export const billboardRelations = relations(billboards, ({ many }) => ({
    categories: many(categories),
}));

export const categoryRelations = relations(categories, ({ one, many }) => ({
    billboard: one(billboards, {
        fields: [categories.billboardId],
        references: [billboards.id],
    }),
    products: many(products),
}));

// --- PRODUCTS & ATTRIBUTES ---
export const productRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    size: one(sizes, {
        fields: [products.sizeId],
        references: [sizes.id],
    }),
    color: one(colors, {
        fields: [products.colorId],
        references: [colors.id],
    }),
    images: many(images),
    orderItems: many(orderItems),
    reviews: many(reviews),
}));

export const imageRelations = relations(images, ({ one }) => ({
    product: one(products, {
        fields: [images.productId],
        references: [products.id],
    }),
}));

// --- ORDERS ---
export const orderRelations = relations(orders, ({ many }) => ({
    orderItems: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
}));

// --- REVIEWS ---
export const reviewRelations = relations(reviews, ({ one }) => ({
    product: one(products, {
        fields: [reviews.productId],
        references: [products.id],
    }),
}));

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    reviews: many(reviews),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));